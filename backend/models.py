from pydantic import BaseModel, EmailStr, Field, validator
from datetime import date, datetime
from typing import Optional, List

# ==========================================
# AUTHENTICATION SCHEMAS
# ==========================================

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    role: str = Field(..., description="Role must be either 'Admin' or 'Viewer'")
    secret_code: Optional[str] = Field(None, description="Secret code required for Admin registration")
    full_name: Optional[str] = Field(None, description="Optional display name for admin user listing")
    account_type: Optional[str] = Field(None, description="Optional portal account type (supplier/warehouse/client/logistics/admin)")

    @validator('role')
    def validate_role(cls, v):
        if v not in ('Admin', 'Viewer'):
            raise ValueError("Role must be 'Admin' or 'Viewer'")
        return v

    @validator('account_type')
    def validate_account_type(cls, v):
        if v is None:
            return v
        if v not in ('admin', 'supplier', 'warehouse', 'client', 'logistics'):
            raise ValueError("account_type must be one of: admin, supplier, warehouse, client, logistics")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str

# ==========================================
# ADMIN USER MANAGEMENT SCHEMAS
# ==========================================

class AdminUser(BaseModel):
    user_id: int
    email: EmailStr
    role: str
    full_name: str
    account_type: Optional[str] = None
    status: str
    created_at: datetime
    metrics: Optional[dict] = None

class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(..., description="Role must be either 'Admin' or 'Viewer'")
    full_name: str = Field(..., min_length=1, max_length=120)
    account_type: Optional[str] = Field(None, description="supplier/warehouse/client/logistics/admin")
    status: str = Field("Active", description="Active or Suspended")

    @validator('role')
    def validate_admin_role(cls, v):
        if v not in ('Admin', 'Viewer'):
            raise ValueError("Role must be 'Admin' or 'Viewer'")
        return v

    @validator('account_type')
    def validate_admin_account_type(cls, v):
        if v is None:
            return v
        if v not in ('admin', 'supplier', 'warehouse', 'client', 'logistics'):
            raise ValueError("account_type must be one of: admin, supplier, warehouse, client, logistics")
        return v

    @validator('status')
    def validate_status(cls, v):
        if v not in ('Active', 'Suspended'):
            raise ValueError("status must be 'Active' or 'Suspended'")
        return v

class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    full_name: Optional[str] = None
    account_type: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)

    @validator('role')
    def validate_update_role(cls, v):
        if v is None:
            return v
        if v not in ('Admin', 'Viewer'):
            raise ValueError("Role must be 'Admin' or 'Viewer'")
        return v

    @validator('account_type')
    def validate_update_account_type(cls, v):
        if v is None:
            return v
        if v not in ('admin', 'supplier', 'warehouse', 'client', 'logistics'):
            raise ValueError("account_type must be one of: admin, supplier, warehouse, client, logistics")
        return v

    @validator('status')
    def validate_update_status(cls, v):
        if v is None:
            return v
        if v not in ('Active', 'Suspended'):
            raise ValueError("status must be 'Active' or 'Suspended'")
        return v

# ==========================================
# MASTER SCM ENTITY SCHEMAS (CRUD)
# ==========================================

class SupplierBase(BaseModel):
    contact_id: int = Field(..., gt=0, description="Contact ID must be a positive integer")
    supplier_name: str = Field(..., min_length=1, max_length=120, description="Supplier name cannot be empty")
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    contact_email: EmailStr = Field(..., description="Valid contact email address")
    phone: str = Field("", max_length=40, description="Supplier phone number")
    status: str = Field("Active", description="Active or Inactive")

    @validator('status')
    def validate_supplier_status(cls, v):
        if v not in ('Active', 'Inactive'):
            raise ValueError("status must be 'Active' or 'Inactive'")
        return v

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    supplier_id: int

class ProductBase(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=100, description="Product Name cannot be empty")
    unit_price: float = Field(..., ge=0, description="Unit Price must be non-negative")
    lead_time_day: int = Field(..., ge=0, description="Lead time in days must be non-negative")
    supplier_id: int = Field(..., gt=0, description="Supplier ID must be positive")

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    product_id: int

