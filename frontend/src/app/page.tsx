import React from "react";
import Link from "next/link";

const heroImages = {
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1100&q=80",
  port: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
};

const stats = [
  ["42 ms", "Average SQL response"],
  ["8 roles", "Admin and partner portals"],
  ["24/7", "Shipment visibility"],
  ["100%", "Raw SQL workflow"],
];

const services = [
  ["Supplier Management", "Onboard vendors, catalogs, product ownership, and purchase coordination."],
  ["Inventory Control", "Track stock by warehouse, threshold, location, and live low-stock signals."],
  ["Shipment Tracking", "Coordinate dispatch, delivery status, shipment logs, and partner updates."],
  ["SQL Query Lab", "Demonstrate joins, aggregates, reports, and operational queries directly."],
];

const roles = [
  ["Admin", "Full control across suppliers, products, warehouses, inventory, shipments, reports, invoices, users, and Query Lab."],
  ["Supplier", "Manage own products, orders, shipments, profile, and fulfillment performance."],
  ["Warehouse Manager", "See assigned warehouse, stock levels, inbound and outbound shipments, alerts, reports, and profile."],
  ["Client / Buyer", "Track shipments, suppliers, reports, invoices, orders, and profile from a buyer workspace."],
  ["Logistics Partner", "View assigned shipments, routes, fleet, tracking logs, delivery performance, and profile."],
];

const hubs = ["Rotterdam", "Singapore", "Los Angeles", "Houston", "Dubai"];

