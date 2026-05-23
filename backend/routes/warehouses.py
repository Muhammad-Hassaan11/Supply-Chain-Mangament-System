from fastapi import APIRouter, Depends, HTTPException, status
from database import execute_query
from models import Warehouse, WarehouseCreate
from typing import List, Optional
from auth import require_write_access

router = APIRouter()

# Response schema extension to include capacity statistics
class WarehouseWithStats(Warehouse):
    product_name: Optional[str] = None
    current_stock: Optional[int] = 0

@router.get("/", response_model=List[WarehouseWithStats])
def get_warehouses():
    """
    Retrieves all warehouses from the database using raw SQL, including 
    the handled product name and current total quantity stored.
    """
    try:
        # Use aggregation to calculate current stock level in the warehouse
        query = """
            SELECT 
                w.warehouse_id, 
                w.warehouse_name, 
                w.capacity, 
                w.product_id,
                p.product_name,
                COALESCE(SUM(i.quantity), 0) AS current_stock
            FROM Warehouse w
            LEFT JOIN Product p ON w.product_id = p.product_id
            LEFT JOIN Inventory i ON w.warehouse_id = i.warehouse_id
            GROUP BY w.warehouse_id, w.warehouse_name, w.capacity, w.product_id, p.product_name
            ORDER BY w.warehouse_id DESC
        """
        result = execute_query(query, fetch=True)
        return result or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch warehouses from database: {str(e)}"
        )

@router.get("/{warehouse_id}", response_model=WarehouseWithStats)
def get_warehouse(warehouse_id: int):
    """
    Retrieves a single warehouse by ID using raw SQL, including stats.
    """
    try:
        query = """
            SELECT 
                w.warehouse_id, 
                w.warehouse_name, 
                w.capacity, 
                w.product_id,
                p.product_name,
                COALESCE(SUM(i.quantity), 0) AS current_stock
            FROM Warehouse w
            LEFT JOIN Product p ON w.product_id = p.product_id
            LEFT JOIN Inventory i ON w.warehouse_id = i.warehouse_id
            WHERE w.warehouse_id = ?
            GROUP BY w.warehouse_id, w.warehouse_name, w.capacity, w.product_id, p.product_name
        """
        result = execute_query(query, (warehouse_id,), fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Warehouse with ID {warehouse_id} not found."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch warehouse: {str(e)}"
        )

@router.post("/", response_model=Warehouse, status_code=status.HTTP_201_CREATED)
def create_warehouse(warehouse: WarehouseCreate, current_user = Depends(require_write_access)):
    """
    Creates a new warehouse using raw SQL. Enforces referential integrity checks.
    """
    try:
        # 1. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        prod_exists = execute_query(prod_check, (warehouse.product_id,), fetch_one=True)
        if not prod_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot create warehouse: Product with ID {warehouse.product_id} does not exist."
            )

        # 2. Insert warehouse
        query = """
            INSERT INTO Warehouse (warehouse_name, capacity, product_id)
            OUTPUT inserted.warehouse_id, inserted.warehouse_name, inserted.capacity, inserted.product_id
            VALUES (?, ?, ?)
        """
        params = (warehouse.warehouse_name, warehouse.capacity, warehouse.product_id)
        result = execute_query(query, params, fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to create warehouse in SQL Server."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Warehouse__capac" in err_msg or "capacity" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Warehouse capacity must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create warehouse: {str(e)}"
        )

@router.put("/{warehouse_id}", response_model=Warehouse)
def update_warehouse(warehouse_id: int, warehouse: WarehouseCreate, current_user = Depends(require_write_access)):
    """
    Updates an existing warehouse using raw SQL.
    """
    try:
        # 1. Verify warehouse exists
        wh_check = "SELECT warehouse_id FROM Warehouse WHERE warehouse_id = ?"
        wh_exists = execute_query(wh_check, (warehouse_id,), fetch_one=True)
        if not wh_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Warehouse with ID {warehouse_id} not found."
            )

        # 2. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        prod_exists = execute_query(prod_check, (warehouse.product_id,), fetch_one=True)
        if not prod_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot update warehouse: Product with ID {warehouse.product_id} does not exist."
            )

        # 3. Update warehouse
        query = """
            UPDATE Warehouse
            SET warehouse_name = ?, capacity = ?, product_id = ?
            WHERE warehouse_id = ?
        """
        params = (warehouse.warehouse_name, warehouse.capacity, warehouse.product_id, warehouse_id)
        execute_query(query, params)

        return {
            "warehouse_id": warehouse_id,
            "warehouse_name": warehouse.warehouse_name,
            "capacity": warehouse.capacity,
            "product_id": warehouse.product_id
        }
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Warehouse__capac" in err_msg or "capacity" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Warehouse capacity must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update warehouse: {str(e)}"
        )

@router.delete("/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_warehouse(warehouse_id: int, current_user = Depends(require_write_access)):
    """
    Deletes a warehouse by ID.
    Enforces referential integrity at the database layer (cascade deletes).
    """
    try:
        # 1. Verify warehouse exists
        wh_check = "SELECT warehouse_id FROM Warehouse WHERE warehouse_id = ?"
        wh_exists = execute_query(wh_check, (warehouse_id,), fetch_one=True)
        if not wh_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Warehouse with ID {warehouse_id} not found."
            )

        # 2. Safe to delete (database handles cascading deletes for Inventory and Shipments)
        delete_query = "DELETE FROM Warehouse WHERE warehouse_id = ?"
        execute_query(delete_query, (warehouse_id,))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete warehouse: {str(e)}"
        )
