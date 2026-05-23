"use client";

import React from "react";
import Link from "next/link";

const reportCards = [
  { title: "Inventory Health", value: "98%", note: "Stable stock coverage", color: "#0f9a94" },
  { title: "Supplier Rating", value: "4.7/5", note: "Average partner score", color: "#0284c7" },
  { title: "Shipment SLA", value: "94%", note: "On-time delivery rate", color: "#10a66a" },
  { title: "Query Latency", value: "42 ms", note: "Average SQL response", color: "#d97706" },
];

const rows = [
  ["Low stock products", "Inventory", "8 items", "Review"],
  ["Active supplier contracts", "Suppliers", "1,250+", "Healthy"],
  ["Warehouse utilization", "Warehouses", "76%", "Optimal"],
  ["In-transit shipments", "Shipments", "312", "Tracking"],
  ["High-value products", "Products", "7", "Protected"],
];

export default function ReportsPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)", fontSize: "2.05rem", marginBottom: "6px" }}>
            Reports
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Executive supply chain metrics for daily operations and leadership review.
          </p>
        </div>
        <Link className="glass-btn glass-btn-primary" href="/query-lab">
          Run SQL Query
        </Link>
      </div>

      <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        {reportCards.map((card) => (
          <section key={card.title} className="glass-card glass-card-hover">
            <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
              <span
                style={{
                  background: `${card.color}18`,
                  border: `1px solid ${card.color}33`,
                  borderRadius: "50%",
                  display: "inline-block",
                  height: "52px",
                  width: "52px",
                }}
              />
              <div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase" }}>
                  {card.title}
                </div>
                <div style={{ color: card.color, fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800 }}>
                  {card.value}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.84rem" }}>{card.note}</div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="glass-card">
        <div style={{ marginBottom: "18px" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>Report Summary</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px" }}>
            Snapshot of operational areas connected across the platform modules.
          </p>
        </div>
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Module</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([metric, module, value, status]) => (
                <tr key={metric}>
                  <td style={{ fontWeight: 700 }}>{metric}</td>
                  <td>{module}</td>
                  <td>{value}</td>
                  <td>
                    <span className="glass-badge glass-badge-success">{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
