from fastapi import APIRouter, HTTPException
from typing import List
from models import QueryCatalogItem, QueryExecutionRequest, QueryExecutionResponse
from database import get_db_connection
import pyodbc

router = APIRouter()

# The curated catalog of SQL queries
CATALOG = [
    {
        "id": "crud-1",
        "title": "High-Value Products",
        "description": "Retrieves products with a unit price greater than 500, ordered alphabetically by name.",
        "category": "CRUD",
        "sql": "SELECT product_id, product_name, unit_price, lead_time_day\nFROM Product\nWHERE unit_price > 500\nORDER BY product_name ASC;"
    },
    {
        "id": "crud-2",
        "title": "Domain Email Search",
        "description": "Finds all suppliers using an 'example.com' email address.",
        "category": "CRUD",
        "sql": "SELECT supplier_id, contact_id, supplier_name, rating, contact_email, phone, status\nFROM Suppliers\nWHERE contact_email LIKE '%@example.com';"
    },
    {
        "id": "join-1",
        "title": "Products with Supplier Details",
        "description": "Joins the Product and Suppliers tables to show products alongside their vendor contact emails and ratings.",
        "category": "JOIN",
        "sql": "SELECT p.product_id, p.product_name, p.unit_price, s.supplier_name, s.rating, s.contact_email\nFROM Product p\nINNER JOIN Suppliers s ON p.supplier_id = s.supplier_id;"
    },
    {
        "id": "join-2",
        "title": "Warehouses and their Shipments",
        "description": "Retrieves all warehouses and any shipments originating from them. Warehouses with no shipments will still appear (NULL tracking numbers).",
        "category": "JOIN",
        "sql": "SELECT w.warehouse_name, w.capacity, s.shipment_date, s.tracking_number\nFROM Warehouse w\nLEFT JOIN Shipments s ON w.warehouse_id = s.warehouse_id;"
    },
    {
        "id": "join-3",
        "title": "Full Supply Chain Traceability",
        "description": "A complex 4-table join tracing a shipment log event back through its shipment, origin warehouse, and main handled product.",
        "category": "JOIN",
        "sql": "SELECT sl.log_timestamp, sl.event_type, p.product_name, w.warehouse_name, s.tracking_number\nFROM Shipment_logs sl\nJOIN Shipments s ON sl.shipment_id = s.shipment_id\nJOIN Warehouse w ON s.warehouse_id = w.warehouse_id\nJOIN Product p ON sl.product_id = p.product_id\nORDER BY sl.log_timestamp DESC;"
    },
    {
        "id": "agg-1",
        "title": "Product Count per Supplier",
        "description": "Calculates the total number of products offered by each supplier.",
        "category": "Aggregate",
        "sql": "SELECT s.supplier_id, s.contact_email, COUNT(p.product_id) as total_products\nFROM Suppliers s\nLEFT JOIN Product p ON s.supplier_id = p.supplier_id\nGROUP BY s.supplier_id, s.contact_email;"
    },
    {
        "id": "agg-2",
        "title": "Total Inventory per Warehouse",
        "description": "Aggregates the total physical stock quantity stored in each warehouse.",
        "category": "Aggregate",
        "sql": "SELECT w.warehouse_name, SUM(i.quantity) as total_stock\nFROM Warehouse w\nJOIN Inventory i ON w.warehouse_id = i.warehouse_id\nGROUP BY w.warehouse_name;"
    },
    {
        "id": "agg-3",
        "title": "High-Volume Warehouses",
        "description": "Identifies warehouses holding more than 500 total items in stock using the HAVING clause.",
        "category": "Aggregate",
        "sql": "SELECT warehouse_id, SUM(quantity) as total_quantity\nFROM Inventory\nGROUP BY warehouse_id\nHAVING SUM(quantity) > 500;"
    },
    {
        "id": "sub-1",
        "title": "Premium Supplier Products",
        "description": "Retrieves all products supplied by vendors who possess a perfect 5-star rating.",
        "category": "Subquery",
        "sql": "SELECT product_id, product_name, unit_price\nFROM Product\nWHERE supplier_id IN (\n    SELECT supplier_id \n    FROM Suppliers \n    WHERE rating = 5\n);"
    },
    {
        "id": "sub-2",
        "title": "Below-Average Capacity Warehouses",
        "description": "Identifies warehouses whose total capacity is strictly less than the system-wide average capacity.",
        "category": "Subquery",
        "sql": "SELECT warehouse_name, capacity\nFROM Warehouse\nWHERE capacity < (\n    SELECT AVG(capacity) \n    FROM Warehouse\n);"
    }
]

@router.get("/catalog", response_model=List[QueryCatalogItem])
def get_query_catalog():
    """
    Returns the curated catalog of queries for the Query Lab UI.
    """
    return CATALOG

@router.post("/execute", response_model=QueryExecutionResponse)
def execute_lab_query(request: QueryExecutionRequest):
    """
    Executes a raw SQL string and returns the column headers and rows.
    Intended for the query lab playground ONLY.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Execute the query
        cursor.execute(request.sql)
        
        # If it's a SELECT query, fetch results
        if cursor.description:
            columns = [col[0] for col in cursor.description]
            raw_rows = cursor.fetchall()
            
            # Convert rows to dictionaries mapping column name to value
            rows = []
            for row in raw_rows:
                row_dict = {}
                for idx, col_name in enumerate(columns):
                    val = row[idx]
                    # Ensure datetime/date are stringified for JSON serialization
                    if hasattr(val, "isoformat"):
                        row_dict[col_name] = val.isoformat()
                    else:
                        row_dict[col_name] = val
                rows.append(row_dict)
                
            return {
                "columns": columns,
                "rows": rows,
                "row_count": len(rows)
            }
        else:
            # For INSERT/UPDATE/DELETE (though in this lab mostly SELECT is used)
            connection.commit()
            return {
                "columns": ["Result"],
                "rows": [{"Result": f"Query executed successfully. Affected rows: {cursor.rowcount}"}],
                "row_count": cursor.rowcount
            }
            
    except pyodbc.Error as e:
        connection.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"SQL Execution Error: {str(e)}"
        )
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Server Error: {str(e)}"
        )
    finally:
        cursor.close()
        connection.close()
