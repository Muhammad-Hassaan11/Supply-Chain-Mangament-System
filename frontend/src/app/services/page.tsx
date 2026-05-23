"use client";

import React, { useState } from "react";

const SERVICES = [
  {
    title: "Supplier Registry",
    desc: "Coordinate supplier catalogs, verify contact info, and track incoming order lineages with 3NF database schema consistency.",
    tag: "Procurement",
    icon: "SR",
  },
  {
    title: "Inventory Level Watch",
    desc: "Real-time stock balance alerts triggered automatically when products cross below designated warehouse safety values.",
    tag: "Warehouse Control",
    icon: "IM",
  },
  {
    title: "Multi-Warehouse Routing",
    desc: "Map layout inventories across distinct spatial coordinates and bin-locations to optimize pick-and-pack routing.",
    tag: "Infrastructure",
    icon: "WH",
  },
  {
    title: "Shipment State Ledgers",
    desc: "Immutable logs tracking cargo handoffs, custom carrier schedules, customs status, and final customer receipts.",
    tag: "Transit Logistics",
    icon: "SL",
  },
  {
    title: "SQL Insights & Query Lab",
    desc: "Run direct relational SELECT statements and custom aggregate reports. Query performance indicators below 200ms.",
    tag: "Analytics",
    icon: "SQL",
  },
  {
    title: "Procurement Automated Flow",
    desc: "Connect purchase records directly to suppliers. Schema triggers auto-create pending invoices on transaction completion.",
    tag: "Finance",
    icon: "PO",
  },
  {
    title: "Demand Analytics Estimator",
    desc: "Review past shipping velocity metrics to predict inventory restock levels and mitigate critical stockout occurrences.",
    tag: "Planning",
    icon: "DA",
  },
  {
    title: "SMS & Email Event Alerts",
    desc: "Keep dispatchers notified immediately when tracking steps occur, cargo is unloaded, or safety caps are reached.",
    tag: "Communication",
    icon: "AL",
  },
];

