import os
import pyodbc
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build SQL Server Connection String
def get_connection_string():
    driver = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")
    server = os.getenv("DB_SERVER", "localhost")
    database = os.getenv("DB_DATABASE", "SupplyChainDB")
    trusted = os.getenv("DB_TRUSTED_CONNECTION", "yes")
    
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")
    
    conn_str = f"DRIVER={{{driver}}};SERVER={server};DATABASE={database};"
    
    if trusted.lower() == "yes":
        conn_str += "Trusted_Connection=yes;"
    else:
        if username and password:
            conn_str += f"UID={username};PWD={password};"
            
    encrypt = os.getenv("DB_ENCRYPT", "no")
    trust_cert = os.getenv("DB_TRUST_SERVER_CERTIFICATE", "yes")
    conn_str += f"Encrypt={encrypt};TrustServerCertificate={trust_cert};"
        
    return conn_str

def get_db_connection():
    """
    Returns a raw pyodbc connection object.
    Caller is responsible for closing the connection.
    """
    conn_str = get_connection_string()
    try:
        connection = pyodbc.connect(conn_str)
        return connection
    except Exception as e:
        print(f"Database Connection Error: {e}")
        raise RuntimeError(f"Could not connect to SQL Server database. Check connection string: {conn_str}. Error: {e}")

