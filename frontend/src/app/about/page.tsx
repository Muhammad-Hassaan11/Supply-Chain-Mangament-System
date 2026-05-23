"use client";

import React, { useState } from "react";
import Link from "next/link";

const ROADMAP_STEPS = [
  {
    step: "01",
    title: "Procurement & Sourcing",
    desc: "Suppliers register their items in the central platform. Contracts and pricing are validated and recorded with strict integrity controls.",
    stats: "Average procurement cycle: 4.2 days",
    details: "Using relational integrity checks, we ensure that every purchase order matches a registered supplier and valid product ID. Automated validation triggers prevent incorrect data insertion before SQL execution.",
  },
  {
    step: "02",
    title: "Inventory & Warehousing",
    desc: "Stock is checked in using designated bin coordinate mappings inside regional warehouse facilities.",
    stats: "Storage capacity accuracy: 100%",
    details: "Inventory entries are automatically updated via stored procedures. When items leave or enter a facility, safety levels are verified and alerts are dispatched instantly for low-stock scenarios.",
  },
  {
    step: "03",
    title: "Transportation & Shipping",
    desc: "Goods are consolidated and assigned to logistics carriers with unique serial shipment tracking keys.",
    stats: "Real-time dispatch speed: < 5 mins",
    details: "Carrier logs and shipment states are managed in normalized database tables. Foreign keys link tracking updates back to the original client order, allowing complete lineage tracing.",
  },
  {
    step: "04",
    title: "Last Mile Delivery",
    desc: "Cargo is dispatched from local distribution centers for delivery and verified upon receipt.",
    stats: "Successful delivery rate: 99.8%",
    details: "Upon delivery, the shipment status is marked as 'Delivered' inside the transactional log. Archive triggers move completed shipping histories into history ledgers to keep primary indexes clean.",
  },
];

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="pub-anim-fade-up">
      {/* Page Header */}
      <section className="pub-section-sm pub-section-mint" style={{ borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <span className="pub-section-label">About the Platform</span>
          <h1 className="pub-heading-lg" style={{ margin: "8px 0 0 0" }}>
            The Relational Backbone of Logistics
          </h1>
          <p className="pub-text-lead" style={{ margin: "12px 0 0 0", maxWidth: "800px" }}>
            SCM is a connected supply chain platform designed to help businesses coordinate suppliers, inventory, warehouses, and shipments with reliable operational data.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="pub-section" style={{ background: "#ffffff" }}>
        <div className="pub-container">
          <div className="pub-grid-2">
            <div className="pub-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="pub-badge" style={{ alignSelf: "flex-start" }}>🎯 OUR MISSION</div>
              <h2 className="pub-heading-md" style={{ margin: 0 }}>
                Data Integrity First
              </h2>
              <p className="pub-text-body" style={{ margin: 0 }}>
                We believe that reliable logistics operations start with robust, clean data. By leveraging high-performance SQL workflows, we reduce double-bookings, orphaned product listings, and untracked shipments. Our mission is to turn operational consistency into faster decisions.
              </p>
            </div>
            <div className="pub-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="pub-badge" style={{ alignSelf: "flex-start" }}>👁️ OUR VISION</div>
              <h2 className="pub-heading-md" style={{ margin: 0 }}>
                Real-Time Supply Chain Telemetry
              </h2>
              <p className="pub-text-body" style={{ margin: 0 }}>
                To create a unified logistics environment where physical warehouse constraints, global ocean lanes, and localized retail levels are captured dynamically. Our vision is a self-reconciling supply chain ledger that operates under tight SQL validations and triggers, enabling human operators to manage by exception rather than constant audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Process Roadmap */}
      <section className="pub-section pub-section-mint" style={{ borderTop: "1px solid #ccfbf1", borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 56px auto" }}>
            <span className="pub-section-label">Logistics Lifecycle</span>
            <h2 className="pub-heading-lg" style={{ margin: "0 0 16px 0" }}>
              How SCM Coordinates Cargo
            </h2>
            <p className="pub-text-body" style={{ margin: 0 }}>
              Click through the lifecycle phases below to see how relational constraints model the flow of cargo from source to destination.
            </p>
          </div>

          <div className="pub-grid-2" style={{ gap: "48px", alignItems: "start" }}>
            {/* Steps Left List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {ROADMAP_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      background: isActive ? "#ffffff" : "transparent",
                      border: isActive ? "1px solid #99f6e4" : "1px solid transparent",
                      borderRadius: "16px",
                      padding: "20px 24px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      gap: "20px",
                      alignItems: "flex-start",
                      transition: "all 0.25s ease",
                      boxShadow: isActive ? "var(--pub-shadow)" : "none",
                      width: "100%",
                      outline: "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: isActive ? "#0d9488" : "#7fb3ad",
                      }}
                    >
                      {step.step}
                    </span>
                    <div>
                      <h3
                        style={{
                          margin: "0 0 4px 0",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: isActive ? "#0f2e2a" : "#4b7a74",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#4b7a74", lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Details Right Card */}
            <div
              className="pub-card"
              style={{
                background: "#ffffff",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                minHeight: "360px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="pub-tag" style={{ background: "#ccfbf1", color: "#0f766e", fontWeight: 600 }}>
                  Active Lifecycle Stage
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d9488" }}>
                  Phase {ROADMAP_STEPS[activeStep].step}
                </span>
              </div>
              <h3 className="pub-heading-md" style={{ margin: 0 }}>
                {ROADMAP_STEPS[activeStep].title}
              </h3>
              <p className="pub-text-body" style={{ margin: 0, lineHeight: 1.7 }}>
                {ROADMAP_STEPS[activeStep].details}
              </p>
              <div
                style={{
                  background: "#f0fdfb",
                  border: "1px solid #ccfbf1",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📈</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f766e" }}>
                  {ROADMAP_STEPS[activeStep].stats}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SQL Server Integration Showcase */}
      <section className="pub-section" style={{ background: "#ffffff" }}>
        <div className="pub-container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 64px auto" }}>
            <span className="pub-section-label">Technical Architecture</span>
            <h2 className="pub-heading-lg" style={{ margin: 0 }}>
              The Power of Relational Schemas
            </h2>
          </div>

          <div className="pub-grid-3">
            {[
              {
                title: "Strict Schemas",
                desc: "Every data entry matches predefined types. Foreign keys enforce logical hierarchies so you can never have a shipment referencing a non-existent warehouse.",
              },
              {
                title: "Triggers & Constraints",
                desc: "Automatic stock alerts are calculated on the database server. Relational triggers log tracking history state changes transparently.",
              },
              {
                title: "Normalized Tables",
                desc: "3NF database modeling reduces redundancy. Complex SQL joins serve dashboards instantly with indexing strategies for fast executions.",
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="pub-card"
                style={{
                  border: "1.5px solid #ccfbf1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>⚙️</span>
                <h3 className="pub-heading-sm" style={{ margin: 0 }}>{feat.title}</h3>
                <p className="pub-text-body" style={{ margin: 0 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Portal Access Details */}
      <section className="pub-section pub-section-mint" style={{ borderTop: "1px solid #ccfbf1" }}>
        <div className="pub-container" style={{ textAlign: "center" }}>
          <span className="pub-section-label">Access Control</span>
          <h2 className="pub-heading-lg" style={{ margin: "8px 0 16px 0" }}>
            Role-Based Portal Access
          </h2>
          <p className="pub-text-body" style={{ maxWidth: "600px", margin: "0 auto 36px auto", fontSize: "1.05rem" }}>
            SCM uses controlled workspace access to safeguard critical transactional logs and operational records.
          </p>

          <div className="pub-grid-2" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
            <div className="pub-card" style={{ background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="pub-heading-sm" style={{ margin: 0 }}>Operations Team</h3>
                <span className="pub-tag" style={{ background: "#ccfbf1", color: "#0f766e" }}>Monitor</span>
              </div>
              <p className="pub-text-body" style={{ margin: 0, fontSize: "0.9rem" }}>
                Ideal for field coordinators. Team members can monitor shipment progress, inspect product counts, and review analytical dashboards.
              </p>
            </div>
            <div className="pub-card" style={{ background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="pub-heading-sm" style={{ margin: 0 }}>Admin Role</h3>
                <span className="pub-tag" style={{ background: "#0d9488", color: "#ffffff" }}>Read & Write</span>
              </div>
              <p className="pub-text-body" style={{ margin: 0, fontSize: "0.9rem" }}>
                Ideal for control center coordinators. Admins can register new suppliers, create warehouses, update inventory counts, dispatch shipments, and access the Query Lab tool to run raw SQL statements.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "48px" }}>
            <Link href="/login" className="pub-btn-primary">
              Log In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