export default function ServicesPage() {
  // Service Estimator State
  const [cargoType, setCargoType] = useState("standard");
  const [quantity, setQuantity] = useState(10);
  const [weeks, setWeeks] = useState(2);

  const calculateEstimate = () => {
    let multiplier = 1;
    let name = "";
    if (cargoType === "standard") {
      multiplier = 15; // $15 per pallet/week
      name = "Standard Dry Racks";
    } else if (cargoType === "cold") {
      multiplier = 35; // $35 per pallet/week
      name = "Climate-Controlled Deep Freeze Zones";
    } else if (cargoType === "hazardous") {
      multiplier = 60; // $60 per pallet/week
      name = "Chemical Containment Vaults";
    }

    const cost = quantity * weeks * multiplier;
    const cubicFeet = quantity * 48; // 48 cu ft per pallet
    return { cost, cubicFeet, name };
  };

  const estimate = calculateEstimate();

  return (
    <div className="pub-anim-fade-up">
      {/* Page Header */}
      <section className="pub-section-sm pub-section-mint" style={{ borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <span className="pub-section-label">Our Capabilities</span>
          <h1 className="pub-heading-lg" style={{ margin: "8px 0 0 0" }}>
            Engineered Supply Chain Solutions
          </h1>
          <p className="pub-text-lead" style={{ margin: "12px 0 0 0", maxWidth: "800px" }}>
            A unified suite of relational database services designed to provide complete operational visibility across suppliers, warehouses, inventory, and shipment transits.
          </p>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="pub-section" style={{ background: "#ffffff" }}>
        <div className="pub-container">
          <div className="pub-grid-4">
            {SERVICES.map((srv, idx) => (
              <div
                key={idx}
                className="pub-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "24px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="pub-icon-box" style={{ fontSize: "0.78rem", fontWeight: 800 }}>{srv.icon}</span>
                  <span className="pub-tag" style={{ background: "#f0fdfb", color: "#0f766e" }}>{srv.tag}</span>
                </div>
                <h3 className="pub-heading-sm" style={{ margin: 0, fontSize: "1.1rem" }}>{srv.title}</h3>
                <p className="pub-text-body" style={{ margin: 0, fontSize: "0.88rem", flexGrow: 1, lineHeight: 1.6 }}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Service Estimator */}
      <section className="pub-section pub-section-mint" style={{ borderTop: "1px solid #ccfbf1", borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <div className="pub-grid-2" style={{ alignItems: "center", gap: "64px" }}>
            {/* Estimator Input Controls */}
            <div>
              <span className="pub-section-label">Interactive Planner</span>
              <h2 className="pub-heading-lg" style={{ margin: "8px 0 16px 0" }}>
                SCM Service & Storage Estimator
              </h2>
              <p className="pub-text-body" style={{ margin: "0 0 28px 0", fontSize: "1rem" }}>
                Select cargo specifications and duration coordinates to calculate estimated storage sizes and database tier costs.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label className="pub-label">Cargo Profile Category</label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    className="pub-select"
                  >
                    <option value="standard">Standard Cargo (Dry Rack Pallets)</option>
                    <option value="cold">Climate-Controlled (Refrigerated)</option>
                    <option value="hazardous">Hazardous Materials (Secure Vaults)</option>
                  </select>
                </div>

                <div className="pub-grid-2" style={{ gap: "20px" }}>
                  <div>
                    <label className="pub-label">Cargo Quantity (Pallets)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      className="pub-input"
                    />
                  </div>
                  <div>
                    <label className="pub-label">Storage Duration (Weeks)</label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={weeks}
                      onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value) || 0))}
                      className="pub-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Estimator Output Display */}
            <div>
              <div
                className="pub-card"
                style={{
                  background: "#ffffff",
                  padding: "36px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <span className="pub-badge" style={{ alignSelf: "flex-start" }}>
                  Estimated Storage Summary
                </span>

                <div style={{ borderBottom: "1px solid #ccfbf1", paddingBottom: "20px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#7fb3ad", display: "block" }}>Required Facility Type</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f2e2a" }}>
                    {estimate.name}
                  </span>
                </div>

                <div className="pub-grid-2" style={{ gap: "20px", borderBottom: "1px solid #ccfbf1", paddingBottom: "20px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#7fb3ad", display: "block" }}>Storage Volume</span>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0d9488" }}>
                      {estimate.cubicFeet.toLocaleString()} ft^3
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#7fb3ad", display: "block" }}>Data Capacity</span>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0ea5e9" }}>
                      {(quantity * 2).toLocaleString()} SQL Rows
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.85rem", color: "#7fb3ad", display: "block" }}>Estimated Cost</span>
                  <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "#0f2e2a", letterSpacing: "-0.02em" }}>
                    ${estimate.cost.toLocaleString()}
                    <span style={{ fontSize: "0.9rem", color: "#4b7a74", fontWeight: 500, marginLeft: "6px" }}>
                      USD / term
                    </span>
                  </span>
                </div>

                <span style={{ fontSize: "0.78rem", color: "#7fb3ad", lineHeight: 1.5 }}>
                  * This estimator provides a reference layout calculation based on standard warehousing dimensions and database indexes. Actual rates may vary with contract durations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLA Details Section */}
      <section className="pub-section" style={{ background: "#ffffff" }}>
        <div className="pub-container" style={{ textAlign: "center" }}>
          <span className="pub-section-label">System Guarantees</span>
          <h2 className="pub-heading-lg" style={{ margin: "8px 0 16px 0" }}>
            Operational Service Level Agreement
          </h2>
          <p className="pub-text-body" style={{ maxWidth: "600px", margin: "0 auto 48px auto" }}>
            Our platform guarantees maximum data consistency and relational schema uptime so your operators can coordinate shipments with absolute trust.
          </p>

          <div className="pub-grid-3" style={{ textAlign: "left" }}>
            <div className="pub-card" style={{ border: "1px solid #ccfbf1" }}>
              <h3 className="pub-heading-sm" style={{ margin: "0 0 10px 0" }}>99.9% Transaction Commit</h3>
              <p className="pub-text-body" style={{ margin: 0, fontSize: "0.9rem" }}>
                Every single cargo tracking or inventory transaction is committed with strict write-ahead logs, ensuring zero missing records during outages.
              </p>
            </div>
            <div className="pub-card" style={{ border: "1px solid #ccfbf1" }}>
              <h3 className="pub-heading-sm" style={{ margin: "0 0 10px 0" }}>Automated Database Backups</h3>
              <p className="pub-text-body" style={{ margin: 0, fontSize: "0.9rem" }}>
                Continuous transactional checkpoints allow restoring schemas to any precise second. SCM tables are replicated across distinct hot nodes.
              </p>
            </div>
            <div className="pub-card" style={{ border: "1px solid #ccfbf1" }}>
              <h3 className="pub-heading-sm" style={{ margin: "0 0 10px 0" }}>Schema Migration Lock</h3>
              <p className="pub-text-body" style={{ margin: 0, fontSize: "0.9rem" }}>
                All schema updates undergo zero-downtime integration validation. Foreign keys and reference columns remain locked during read cycles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
