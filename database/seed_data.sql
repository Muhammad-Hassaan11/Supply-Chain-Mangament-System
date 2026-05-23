-- Supply Chain Management DBMS - High-Quality Seed Data
-- Target: Microsoft SQL Server
-- Default user password for seed accounts is "password123" (bcrypt hash: $2b$12$J2zLC8JLah/2xW9DXObVJ.W96zWp5ytO7WuMaDMA98Zk5jxpvQamW)

-- 1. Clear existing data in reverse order of dependencies
DELETE FROM Shipment_logs;
DELETE FROM Shipments;
DELETE FROM Inventory;
DELETE FROM Warehouse;
DELETE FROM Product;
DELETE FROM Suppliers;
DELETE FROM Users;

-- 2. Seed Users
INSERT INTO Users (email, password_hash, role) VALUES
('admin@supplychain.com', '$2b$12$J2zLC8JLah/2xW9DXObVJ.W96zWp5ytO7WuMaDMA98Zk5jxpvQamW', 'Admin'),
('viewer@supplychain.com', '$2b$12$J2zLC8JLah/2xW9DXObVJ.W96zWp5ytO7WuMaDMA98Zk5jxpvQamW', 'Viewer');

-- 3. Seed Suppliers (10 rows)
INSERT INTO Suppliers (contact_id, rating, contact_email) VALUES
(1001, 5, 'info@apexlogistics.com'),
(1002, 4, 'sales@quantumparts.com'),
(1003, 3, 'contact@globalsteel.co'),
(1004, 5, 'support@electrosource.net'),
(1005, 4, 'orders@bio-medsupply.com'),
(1006, 2, 'help@chemsolutions.org'),
(1007, 5, 'admin@valueline.in'),
(1008, 4, 'wholesale@texfabric.com'),
(1009, 3, 'delivery@evergreenparts.com'),
(1010, 5, 'partner@titaniumforge.com');

-- 4. Seed Products (25 rows)
-- Note: supplier_id references Suppliers. IDENTITY starts at 1, increments by 1.
INSERT INTO Product (product_name, unit_price, lead_time_day, supplier_id) VALUES
('Titanium Alloy Sheet', 450.00, 14, 10), -- Supplier 10
('Carbon Fiber Panel', 299.90, 20, 10),
('Precision Valve V-400', 89.50, 7, 2),    -- Supplier 2
('Heavy Steel Beam H10', 120.00, 10, 3),   -- Supplier 3
('Industrial Copper Wire 100m', 75.00, 5, 4),-- Supplier 4
('Microprocessor Chipset M1', 19.99, 30, 4),
('OLED Display Panel 7"', 45.50, 25, 4),
('Steel Rebar Bundle', 350.00, 12, 3),
('Chemical Solvent E-34', 65.00, 6, 6),     -- Supplier 6
('Nitrile Gloves Box 100x', 12.50, 2, 5),    -- Supplier 5
('Surgical Scalpel Pack', 45.00, 4, 5),
('Aluminium Ingot 50kg', 110.00, 8, 1),     -- Supplier 1
('Hydraulic Pump H-200', 675.00, 15, 2),
('Electronic Sensor module', 15.75, 5, 4),
('High-tensile Bolt M12 Pack', 8.50, 3, 7),  -- Supplier 7
('Hex Nut M12 Pack', 4.25, 3, 7),
('Synthetic Lubricant 5L', 55.00, 5, 6),
('Polyester Thread Spool', 18.00, 9, 8),     -- Supplier 8
('Raw Cotton Bale', 140.00, 15, 8),
('Graphene Powder 100g', 850.00, 22, 10),
('Neodymium Magnet N52', 22.40, 10, 9),    -- Supplier 9
('Brushless DC Motor 24V', 35.00, 11, 2),
('Lithium-ion Battery Pack', 88.00, 18, 4),
('Optical Glass Lens', 125.00, 16, 9),
('Thermal Compound Paste', 6.20, 2, 4);

