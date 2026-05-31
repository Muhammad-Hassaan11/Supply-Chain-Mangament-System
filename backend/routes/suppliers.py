from fastapi import APIRouter, Depends, HTTPException, status
from database import ensure_supplier_profile_columns, execute_query
from models import Supplier, SupplierCreate
from typing import List
from auth import require_write_access

router = APIRouter()

@router.get("/", response_model=List[Supplier])
def get_suppliers():
    """
    Retrieves all suppliers from the database using raw SQL.
    """
    try:
        ensure_supplier_profile_columns()
        query = """
            SELECT supplier_id, contact_id, supplier_name, rating, contact_email, phone, status
            FROM Suppliers
            ORDER BY supplier_id DESC
        """
        result = execute_query(query, fetch=True)
        return result or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch suppliers from database: {str(e)}"
        )

@router.get("/{supplier_id}", response_model=Supplier)
def get_supplier(supplier_id: int):
    """
    Retrieves a single supplier by ID using raw SQL.
    """
    try:
        ensure_supplier_profile_columns()
        query = """
            SELECT supplier_id, contact_id, supplier_name, rating, contact_email, phone, status
            FROM Suppliers
            WHERE supplier_id = ?
        """
        result = execute_query(query, (supplier_id,), fetch_one=True)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Supplier with ID {supplier_id} not found."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch supplier: {str(e)}"
        )

@router.post("/", response_model=Supplier, status_code=status.HTTP_201_CREATED)
def create_supplier(supplier: SupplierCreate, current_user = Depends(require_write_access)):
    """
    Creates a new supplier using raw SQL.
    """
    try:
        ensure_supplier_profile_columns()
        # Validate rating in application layer (as double insurance)
        if not (1 <= supplier.rating <= 5):
            raise HTTPException(
                status_code=400,
                detail="Supplier rating must be an integer between 1 and 5."
            )

        query = """
            INSERT INTO Suppliers (contact_id, supplier_name, rating, contact_email, phone, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        params = (
            supplier.contact_id,
            supplier.supplier_name,
            supplier.rating,
            supplier.contact_email,
            supplier.phone,
            supplier.status,
        )
        execute_query(query, params)

        result = execute_query(
            """
            SELECT TOP 1 supplier_id, contact_id, supplier_name, rating, contact_email, phone, status
            FROM Suppliers
            WHERE contact_id = ? AND contact_email = ?
            ORDER BY supplier_id DESC
            """,
            (supplier.contact_id, supplier.contact_email),
            fetch_one=True
        )
        
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to create supplier row in SQL Server."
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        # Catch SQL Server Check Constraint violations or other database errors
        err_msg = str(e)
        if "CK__Suppliers__ratin" in err_msg or "rating" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Supplier rating must be between 1 and 5."
            )
        elif "CK__Suppliers__conta" in err_msg or "email" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Supplier email must be a valid email format (e.g. contact@domain.com)."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create supplier: {str(e)}"
        )

@router.put("/{supplier_id}", response_model=Supplier)
def update_supplier(supplier_id: int, supplier: SupplierCreate, current_user = Depends(require_write_access)):
    """
    Updates an existing supplier using raw SQL.
    """
    try:
        ensure_supplier_profile_columns()
        # First verify supplier exists
        check_query = "SELECT supplier_id FROM Suppliers WHERE supplier_id = ?"
        exists = execute_query(check_query, (supplier_id,), fetch_one=True)
        if not exists:
            raise HTTPException(
                status_code=404,
                detail=f"Supplier with ID {supplier_id} not found."
            )

        if not (1 <= supplier.rating <= 5):
            raise HTTPException(
                status_code=400,
                detail="Supplier rating must be an integer between 1 and 5."
            )

        query = """
            UPDATE Suppliers
            SET contact_id = ?, supplier_name = ?, rating = ?, contact_email = ?, phone = ?, status = ?
            WHERE supplier_id = ?
        """
        params = (
            supplier.contact_id,
            supplier.supplier_name,
            supplier.rating,
            supplier.contact_email,
            supplier.phone,
            supplier.status,
            supplier_id,
        )
        execute_query(query, params)

        # Return updated supplier
        return {
            "supplier_id": supplier_id,
            "contact_id": supplier.contact_id,
            "supplier_name": supplier.supplier_name,
            "rating": supplier.rating,
            "contact_email": supplier.contact_email,
            "phone": supplier.phone,
            "status": supplier.status,
        }
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "CK__Suppliers__ratin" in err_msg or "rating" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Supplier rating must be between 1 and 5."
            )
        elif "CK__Suppliers__conta" in err_msg or "email" in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Supplier email must be a valid email format (e.g. contact@domain.com)."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update supplier: {str(e)}"
        )

@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: int, current_user = Depends(require_write_access)):
    """
    Deletes a supplier by ID.
    Enforces application-level restriction against cascading deletes if dependent Products exist.
    """
    try:
        ensure_supplier_profile_columns()
        # First verify supplier exists
        check_query = "SELECT supplier_id FROM Suppliers WHERE supplier_id = ?"
        exists = execute_query(check_query, (supplier_id,), fetch_one=True)
        if not exists:
            raise HTTPException(
                status_code=404,
                detail=f"Supplier with ID {supplier_id} not found."
            )

        # Check for dependent Products (restrict deletion)
        # Note the table name in database/schema.sql is singular 'Product'
        dep_query = "SELECT COUNT(*) AS total FROM Product WHERE supplier_id = ?"
        dep_res = execute_query(dep_query, (supplier_id,), fetch_one=True)
        
        if dep_res and dep_res["total"] > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete supplier: Active products ({dep_res['total']}) are currently linked to this supplier. Delete the products first."
            )

        # Safe to delete
        delete_query = "DELETE FROM Suppliers WHERE supplier_id = ?"
        execute_query(delete_query, (supplier_id,))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete supplier: {str(e)}"
        )
