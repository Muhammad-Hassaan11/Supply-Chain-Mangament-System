# Feature Specification: Supply Chain Management DBMS

**Feature Branch**: `001-supply-chain-dbms`  
**Created**: 2026-05-22  
**Status**: Draft  
**Input**: User description: "Create a fully responsive, professional Supply Chain Management DBMS project with a Next.js frontend, FastAPI backend, and SQL Server database with raw SQL query execution, dashboards, reports, and a query playground."

## Clarifications

### Session 2026-05-22
- Q: How should we secure the creation of "Admin" users to prevent unauthorized modifications during a viva? → A: Anyone can register as a Viewer, but registering as an Admin requires a shared secret code (validated against an `ADMIN_REGISTRATION_SECRET` in `.env`).
- Q: When deleting a Supplier or Product with active downstream references, how should we handle SQL Server FK constraints? → A: Restrict deletion; the backend/API blocks the operation and returns a user-friendly error detailing that active dependent records exist.
- Q: When registering a Shipment for a product out of stock, should we block it or just show a warning? → A: Hard validation; the backend blocks shipment creation if the quantity in the origin warehouse is 0, returning an error.
- Q: How should the system determine if a product has low stock for the dashboard alerts panel? → A: Static SQL threshold; use a global threshold of quantity < 10 directly in the raw SQL queries.
- Q: What should be the lifetime/expiration duration of JWT access tokens? → A: 24-hour expiration to prevent sudden lockouts during demo sessions while preserving security.






## User Scenarios & Testing *(mandatory)*

### User Story 1 - Executive Dashboard and Summary Metrics (Priority: P1)

As an operations manager, I want to see an overview dashboard that aggregates supply chain metrics (total suppliers, total products, total shipments, low-stock alerts) so that I can understand the status of operations at a glance.

**Why this priority**: Essential P1 MVP feature. Provides the entry point and instant business value to the user by summarizing the entire supply chain state.

**Independent Test**: Can be fully tested with sample seed data without creating/updating records, and delivers visual aggregates.

**Acceptance Scenarios**:

1. **Given** a populated database with 10 suppliers, 25 products, and 8 warehouses, **When** the dashboard page loads, **Then** the user sees high-level stat cards showing exactly "10 Suppliers", "25 Products", and "8 Warehouses".
2. **Given** some products have stock levels below the global threshold of 10 units, **When** the dashboard page loads, **Then** a "Low Stock Alerts" panel lists these products and their locations.

---

### User Story 2 - Master Data Management CRUD (Priority: P1)

As an administrator, I want to view, add, edit, and remove records for all key supply chain entities (Suppliers, Products, Warehouses, Inventory, Shipments, Shipment Logs) while enforcing database integrity rules.

**Why this priority**: Core data-entry capability. A database management system must allow administrators to manipulate the underlying data records.

**Independent Test**: Can test adding a new supplier, verifying it is added, updating it, and deleting it, while verifying that illegal values (e.g., negative rating) are rejected.

**Acceptance Scenarios**:

1. **Given** the Supplier list page, **When** the user clicks "Add Supplier" and enters valid data (Name: "Global Logistics", Rating: 5, Email: "contact@global.com"), **Then** the supplier is successfully created and appears in the list.
2. **Given** the Supplier creation form, **When** the user enters an invalid email format or a rating outside the 1–5 range, **Then** the form prevents submission and displays a clear validation error.

---

### User Story 3 - Shipment tracking & logs timeline (Priority: P2)

As a customer service representative, I want to track a shipment and view its comprehensive timeline log events (e.g., loaded, shipped, in transit, delivered) to understand delays or transport milestones.

**Why this priority**: Specialized supply chain operation. Adds deep business utility beyond basic spreadsheets.

**Independent Test**: Can look up a shipment ID and see sequential log timestamps showing the lifecycle of the shipment from start to finish.

**Acceptance Scenarios**:

1. **Given** a shipment with ID `SH-1002` that has undergone three events (Created, In Transit, Delivered), **When** the user views the shipment's details, **Then** a vertical timeline displays these three events in chronological order with timestamps and event descriptions.