-- 5. Seed Warehouses (8 rows)
-- product_id references Product (primary handled product for simplicity)
INSERT INTO Warehouse (warehouse_name, capacity, product_id) VALUES
('Central Hub Chicago', 10000, 1),
('East Coast Storage NY', 5000, 6),
('West Coast Depot LA', 8000, 3),
('Southern Logistics Houston', 6500, 9),
('Midwest Distribution Omaha', 4000, 12),
('Pac-West Fulfillment Seattle', 4500, 23),
('Southeast Annex Atlanta', 3000, 15),
('Rocky Mountain Silo Denver', 2500, 8);

-- 6. Seed Inventory (40 rows)
-- Connects Warehouses and Products. Contains some low-stock (<10) quantities for testing.
INSERT INTO Inventory (warehouse_id, product_id, location, quantity) VALUES
(1, 1, 'Aisle 1-A', 550),
(1, 2, 'Aisle 1-B', 220),
(1, 20, 'Vault A', 15),
(2, 6, 'Zone B-1', 4500),
(2, 7, 'Zone B-2', 1200),
(2, 14, 'Shelf 4', 8),    -- LOW STOCK ALERT (8)
(3, 3, 'Rack 12', 340),
(3, 13, 'Rack 13', 25),
(3, 22, 'Rack 14', 9),    -- LOW STOCK ALERT (9)
(4, 9, 'Tank 1', 120),
(4, 17, 'Tank 2', 40),
(4, 21, 'Bin 9', 3),      -- LOW STOCK ALERT (3)
(5, 12, 'Bay 4', 800),
(5, 4, 'Bay 5', 420),
(5, 8, 'Bay 6', 150),
(6, 23, 'Cold Storage', 180),
(6, 10, 'Aisle C-3', 1400),
(6, 11, 'Aisle C-4', 5),  -- LOW STOCK ALERT (5)
(7, 15, 'Bin 1-3', 2500),
(7, 16, 'Bin 1-4', 4000),
(7, 25, 'Shelf 8', 2),    -- LOW STOCK ALERT (2)
(8, 8, 'Silo 2', 650),
(8, 18, 'Rack E', 95),
(8, 19, 'Rack F', 45),
-- Additional listings to spread data (~40 inventory rows)
(1, 3, 'Aisle 2-A', 45),
(1, 4, 'Aisle 2-B', 80),
(1, 5, 'Aisle 2-C', 150),
(2, 23, 'Zone D', 60),
(2, 25, 'Shelf 9', 4),    -- LOW STOCK ALERT (4)
(3, 2, 'Rack 15', 30),
(3, 23, 'Rack 16', 7),    -- LOW STOCK ALERT (7)
(4, 10, 'Bin 10', 95),
(5, 15, 'Bay 7', 85),
(5, 16, 'Bay 8', 12),
(6, 6, 'Aisle D-1', 400),
(6, 7, 'Aisle D-2', 150),
(7, 14, 'Bin 1-5', 65),
(7, 24, 'Shelf 10', 50),
(8, 21, 'Rack G', 120),
(8, 24, 'Rack H', 8);     -- LOW STOCK ALERT (8)

-- 7. Seed Shipments (15 rows)
-- warehouse_id references Warehouse
INSERT INTO Shipments (shipment_date, warehouse_id, tracking_number) VALUES
('2026-05-01', 1, 'TRK-USA-10001'),
('2026-05-03', 2, 'TRK-USA-10002'),
('2026-05-05', 3, 'TRK-USA-10003'),
('2026-05-08', 4, 'TRK-USA-10004'),
('2026-05-10', 5, 'TRK-USA-10005'),
('2026-05-12', 6, 'TRK-USA-10006'),
('2026-05-14', 7, 'TRK-USA-10007'),
('2026-05-15', 8, 'TRK-USA-10008'),
('2026-05-16', 1, 'TRK-USA-10009'),
('2026-05-18', 2, 'TRK-USA-10010'),
('2026-05-19', 3, 'TRK-USA-10011'),
('2026-05-20', 4, 'TRK-USA-10012'),
('2026-05-21', 5, 'TRK-USA-10013'),
('2026-05-22', 6, 'TRK-USA-10014'),
('2026-05-22', 7, 'TRK-USA-10015');

