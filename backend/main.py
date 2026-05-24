import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environmental configs
load_dotenv()

def _parse_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [v.strip().rstrip("/") for v in value.split(",") if v.strip()]

app = FastAPI(
    title="Supply Chain Management DBMS API",
    description="Raw SQL Server backend API for University SCM DBMS Project",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
# - Local dev defaults
# - Production can override with CORS_ORIGINS and/or CORS_ORIGIN_REGEX
origins = _parse_csv(os.getenv("CORS_ORIGINS")) or [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
origin_regex = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"^https://([a-zA-Z0-9-]+\.)?(vercel\.app|ngrok-free\.app|trycloudflare\.com)$",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Supply Chain DBMS backend service is running successfully.",
        "database": os.getenv("DB_DATABASE", "SupplyChainDB"),
        "server": os.getenv("DB_SERVER", "localhost")
    }

# Dynamic router registrations will go here during US implementation steps
from routes import analytics, suppliers, products, warehouses, inventory, shipments, queries, auth
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["Suppliers"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(warehouses.router, prefix="/api/warehouses", tags=["Warehouses"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(shipments.router, prefix="/api/shipments", tags=["Shipments"])
app.include_router(queries.router, prefix="/api/queries", tags=["Query Lab"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])



if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