---

### User Story 4 - Query Lab / SQL Demonstration Workbench (Priority: P2)

As a DBMS student or examiner, I want a dedicated interactive workbench that lists and explains pre-packaged SQL query categories (CRUD, multi-table JOINs, aggregate functions with GROUP BY/HAVING, and scalar/correlated subqueries) and executes them live against the database to show real-time query results.

**Why this priority**: Crucial university project demonstration feature. Allows the examiner to review and test complex database query mastery easily.

**Independent Test**: Select "Top Suppliers by Product Count" from a catalog, see the SQL query definition, click Run, and see a tabular result showing the matching rows.

**Acceptance Scenarios**:

1. **Given** the Query Lab catalog, **When** the user selects the "Products and Suppliers" multi-table JOIN query, **Then** the screen displays the raw SQL syntax and a detailed explanation of how the join works.
2. **Given** a selected query, **When** the user clicks "Execute Query", **Then** the system queries the live database and displays the resulting rows in a clean, scrollable tabular format.

---

### User Story 5 - Role-Based Action Constraints (Priority: P3)

As an administrative user, I want to sign in under a specific role (Admin vs. Viewer) where only the Admin can modify data (add/edit/delete) while the Viewer can only search and view queries, to prevent accidental modification of critical records.

**Why this priority**: Enhances system security and mimics real-world enterprise access control.

**Independent Test**: Log in as a Viewer, verify edit/delete buttons are disabled or hidden, and attempt to add a record is blocked; log in as Admin and verify complete read-write access.

**Acceptance Scenarios**:

1. **Given** the user is logged in as a "Viewer", **When** they view any master data list (e.g. Products), **Then** all "Add", "Edit", and "Delete" buttons are disabled or hidden, and manual API calls to these actions return an "Access Denied" error.
2. **Given** the user is logged in as an "Admin", **When** they view any master data list, **Then** all CRUD controls are fully visible and active.

---

### Edge Cases

- **Cascading Deletes**: When a user tries to delete a Supplier or Product that has dependent inventory records, the API blocks the request, prevents the SQL driver crash, and returns a detailed message describing which dependent references are blocking deletion.
- **Out of Stock**: When a shipment registration is requested for an item with 0 quantity on hand in the origin warehouse, the backend validation blocks creation of the shipment and returns an explicit out-of-stock error.
- **Empty Query Results**: When a custom filter or Query Lab execution returns 0 rows, the system must show a friendly "No matching records found" message rather than an empty page or crash.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST maintain the relational database schema representing Suppliers, Products, Warehouses, Inventory, Shipments, and Shipment Logs.
- **FR-002**: System MUST validate all data entry forms (e.g., unique IDs, non-negative quantities, bounded rating scale of 1–5).
- **FR-003**: System MUST provide an executive dashboard displaying key performance indicators (KPIs) and operational summaries.
- **FR-004**: System MUST implement a "Query Lab" displaying raw SQL queries and executing them against the live database dynamically.
- **FR-005**: System MUST enforce Role-Based Access Control restricting data mutation to "Admin" users, and registration as an Admin MUST require a pre-configured secret code verified on the backend.
- **FR-006**: System MUST track shipment state transitions and display them chronologically in a visual timeline.
- **FR-007**: System MUST support paginated, searchable, and sortable list views for all primary entities.

### Key Entities

- **Supplier**: Represents the vendor providing products. Key attributes include a unique supplier ID, contact details, rating (1–5), and email address.
- **Product**: Represents items supplied and stored. Linked to a single Supplier. Key attributes include product ID, name, unit price, and estimated lead time in days.
- **Warehouse**: Represents storage facilities. Key attributes include warehouse ID, name, and total capacity.
- **Inventory**: Represents stock levels, linking a Warehouse and a Product (composite key). Key attributes include location identifier within the warehouse and quantity on hand.
- **Shipment**: Represents transport orders from a specific Warehouse. Key attributes include shipment ID, date, and tracking number.
- **Shipment Log**: Chronological audit trail for shipment status updates. Linked to a Shipment and a Product. Key attributes include sequence number, timestamp, and event type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully verify data-tier operations (creating, reading, updating, and deleting a record) with real-time updates in under 2 seconds.
- **SC-002**: A database examiner can select, view, and run any of the required query types (JOINs, aggregates, subqueries) with live results in under 1 second.
- **SC-003**: System remains 100% stable with no database locks or unhandled errors during concurrent viewer queries.
- **SC-004**: Interface adapts smoothly to any screen size from mobile (320px) to desktop (1440px+), with no cut-off text or broken layouts.

