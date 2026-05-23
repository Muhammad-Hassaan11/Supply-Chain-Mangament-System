from fastapi import APIRouter, Depends, HTTPException, status
from database import execute_query
from models import Shipment, ShipmentCreate, ShipmentLog, ShipmentLogCreate
from typing import List, Optional
from datetime import date
from auth import require_write_access

router = APIRouter()

# Response schema extensions for joined details
class ShipmentWithWarehouse(Shipment):
    warehouse_name: Optional[str] = None

class ShipmentLogWithProduct(ShipmentLog):
    product_name: Optional[str] = None

@router.get("/", response_model=List[ShipmentWithWarehouse])
def get_shipments():
    """
    Retrieves all shipments from the database using raw SQL,
    joining the origin warehouse name.
    """
    try:
        query = """
            SELECT 
                s.shipment_id, 
                s.shipment_date, 
                s.warehouse_id, 
                s.tracking_number,
                w.warehouse_name
            FROM Shipments s
            JOIN Warehouse w ON s.warehouse_id = w.warehouse_id
            ORDER BY s.shipment_id DESC
        """
        result = execute_query(query, fetch=True)
        return result or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch shipments from database: {str(e)}"
        )

@router.get("/{shipment_id}", response_model=ShipmentWithWarehouse)
def get_shipment(shipment_id: int):
    """
    Retrieves a single shipment by ID.
    """
    try:
        query = """
            SELECT 
                s.shipment_id, 
                s.shipment_date, 
                s.warehouse_id, 
                s.tracking_number,
                w.warehouse_name
            FROM Shipments s
            JOIN Warehouse w ON s.warehouse_id = w.warehouse_id
            WHERE s.shipment_id = ?
        """
        result = execute_query(query, (shipment_id,), fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Shipment with ID {shipment_id} not found."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch shipment: {str(e)}"
        )

@router.post("/", response_model=Shipment, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate, current_user = Depends(require_write_access)):
    """
    Creates a new shipment with database out-of-stock validation.
    Also creates an initial 'Created' log in Shipment_logs and decrements inventory by 1.
    """
    try:
        # 1. Verify origin warehouse exists and retrieve its main product
        wh_query = "SELECT product_id, warehouse_name FROM Warehouse WHERE warehouse_id = ?"
        warehouse = execute_query(wh_query, (shipment.warehouse_id,), fetch_one=True)
        if not warehouse:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot create shipment: Warehouse with ID {shipment.warehouse_id} does not exist."
            )
        
        main_product_id = warehouse["product_id"]

        # 2. Check stock of this product in this warehouse
        inv_query = "SELECT quantity, location FROM Inventory WHERE warehouse_id = ? AND product_id = ?"
        inventory = execute_query(inv_query, (shipment.warehouse_id, main_product_id), fetch_one=True)
        
        if not inventory or inventory["quantity"] <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot create shipment: Origin warehouse '{warehouse['warehouse_name']}' is OUT OF STOCK for its handled product."
            )

        # 3. Check for unique tracking number
        track_query = "SELECT shipment_id FROM Shipments WHERE tracking_number = ?"
        track_exists = execute_query(track_query, (shipment.tracking_number,), fetch_one=True)
        if track_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot create shipment: Tracking number '{shipment.tracking_number}' is already registered."
            )

        # 4. Insert shipment
        shipment_insert = """
            INSERT INTO Shipments (shipment_date, warehouse_id, tracking_number)
            OUTPUT inserted.shipment_id, inserted.shipment_date, inserted.warehouse_id, inserted.tracking_number
            VALUES (?, ?, ?)
        """
        # Convert date to string format for safety if required
        shipment_date_str = shipment.shipment_date.strftime("%Y-%m-%d")
        new_shipment = execute_query(shipment_insert, (shipment_date_str, shipment.warehouse_id, shipment.tracking_number), fetch_one=True)
        
        if not new_shipment:
            raise HTTPException(
                status_code=500,
                detail="Failed to record shipment in SQL Server."
            )

        new_shipment_id = new_shipment["shipment_id"]

        # 5. Decrement inventory level by 1
        decrement_query = """
            UPDATE Inventory 
            SET quantity = quantity - 1 
            WHERE warehouse_id = ? AND product_id = ?
        """
        execute_query(decrement_query, (shipment.warehouse_id, main_product_id))

        # 6. Create initial 'Created' event log
        log_insert = """
            INSERT INTO Shipment_logs (shipment_id, log_seq_num, event_type, product_id)
            VALUES (?, 1, 'Created', ?)
        """
        execute_query(log_insert, (new_shipment_id, main_product_id))

        return new_shipment

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create shipment: {str(e)}"
        )