export default function HomePage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="pub-badge">SQL-powered logistics command center</span>
              <h1 className="pub-heading-xl">
                Smart Supply Chain OS for Modern Logistics Teams
              </h1>
              <p className="pub-text-lead">
                Connect suppliers, warehouses, inventory, shipments, shipment logs, invoices, and analytics in one SQL Server powered operating system built for clean visibility.
              </p>
              <div className="home-hero-actions">
                <Link className="pub-btn-primary" href="/signup">Get Started</Link>
                <Link className="pub-btn-secondary" href="/services">Explore Platform</Link>
              </div>
              <div className="pub-kicker-row">
                {["Raw SQL backend", "Role-based portals", "Real-time operations"].map((item) => (
                  <span className="pub-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="home-hero-visual" aria-label="Logistics operations preview">
              <img className="home-hero-photo" src={heroImages.warehouse} alt="Warehouse workers managing inventory racks" />
              <div className="home-dashboard-card">
                <div className="home-card-top">
                  <span>Shipment Network</span>
                  <strong>Live</strong>
                </div>
                <div className="home-route-map">
                  {hubs.map((hub, index) => (
                    <div className={`home-map-node node-${index + 1}`} key={hub}>
                      <span />
                      <small>{hub}</small>
                    </div>
                  ))}
                </div>
                <div className="home-mini-stats">
                  <div><strong>1,284</strong><span>Inventory rows</span></div>
                  <div><strong>97%</strong><span>On-time routes</span></div>
                </div>
              </div>
              <div className="home-floating-card">
                <span className="pub-tag">TRK-USA-10015</span>
                <strong>Atlanta to Dallas</strong>
                <p>In transit. ETA May 28, 2026.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats-wrap">
        <div className="pub-container">
          <div className="home-stats pub-card">
            {stats.map(([value, label]) => (
              <div key={label}>
                <strong className="pub-stat-value">{value}</strong>
                <span className="pub-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="pub-section-head">
            <div>
              <span className="pub-section-label">Platform Services</span>
              <h2 className="pub-heading-lg">Everything your supply chain team needs in one clean workspace.</h2>
            </div>
            <Link className="pub-btn-secondary" href="/services">View services</Link>
          </div>
          <div className="pub-grid-4">
            {services.map(([title, desc], index) => (
              <article className="pub-card" key={title}>
                <div className="pub-icon-box">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="pub-heading-sm" style={{ margin: "22px 0 10px" }}>{title}</h3>
                <p className="pub-text-body" style={{ margin: 0 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="home-preview-grid">
            <div className="pub-image-card">
              <img src={heroImages.port} alt="Shipping containers at a logistics port" />
              <div className="pub-image-card-body">
                <span className="pub-section-label">Shipment Tracking</span>
                <h2 className="pub-heading-md">From warehouse dock to regional hub, every movement has a record.</h2>
                <p className="pub-text-body">
                  Shipment logs keep each status change traceable while dashboards surface exceptions, delivery progress, and lane performance.
                </p>
              </div>
            </div>
            <div className="home-track-card pub-card">
              {["Order created", "Warehouse packed", "Carrier assigned", "In transit", "Delivered"].map((step, index) => (
                <div className="home-track-row" key={step}>
                  <span className={index < 3 ? "active" : ""}>{index + 1}</span>
                  <div>
                    <strong>{step}</strong>
                    <p>{index < 3 ? "Completed and written to shipment logs." : "Awaiting next update."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="pub-section-head">
            <div>
              <span className="pub-section-label">Role-Based Platform</span>
              <h2 className="pub-heading-lg">Separate portals for every team, not copies of the admin dashboard.</h2>
            </div>
            <Link className="pub-btn-primary" href="/login">Login to portal</Link>
          </div>
          <div className="home-role-grid">
            {roles.map(([title, desc]) => (
              <article className="pub-card" key={title}>
                <span className="pub-tag">{title}</span>
                <p className="pub-text-body" style={{ margin: "16px 0 0" }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="pub-cta-banner home-final-cta">
            <div>
              <span className="pub-section-label" style={{ color: "#bff5e4" }}>Global Locations</span>
              <h2 className="pub-heading-lg">Coordinate warehouses, ports, hubs, and delivery partners with SQL-backed clarity.</h2>
              <p className="pub-text-lead">Explore regional hub layouts, location cards, and global network stats built for a professional logistics SaaS experience.</p>
            </div>
            <div className="home-cta-actions">
              <Link className="pub-btn-primary" href="/locations">View locations</Link>
              <Link className="pub-btn-secondary" href="/contact">Talk to team</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-hero-grid {
          align-items: center;
          display: grid;
          gap: 52px;
          grid-template-columns: .94fr 1.06fr;
        }
        .home-hero-copy {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .home-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
        }
        .home-hero-visual {
          min-height: 620px;
          position: relative;
        }
        .home-hero-photo {
          border: 1px solid var(--pub-border);
          border-radius: 34px;
          box-shadow: var(--pub-shadow);
          height: 520px;
          object-fit: cover;
          width: 86%;
        }
        .home-dashboard-card {
          background: rgba(255,255,255,.92);
          border: 1px solid var(--pub-border);
          border-radius: 28px;
          bottom: 42px;
          box-shadow: var(--pub-shadow);
          padding: 20px;
          position: absolute;
          right: 0;
          width: 64%;
        }
        .home-card-top,
        .home-mini-stats,
        .home-track-row {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }
        .home-card-top strong {
          color: var(--pub-teal);
        }
        .home-route-map {
          background:
            linear-gradient(135deg, rgba(12,154,143,.08), transparent),
            #f7fffc;
          border: 1px solid var(--pub-border);
          border-radius: 22px;
          height: 190px;
          margin: 16px 0;
          position: relative;
        }
        .home-route-map::before {
          border-top: 2px dashed rgba(12,154,143,.38);
          content: "";
          left: 13%;
          position: absolute;
          right: 13%;
          top: 50%;
          transform: rotate(-10deg);
        }
        .home-map-node {
          position: absolute;
        }
        .home-map-node span {
          background: var(--pub-teal);
          border: 8px solid #dff7ef;
          border-radius: 50%;
          display: block;
          height: 28px;
          width: 28px;
        }
        .home-map-node small {
          color: var(--pub-muted);
          display: block;
          font-size: .72rem;
          font-weight: 850;
          margin-top: 4px;
        }
        .node-1 { left: 8%; top: 52%; }
        .node-2 { left: 30%; top: 33%; }
        .node-3 { left: 49%; top: 59%; }
        .node-4 { left: 66%; top: 26%; }
        .node-5 { left: 82%; top: 48%; }
        .home-mini-stats {
          gap: 12px;
        }
        .home-mini-stats div {
          background: var(--pub-mint-2);
          border: 1px solid var(--pub-border);
          border-radius: 18px;
          flex: 1;
          padding: 14px;
        }
        .home-mini-stats strong {
          display: block;
          font-size: 1.3rem;
        }
        .home-mini-stats span,
        .home-floating-card p,
        .home-track-row p {
          color: var(--pub-muted);
          font-size: .82rem;
        }
        .home-floating-card {
          background: #fff;
          border: 1px solid var(--pub-border);
          border-radius: 22px;
          box-shadow: var(--pub-shadow);
          left: 0;
          padding: 18px;
          position: absolute;
          top: 58px;
          width: 220px;
        }
        .home-floating-card strong {
          display: block;
          margin: 14px 0 4px;
        }
        .home-stats-wrap {
          margin-top: -36px;
          position: relative;
          z-index: 3;
        }
        .home-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 0;
        }
        .home-stats > div {
          border-right: 1px solid var(--pub-border);
          padding: 26px;
        }
        .home-stats > div:last-child {
          border-right: 0;
        }
        .home-preview-grid {
          align-items: stretch;
          display: grid;
          gap: 24px;
          grid-template-columns: 1.1fr .9fr;
        }
        .home-track-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: center;
        }
        .home-track-row {
          background: #f8fffc;
          border: 1px solid var(--pub-border);
          border-radius: 18px;
          gap: 14px;
          justify-content: flex-start;
          padding: 15px;
        }
        .home-track-row > span {
          align-items: center;
          background: #e7f2ef;
          border-radius: 50%;
          color: var(--pub-muted);
          display: flex;
          font-weight: 900;
          height: 34px;
          justify-content: center;
          width: 34px;
        }
        .home-track-row > span.active {
          background: var(--pub-teal);
          color: #fff;
        }
        .home-role-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(5, 1fr);
        }
        .home-final-cta {
          align-items: center;
          display: flex;
          gap: 24px;
          justify-content: space-between;
        }
        .home-cta-actions {
          display: flex;
          flex-shrink: 0;
          gap: 12px;
        }
        @media (max-width: 1080px) {
          .home-hero-grid,
          .home-preview-grid {
            grid-template-columns: 1fr;
          }
          .home-role-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .home-final-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }
        @media (max-width: 720px) {
          .home-hero-visual {
            min-height: auto;
          }
          .home-hero-photo,
          .home-dashboard-card,
          .home-floating-card {
            position: static;
            width: 100%;
          }
          .home-hero-photo {
            height: 320px;
            margin-bottom: 14px;
          }
          .home-stats,
          .home-role-grid {
            grid-template-columns: 1fr;
          }
          .home-stats > div {
            border-bottom: 1px solid var(--pub-border);
            border-right: 0;
          }
          .home-cta-actions {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