-- 8. Seed Shipment Logs (45 rows - status tracks for Shipments)
-- Connecting shipments to products via shipment logs status updates.
-- Event sequence logs representing transitions
INSERT INTO Shipment_logs (shipment_id, log_seq_num, log_timestamp, event_type, product_id) VALUES
-- Shipment 1
(1, 1, '2026-05-01 08:00:00', 'Order Created', 1),
(1, 2, '2026-05-01 14:30:00', 'Loaded onto Carrier', 1),
(1, 3, '2026-05-02 09:15:00', 'In Transit', 1),
(1, 4, '2026-05-04 11:00:00', 'Delivered', 1),
-- Shipment 2
(2, 1, '2026-05-03 09:00:00', 'Order Created', 6),
(2, 2, '2026-05-03 16:00:00', 'Loaded onto Carrier', 6),
(2, 3, '2026-05-04 10:00:00', 'In Transit', 6),
(2, 4, '2026-05-05 13:45:00', 'Delivered', 6),
-- Shipment 3
(3, 1, '2026-05-05 10:00:00', 'Order Created', 3),
(3, 2, '2026-05-05 17:00:00', 'Loaded onto Carrier', 3),
(3, 3, '2026-05-06 11:30:00', 'In Transit', 3),
(3, 4, '2026-05-07 14:00:00', 'Delivered', 3),
-- Shipment 4
(4, 1, '2026-05-08 08:30:00', 'Order Created', 9),
(4, 2, '2026-05-08 15:00:00', 'Loaded onto Carrier', 9),
(4, 3, '2026-05-09 09:00:00', 'In Transit', 9),
(4, 4, '2026-05-11 10:30:00', 'Delivered', 9),
-- Shipment 5
(5, 1, '2026-05-10 11:00:00', 'Order Created', 12),
(5, 2, '2026-05-10 16:30:00', 'Loaded onto Carrier', 12),
(5, 3, '2026-05-11 08:00:00', 'In Transit', 12),
(5, 4, '2026-05-12 15:00:00', 'Delivered', 12),
-- Shipment 6
(6, 1, '2026-05-12 09:00:00', 'Order Created', 23),
(6, 2, '2026-05-12 14:00:00', 'Loaded onto Carrier', 23),
(6, 3, '2026-05-13 10:15:00', 'In Transit', 23),
-- Shipment 7
(7, 1, '2026-05-14 10:00:00', 'Order Created', 15),
(7, 2, '2026-05-14 16:00:00', 'Loaded onto Carrier', 15),
(7, 3, '2026-05-15 08:30:00', 'In Transit', 15),
-- Shipment 8
(8, 1, '2026-05-15 09:30:00', 'Order Created', 8),
(8, 2, '2026-05-15 14:45:00', 'Loaded onto Carrier', 8),
(8, 3, '2026-05-16 11:00:00', 'In Transit', 8),
-- Shipment 9
(9, 1, '2026-05-16 13:00:00', 'Order Created', 1),
(9, 2, '2026-05-17 09:00:00', 'Loaded onto Carrier', 1),
-- Shipment 10
(10, 1, '2026-05-18 10:00:00', 'Order Created', 6),
(10, 2, '2026-05-18 15:30:00', 'Loaded onto Carrier', 6),
-- Shipment 11
(11, 1, '2026-05-19 11:00:00', 'Order Created', 2),
-- Shipment 12
(12, 1, '2026-05-20 08:00:00', 'Order Created', 10),
(12, 2, '2026-05-20 12:00:00', 'Loaded onto Carrier', 10),
-- Shipment 13
(13, 1, '2026-05-21 09:00:00', 'Order Created', 16),
-- Shipment 14
(14, 1, '2026-05-22 10:00:00', 'Order Created', 23),
-- Shipment 15
(15, 1, '2026-05-22 14:00:00', 'Order Created', 25);