@router.put("/{shipment_id}", response_model=Shipment)
def update_shipment(shipment_id: int, shipment: ShipmentCreate, current_user = Depends(require_write_access)):
    """
    Updates an existing shipment.
    """
    try:
        # 1. Verify shipment exists
        ship_check = "SELECT shipment_id FROM Shipments WHERE shipment_id = ?"
        ship_exists = execute_query(ship_check, (shipment_id,), fetch_one=True)
        if not ship_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Shipment with ID {shipment_id} not found."
            )

        # 2. Verify warehouse exists
        wh_check = "SELECT warehouse_id FROM Warehouse WHERE warehouse_id = ?"
        wh_exists = execute_query(wh_check, (shipment.warehouse_id,), fetch_one=True)
        if not wh_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot update shipment: Warehouse with ID {shipment.warehouse_id} does not exist."
            )

        # 3. Check for unique tracking number (excluding self)
        track_query = "SELECT shipment_id FROM Shipments WHERE tracking_number = ? AND shipment_id <> ?"
        track_exists = execute_query(track_query, (shipment.tracking_number, shipment_id), fetch_one=True)
        if track_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot update shipment: Tracking number '{shipment.tracking_number}' is already used by another shipment."
            )

        # 4. Update shipment
        query = """
            UPDATE Shipments
            SET shipment_date = ?, warehouse_id = ?, tracking_number = ?
            WHERE shipment_id = ?
        """
        shipment_date_str = shipment.shipment_date.strftime("%Y-%m-%d")
        execute_query(query, (shipment_date_str, shipment.warehouse_id, shipment.tracking_number, shipment_id))

        return {
            "shipment_id": shipment_id,
            "shipment_date": shipment.shipment_date,
            "warehouse_id": shipment.warehouse_id,
            "tracking_number": shipment.tracking_number
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update shipment: {str(e)}"
        )

@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(shipment_id: int, current_user = Depends(require_write_access)):
    """
    Deletes a shipment by ID (cascades logs deletion).
    """
    try:
        # 1. Verify shipment exists
        ship_check = "SELECT shipment_id FROM Shipments WHERE shipment_id = ?"
        ship_exists = execute_query(ship_check, (shipment_id,), fetch_one=True)
        if not ship_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Shipment with ID {shipment_id} not found."
            )

        # 2. Safe to delete (database handles cascading deletes for Shipment_logs)
        delete_query = "DELETE FROM Shipments WHERE shipment_id = ?"
        execute_query(delete_query, (shipment_id,))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete shipment: {str(e)}"
        )

# ==========================================
# SHIPMENT LOGS & TIMELINE ENDPOINTS (US3)
# ==========================================

@router.get("/{shipment_id}/logs", response_model=List[ShipmentLogWithProduct])
def get_shipment_logs(shipment_id: int):
    """
    Retrieves the chronological milestone logs for a shipment timeline.
    """
    try:
        # Verify shipment exists first
        ship_check = "SELECT shipment_id FROM Shipments WHERE shipment_id = ?"
        if not execute_query(ship_check, (shipment_id,), fetch_one=True):
            raise HTTPException(
                status_code=404,
                detail=f"Shipment with ID {shipment_id} not found."
            )

        query = """
            SELECT 
                sl.shipment_id, 
                sl.log_seq_num, 
                sl.log_timestamp, 
                sl.event_type, 
                sl.product_id,
                p.product_name
            FROM Shipment_logs sl
            JOIN Product p ON sl.product_id = p.product_id
            WHERE sl.shipment_id = ?
            ORDER BY sl.log_seq_num ASC
        """
        result = execute_query(query, (shipment_id,), fetch=True)
        return result or []
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch tracking logs for shipment {shipment_id}: {str(e)}"
        )

@router.post("/{shipment_id}/logs", response_model=ShipmentLog, status_code=status.HTTP_201_CREATED)
def create_shipment_log(shipment_id: int, log_data: ShipmentLogCreate, current_user = Depends(require_write_access)):
    """
    Appends a new chronological tracking event milestone to the shipment timeline.
    Enforces auto-increment log_seq_num logic per shipment.
    """
    try:
        # 1. Verify shipment exists
        ship_check = "SELECT shipment_id FROM Shipments WHERE shipment_id = ?"
        if not execute_query(ship_check, (shipment_id,), fetch_one=True):
            raise HTTPException(
                status_code=404,
                detail=f"Shipment with ID {shipment_id} not found."
            )

        # 2. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        if not execute_query(prod_check, (log_data.product_id,), fetch_one=True):
            raise HTTPException(
                status_code=400,
                detail=f"Cannot add log: Product with ID {log_data.product_id} does not exist."
            )

        # 3. Retrieve maximum log_seq_num to generate next sequence number
        seq_query = "SELECT COALESCE(MAX(log_seq_num), 0) AS max_seq FROM Shipment_logs WHERE shipment_id = ?"
        seq_res = execute_query(seq_query, (shipment_id,), fetch_one=True)
        next_seq = (seq_res["max_seq"] if seq_res else 0) + 1

        # 4. Insert shipment log
        log_insert = """
            INSERT INTO Shipment_logs (shipment_id, log_seq_num, event_type, product_id, log_timestamp)
            OUTPUT inserted.shipment_id, inserted.log_seq_num, inserted.log_timestamp, inserted.event_type, inserted.product_id
            VALUES (?, ?, ?, ?, GETDATE())
        """
        params = (shipment_id, next_seq, log_data.event_type, log_data.product_id)
        result = execute_query(log_insert, params, fetch_one=True)
        
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to record shipment milestone log in SQL Server."
            )
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create shipment milestone log: {str(e)}"
        )