## Assumptions

- **Local Execution**: The database server (SQL Server) is running locally on the user's host machine.
- **Environment**: The user has Node.js 18+ and Python 3.10+ environments configured.
- **Security Scope**: Basic role distinction (Admin/Viewer) using session token authentication is sufficient for the academic scope.

---

## Public Website Interface Specification

**Section Added**: 2026-05-23
**Status**: Approved for Implementation

### Overview

The SCM platform exposes a public-facing marketing website that presents the system as a professional logistics and supply chain SaaS company. This website is entirely separate in styling and layout from the authenticated operations dashboard. It is inspired by enterprise logistics platforms (e.g. Yusen Logistics) but carries its own SCM branding with a **light mint and teal** color palette.

The public website is **read-only** and requires **no authentication**. It serves as the entry point for new users, potential clients, and role-based portal access.

---

### Design System

| Token | Value |
|---|---|
| Background | `#f4fcf9` (soft white / light mint) |
| Surface (Cards) | `#ffffff` |
| Primary Accent | `#0d9488` (teal-600) |
| Accent Hover | `#0f766e` (teal-700) |
| Mint Light | `#e0f7f4` |
| Border Color | `#b2e0da` |
| Text Primary | `#0f2e2a` |
| Text Secondary | `#4b7a74` |
| Shadow | `rgba(13, 148, 136, 0.08)` |
| Font Body | Plus Jakarta Sans |
| Font Headings | Space Grotesk |
| Border Radius (Cards) | `16px` |
| Button Shape | Rounded full (`border-radius: 9999px`) |

**Key Style Rules:**
- Light, airy layout — no dark backgrounds on public pages.
- Cards use `white` surface, thin `#b2e0da` border, and `8px` soft box-shadow.
- Section backgrounds alternate between `#f4fcf9` and `#ffffff` for visual separation.
- All primary buttons use a teal gradient (`#0d9488` → `#0f766e`) with a subtle lift on hover.
- Secondary buttons use a white background with a teal border.
- All icons use SVG stroke style matching the teal accent color.
- Animations: subtle fade-in on scroll, card hover lift (`translateY(-3px)`), button press scale (`scale(0.97)`).

---

### Layout Separation Strategy

The application uses a **conditional layout wrapper** (`LayoutWrapper`) to serve two completely separate visual experiences:

| Route Group | Layout | Theme |
|---|---|---|
| `/`, `/about`, `/services`, `/industries`, `/locations`, `/contact`, `/login`, `/signup` | Public Navbar + Footer | Light Mint & Teal |
| `/dashboard`, `/suppliers`, `/products`, `/warehouses`, `/inventory`, `/shipments`, `/query-lab`, `/reports` | Dark Glassmorphic Sidebar | Dark Glassmorphic |

**Route Guard Rules:**
- Unauthenticated users accessing any private route (`/dashboard`, `/suppliers`, etc.) are redirected to `/login`.
- Authenticated users accessing `/login` or `/signup` are automatically redirected to `/dashboard`.
- All public routes (`/`, `/about`, `/services`, etc.) are accessible without authentication.

**Dashboard relocation:** The current admin dashboard at `/` is moved to `/dashboard` to free the root route for the public home page.

---

### Navigation Bar

**Component**: `PublicNavbar`

