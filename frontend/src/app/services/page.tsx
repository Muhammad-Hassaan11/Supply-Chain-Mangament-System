import React from "react";
import Link from "next/link";

const services = [
  ["Supplier Management", "Register suppliers, maintain partner profiles, connect products, and coordinate purchase activity."],
  ["Product Management", "Manage product master data, categories, supplier ownership, prices, and SKU-level records."],
  ["Warehouse Operations", "Monitor warehouse capacity, facility data, assigned managers, and operational hub layouts."],
  ["Inventory Control", "Track stock quantities, locations, reorder thresholds, and low-stock alerts across warehouses."],
  ["Shipment Tracking", "Create shipments, monitor status, follow carrier progress, and expose tracking views to partners."],
  ["Shipment Logs", "Keep a traceable timeline of shipment state changes, route updates, delivery milestones, and exceptions."],
  ["SQL Query Lab", "Run curated and custom SQL queries for joins, aggregates, filters, subqueries, and viva demonstrations."],
  ["Reports", "Surface operational analytics for suppliers, stock, shipments, warehouse health, and client performance."],
  ["Alerts", "Highlight low stock, delayed movements, exception routes, and operational records needing attention."],
  ["Invoices", "Give buyers and admins clean visibility into invoice status, payment context, and settlement records."],
];

export default function ServicesPage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="services-hero">
            <div>
              <span className="pub-badge">Platform Services</span>
              <h1 className="pub-heading-xl">One operations suite for every supply chain record.</h1>
              <p className="pub-text-lead">
                SCM organizes the core entities of a logistics business into clean modules while preserving the existing SQL Server backend, raw queries, forms, and CRUD behavior.
              </p>
              <Link className="pub-btn-primary" href="/signup">Start with your role</Link>
            </div>
            <div className="pub-image-card">
              <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1100&q=80" alt="Inventory racks and warehouse operations" />
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="pub-section-head">
            <div>
              <span className="pub-section-label">Capabilities</span>
              <h2 className="pub-heading-lg">Designed for demos, daily work, and database clarity.</h2>
            </div>
          </div>
          <div className="services-grid">
            {services.map(([title, desc], index) => (
              <article className="pub-card" key={title}>
                <div className="pub-icon-box">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="pub-heading-sm" style={{ margin: "20px 0 10px" }}>{title}</h3>
                <p className="pub-text-body" style={{ margin: 0 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="services-showcase">
            <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80" alt="Cargo containers and port logistics" />
            <div className="pub-card">
              <span className="pub-section-label">Operational Flow</span>
              <h2 className="pub-heading-md">Supplier to warehouse to shipment to invoice.</h2>
              <p className="pub-text-body">
                Each module supports a real supply chain workflow while staying connected to the database relationships that matter for a DBMS project: foreign keys, joins, aggregate reports, and transaction-safe updates.
              </p>
              <div className="services-flow">
                {["Supplier", "Product", "Inventory", "Shipment", "Invoice"].map((item) => (
                  <span className="pub-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .services-hero,
        .services-showcase {
          align-items: center;
          display: grid;
          gap: 42px;
          grid-template-columns: 1fr 1fr;
        }
        .services-hero .pub-image-card img,
        .services-showcase img {
          border-radius: 30px;
          height: 500px;
          object-fit: cover;
          width: 100%;
        }
        .services-showcase img {
          border: 1px solid var(--pub-border);
          box-shadow: var(--pub-shadow);
        }
        .services-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(5, 1fr);
        }
        .services-flow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }
        @media (max-width: 1180px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 820px) {
          .services-hero,
          .services-showcase,
          .services-grid {
            grid-template-columns: 1fr;
          }
          .services-hero .pub-image-card img,
          .services-showcase img {
            height: 340px;
          }
        }
      `}</style>
    </main>
  );
}