class WarehouseBase(BaseModel):
    warehouse_name: str = Field(..., min_length=1, max_length=100, description="Warehouse Name cannot be empty")
    capacity: int = Field(..., ge=0, description="Capacity must be non-negative")
    product_id: int = Field(..., gt=0, description="Main handled Product ID must be positive")

class WarehouseCreate(WarehouseBase):
    pass

class Warehouse(WarehouseBase):
    warehouse_id: int

class InventoryBase(BaseModel):
    warehouse_id: int = Field(..., gt=0, description="Warehouse ID must be positive")
    product_id: int = Field(..., gt=0, description="Product ID must be positive")
    location: str = Field(..., min_length=1, max_length=50, description="Location within warehouse cannot be empty")
    quantity: int = Field(..., ge=0, description="Quantity must be non-negative")

class InventoryCreate(InventoryBase):
    pass

class Inventory(InventoryBase):
    pass

class ShipmentBase(BaseModel):
    shipment_date: date = Field(..., description="Date of shipment (YYYY-MM-DD)")
    warehouse_id: int = Field(..., gt=0, description="Origin Warehouse ID must be positive")
    tracking_number: str = Field(..., min_length=1, max_length=100, description="Unique Tracking Number cannot be empty")

class ShipmentCreate(ShipmentBase):
    pass

class Shipment(ShipmentBase):
    shipment_id: int

class ShipmentLogBase(BaseModel):
    shipment_id: int = Field(..., gt=0, description="Shipment ID must be positive")
    log_seq_num: int = Field(..., gt=0, description="Log Sequence Number must be a positive integer")
    log_timestamp: Optional[datetime] = None
    event_type: str = Field(..., min_length=1, max_length=50, description="Event Type cannot be empty")
    product_id: int = Field(..., gt=0, description="Product ID must be positive")

class ShipmentLogCreate(ShipmentLogBase):
    pass

class ShipmentLog(ShipmentLogBase):
    pass

# ==========================================
# ANALYTICS & DASHBOARD SCHEMAS
# ==========================================

class LowStockAlert(BaseModel):
    warehouse_name: str
    product_name: str
    location: str
    quantity: int

class DashboardStats(BaseModel):
    total_suppliers: int
    total_products: int
    total_warehouses: int
    total_shipments: int
    low_stock_count: int
    low_stock_alerts: List[LowStockAlert]

# ==========================================
# QUERY LAB SCHEMAS
# ==========================================

class QueryCatalogItem(BaseModel):
    id: str
    title: str
    description: str
    category: str
    sql: str

class QueryExecutionRequest(BaseModel):
    sql: str

class QueryExecutionResponse(BaseModel):
    columns: List[str]
    rows: List[dict]
    row_count: int

# ==========================================
# CLIENT PORTAL SCHEMAS
# ==========================================

class ClientProfileResponse(BaseModel):
    user_id: int
    email: EmailStr
    full_name: str
    job_title: str
    phone: str
    alt_phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    location: str
    timezone: str
    language: str
    company_name: str
    legal_name: str
    headquarters: str
    website: str
    tax_id: str
    client_id: str
    client_type: str
    access_level: str
    assigned_since: str
    support_email: EmailStr
    billing_email: EmailStr
    profile_image_url: Optional[str] = None

class ClientProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    alt_phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    tax_id: Optional[str] = None
    support_email: Optional[EmailStr] = None
    billing_email: Optional[EmailStr] = None
    profile_image_url: Optional[str] = None

class ClientReportRequest(BaseModel):
    report_type: str = "Summary Overview"
    date_range: str = "May 1 – May 25, 2025"

class ClientReportResponse(BaseModel):
    file_name: str
    content: str
    generated_at: str

class ClientPaymentRequest(BaseModel):
    amount: str
    invoice_reference: Optional[str] = None

class ClientPaymentResponse(BaseModel):
    success: bool
    confirmation_message: str
    paid_at: str

class ClientSupportRequest(BaseModel):
    subject: str
    message: str

class ClientSupportResponse(BaseModel):
    success: bool
    ticket_id: str
    message: str