| Element | Detail |
|---|---|
| Brand Logo | Teal gradient SCM logo icon + "SCM Nexus" wordmark |
| Nav Links | Home · About · Services · Industries · Locations · Contact |
| Right CTAs (Guest) | "Login" (outline button) · "Sign Up" (filled teal button) |
| Right CTAs (Authenticated) | "Go to Portal" (filled teal button) · "Logout" (text link) |
| Mobile | Hamburger menu with animated slide-down nav overlay |
| Sticky | Sticky top with frosted glass background on scroll (`backdrop-filter: blur(12px)`) |

---

### Footer

**Component**: `PublicFooter`

- **Column 1** – Brand: Logo, one-line description, social placeholder icons.
- **Column 2** – Company: Home, About, Contact, Careers.
- **Column 3** – Services: Supplier Management, Inventory Tracking, Shipment Tracking, Analytics.
- **Column 4** – Contact: Email, Phone, HQ Address.
- **Bottom Bar**: Copyright notice, "Powered by SQL Server" badge.

---

### Pages

#### Page 1 — Home Page (`/`)

| Section | Content |
|---|---|
| **Hero** | Headline, subheadline, primary CTA ("Explore the Portal"), secondary CTA ("Contact Sales"), inline SVG supply chain network illustration |
| **Stats Bar** | 99.9% Uptime · 100K+ Shipments Tracked · 50+ Warehouses · <200ms SQL execution |
| **Services Preview** | 4-card grid showing top services (Supplier Mgmt, Inventory, Shipment Tracking, Analytics) with teal icon + hover lift |
| **Industries Preview** | Horizontal badge-scroll showing 8 supported industries |
| **Global Locations** | SVG world map with animated region markers (Americas, Europe, Asia-Pac, MEA) |
| **Shipment Tracker** | Mock tracking input — user types any code and sees a simulated multi-step shipment status timeline |
| **Portal CTA Banner** | Admin/Viewer dual-access CTA section with role-descriptive cards and Sign Up / Login buttons |
| **Footer** | `PublicFooter` component |

---

#### Page 2 — About Page (`/about`)

| Section | Content |
|---|---|
| **Page Hero** | "About SCM Nexus" with breadcrumb and a teal-tinted decorative background |
| **Mission & Vision** | Two-column card layout — Mission (left) and Vision (right) |
| **Platform Story** | Prose section explaining the SQL Server-backed system, its academic origins, and real-world applicability |
| **Supply Chain Process** | Horizontal timeline stepper: Procurement → Supplier Selection → Warehousing → Inventory Control → Shipment → Delivery |
| **SQL Power Section** | Feature list: Raw SQL execution · Relational Integrity · FK enforcement · JOIN-based analytics · Parameterized queries |
| **Role Access Cards** | Two cards: Admin (full CRUD) and Viewer (read-only) with capability breakdowns |
| **Platform Benefits** | Icon + text grid of 6 benefits (Speed, Accuracy, Transparency, Security, Scalability, Auditability) |

---

#### Page 3 — Services Page (`/services`)

| Service Card | Icon | Description | Tags |
|---|---|---|---|
| Supplier Management | Users icon | End-to-end supplier lifecycle from onboarding to rating | #Suppliers #CRUD #Rating |
| Inventory Management | Layers icon | Real-time stock tracking with low-stock alerting | #Stock #Alerts #Thresholds |
| Warehousing & 3PL | Warehouse icon | Capacity-aware multi-warehouse storage management | #3PL #Capacity #Bins |
| Shipment Tracking | Truck icon | Shipment lifecycle with log-based event timelines | #Tracking #Timeline #Logs |
| SQL Insights & Analytics | Bar Chart icon | Live aggregated KPIs, JOINs, GROUP BY, HAVING queries | #SQL #Reports #KPI |
| Procurement Coordination | Link icon | Supplier-to-product procurement workflow tracking | #Procurement #Lead Time |
| Demand Planning | TrendingUp icon | Historical inventory analysis for forecast estimation | #Demand #Forecast #Planning |
| Alerts & Notifications | Bell icon | Low stock, shipment status, and system health alerts | #Alerts #Threshold #Health |

Each card includes: SVG icon in teal circle, service name, 2-line description, tag pills, and a "Learn More" hover-reveal CTA.

