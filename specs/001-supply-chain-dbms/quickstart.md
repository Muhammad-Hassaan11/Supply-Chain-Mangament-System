# Quickstart Guide: Supply Chain Management DBMS

This guide provides step-by-step setup instructions for running the three-tier university supply chain DBMS application.

## Prerequisites
- **Python**: 3.10+ (for backend api)
- **Node.js**: 18+ (for Next.js frontend)
- **Database**: Microsoft SQL Server (Local Express/Developer Instance)
- **Tools**: SQL Server Management Studio (SSMS) or Azure Data Studio

---

## 1. Database Setup

1. Open **SQL Server Management Studio (SSMS)** and connect to your local server (e.g. `localhost` or `localhost\SQLEXPRESS`).
2. Create a new database named `SupplyChainDB`:
   ```sql
   CREATE DATABASE SupplyChainDB;
   ```
3. Open `database/schema.sql` and run it to create the 6 tables and the users authentication table.
4. Open `database/seed_data.sql` and run it to load clean sample data for suppliers, products, warehouses, inventories, shipments, and shipment logs.

---

## 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   * **Windows PowerShell**: `.\venv\Scripts\Activate.ps1`
   * **CMD/Git Bash**: `source venv/scripts/activate`
4. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Copy `.env.example` to `.env` and fill in your SQL Server instance details:
   ```env
   # Server Connection Settings
   DB_SERVER=localhost\SQLEXPRESS
   DB_DATABASE=SupplyChainDB
   DB_DRIVER=ODBC Driver 17 for SQL Server
   
   # For Windows Trusted Authentication (Integrated Security), set:
   DB_TRUSTED_CONNECTION=yes
   
   # OR for standard SQL Server SQL-Auth, set DB_TRUSTED_CONNECTION=no and provide credentials:
   # DB_TRUSTED_CONNECTION=no
   # DB_USERNAME=sa
   # DB_PASSWORD=your_sa_password_here
   
   # Authentication Settings
   JWT_SECRET_KEY=generate_a_random_jwt_secret_key
   ADMIN_REGISTRATION_SECRET=SCM_VIVA_DEMO_ADMIN_2026
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
7. Verify backend is running by opening [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to view the interactive API swagger docs.

---

## 3. Frontend Setup (Next.js 14)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the fully responsive dark glassmorphic user interface by opening [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 4. Deploy (Vercel + Hosted Backend)

If you deploy the **frontend** to Vercel, the **FastAPI backend + SQL Server** must also be hosted on a server that can reach your database.

Important: Vercel can’t connect to your **local** SQL Server running on your laptop/PC. For production, use a cloud SQL Server (e.g., Azure SQL) or a publicly reachable SQL Server.

### 4.1 Deploy backend (recommended: Docker on Render/Railway/Fly)

1. Use the backend Dockerfile: `backend/Dockerfile`
2. Set backend environment variables on the hosting provider:
   - `DB_SERVER`, `DB_DATABASE`, `DB_TRUSTED_CONNECTION=no`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET_KEY`, `ADMIN_REGISTRATION_SECRET`
   - `CORS_ORIGINS=https://<your-vercel-domain>`

After deploy, note your backend URL (example: `https://your-backend.onrender.com`).

### 4.2 Connect Vercel frontend to backend

In Vercel Project Settings → Environment Variables, set:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```
