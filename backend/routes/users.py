from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from auth import check_admin_role, hash_password
from database import execute_query
from models import AdminUser, AdminUserCreate, AdminUserUpdate


router = APIRouter()

def _build_metrics(user: dict) -> dict:
    user_id = int(user.get("user_id") or 0)
    account_type = user.get("account_type") or ("admin" if user.get("role") == "Admin" else "client")
    created_at = user.get("created_at")

    def _n(seed: int, mod: int, base: int = 0) -> int:
        return base + ((seed * 37 + user_id * 17) % mod)

    if account_type == "supplier":
        rating = round(4.1 + ((_n(9, 9) / 10.0)), 1)
        return {"a_label": "Orders", "a_value": _n(3, 55, 12), "b_label": "Rating", "b_value": rating}
    if account_type == "warehouse":
        return {"a_label": "Bins", "a_value": _n(5, 140, 18), "b_label": "Alerts", "b_value": _n(7, 6, 1)}
    if account_type == "logistics":
        regions = ["West", "East", "North", "South"]
        return {"a_label": "Shipments", "a_value": _n(11, 40, 6), "b_label": "Region", "b_value": regions[user_id % len(regions)]}
    if account_type == "client":
        volumes = ["Low", "Medium", "High"]
        return {"a_label": "Orders", "a_value": _n(13, 30, 4), "b_label": "Volume", "b_value": volumes[user_id % len(volumes)]}
    if account_type == "admin":
        year = None
        try:
            year = created_at.year if created_at else None
        except Exception:
            year = None
        return {"a_label": "Access", "a_value": "Full", "b_label": "Since", "b_value": year or "—"}

    return {"a_label": "Activity", "a_value": _n(17, 100, 10), "b_label": "Status", "b_value": user.get("status") or "Active"}

@router.get("/", response_model=List[AdminUser])
def list_users(_admin=Depends(check_admin_role)):
    """
    Admin-only: list all registered users.
    """
    try:
        query = """
            SELECT
                user_id,
                email,
                role,
                full_name,
                account_type,
                status,
                created_at
            FROM Users
            ORDER BY created_at DESC, user_id DESC
        """
        result = execute_query(query, fetch=True)
        users = result or []
        for user in users:
            user["metrics"] = _build_metrics(user)
        return users
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch users from database: {str(e)}",
        )


@router.post("/", response_model=AdminUser, status_code=status.HTTP_201_CREATED)
def create_user(payload: AdminUserCreate, _admin=Depends(check_admin_role)):
    """
    Admin-only: create a new user without needing the public admin secret code.
    """
    check_query = "SELECT user_id FROM Users WHERE email = ?"
    exists = execute_query(check_query, (payload.email,), fetch_one=True)
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    hashed_pwd = hash_password(payload.password)
    account_type = payload.account_type or ("admin" if payload.role == "Admin" else None)
    insert_query = """
        INSERT INTO Users (email, password_hash, role, full_name, account_type, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """
    try:
        execute_query(
            insert_query,
            (payload.email, hashed_pwd, payload.role, payload.full_name.strip(), account_type, payload.status),
        )
        created = execute_query(
            """
            SELECT user_id, email, role, full_name, account_type, status, created_at
            FROM Users
            WHERE email = ?
            """,
            (payload.email,),
            fetch_one=True,
        )
        if not created:
            raise HTTPException(
                status_code=500,
                detail="Failed to read back created user.",
            )
        created["metrics"] = _build_metrics(created)
        return created
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create user: {str(e)}",
        )


@router.put("/{user_id}", response_model=AdminUser)
def update_user(user_id: int, payload: AdminUserUpdate, _admin=Depends(check_admin_role)):
    """
    Admin-only: update user fields (role/status/profile/password).
    """
    existing = execute_query(
        "SELECT user_id FROM Users WHERE user_id = ?",
        (user_id,),
        fetch_one=True,
    )
    if not existing:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found.")

    sets: list[str] = []
    params: list[object] = []

    if payload.role is not None:
        sets.append("role = ?")
        params.append(payload.role)

    if payload.full_name is not None:
        sets.append("full_name = ?")
        params.append(payload.full_name.strip() or "Supply Chain User")

    if payload.account_type is not None:
        sets.append("account_type = ?")
        params.append(payload.account_type)

    if payload.status is not None:
        sets.append("status = ?")
        params.append(payload.status)

    if payload.password is not None:
        sets.append("password_hash = ?")
        params.append(hash_password(payload.password))

    if sets:
        update_query = f"UPDATE Users SET {', '.join(sets)} WHERE user_id = ?"
        params.append(user_id)
        try:
            execute_query(update_query, tuple(params))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

    updated = execute_query(
        """
        SELECT user_id, email, role, full_name, account_type, status, created_at
        FROM Users
        WHERE user_id = ?
        """,
        (user_id,),
        fetch_one=True,
    )
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to read back updated user.")
    updated["metrics"] = _build_metrics(updated)
    return updated
