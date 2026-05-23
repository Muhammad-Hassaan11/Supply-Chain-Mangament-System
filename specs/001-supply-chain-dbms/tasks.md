# Tasks: Supply Chain Management DBMS

**Input**: Design documents from `/specs/001-supply-chain-dbms/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested. In this university project, manual verification through SQL verification and UI testing is sufficient as specified in the verification plan.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/`, `frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project folder structure and README.md at repository root
- [x] T002 Initialize Python backend with virtual environment in backend/
- [x] T003 [P] Initialize Next.js project in frontend/ with TypeScript
- [x] T004 [P] Configure custom dark glassmorphic CSS variables in frontend/src/styles/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup database schema file with all 6 tables and integrity constraints in database/schema.sql
- [x] T006 [P] Create seed dataset with high-quality, realistic records in database/seed_data.sql
- [x] T007 Implement pyodbc connection manager and row dictionary factory in backend/database.py
- [x] T008 [P] Setup backend environmental configuration template in backend/.env.example and backend/.env
- [x] T009 [P] Initialize FastAPI application with CORS middleware configured in backend/main.py
- [x] T010 Implement JWT token utilities and bcrypt password hashing in backend/auth.py
- [x] T011 Create shared layout and navigation sidebar components in frontend/src/app/layout.tsx
- [x] T012 [P] Implement API client wrapper using Fetch/Axios in frontend/src/lib/api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Executive Dashboard and Summary Metrics (Priority: P1) 🎯 MVP

**Goal**: Overview dashboard aggregating key supply chain metrics (total suppliers, total products, total shipments, low-stock alerts)

**Independent Test**: Start backend and frontend, verify dashboard loads showing exact numbers matching seed data (e.g. 10 Suppliers, 25 Products, 8 Warehouses), and verify the "Low Stock Alerts" panel renders warning rows.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create Pydantic models for analytical data in backend/models.py
- [x] T014 [US1] Implement analytical raw SQL queries and FastAPI router endpoint in backend/routes/analytics.py
- [x] T015 [US1] Register analytics routes inside main backend app backend/main.py
- [x] T016 [US1] Build responsive Dashboard layout with stat cards and low stock panel in frontend/src/app/page.tsx

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently with seed data.

---

## Phase 4: User Story 2 - Master Data Management CRUD (Priority: P1)

**Goal**: Complete CRUD operations (view, add, edit, and remove) for key supply chain entities, enforcing database constraints.

**Independent Test**: Navigate to the Suppliers or Products page, perform complete add, edit, delete cycle, and verify that invalid data (e.g., ratings outside 1–5 or malformed emails) triggers strict user-friendly warnings.

### Implementation for User Story 2

- [x] T017 [P] [US2] Create Pydantic schemas for the 6 SCM entities in backend/models.py
- [x] T018 [US2] Implement CRUD endpoints with raw SQL queries for Suppliers in backend/routes/suppliers.py
- [x] T019 [US2] Implement CRUD endpoints with raw SQL queries for Products in backend/routes/products.py
- [x] T020 [US2] Implement CRUD endpoints with raw SQL queries for Warehouses in backend/routes/warehouses.py
- [x] T021 [US2] Implement CRUD endpoints with raw SQL queries for Inventory in backend/routes/inventory.py
- [x] T022 [US2] Implement CRUD endpoints with raw SQL queries for Shipments in backend/routes/shipments.py
- [x] T023 [US2] Register master data routers in backend/main.py
- [x] T024 [US2] Build reusable DataTable and CRUD Form modal components in frontend/src/components/
- [x] T025 [US2] Implement Suppliers management page in frontend/src/app/suppliers/page.tsx
- [x] T026 [US2] Implement Products management page in frontend/src/app/products/page.tsx
- [x] T027 [US2] Implement Warehouses visual capacity page in frontend/src/app/warehouses/page.tsx
- [x] T028 [US2] Implement Inventory stock adjustment page in frontend/src/app/inventory/page.tsx

**Checkpoint**: Complete data layer is functional. Administrators can fully manipulate SCM tables with proper validations.

---

## Phase 5: User Story 3 - Shipment tracking & logs timeline (Priority: P2)

**Goal**: Retrieve shipment tracking details and render chronological milestone logs in a visual timeline.

**Independent Test**: Query a specific shipment (e.g. `SH-1002`), confirm the system loads chronological tracking steps with custom timestamps, showing clear transitions.

### Implementation for User Story 3

- [x] T029 [US3] Create shipment log endpoints and query operations in backend/routes/shipments.py
- [x] T030 [US3] Build interactive timeline and shipment logs tracker page in frontend/src/app/shipments/page.tsx

**Checkpoint**: Shipments tracking timeline is fully functional and visual.

---

## Phase 6: User Story 4 - Query Lab / SQL Demonstration Workbench (Priority: P2)

**Goal**: Dedicated interactive workbench showcasing raw SQL mastery with live query execution.

**Independent Test**: Access the `/query-lab` page, click on any pre-packaged JOIN or aggregate query, click execute, and verify result columns print dynamically.

### Implementation for User Story 4

- [x] T031 [P] [US4] Write curated catalog of demonstration SQL queries in database/queries.sql
- [x] T032 [US4] Implement dynamic Query execution and meta-catalog endpoint in backend/routes/queries.py
- [x] T033 [US4] Register query lab execution routes in backend/main.py
- [x] T034 [US4] Build Query Lab playground UI with SQL viewer and tabular results in frontend/src/app/query-lab/page.tsx

**Checkpoint**: Query Lab is complete and ready for interactive viva demonstration.

---

## Phase 7: User Story 5 - Role-Based Action Constraints (Priority: P3)

**Goal**: Protect write operations by enforcing Admin/Viewer access roles using secure session tokens.

**Independent Test**: Login as a Viewer, verify all write actions (buttons/forms) are disabled or hidden in the UI, and verify backend blocks Viewer POST/PUT/DELETE API requests with an Access Denied error.

### Implementation for User Story 5

- [x] T035 [US5] Apply Role-Based Access Control guards to write routes in backend/auth.py
- [x] T036 [US5] Create session login and registration endpoints in backend/routes/auth.py
- [x] T037 [US5] Create beautiful Glassmorphic login panel in frontend/src/app/login/page.tsx
- [x] T038 [US5] Implement global auth context and UI button guards in frontend/src/app/

**Checkpoint**: Role authentication and client-side and server-side authorization guards are active.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: UI polishing, error handling refinement, and docs validation

- [x] T039 [P] Update custom dark glassmorphic CSS styling properties and transitions in frontend/src/styles/globals.css
- [x] T040 Enhance server-side relational cascade delete handling and custom user error responses
- [x] T041 Ensure every interactive HTML element has a unique, descriptive ID for automated UI testing
- [x] T042 [P] Verify setup and install details inside specs/001-supply-chain-dbms/quickstart.md
- [x] T043 Run end-to-end viva manual testing checklist across all features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Serves as core CRUD tables, but can be done independently.
- **User Story 3 (P3)**: Depends on Shipments entity being ready from User Story 2.
- **User Story 4 (P3)**: Can run independently once database/schema.sql and seed data are ready.
- **User Story 5 (P3)**: Implemented in backend first, integrated across UI forms.

---

## Parallel Example: User Story 1

```bash
# Launch models and endpoints in parallel:
Task: "Create Pydantic models for analytical data in backend/models.py" [T013]
# UI can be built on mocked data before API integration:
Task: "Build responsive Dashboard layout in frontend/src/app/page.tsx" [T016]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently against seed data.

### Incremental Delivery

1. Setup + Foundation → Core app base ready.
2. Add User Story 1 (Dashboard) → Test and showcase MVP.
3. Add User Story 2 (Master CRUD) → Live data-entry interface.
4. Add User Story 3 (Shipment tracker timeline) → Operation tracking.
5. Add User Story 4 (Query Lab) → Demonstration workbench.
6. Add User Story 5 (Auth & Roles) → Wrap up security and roles constraints.
7. Run Polish Phase → Final presentation styling and deployment check.
