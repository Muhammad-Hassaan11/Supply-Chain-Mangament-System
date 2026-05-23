from fastapi import APIRouter, Depends, HTTPException, status
from database import execute_query
from models import Inventory, InventoryCreate
from typing import List, Optional
from auth import require_write_access

router = APIRouter()

# Response schema extension to include descriptive names
class InventoryWithNames(Inventory):
    product_name: Optional[str] = None
    warehouse_name: Optional[str] = None

@router.get("/", response_model=List[InventoryWithNames])
def get_inventory():
    """
    Retrieves all inventory allocations from the database using raw SQL,
    joining product and warehouse names for UX visibility.
    """
    try:
        query = """
            SELECT 
                i.warehouse_id, 
                i.product_id, 
                i.location, 
                i.quantity,
                p.product_name,
                w.warehouse_name
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            ORDER BY w.warehouse_name ASC, p.product_name ASC
        """
        result = execute_query(query, fetch=True)
        return result or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch inventory allocations: {str(e)}"
        )

@router.get("/{warehouse_id}/{product_id}", response_model=InventoryWithNames)
def get_inventory_item(warehouse_id: int, product_id: int):
    """
    Retrieves a single inventory allocation by warehouse ID and product ID.
    """
    try:
        query = """
            SELECT 
                i.warehouse_id, 
                i.product_id, 
                i.location, 
                i.quantity,
                p.product_name,
                w.warehouse_name
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            WHERE i.warehouse_id = ? AND i.product_id = ?
        """
        result = execute_query(query, (warehouse_id, product_id), fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Inventory allocation for Warehouse {warehouse_id} and Product {product_id} not found."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch inventory item: {str(e)}"
        )

@router.post("/", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def create_inventory(inventory: InventoryCreate, current_user = Depends(require_write_access)):
    """
    Creates a new inventory allocation. Checks warehouse and product existence, 
    and verifies that a record for this composite key doesn't already exist.
    """
    try:
        # 1. Verify warehouse exists
        wh_check = "SELECT warehouse_id FROM Warehouse WHERE warehouse_id = ?"
        wh_exists = execute_query(wh_check, (inventory.warehouse_id,), fetch_one=True)
        if not wh_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot allocate inventory: Warehouse with ID {inventory.warehouse_id} does not exist."
            )

        # 2. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        prod_exists = execute_query(prod_check, (inventory.product_id,), fetch_one=True)
        if not prod_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot allocate inventory: Product with ID {inventory.product_id} does not exist."
            )

        # 3. Verify duplicate composite key
        dup_check = "SELECT warehouse_id FROM Inventory WHERE warehouse_id = ? AND product_id = ?"
        dup_exists = execute_query(dup_check, (inventory.warehouse_id, inventory.product_id), fetch_one=True)
        if dup_exists:
            raise HTTPException(
                status_code=400,
                detail="Cannot allocate inventory: An allocation record already exists for this Product in this Warehouse. Update the existing record instead."
            )

        # 4. Insert inventory
        query = """
            INSERT INTO Inventory (warehouse_id, product_id, location, quantity)
            OUTPUT inserted.warehouse_id, inserted.product_id, inserted.location, inserted.quantity
            VALUES (?, ?, ?, ?)
        """
        params = (inventory.warehouse_id, inventory.product_id, inventory.location, inventory.quantity)
        result = execute_query(query, params, fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to create inventory record in SQL Server."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Inventory__quant" in err_msg or "quantity" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Inventory quantity must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create inventory record: {str(e)}"
        )

@router.put("/{warehouse_id}/{product_id}", response_model=Inventory)
def update_inventory(warehouse_id: int, product_id: int, inventory: InventoryCreate, current_user = Depends(require_write_access)):
    """
    Updates an existing inventory allocation.
    """
    try:
        # 1. Verify inventory exists
        inv_check = "SELECT warehouse_id FROM Inventory WHERE warehouse_id = ? AND product_id = ?"
        inv_exists = execute_query(inv_check, (warehouse_id, product_id), fetch_one=True)
        if not inv_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Inventory allocation for Warehouse {warehouse_id} and Product {product_id} not found."
            )

        # 2. Verify targets match URLs (if shifting PKs, block it to avoid integrity issues)
        if warehouse_id != inventory.warehouse_id or product_id != inventory.product_id:
            raise HTTPException(
                status_code=400,
                detail="Cannot change primary composite key IDs during update. Delete and create a new record instead."
            )

        # 3. Update inventory
        query = """
            UPDATE Inventory
            SET location = ?, quantity = ?
            WHERE warehouse_id = ? AND product_id = ?
        """
        params = (inventory.location, inventory.quantity, warehouse_id, product_id)
        execute_query(query, params)

        return {
            "warehouse_id": warehouse_id,
            "product_id": product_id,
            "location": inventory.location,
            "quantity": inventory.quantity
        }
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Inventory__quant" in err_msg or "quantity" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Inventory quantity must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update inventory record: {str(e)}"
        )

@router.delete("/{warehouse_id}/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory(warehouse_id: int, product_id: int, current_user = Depends(require_write_access)):
    """
    Deletes an inventory allocation.
    """
    try:
        # 1. Verify inventory exists
        inv_check = "SELECT warehouse_id FROM Inventory WHERE warehouse_id = ? AND product_id = ?"
        inv_exists = execute_query(inv_check, (warehouse_id, product_id), fetch_one=True)
        if not inv_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Inventory allocation for Warehouse {warehouse_id} and Product {product_id} not found."
            )

        # 2. Delete inventory
        query = "DELETE FROM Inventory WHERE warehouse_id = ? AND product_id = ?"
        execute_query(query, (warehouse_id, product_id))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete inventory record: {str(e)}"
        )
