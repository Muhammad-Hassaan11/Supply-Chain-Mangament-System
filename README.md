# Supply Chain Management DBMS

Comprehensive university project implementing a three-tier Supply Chain Management Database Management System (SCM DBMS).

This repository contains:

- A FastAPI backend that executes parameterized raw SQL against Microsoft SQL Server.
- A Next.js frontend (TypeScript) implementing a dark glassmorphism admin portal and a light public site.
- Version-controlled SQL scripts for schema, seed data, and a curated Query Lab catalog.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Repository Layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Quickstart — Run Locally](#quickstart---run-locally)
	- [Database: SQL Server](#database-sql-server)
	- [Backend: FastAPI](#backend-fastapi)
	- [Frontend: Next.js](#frontend-nextjs)
- [Environment Variables](#environment-variables)
- [Docker / Deployment](#docker--deployment)
- [API Summary (key endpoints)](#api-summary-key-endpoints)
- [Database Schema & Seed Data](#database-schema--seed-data)
- [Query Lab](#query-lab)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project demonstrates raw-SQL DBMS skills (schema design, constraints, joins, aggregates, subqueries) combined with a modern web UI and role-based access. It is intended for academic demonstration (viva) and local development.

Key capabilities:

- Executive dashboard with KPIs and low-stock alerts
- Full CRUD for Suppliers, Products, Warehouses, Inventory, Shipments and Shipment Logs
- Role-based access (Admin = read/write, Viewer = read-only)
- Query Lab: curated SQL queries and a live execution endpoint

---

## Architecture & Tech Stack

- Backend: FastAPI (Python 3.10+), uvicorn
- Database driver: pyodbc connecting to Microsoft SQL Server
- Auth: JWT tokens (python-jose) + bcrypt password hashing
- Frontend: Next.js (see frontend/package.json for exact version), React
- Dev / Packaging: Dockerfile provided for backend

Versions and dependencies are listed in:

- [backend/requirements.txt](backend/requirements.txt)
- [frontend/package.json](frontend/package.json)

---

## Repository Layout

- [backend/](backend/) — FastAPI app and routes
	- [backend/main.py](backend/main.py) — app entry & CORS config
	- [backend/database.py](backend/database.py) — pyodbc helpers and execute_query
	- [backend/auth.py](backend/auth.py) — JWT helpers and auth dependencies
	- [backend/models.py](backend/models.py) — Pydantic schemas
	- [backend/routes/](backend/routes/) — per-entity route handlers (see list below)

- [frontend/](frontend/) — Next.js app (app router)
	- [frontend/src/lib/api.ts](frontend/src/lib/api.ts) — centralized API client
	- [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx) — auth state

- [database/](database/) — SQL scripts
	- [database/schema.sql](database/schema.sql) — CREATE TABLE DDL
	- [database/seed_data.sql](database/seed_data.sql) — comprehensive seed rows
	- [database/queries.sql](database/queries.sql) — curated Query Lab queries

- [specs/001-supply-chain-dbms/](specs/001-supply-chain-dbms/) — spec, plan, and quickstart

---

## Prerequisites

- Python 3.10+ (backend)
- Node.js 18+ (frontend)
- Microsoft SQL Server (Local Express/Developer or hosted Azure SQL)
- Optional: Docker for containerized backend deployment

On Windows, the backend uses either Integrated Security (Trusted Connection) or SQL Authentication via `pyodbc` and an ODBC driver.

---

## Quickstart — Run Locally

Below are condensed steps to get the full stack running locally.

### Database (SQL Server)

1. Create a database named `SupplyChainDB` in your SQL Server instance (e.g. `localhost\\SQLEXPRESS`).

```sql
CREATE DATABASE SupplyChainDB;
```

2. Run the schema and seed scripts using your SQL client (SSMS / Azure Data Studio):

- Execute [database/schema.sql](database/schema.sql)
- Execute [database/seed_data.sql](database/seed_data.sql)

### Backend (FastAPI)

1. Open a terminal and change into the backend folder:

```bash
cd backend
python -m venv .venv
```

2. Activate the virtual environment:

- PowerShell: `.\\.venv\\Scripts\\Activate.ps1`
- CMD: `.\\.venv\\Scripts\\activate.bat`

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy and edit environment variables:

```bash
cp .env.example .env
# Edit .env to match your SQL Server instance and JWT secret
```

Key `.env` values are in [backend/.env.example](backend/.env.example).

5. Run the development server (auto-reloads):

```bash
uvicorn main:app --reload --port 8000
```

6. Verify the API docs: http://127.0.0.1:8000/docs

### Frontend (Next.js)

1. In a new terminal, install frontend dependencies and run:

```bash
cd frontend
npm install
npm run dev
```

2. Open the UI at http://localhost:3000 and authenticate using seeded accounts:

- Admin: `admin@supplychain.com` / `password123`
- Viewer: `viewer@supplychain.com` / `password123`

---

## Environment Variables

See [backend/.env.example](backend/.env.example) for the full template. Important values:

- `DB_SERVER` — your SQL Server host (e.g. `localhost\\SQLEXPRESS`)
- `DB_DATABASE` — `SupplyChainDB`
- `DB_TRUSTED_CONNECTION` — `yes` for Windows Integrated Auth, otherwise `no` and provide `DB_USERNAME` and `DB_PASSWORD`
- `JWT_SECRET_KEY` — your JWT signing secret
- `ADMIN_REGISTRATION_SECRET` — code required to register an Admin account via `/api/auth/register`

Frontend uses `NEXT_PUBLIC_API_URL` to point to the backend (default: `http://127.0.0.1:8000`).

---

## Docker / Deployment

The backend includes a Dockerfile at [backend/Dockerfile](backend/Dockerfile). Typical workflow:

```bash
# Build image
docker build -t scm-backend:latest -f backend/Dockerfile .

# Run (pass environment variables via -e or a .env file)
docker run -p 8000:8000 --env-file backend/.env scm-backend:latest
```

Notes:

- When deploying the frontend to Vercel, the backend must be hosted on a reachable URL (Render, Railway, Azure App Service, etc.) and `NEXT_PUBLIC_API_URL` updated to that URL.
- For production use, configure a cloud SQL Server (Azure SQL) or a publicly routable hosted DB.

---

## API Summary (key endpoints)

The backend exposes REST endpoints under the `/api` prefix. The interactive Swagger docs provide exact request/response shapes at `/docs`.

- Authentication
	- `POST /api/auth/register` — register (Admin requires `ADMIN_REGISTRATION_SECRET`)
	- `POST /api/auth/login` — login → returns JWT access token

- Users (Admin only)
	- `GET /api/users/` — list users
	- `POST /api/users/` — create user
	- `PUT /api/users/{user_id}` — update user
	- `DELETE /api/users/{user_id}` — delete user

- Suppliers
	- `GET /api/suppliers/`, `GET /api/suppliers/{id}`, `POST /api/suppliers/`, `PUT /api/suppliers/{id}`, `DELETE /api/suppliers/{id}`
	- See [backend/routes/suppliers.py](backend/routes/suppliers.py)

- Products
	- `GET /api/products/`, `GET /api/products/{id}`, `POST /api/products/`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`
	- See [backend/routes/products.py](backend/routes/products.py)

- Warehouses
	- `GET /api/warehouses/`, `GET /api/warehouses/{id}`, `POST /api/warehouses/`, `PUT /api/warehouses/{id}`, `DELETE /api/warehouses/{id}`
	- See [backend/routes/warehouses.py](backend/routes/warehouses.py)

- Inventory
	- `GET /api/inventory/` — list allocations
	- `GET /api/inventory/{warehouse_id}/{product_id}`
	- `POST /api/inventory/`, `PUT /api/inventory/{warehouse_id}/{product_id}`, `DELETE /api/inventory/{warehouse_id}/{product_id}`
	- See [backend/routes/inventory.py](backend/routes/inventory.py)

- Shipments & Logs
	- `GET /api/shipments/`, `GET /api/shipments/{id}`, `POST /api/shipments/`, `PUT /api/shipments/{id}`, `DELETE /api/shipments/{id}`
	- `GET /api/shipments/{id}/logs`, `POST /api/shipments/{id}/logs`
	- See [backend/routes/shipments.py](backend/routes/shipments.py)

- Analytics
	- `GET /api/analytics/dashboard` — aggregated KPIs and low-stock alerts
	- See [backend/routes/analytics.py](backend/routes/analytics.py)

- Query Lab
	- `GET /api/queries/catalog` — curated SQL catalog
	- `POST /api/queries/execute` — execute raw SQL (playground)
	- See [backend/routes/queries.py](backend/routes/queries.py) and [database/queries.sql](database/queries.sql)

---

## Database Schema & Seed Data

- Schema: [database/schema.sql](database/schema.sql)
- Seed data: [database/seed_data.sql](database/seed_data.sql)
- The seeded data includes demo Admin and Viewer accounts used by the frontend during development.

---

## Query Lab

The Query Lab provides pre-written SQL examples and a live execution endpoint that runs the SQL on your configured SQL Server. See:

- [database/queries.sql](database/queries.sql)
- [backend/routes/queries.py](backend/routes/queries.py)

Important: The Query Lab executes raw SQL; do not expose it in production without strict RBAC and auditing.

---

## Contributing

If you'd like to contribute, please open issues or PRs describing your change. The project is structured so frontend and backend development can proceed independently.

Small notes for contributors:

- Follow the raw-SQL constraint — avoid ORMs in backend code unless explicitly agreed.
- Use the existing Pydantic schemas in [backend/models.py](backend/models.py) for request/response shapes.

---

## License

This repository does not include an explicit license file. Add a LICENSE file if you intend to publish or share under a specific open-source license.

---

If you'd like, I can also:

- add a short troubleshooting section (common SQL Server connection issues),
- create a minimal `docker-compose.yml` to start SQL Server + backend + frontend locally, or
- run a quick smoke-check script to validate environment variables and connectivity.

Would you like me to add any of those next?
