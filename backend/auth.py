import os
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# JWT configurations from environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "94d76a7e08920bc8b671a932b70f0322cfd8995a947a11979ad234857b28db76")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # Default 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify standard bcrypt password"""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """
    FastAPI dependency to secure routes.
    Decodes the JWT token and returns standard TokenData.
    Raises 401 if token is missing or invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
        
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise credentials_exception
        return TokenData(email=email, role=role)
    except JWTError:
        raise credentials_exception

def check_admin_role(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    """
    FastAPI dependency to restrict routes to Admins only.
    Raises 403 Forbidden if user role is not Admin.
    """
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Administrative privileges required."
        )
    return current_user

def get_optional_user(token: str = Depends(oauth2_scheme)) -> Optional[TokenData]:
    """
    FastAPI dependency that extracts user info from JWT if present.
    Returns None if no token or invalid token (does NOT raise 401).
    Used for soft-auth: allows unauthenticated access but provides role info when logged in.
    """
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            return None
        return TokenData(email=email, role=role)
    except JWTError:
        return None

def require_write_access(current_user: Optional[TokenData] = Depends(get_optional_user)) -> Optional[TokenData]:
    """
    FastAPI dependency to block Viewer role from write operations (POST/PUT/DELETE).
    - If no token present (unauthenticated): allows access (demo/dev mode).
    - If token present with Admin role: allows access.
    - If token present with Viewer role: raises 403 Forbidden.
    """
    if current_user is not None and current_user.role == "Viewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Viewer accounts cannot perform write operations. Please login with an Admin account."
        )
    return current_user
