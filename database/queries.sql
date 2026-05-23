-- Supply Chain DBMS: Demonstration SQL Queries Catalog
-- This file contains the curated SQL queries for the Query Lab playground and viva demonstration.
-- It demonstrates full coverage of SQL Server capabilities including CRUD, JOINs, Aggregates, and Subqueries.

-- ======================================================================
-- 1. CRUD OPERATIONS (Basic Data Manipulation)
-- ======================================================================

-- 1.1 SELECT with WHERE, ORDER BY, LIKE
-- Title: High-Value Products
-- Description: Retrieves products with a unit price greater than 500, ordered alphabetically by name.
SELECT product_id, product_name, unit_price, lead_time_day
FROM Product
WHERE unit_price > 500
ORDER BY product_name ASC;

-- 1.2 SELECT with LIKE pattern matching
-- Title: Domain Email Search
-- Description: Finds all suppliers using an 'example.com' email address.
SELECT supplier_id, contact_id, rating, contact_email
FROM Suppliers
WHERE contact_email LIKE '%@example.com';

-- 1.3 INSERT Statement
-- Title: Insert New Supplier
-- Description: Demonstrates inserting a new record into the Suppliers table. (Requires Admin privileges)
-- NOTE: In the live playground, this is a read-only demonstration, but serves as the backend logic template.
INSERT INTO Suppliers (contact_id, rating, contact_email)
VALUES (999, 5, 'new.vendor@supplychain.net');

-- 1.4 UPDATE Statement
-- Title: Update Inventory Location
-- Description: Updates the physical bin location of a specific inventory item.
UPDATE Inventory
SET location = 'Aisle 4 - Rack B'
WHERE warehouse_id = 1 AND product_id = 2;


-- ======================================================================
-- 2. JOIN OPERATIONS (Relational Data Extraction)
-- ======================================================================

-- 2.1 INNER JOIN
-- Title: Products with Supplier Details
-- Description: Joins the Product and Suppliers tables to show products alongside their vendor contact emails and ratings.
SELECT p.product_id, p.product_name, p.unit_price, s.rating, s.contact_email
FROM Product p
INNER JOIN Suppliers s ON p.supplier_id = s.supplier_id;

-- 2.2 LEFT JOIN
-- Title: Warehouses and their Shipments
-- Description: Retrieves all warehouses and any shipments originating from them. Warehouses with no shipments will still appear (NULL tracking numbers).
SELECT w.warehouse_name, w.capacity, s.shipment_date, s.tracking_number
FROM Warehouse w
LEFT JOIN Shipments s ON w.warehouse_id = s.warehouse_id;

-- 2.3 MULTI-TABLE JOIN
-- Title: Full Supply Chain Traceability
-- Description: A complex 4-table join tracing a shipment log event back through its shipment, origin warehouse, and main handled product.
SELECT sl.log_timestamp, sl.event_type, p.product_name, w.warehouse_name, s.tracking_number
FROM Shipment_logs sl
JOIN Shipments s ON sl.shipment_id = s.shipment_id
JOIN Warehouse w ON s.warehouse_id = w.warehouse_id
JOIN Product p ON sl.product_id = p.product_id
ORDER BY sl.log_timestamp DESC;


-- ======================================================================
-- 3. AGGREGATE FUNCTIONS (Data Summarization)
-- ======================================================================

-- 3.1 COUNT
-- Title: Product Count per Supplier
-- Description: Calculates the total number of products offered by each supplier.
SELECT s.supplier_id, s.contact_email, COUNT(p.product_id) as total_products
FROM Suppliers s
LEFT JOIN Product p ON s.supplier_id = p.supplier_id
GROUP BY s.supplier_id, s.contact_email;

-- 3.2 SUM
-- Title: Total Inventory per Warehouse
-- Description: Aggregates the total physical stock quantity stored in each warehouse.
SELECT w.warehouse_name, SUM(i.quantity) as total_stock
FROM Warehouse w
JOIN Inventory i ON w.warehouse_id = i.warehouse_id
GROUP BY w.warehouse_name;

-- 3.3 AVG, MIN, MAX
-- Title: Product Price Analytics
-- Description: Calculates the average, minimum, and maximum unit prices across all registered products.
SELECT 
    AVG(unit_price) as avg_price, 
    MIN(unit_price) as min_price, 
    MAX(unit_price) as max_price
FROM Product;

-- 3.4 GROUP BY + HAVING
-- Title: High-Volume Warehouses
-- Description: Identifies warehouses holding more than 500 total items in stock using the HAVING clause.
SELECT warehouse_id, SUM(quantity) as total_quantity
FROM Inventory
GROUP BY warehouse_id
HAVING SUM(quantity) > 500;


-- ======================================================================
-- 4. SUBQUERIES (Nested Queries)
-- ======================================================================

-- 4.1 Simple Subquery (WHERE clause)
-- Title: Premium Supplier Products
-- Description: Retrieves all products supplied by vendors who possess a perfect 5-star rating.
SELECT product_id, product_name, unit_price
FROM Product
WHERE supplier_id IN (
    SELECT supplier_id 
    FROM Suppliers 
    WHERE rating = 5
);

-- 4.2 Scalar Subquery
-- Title: Below-Average Capacity Warehouses
-- Description: Identifies warehouses whose total capacity is strictly less than the system-wide average capacity.
SELECT warehouse_name, capacity
FROM Warehouse
WHERE capacity < (
    SELECT AVG(capacity) 
    FROM Warehouse
);

-- 4.3 Correlated Subquery
-- Title: Top Supplier Identifier
-- Description: Identifies the supplier(s) that supply the absolute maximum number of products in the entire catalog.
SELECT s.supplier_id, s.contact_email
FROM Suppliers s
WHERE (
    SELECT COUNT(*) 
    FROM Product p 
    WHERE p.supplier_id = s.supplier_id
) = (
    SELECT TOP 1 COUNT(*) 
    FROM Product 
    GROUP BY supplier_id 
    ORDER BY COUNT(*) DESC
);
