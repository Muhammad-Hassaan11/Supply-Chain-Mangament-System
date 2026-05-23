"use client";

import React, { useState } from "react";

const INDUSTRIES = [
  {
    title: "High-Tech Manufacturing",
    category: "Industrial",
    desc: "Coordinate precision component parts delivery and manage supplier lead times with database schemas tailored for sub-assembly workflows.",
    tags: ["JIT Inventory", "Sub-Assembly Logs", "OEM Tracking"],
    icon: "⚙️",
  },
  {
    title: "Biopharma & Healthcare",
    category: "Medical",
    desc: "Maintain strict environment control records and lot number tracking with cold chain logistics validation triggers.",
    tags: ["Cold Chain Logs", "FDA Lot Compliance", "Item Serializers"],
    icon: "🧪",
  },
  {
    title: "Retail & E-Commerce",
    category: "Consumer",
    desc: "Integrate multi-channel retail storefront orders directly into fulfillment queues with zero-latency inventory queries.",
    tags: ["API Feeds", "Multi-Channel Orders", "Pick & Pack Routing"],
    icon: "🛍️",
  },
  {
    title: "Automotive Assembly",
    category: "Industrial",
    desc: "Optimize just-in-time components supply. Automated relational triggers sync sequence schedules with nearby supplier inventories.",
    tags: ["JIT Logistics", "Sequencing Schedules", "Component Registry"],
    icon: "🚗",
  },
  {
    title: "Food & Beverage Grid",
    category: "Consumer",
    desc: "Track batch serial tags and expiry parameters. Relational views immediately highlight items nearing expiry limits.",
    tags: ["Batch Serials", "Expiration Views", "First-In-First-Out"],
    icon: "🍎",
  },
  {
    title: "Chemicals & Compliance",
    category: "Specialized",
    desc: "Enforce hazard safety classifications, storage layout rules, and containment vault clearance codes.",
    tags: ["Hazmat Protocols", "Vault Placement", "Custom Inspections"],
    icon: "☣️",
  },
  {
    title: "Technology & Hardware",
    category: "Consumer",
    desc: "Manage high-value silicon microchips and networking hardware, logging precise serial histories across multi-modal transits.",
    tags: ["Serial Registration", "High-Value Escort", "Security Logins"],
    icon: "💻",
  },
  {
    title: "Pharma Distribution",
    category: "Medical",
    desc: "Enforce strict chain of custody protocols for controlled substances, logging digital signatures on database checkpoints.",
    tags: ["Custody Trails", "Secure Signatures", "Audit Checkpoints"],
    icon: "💊",
  },
];

const CATEGORIES = ["All", "Industrial", "Medical", "Consumer", "Specialized"];

export default function IndustriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIndustries = INDUSTRIES.filter((ind) => {
    const matchesCategory = selectedCategory === "All" || ind.category === selectedCategory;
    const matchesSearch =
      ind.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pub-anim-fade-up">
      {/* Page Header */}
      <section className="pub-section-sm pub-section-mint" style={{ borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <span className="pub-section-label">Markets Served</span>
          <h1 className="pub-heading-lg" style={{ margin: "8px 0 0 0" }}>
            Tailored Industry Solutions
          </h1>
          <p className="pub-text-lead" style={{ margin: "12px 0 0 0", maxWidth: "800px" }}>
            SCM adapts operational data rules to verify compliance, catalog structures, and routing parameters across diverse market channels.
          </p>
        </div>
      </section>

      {/* Filter and Search Panel */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #ccfbf1", padding: "24px 0" }}>
        <div className="pub-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* Category Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: isActive ? "#ccfbf1" : "transparent",
                      border: isActive ? "1px solid #99f6e4" : "1px solid #e0f2ed",
                      borderRadius: "9999px",
                      color: isActive ? "#0d9488" : "#4b7a74",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      padding: "8px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
              <input
                type="text"
                placeholder="Search industries, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pub-input"
                style={{ padding: "10px 16px 10px 38px", fontSize: "0.88rem" }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#7fb3ad",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="pub-section" style={{ background: "#f4fcf9" }}>
        <div className="pub-container">
          {filteredIndustries.length === 0 ? (
            <div
              className="pub-card"
              style={{
                textAlign: "center",
                padding: "64px",
                background: "#ffffff",
                color: "#4b7a74",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📂</div>
              <h3 className="pub-heading-sm" style={{ margin: 0 }}>No Matching Sectors</h3>
              <p className="pub-text-body" style={{ margin: "4px 0 0 0" }}>
                Adjust your category filters or search parameters and try again.
              </p>
            </div>
          ) : (
            <div className="pub-grid-2">
              {filteredIndustries.map((ind, idx) => (
                <div
                  key={idx}
                  className="pub-card"
                  style={{
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <div
                        className="pub-icon-box"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          fontSize: "1.3rem",
                        }}
                      >
                        {ind.icon}
                      </div>
                      <div>
                        <h3 className="pub-heading-sm" style={{ margin: 0, fontSize: "1.15rem" }}>
                          {ind.title}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "#7fb3ad" }}>{ind.category} sector</span>
                      </div>
                    </div>
                  </div>

                  <p className="pub-text-body" style={{ margin: 0, fontSize: "0.92rem", flexGrow: 1, lineHeight: 1.6 }}>
                    {ind.desc}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {ind.tags.map((tag) => (
                      <span key={tag} className="pub-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Study Callout */}
      <section className="pub-section" style={{ background: "#ffffff", borderTop: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <div
            style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
              borderRadius: "24px",
              padding: "48px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            <div style={{ maxWidth: "640px" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#ccfbf1",
                }}
              >
                High-Volume Logistics Case Study
              </span>
              <h2 className="pub-heading-md" style={{ color: "#ffffff", margin: "8px 0 12px 0" }}>
                AutoCorp Global Optimizes Sub-Assembly Schedules
              </h2>
              <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6, color: "#e0f7f4" }}>
                By mapping parts components under strict constraints and running scheduled indexing on transactional shipment tables, AutoCorp Global reduced warehouse sorting latency by 34% and eliminated duplicate item registry logs.
              </p>
            </div>
            <div
              className="pub-badge"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                padding: "8px 18px",
                fontSize: "0.85rem",
              }}
            >
              📊 SLA Verified Response
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
