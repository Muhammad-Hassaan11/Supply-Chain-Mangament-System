from fastapi import APIRouter, Depends, HTTPException, status
from database import execute_query
from models import Product, ProductCreate
from typing import List
from auth import require_write_access

router = APIRouter()

@router.get("/", response_model=List[Product])
def get_products():
    """
    Retrieves all products from the database using raw SQL.
    """
    try:
        query = "SELECT product_id, product_name, unit_price, lead_time_day, supplier_id FROM Product ORDER BY product_id DESC"
        result = execute_query(query, fetch=True)
        return result or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch products from database: {str(e)}"
        )

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int):
    """
    Retrieves a single product by ID using raw SQL.
    """
    try:
        query = "SELECT product_id, product_name, unit_price, lead_time_day, supplier_id FROM Product WHERE product_id = ?"
        result = execute_query(query, (product_id,), fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Product with ID {product_id} not found."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch product: {str(e)}"
        )

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, current_user = Depends(require_write_access)):
    """
    Creates a new product using raw SQL. Enforces referential integrity checks.
    """
    try:
        # 1. Verify supplier exists
        supp_check = "SELECT supplier_id FROM Suppliers WHERE supplier_id = ?"
        supplier_exists = execute_query(supp_check, (product.supplier_id,), fetch_one=True)
        if not supplier_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot create product: Supplier with ID {product.supplier_id} does not exist."
            )

        # 2. Insert product
        query = """
            INSERT INTO Product (product_name, unit_price, lead_time_day, supplier_id)
            OUTPUT inserted.product_id, inserted.product_name, inserted.unit_price, inserted.lead_time_day, inserted.supplier_id
            VALUES (?, ?, ?, ?)
        """
        params = (product.product_name, product.unit_price, product.lead_time_day, product.supplier_id)
        result = execute_query(query, params, fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to create product in SQL Server."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Product__unit_pr" in err_msg or "unit_price" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Product unit price must be a non-negative number."
            )
        elif "CK__Product__lead_ti" in err_msg or "lead_time" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Product lead time must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create product: {str(e)}"
        )

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product: ProductCreate, current_user = Depends(require_write_access)):
    """
    Updates an existing product using raw SQL.
    """
    try:
        # 1. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        prod_exists = execute_query(prod_check, (product_id,), fetch_one=True)
        if not prod_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Product with ID {product_id} not found."
            )

        # 2. Verify supplier exists
        supp_check = "SELECT supplier_id FROM Suppliers WHERE supplier_id = ?"
        supplier_exists = execute_query(supp_check, (product.supplier_id,), fetch_one=True)
        if not supplier_exists:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot update product: Supplier with ID {product.supplier_id} does not exist."
            )

        # 3. Update product
        query = """
            UPDATE Product
            SET product_name = ?, unit_price = ?, lead_time_day = ?, supplier_id = ?
            WHERE product_id = ?
        """
        params = (product.product_name, product.unit_price, product.lead_time_day, product.supplier_id, product_id)
        execute_query(query, params)

        return {
            "product_id": product_id,
            "product_name": product.product_name,
            "unit_price": product.unit_price,
            "lead_time_day": product.lead_time_day,
            "supplier_id": product.supplier_id
        }
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Product__unit_pr" in err_msg or "unit_price" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Product unit price must be a non-negative number."
            )
        elif "CK__Product__lead_ti" in err_msg or "lead_time" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Product lead time must be a non-negative integer."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update product: {str(e)}"
        )

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, current_user = Depends(require_write_access)):
    """
    Deletes a product by ID.
    Enforces application-level restriction against cascading deletes if dependent Warehouses,
    Inventory, or Shipment logs exist.
    """
    try:
        # 1. Verify product exists
        prod_check = "SELECT product_id FROM Product WHERE product_id = ?"
        prod_exists = execute_query(prod_check, (product_id,), fetch_one=True)
        if not prod_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Product with ID {product_id} not found."
            )

        # 2. Check for dependent Warehouses
        wh_check = "SELECT COUNT(*) AS total FROM Warehouse WHERE product_id = ?"
        wh_res = execute_query(wh_check, (product_id,), fetch_one=True)
        if wh_res and wh_res["total"] > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete product: It is configured as the main product for {wh_res['total']} warehouses. Delete or reassign those warehouses first."
            )

        # 3. Check for dependent Inventory
        inv_check = "SELECT COUNT(*) AS total FROM Inventory WHERE product_id = ?"
        inv_res = execute_query(inv_check, (product_id,), fetch_one=True)
        if inv_res and inv_res["total"] > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete product: Stock allocations exist for this product in {inv_res['total']} warehouses. Clear the inventory records first."
            )

        # 4. Check for dependent Shipment Logs
        logs_check = "SELECT COUNT(*) AS total FROM Shipment_logs WHERE product_id = ?"
        logs_res = execute_query(logs_check, (product_id,), fetch_one=True)
        if logs_res and logs_res["total"] > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete product: Shipment log records ({logs_res['total']}) are currently linked to this product. Clear logs or shipments first."
            )

        # 5. Safe to delete
        delete_query = "DELETE FROM Product WHERE product_id = ?"
        execute_query(delete_query, (product_id,))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete product: {str(e)}"
        )