---

#### Page 4 — Industries Page (`/industries`)

| Industry | Icon | Key Tags |
|---|---|---|
| Manufacturing | Factory | Production Planning, JIT Inventory, Parts Sourcing |
| Healthcare | Cross/Heart | Cold Chain, Compliance, Pharma Logistics |
| Retail & eCommerce | ShoppingBag | Omnichannel, Returns, Last-Mile |
| Automotive | Car | Just-In-Time, Parts Lifecycle, Supplier Tiers |
| Food & Beverages | Coffee | Perishable, Cold Storage, FIFO |
| Chemicals | Flask | Hazmat Compliance, Safety Stock, Segregation |
| Technology | Cpu | Component Sourcing, Global Assembly, Short Lead Times |
| Pharma | Pill | Regulatory Compliance, Serialization, Track & Trace |

**Filter Bar**: Text input to filter industry cards by name or tag. Cards support a hover state revealing a teal gradient overlay with the industry tag list.

---

#### Page 5 — Locations Page (`/locations`)

| Section | Content |
|---|---|
| **Page Hero** | "Global Operations" headline, world map SVG with pulse-dot markers |
| **Regional Stats** | 4 stat cards: Americas (12 hubs), Europe (9 hubs), Asia Pacific (18 hubs), MEA (7 hubs) |
| **Hub Cards Grid** | Dummy location cards: Rotterdam Gateway, Singapore Port Hub, Los Angeles Distribution Center, Dubai Logistics Park, Shanghai Freight Hub, Mumbai Port Facility |
| **Hub Card Fields** | Hub Name, Region Badge, Type (Port/Warehouse/Distribution), Capacity (sq m), Status (Active/Expansion/Planned) |
| **CTA** | "Partner With Us" call-to-action block linking to Contact page |

---

#### Page 6 — Contact Page (`/contact`)

| Section | Content |
|---|---|
| **Page Hero** | "Get in Touch" with breadcrumb |
| **Two-Column Layout** | Left: Contact Form · Right: Contact Details + Office Cards |
| **Contact Form** | Fields: Full Name, Email, Company, Subject (dropdown), Message textarea. Submit shows a teal success confirmation banner. |
| **Contact Details** | Email: support@scmnexus.com · Phone: +1 (800) SCM-NEXUS · Hours: Mon–Fri 08:00–18:00 UTC |
| **Office Cards** | Headquarters (Karachi, PK), APAC Office (Singapore), EU Office (Rotterdam, NL) |
| **FAQ Accordion** | 5 expandable Q&As about the platform, pricing, access roles, data security, and system requirements |

---

### New Functional Requirements

- **FR-008**: The system MUST serve a public-facing marketing website at the root URL (`/`) accessible without authentication.
- **FR-009**: The public website MUST use a light mint and teal design system entirely separate from the dark glassmorphic operations dashboard.
- **FR-010**: The public navigation MUST include a persistent Navbar with links to Home, About, Services, Industries, Locations, and Contact, plus Login and Sign Up CTAs.
- **FR-011**: The dashboard route MUST be relocated from `/` to `/dashboard`, with authentication guards protecting all private routes.
- **FR-012**: The public Shipment Tracker section MUST accept a user-entered tracking code and display a simulated multi-step delivery status timeline without requiring database connectivity.
- **FR-013**: The Contact Form MUST perform client-side validation and display a styled success confirmation on submission (backend integration deferred).
- **FR-014**: The Industries and Services pages MUST support client-side text filtering without a backend query.
- **FR-015**: All six public pages MUST be fully responsive from 320px to 1440px+ screen widths.

### Additional Success Criteria

- **SC-005**: A visitor can navigate all six public pages, read platform information, and reach the Login or Sign Up portal within 3 clicks from the home page.
- **SC-006**: Public pages achieve a Lighthouse Performance score of ≥ 85 in production build, with no layout shift on navigation transitions.
- **SC-007**: The public and private themes must not bleed into each other — dark glassmorphic styles must not appear on public pages and vice versa.

