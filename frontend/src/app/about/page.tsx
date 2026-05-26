import React from "react";
import Link from "next/link";

const values = [
  ["Mission", "Give logistics teams one reliable SQL-backed workspace for suppliers, products, inventory, warehouses, shipments, reports, and invoices."],
  ["Vision", "Make supply chain operations visible, auditable, and role-aware without forcing every team into an admin-style dashboard."],
  ["Purpose", "Turn database integrity into operational confidence through normalized entities, raw SQL routes, and clean business workflows."],
];

const architecture = [
  ["SQL Server Core", "Every dashboard, CRUD module, report, and Query Lab result is powered by the existing SQL Server integration."],
  ["Role-Based Access", "Admins, suppliers, warehouse managers, clients, and logistics partners see separate, purpose-built workspaces."],
  ["Operational Visibility", "Shipment logs, low-stock signals, invoices, reports, and route status keep teams aligned around the same facts."],
];

export default function AboutPage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="about-hero">
            <div>
              <span className="pub-badge">About SCM</span>
              <h1 className="pub-heading-xl">A smarter operating layer for supply chain data.</h1>
              <p className="pub-text-lead">
                SCM brings suppliers, warehouses, inventory, shipments, shipment logs, analytics, and invoices into a connected software product backed by SQL Server. It is designed for teams that need fast visibility without losing database discipline.
              </p>
            </div>
            <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1100&q=80" alt="Logistics team managing warehouse operations" />
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="pub-grid-3">
            {values.map(([title, desc]) => (
              <article className="pub-card" key={title}>
                <span className="pub-section-label">{title}</span>
                <p className="pub-text-body" style={{ margin: 0 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="about-split">
            <div>
              <span className="pub-section-label">Platform Architecture</span>
              <h2 className="pub-heading-lg">Built to prove clean database design and serve real operational roles.</h2>
              <p className="pub-text-body">
                The public website presents SCM as a premium SaaS product, while the protected area preserves the functional backend, SQL queries, authentication, CRUD routes, and role-aware navigation. Admins keep full access; partner portals remain focused on assigned work.
              </p>
              <Link className="pub-btn-primary" href="/services">Explore capabilities</Link>
            </div>
            <div className="about-stack">
              {architecture.map(([title, desc]) => (
                <div className="pub-card" key={title}>
                  <h3 className="pub-heading-sm">{title}</h3>
                  <p className="pub-text-body" style={{ margin: "10px 0 0" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="pub-cta-banner">
            <span className="pub-section-label" style={{ color: "#bff5e4" }}>Supply Chain Visibility</span>
            <h2 className="pub-heading-lg">From database tables to daily decisions.</h2>
            <p className="pub-text-lead">SCM helps operators manage by exception: low stock, delayed shipments, pending invoices, inactive suppliers, and route changes surface where each role needs them.</p>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero,
        .about-split {
          align-items: center;
          display: grid;
          gap: 44px;
          grid-template-columns: 1fr 1fr;
        }
        .about-hero img {
          border: 1px solid var(--pub-border);
          border-radius: 34px;
          box-shadow: var(--pub-shadow);
          height: 520px;
          object-fit: cover;
          width: 100%;
        }
        .about-stack {
          display: grid;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .about-hero,
          .about-split {
            grid-template-columns: 1fr;
          }
          .about-hero img {
            height: 340px;
          }
        }
      `}</style>
    </main>
  );
}
