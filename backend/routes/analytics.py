from fastapi import APIRouter, Depends, HTTPException
from database import execute_query
from models import DashboardStats, LowStockAlert
from auth import get_current_user, TokenData

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats():
    """
    Retrieves aggregated summary statistics and low stock alerts for the executive dashboard.
    Uses 100% raw SQL queries executed directly against SQL Server.
    """
    try:
        # 1. Get count of Suppliers
        suppliers_result = execute_query("SELECT COUNT(*) AS total FROM Suppliers", fetch_one=True)
        total_suppliers = suppliers_result["total"] if suppliers_result else 0

        # 2. Get count of Products (note table name is singular 'Product')
        products_result = execute_query("SELECT COUNT(*) AS total FROM Product", fetch_one=True)
        total_products = products_result["total"] if products_result else 0

        # 3. Get count of Warehouses (note table name is singular 'Warehouse')
        warehouses_result = execute_query("SELECT COUNT(*) AS total FROM Warehouse", fetch_one=True)
        total_warehouses = warehouses_result["total"] if warehouses_result else 0

        # 4. Get count of Shipments (note table name is plural 'Shipments')
        shipments_result = execute_query("SELECT COUNT(*) AS total FROM Shipments", fetch_one=True)
        total_shipments = shipments_result["total"] if shipments_result else 0

        # 5. Get total count of low stock inventory records (quantity < 10)
        low_stock_count_res = execute_query("SELECT COUNT(*) AS total FROM Inventory WHERE quantity < 10", fetch_one=True)
        low_stock_count = low_stock_count_res["total"] if low_stock_count_res else 0

        # 6. Retrieve detailed low-stock items with Warehouse and Product JOINs
        low_stock_alerts_query = """
            SELECT 
                w.warehouse_name, 
                p.product_name, 
                i.location, 
                i.quantity
            FROM Inventory i
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            JOIN Product p ON i.product_id = p.product_id
            WHERE i.quantity < 10
            ORDER BY i.quantity ASC
        """
        alerts_result = execute_query(low_stock_alerts_query, fetch=True)
        
        low_stock_alerts = []
        if alerts_result:
            for alert in alerts_result:
                low_stock_alerts.append(
                    LowStockAlert(
                        warehouse_name=alert["warehouse_name"],
                        product_name=alert["product_name"],
                        location=alert["location"],
                        quantity=alert["quantity"]
                    )
                )

        return DashboardStats(
            total_suppliers=total_suppliers,
            total_products=total_products,
            total_warehouses=total_warehouses,
            total_shipments=total_shipments,
            low_stock_count=low_stock_count,
            low_stock_alerts=low_stock_alerts
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch dashboard metrics from SQL Server database: {str(e)}"
        )
