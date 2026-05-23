# Technical Research: Supply Chain Management DBMS

## Tech Stack Decisions & Rationale

### 1. Database Connectivity (FastAPI to SQL Server)
* **Decision**: Use `pyodbc` with connection pooling, using either `ODBC Driver 17 for SQL Server` or `ODBC Driver 18 for SQL Server` (standard on Windows).
* **Rationale**: Required by project constitution (raw SQL query execution, no ORM). `pyodbc` is the standard, high-performance database connector for SQL Server in Python.
* **Alternatives Considered**: 
  * `pymssql`: Pure python library, but lacks robust active maintenance and performance of native ODBC drivers.
  * `SQLAlchemy`: Prohibited by the constitution.

### 2. Frontend Styling System (Dark Glassmorphism)
* **Decision**: Vanilla CSS Custom Properties (Design Tokens) with absolute standard glass styling variables.
* **Rationale**: High flexibility and 100% compliant with the project constitution. Custom properties allow clean theme definition:
  ```css
  :root {
    --bg-main: #0a0a0f;
    --bg-card: rgba(26, 26, 46, 0.4);
    --border-glass: rgba(255, 255, 255, 0.08);
    --glass-blur: blur(16px);
    --accent-indigo: #6c63ff;
    --accent-cyan: #00d9ff;
    --text-primary: #ffffff;
    --text-secondary: #a0a0b0;
  }
  ```
* **Alternatives Considered**: 
  * Tailwind CSS: Ruled out to prioritize absolute design control and strict vanilla CSS styling.

### 3. Frontend Charting & Visualization
* **Decision**: `Recharts` (React-based SVG chart library) or Vanilla SVG Charts.
* **Rationale**: Offers responsive, customizable, and modern-looking charts that render perfectly in dark mode. Extremely reliable for Next.js.
* **Alternatives Considered**: 
  * `Chart.js`: Lacks native React components, requiring wrapper libraries. Recharts fits cleanly inside TypeScript/Next.js components.

---

## Technical Unknowns Resolved

### Q1: Connection String Format for SQL Server
We support both Windows and SQL Server Authentication. For SQL Server authentication (with `sa` user):
```python
conn_str = (
    f"DRIVER={driver};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={user};"
    f"PWD={password};"
    "TrustServerCertificate=yes;" # Standard for local dev instances
)
```

### Q2: Row Serialization with pyodbc
By default, `pyodbc` returns row tuples. To easily serialize them into Pydantic models/JSON:
```python
def dict_row_factory(cursor, row):
    return {col[0]: val for col, val in zip(cursor.description, row)}
```
We set this as `cursor.row_factory = dict_row_factory` inside our database session helper.
