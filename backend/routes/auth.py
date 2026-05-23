from fastapi import APIRouter, HTTPException, status
from database import execute_query
from models import UserLogin, UserRegister, Token
from auth import hash_password, verify_password, create_access_token

router = APIRouter()

ADMIN_SECRET = "admin123" # Friendly, simple secret code for demo/viva purposes

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(register_data: UserRegister):
    """
    Registers a new user inside the SQL Server Users table.
    Enforces check constraint validations and handles administrative secret codes.
    """
    # 1. Check if user already exists
    check_query = "SELECT user_id FROM Users WHERE email = ?"
    exists = execute_query(check_query, (register_data.email,), fetch_one=True)
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Check secret code for Admin role
    if register_data.role == "Admin":
        if not register_data.secret_code or register_data.secret_code != ADMIN_SECRET:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid secret administrative code. You cannot register as an Admin without the correct secret key."
            )

    # 3. Create user
    hashed_pwd = hash_password(register_data.password)
    insert_query = """
        INSERT INTO Users (email, password_hash, role)
        VALUES (?, ?, ?)
    """
    try:
        execute_query(insert_query, (register_data.email, hashed_pwd, register_data.role))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user in database: {str(e)}"
        )

    # 4. Generate token to auto-login
    access_token = create_access_token(data={"sub": register_data.email, "role": register_data.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": register_data.role,
        "email": register_data.email
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin):
    """
    Authenticates a user against credentials stored inside the Users table.
    Returns signed JWT access token on success.
    """
    # 1. Fetch user
    query = "SELECT email, password_hash, role FROM Users WHERE email = ?"
    user = execute_query(query, (login_data.email,), fetch_one=True)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Verify password
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate token
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "email": user["email"]
    }