def execute_query(query: str, params: tuple = None, fetch: bool = False, fetch_one: bool = False):
    """
    Executes a raw SQL query.
    If fetch is True, returns a list of dictionaries mapping column name to value.
    If fetch_one is True, returns a single dictionary or None.
    If fetch and fetch_one are False, returns the number of affected rows.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        normalized_query = query.lstrip().upper()
        is_read_query = normalized_query.startswith("SELECT")

        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
            
        if fetch or fetch_one:
            if not cursor.description:
                return [] if fetch else None
                
            columns = [column[0] for column in cursor.description]
            
            if fetch_one:
                row = cursor.fetchone()
                if not is_read_query:
                    connection.commit()
                if row:
                    return dict(zip(columns, row))
                return None
            else:
                rows = cursor.fetchall()
                if not is_read_query:
                    connection.commit()
                return [dict(zip(columns, row)) for row in rows]
        else:
            connection.commit()
            return cursor.rowcount
            
    except Exception as e:
        connection.rollback()
        print(f"SQL Execution Error: {e}\nQuery: {query}\nParams: {params}")
        raise e
    finally:
        cursor.close()
        connection.close()

def ensure_user_profile_columns():
    """
    Upgrades older demo databases so admin user management can run without
    requiring a full schema rebuild.
    """
    statements = [
        """
        IF COL_LENGTH('Users', 'full_name') IS NULL
            ALTER TABLE Users ADD full_name VARCHAR(120) NOT NULL
            CONSTRAINT DF_Users_full_name DEFAULT 'Supply Chain User'
        """,
        """
        IF COL_LENGTH('Users', 'account_type') IS NULL
            ALTER TABLE Users ADD account_type VARCHAR(30) NULL
        """,
        """
        IF COL_LENGTH('Users', 'status') IS NULL
            ALTER TABLE Users ADD status VARCHAR(20) NOT NULL
            CONSTRAINT DF_Users_status DEFAULT 'Active'
        """,
        """
        IF COL_LENGTH('Users', 'created_at') IS NULL
            ALTER TABLE Users ADD created_at DATETIME NOT NULL
            CONSTRAINT DF_Users_created_at DEFAULT GETDATE()
        """,
        """
        IF COL_LENGTH('Users', 'phone') IS NULL
            ALTER TABLE Users ADD phone VARCHAR(40) NULL
        """,
        """
        IF COL_LENGTH('Users', 'alt_phone') IS NULL
            ALTER TABLE Users ADD alt_phone VARCHAR(40) NULL
        """,
        """
        IF COL_LENGTH('Users', 'emergency_phone') IS NULL
            ALTER TABLE Users ADD emergency_phone VARCHAR(40) NULL
        """,
        """
        IF COL_LENGTH('Users', 'location') IS NULL
            ALTER TABLE Users ADD location VARCHAR(120) NULL
        """,
        """
        IF COL_LENGTH('Users', 'timezone') IS NULL
            ALTER TABLE Users ADD timezone VARCHAR(80) NULL
        """,
        """
        IF COL_LENGTH('Users', 'language') IS NULL
            ALTER TABLE Users ADD language VARCHAR(40) NULL
        """,
        """
        IF COL_LENGTH('Users', 'company_name') IS NULL
            ALTER TABLE Users ADD company_name VARCHAR(120) NULL
        """,
        """
        IF COL_LENGTH('Users', 'website') IS NULL
            ALTER TABLE Users ADD website VARCHAR(160) NULL
        """,
        """
        IF COL_LENGTH('Users', 'tax_id') IS NULL
            ALTER TABLE Users ADD tax_id VARCHAR(50) NULL
        """,
        """
        IF COL_LENGTH('Users', 'support_email') IS NULL
            ALTER TABLE Users ADD support_email VARCHAR(160) NULL
        """,
        """
        IF COL_LENGTH('Users', 'billing_email') IS NULL
            ALTER TABLE Users ADD billing_email VARCHAR(160) NULL
        """,
        """
        IF COL_LENGTH('Users', 'profile_image_url') IS NULL
            ALTER TABLE Users ADD profile_image_url NVARCHAR(MAX) NULL
        """,
    ]

    for statement in statements:
        execute_query(statement)

def ensure_supplier_profile_columns():
    """
    Upgrades older demo databases so supplier profile fields can be edited
    without requiring a full schema rebuild.
    """
    statements = [
        """
        IF COL_LENGTH('Suppliers', 'supplier_name') IS NULL
            ALTER TABLE Suppliers ADD supplier_name VARCHAR(120) NOT NULL
            CONSTRAINT DF_Suppliers_supplier_name DEFAULT 'Unnamed Supplier'
        """,
        """
        IF COL_LENGTH('Suppliers', 'phone') IS NULL
            ALTER TABLE Suppliers ADD phone VARCHAR(40) NOT NULL
            CONSTRAINT DF_Suppliers_phone DEFAULT ''
        """,
        """
        IF COL_LENGTH('Suppliers', 'status') IS NULL
            ALTER TABLE Suppliers ADD status VARCHAR(20) NOT NULL
            CONSTRAINT DF_Suppliers_status DEFAULT 'Active'
        """,
        """
        UPDATE Suppliers
        SET supplier_name = CASE contact_id
            WHEN 1001 THEN 'Apex Logistics'
            WHEN 1002 THEN 'Quantum Parts'
            WHEN 1003 THEN 'Global Steel Co.'
            WHEN 1004 THEN 'ElectroSource'
            WHEN 1005 THEN 'Bio-Med Supply'
            WHEN 1006 THEN 'Chem Solutions'
            WHEN 1007 THEN 'ValueLine Industrial'
            WHEN 1008 THEN 'TexFabric Wholesale'
            WHEN 1009 THEN 'Evergreen Parts'
            WHEN 1010 THEN 'Titanium Forge'
            ELSE supplier_name
        END,
        phone = CASE contact_id
            WHEN 1001 THEN '+1 (404) 555-0112'
            WHEN 1002 THEN '+1 (312) 555-0188'
            WHEN 1003 THEN '+1 (214) 555-0199'
            WHEN 1004 THEN '+1 (404) 555-0112'
            WHEN 1005 THEN '+1 (408) 555-0109'
            WHEN 1006 THEN '+1 (619) 555-0123'
            WHEN 1007 THEN '+1 (414) 555-0155'
            WHEN 1008 THEN '+1 (540) 555-0177'
            WHEN 1009 THEN '+1 (206) 555-0166'
            WHEN 1010 THEN '+1 (678) 555-0147'
            ELSE phone
        END,
        status = CASE WHEN rating >= 4 THEN 'Active' ELSE 'Inactive' END
        WHERE supplier_name = 'Unnamed Supplier' OR phone = ''
        """,
    ]

    for statement in statements:
        execute_query(statement)
