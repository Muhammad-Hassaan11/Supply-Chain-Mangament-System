# Implementation Plan: Supply Chain Management DBMS

**Branch**: `001-supply-chain-dbms` | **Date**: 2026-05-22 | **Spec**: [spec.md](file:///c:/Users/thisf/Desktop/dbms%20project/specs/001-supply-chain-dbms/spec.md)
**Input**: Feature specification from `/specs/001-supply-chain-dbms/spec.md`

---

## Summary

This project implements a professional, three-tier Supply Chain Management DBMS university project. The core objective is to showcase database design and SQL query mastery (JOINs, aggregates, subqueries, full CRUD) in a live, interactive web application. The technical approach uses Microsoft SQL Server for the database, FastAPI (Python) with pyodbc for raw SQL execution (no ORMs), and Next.js 14 (TypeScript) with a custom dark glassmorphic styling system for a beautiful, fully responsive presentation layer.

---

## Technical Context

- **Language/Version**: Python 3.10+ (Backend), Node.js 18+ & TypeScript 5+ (Frontend)
- **Primary Dependencies**: FastAPI, pyodbc, python-dotenv, passlib (bcrypt), python-jose (JWT) on backend; Next.js 14, Recharts on frontend
- **Storage**: Microsoft SQL Server (Local Express/Developer database instance)
- **Testing**: Manual testing of CRUD operations, form validations, role guards, and Query Lab outputs
- **Target Platform**: Local execution on Windows host machine (suitable for university viva demo)
- **Project Type**: Web Application (FastAPI backend + Next.js frontend)
- **Performance Goals**: Live dashboard load < 500ms, raw SQL execution in Query Lab < 200ms
- **Constraints**: 100% Raw SQL queries only (explicitly no SQLAlchemy, no Prisma, or other ORMs)
- **Scale/Scope**: 6 primary tables with full integrity constraints, pre-loaded seed data (~180 total records), and 2 primary user access roles (Admin/Viewer)

---

## Constitution Check

*GATE: Passed constitution compatibility review before Phase 0/1.*

- **Database-First Design**: The relational schema aligns 100% with the provided SCM ERD diagram. Constraints are fully defined at the database level.
- **SQL Query Demonstration**: Every route executes raw parameterized SQL. The Query Lab enables interactive viva presentation.
- **Separation of Concerns**: Complete decoupling. Frontend consumes REST APIs; backend communicates to database; database contains the engine constraints.
- **Dark Glassmorphism UI**: Beautiful custom CSS properties defining dark gradients, background-blur panels, and micro-animations.
- **Role-Based Access Control**: Enforces Admin/Viewer roles using signed JSON Web Tokens (JWT) and bcrypt hashes.
- **Vanilla CSS styling constraint**: No Tailwind utility leakage, maintaining clean global CSS stylesheets.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-supply-chain-dbms/
├── plan.md              # This file
├── research.md          # Technical research & choices
├── data-model.md        # Relational schema & composite keys
├── quickstart.md        # Quickstart setup instructions
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code Layout

```text
database/
├── schema.sql           # Schema definition (6 tables + auth users)
├── seed_data.sql        # High-quality realistic supply chain datasets
└── queries.sql          # Curated SQL query catalog for Viva/demo
backend/
├── main.py              # FastAPI app with CORS middleware
├── database.py          # pyodbc connection manager & row dict factory
├── auth.py              # JWT tokens & bcrypt password hashing
├── models.py            # Pydantic schemas for data validation
├── routes/
│   ├── suppliers.py     # CRUD operations for Suppliers
│   ├── products.py      # CRUD + JOINs for Products
│   ├── warehouses.py    # CRUD + Capacity calculations
│   ├── shipments.py     # CRUD + Shipment logging timeline
│   ├── inventory.py     # Stock updates + low-stock thresholds
│   ├── analytics.py     # Dashboard summary calculations
│   └── queries.py       # Live Query Lab SQL execution engine
├── requirements.txt     # Python backend dependencies
└── .env                 # Database credentials & server variables
frontend/
├── src/app/
│   ├── layout.tsx       # Root glassmorphism layout & sidebar nav
│   ├── page.tsx         # Dashboard overview (Recharts widgets)
│   ├── login/page.tsx   # Access control entry page
│   ├── query-lab/       # Interactive live SQL playground
│   ├── suppliers/       # Suppliers listing, add, edit, delete forms
│   ├── products/        # Products listing, filter, CRUD forms
│   ├── warehouses/      # Warehouses overview & capacity utilization
│   ├── shipments/       # Shipments dashboard & interactive logging timeline
│   ├── inventory/       # Stock tracking & manual quantity adjustments
│   └── reports/         # Detailed charts page (recharts visualizations)
├── src/components/      # Reusable GlassCard, Sidebar, DataTable components
├── src/styles/
│   └── globals.css      # Core Dark Glassmorphic CSS custom design tokens
├── src/lib/
│   └── api.ts           # Axios/Fetch API client wrapper
├── package.json         # NPM package dependencies
└── tsconfig.json        # TypeScript compile parameters
```

**Structure Decision**: Standard decoupled Web Application structure separating backend REST services from Next.js single-page application views, allowing clean university demo deployments.

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No ORM | Strict university requirement to prove SQL query writing skills. | Direct Python sql execution prevents automated object mapping, but is mandatory for DBMS evaluation. |
| JWT Authentication | Required to satisfy two-role access control (Admin vs. Viewer) securely. | Hardcoded state lacks realistic security and is easily rejected in DBMS projects. |
