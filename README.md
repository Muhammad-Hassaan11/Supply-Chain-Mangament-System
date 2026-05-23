# Supply Chain Management DBMS University Project

A professional, three-tier Supply Chain Management Database Management System university project showcasing database design, SQL integrity constraints, raw SQL query competency, and a modern responsive dark-themed presentation layer.

## Architecture & Technology Stack

- **Presentation Layer (Frontend)**: Next.js 14 (App Router), TypeScript 5+, Vanilla CSS for maximum styling control with professional dark glassmorphism design tokens.
- **Application Layer (Backend)**: FastAPI (Python 3.10+) executing raw, parameterized SQL queries via `pyodbc` connection pooling.
- **Storage Layer (Database)**: Microsoft SQL Server expressing full integrity constraints (Primary Keys, Foreign Keys, Composite Keys, CHECK constraints) and high-quality seed datasets (~180 records).

## Key Features

1. **Executive Dashboard**: Dynamic high-level KPI cards and low-stock warnings populated instantly from live database aggregates.
2. **Master Data CRUD**: Searchable, paginated, and sortable tables for all 6 SCM entities with complete administrative read-write operations and user-friendly constraint validations.
3. **Shipment logs timeline**: Cronological status logging transitions rendering in a sleek vertical interactive timeline.
4. **Query Lab Demonstration Workbench**: Catalog of complex raw SQL joins, group-by aggregates, and scalar/correlated subqueries executed live against the database showing real-time results.
5. **Role-Based Access Control**: Standard `Admin` (full read-write) and `Viewer` (read-only) roles secured with JWT session tokens and bcrypt password hashing.

## Project Structure

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

## Quick Start Setup

Refer to the complete quickstart guide:
`specs/001-supply-chain-dbms/quickstart.md`
