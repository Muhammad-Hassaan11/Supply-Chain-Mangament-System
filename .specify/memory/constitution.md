<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0
  Bump rationale: MAJOR — initial constitution ratification (all principles new)

  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (7 principles)
    - Technology Stack
    - Development Workflow
    - Governance

  Removed sections: N/A

  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ reviewed (Constitution Check section aligns)
    - .specify/templates/spec-template.md ✅ reviewed (scope/requirements align)
    - .specify/templates/tasks-template.md ✅ reviewed (web app path conventions match)

  Follow-up TODOs: None
-->

# Supply Chain Management Constitution

## Core Principles

### I. Database-First Design
Every feature MUST begin with the SQL Server schema. The database is the
single source of truth. All 6 entities (Suppliers, Product, Warehouse,
Shipments, Inventory, Shipment_logs) MUST respect the ERD constraints:
primary keys, foreign keys, composite keys, and referential integrity.
No application logic may bypass or duplicate database-level constraints.

### II. SQL Query Demonstration
This is a university DBMS project. The primary goal is to demonstrate
SQL competency. Every API endpoint MUST use raw SQL queries via pyodbc —
no ORM abstraction is permitted. The following SQL concepts MUST be
demonstrable through the Query Lab page:
- CRUD operations (INSERT, SELECT, UPDATE, DELETE)
- JOIN queries (INNER JOIN, LEFT JOIN, multi-table JOINs)
- Aggregate functions (COUNT, SUM, AVG, MIN, MAX) with GROUP BY / HAVING
- Subqueries (scalar, correlated, and nested)

Views, stored procedures, and triggers are explicitly out of scope.

### III. Separation of Concerns (Frontend / Backend / Database)
The project MUST maintain a clear three-tier architecture:
- **Frontend** (Next.js 14 + TypeScript): UI rendering, form validation,
  API consumption. No direct database access.
- **Backend** (FastAPI + Python): Business logic, authentication, SQL
  query execution. Communicates with SQL Server via pyodbc.
- **Database** (SQL Server): Schema, constraints, seed data, and raw
  SQL scripts. All queries are version-controlled in `database/queries.sql`.

### IV. Dark Glassmorphism UI Standard
The frontend MUST implement a professional dark-themed design with
glassmorphism effects. Non-negotiable design tokens:
- Background: `#0a0a0f` to `#1a1a2e` gradient
- Glass surfaces: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(16px)`
- Accent colors: Electric Indigo `#6C63FF`, Cyan `#00D9FF`
- Typography: Inter (Google Fonts)
- Micro-animations on all interactive elements (hover, focus, transitions)

Plain, unstyled, or default-browser-themed pages are unacceptable.

### V. Role-Based Access Control
The application MUST enforce two distinct roles:
- **Admin**: Full CRUD access to all entities, access to Query Lab,
  ability to execute destructive operations (UPDATE, DELETE).
- **Viewer**: Read-only access to dashboards, reports, and data tables.
  No create, update, or delete operations permitted.

Authentication MUST use JWT tokens. Passwords MUST be hashed with bcrypt.

### VI. Responsive Design
Every page MUST be fully responsive across desktop (1440px+),
tablet (768px–1439px), and mobile (320px–767px) viewports.
CSS media queries or responsive CSS techniques MUST be used.
No page may break or become unusable at any standard viewport width.

### VII. Data Integrity and Sample Data
The project MUST ship with pre-loaded sample data via SQL seed scripts
so the application is functional immediately on first launch. Users
MUST also be able to add, edit, and delete data through frontend forms.
All form inputs MUST validate against database constraints before
submission.

## Technology Stack

All code MUST use the following technologies. No substitutions without
amending this constitution:

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js (App Router) | 14+ |
| Frontend Language | TypeScript | 5+ |
| Styling | Vanilla CSS (custom properties) | — |
| Backend Framework | FastAPI | 0.100+ |
| Backend Language | Python | 3.10+ |
| Database | Microsoft SQL Server | 2019+ |
| DB Driver | pyodbc + ODBC Driver 17/18 | — |
| Auth | JWT (python-jose) + bcrypt (passlib) | — |
| Charts | Recharts or Chart.js | — |

**Explicitly prohibited**: ORMs (SQLAlchemy, Prisma, etc.), Tailwind CSS
(unless constitution amended), server-side SQL generation libraries.

## Development Workflow

### Project Structure

```text
dbms project/
├── frontend/           # Next.js 14 (App Router, TypeScript, CSS)
│   ├── src/app/        # Pages (dashboard, CRUD, query-lab, reports, login)
│   ├── src/components/ # Reusable UI components
│   ├── src/styles/     # Global CSS and design tokens
│   ├── src/lib/        # API client and utilities
│   └── src/context/    # Auth context (React Context API)
├── backend/            # FastAPI (Python)
│   ├── routes/         # API route handlers per entity
│   ├── main.py         # App entry point
│   ├── database.py     # pyodbc connection management
│   ├── auth.py         # JWT authentication
│   └── models.py       # Pydantic request/response models
├── database/           # SQL scripts (version-controlled)
│   ├── schema.sql      # CREATE TABLE statements
│   ├── seed_data.sql   # INSERT sample data
│   └── queries.sql     # All demonstrable SQL queries
└── README.md           # Setup instructions and project overview
```

### Build and Run Commands

- **Frontend**: `cd frontend && npm install && npm run dev` (port 3000)
- **Backend**: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload` (port 8000)
- **Database**: Execute `database/schema.sql` then `database/seed_data.sql` in SSMS

### Code Standards

- All API routes MUST return JSON responses with consistent error structure
- All SQL queries MUST use parameterized queries (no string concatenation)
  to prevent SQL injection
- Environment variables MUST be used for database credentials (never hardcoded)
- Every page MUST have a descriptive HTML `<title>` tag

## Governance

This constitution is the authoritative reference for all design and
implementation decisions in the Supply Chain Management project.

- All code contributions MUST comply with these principles
- Amendments require updating this document, incrementing the version,
  and updating the `LAST_AMENDED_DATE`
- If a principle conflicts with a professor's requirement, the professor's
  requirement takes precedence — but the deviation MUST be documented here
- Use `AGENTS.md` for runtime development guidance

**Version**: 1.0.0 | **Ratified**: 2026-05-22 | **Last Amended**: 2026-05-22
