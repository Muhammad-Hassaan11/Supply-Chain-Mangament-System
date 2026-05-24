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
