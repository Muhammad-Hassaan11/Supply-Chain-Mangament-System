-- Supply Chain Management DBMS - Relational Database Schema
-- Target: Microsoft SQL Server

-- 1. Suppliers Table
CREATE TABLE Suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    contact_id INT NOT NULL,
    supplier_name VARCHAR(120) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    contact_email VARCHAR(100) NOT NULL CHECK (contact_email LIKE '%_@__%._%'),
    phone VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive'))
);

-- 2. Product Table
CREATE TABLE Product (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    lead_time_day INT NOT NULL CHECK (lead_time_day >= 0),
    supplier_id INT NOT NULL FOREIGN KEY REFERENCES Suppliers(supplier_id) ON DELETE CASCADE
);

-- 3. Warehouse Table
CREATE TABLE Warehouse (
    warehouse_id INT IDENTITY(1,1) PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity >= 0),
    product_id INT NOT NULL FOREIGN KEY REFERENCES Product(product_id)
);

-- 4. Inventory Table (Composite Primary Key)
CREATE TABLE Inventory (
    warehouse_id INT NOT NULL,
    product_id INT NOT NULL,
    location VARCHAR(50) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    PRIMARY KEY (warehouse_id, product_id),
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- 5. Shipments Table
CREATE TABLE Shipments (
    shipment_id INT IDENTITY(1,1) PRIMARY KEY,
    shipment_date DATE NOT NULL,
    warehouse_id INT NOT NULL FOREIGN KEY REFERENCES Warehouse(warehouse_id) ON DELETE CASCADE,
    tracking_number VARCHAR(100) NOT NULL UNIQUE
);

-- 6. Shipment_logs Table (Composite Primary Key)
CREATE TABLE Shipment_logs (
    shipment_id INT NOT NULL,
    log_seq_num INT NOT NULL,
    log_timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    event_type VARCHAR(50) NOT NULL,
    product_id INT NOT NULL FOREIGN KEY REFERENCES Product(product_id),
    PRIMARY KEY (shipment_id, log_seq_num),
    FOREIGN KEY (shipment_id) REFERENCES Shipments(shipment_id) ON DELETE CASCADE
);

-- 7. Users Table (Authentication & Role-Based Access Control)
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Viewer')),
    full_name VARCHAR(120) NOT NULL DEFAULT 'Supply Chain User',
    account_type VARCHAR(30) NULL CHECK (account_type IN ('admin', 'supplier', 'warehouse', 'client', 'logistics')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    created_at DATETIME NOT NULL DEFAULT GETDATE()
);
