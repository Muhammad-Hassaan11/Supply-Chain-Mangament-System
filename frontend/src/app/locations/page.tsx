"use client";

import React, { useState } from "react";

const HUBS = [
  {
    name: "Rotterdam Gateway Hub",
    region: "Europe",
    status: "Operational",
    capacity: "45,000 m²",
    occupancy: "82%",
    coord: "Rotterdam, Netherlands",
    contact: "rotterdam@scmnexus.com",
    features: ["Automated Ocean Unloading", "Railway Integration", "Custom Clearance Vaults"],
  },
  {
    name: "Singapore Port Terminal",
    region: "Asia Pacific",
    status: "Operational",
    capacity: "60,000 m²",
    occupancy: "78%",
    coord: "Keppel District, Singapore",
    contact: "singapore@scmnexus.com",
    features: ["Automated Sorting Cranes", "Climate Control Storage", "Bonded Cargo Staging"],
  },
  {
    name: "Los Angeles Cargo Gateway",
    region: "Americas",
    status: "Operational",
    capacity: "55,000 m²",
    occupancy: "89%",
    coord: "San Pedro Bay, CA, USA",
    contact: "la@scmnexus.com",
    features: ["Direct Highway Transits", "Cross-Dock Terminal", "Hazard Class Storage"],
  },
  {
    name: "Houston Distribution Center",
    region: "Americas",
    status: "Operational",
    capacity: "35,000 m²",
    occupancy: "68%",
    coord: "Houston Ship Channel, TX, USA",
    contact: "houston@scmnexus.com",
    features: ["Container Depot Staging", "Refrigerated Racks", "Bulk Inventory Zones"],
  },
];

const LOOKUP_REGIONS = [
  { country: "United States", bestHub: "Los Angeles Cargo Gateway", transitEst: "1-2 Business Days" },
  { country: "Canada", bestHub: "Los Angeles Cargo Gateway", transitEst: "2-4 Business Days" },
  { country: "Netherlands", bestHub: "Rotterdam Gateway Hub", transitEst: "Same-Day Dispatch" },
  { country: "Germany", bestHub: "Rotterdam Gateway Hub", transitEst: "1-2 Business Days" },
  { country: "United Kingdom", bestHub: "Rotterdam Gateway Hub", transitEst: "2-3 Business Days" },
  { country: "Singapore", bestHub: "Singapore Port Terminal", transitEst: "Immediate Pick-up" },
  { country: "Australia", bestHub: "Singapore Port Terminal", transitEst: "3-5 Business Days" },
  { country: "Japan", bestHub: "Singapore Port Terminal", transitEst: "2-4 Business Days" },
];

export default function LocationsPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [lookupCountry, setLookupCountry] = useState("United States");

  const filteredHubs = HUBS.filter(
    (hub) => selectedRegion === "All" || hub.region === selectedRegion
  );

  const matchedLookup = LOOKUP_REGIONS.find((l) => l.country === lookupCountry);
  const matchedHubDetails = HUBS.find((h) => h.name === matchedLookup?.bestHub);

  return (
    <div className="pub-anim-fade-up">
      {/* Page Header */}
      <section className="pub-section-sm pub-section-mint" style={{ borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <span className="pub-section-label">Global Infrastructure</span>
          <h1 className="pub-heading-lg" style={{ margin: "8px 0 0 0" }}>
            Operational Facility Network
          </h1>
          <p className="pub-text-lead" style={{ margin: "12px 0 0 0", maxWidth: "800px" }}>
            SCM coordinates inventory across strategic global hubs, connecting marine sea lanes, rail freight depots, and inland cargo stations.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ background: "#ffffff", padding: "48px 0", borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: "880px", margin: "0 auto", padding: "20px", background: "#f4fcf9", borderRadius: "24px", border: "1px solid #ccfbf1" }}>
            <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              {/* World outline vectors */}
              <path d="M70 120 Q120 90 200 130 T280 100 T350 140 T420 100 T510 130 T600 90 T700 140 T750 120" stroke="rgba(13, 148, 136, 0.12)" strokeWidth="3" fill="none" />
              <path d="M90 250 Q160 220 220 270 T300 240 T410 280 T520 240 T630 290 T720 250" stroke="rgba(13, 148, 136, 0.12)" strokeWidth="3" fill="none" />
              
              {/* Shipping lanes */}
              <path d="M180 180 Q320 110 430 140" stroke="#99f6e4" strokeWidth="2" strokeDasharray="4,4" />
              <path d="M430 140 Q520 210 610 290" stroke="#99f6e4" strokeWidth="2" strokeDasharray="4,4" />
              <path d="M610 290 Q400 240 180 180" stroke="#99f6e4" strokeWidth="2.5" strokeDasharray="4,4" />

              {/* Rotterdam Node */}
              <g transform="translate(430, 140)">
                <circle cx="0" cy="0" r="16" fill="rgba(13,148,136,0.15)" />
                <circle cx="0" cy="0" r="7" fill="#0d9488" />
                <text x="14" y="4" fill="#0f2e2a" fontFamily="'Space Grotesk'" fontSize="11" fontWeight="700">Rotterdam Hub</text>
              </g>

              {/* Singapore Node */}
              <g transform="translate(610, 290)">
                <circle cx="0" cy="0" r="16" fill="rgba(13,148,136,0.15)" />
                <circle cx="0" cy="0" r="7" fill="#0ea5e9" />
                <text x="14" y="4" fill="#0f2e2a" fontFamily="'Space Grotesk'" fontSize="11" fontWeight="700">Singapore Port</text>
              </g>

              {/* Los Angeles Node */}
              <g transform="translate(180, 180)">
                <circle cx="0" cy="0" r="16" fill="rgba(13,148,136,0.15)" />
                <circle cx="0" cy="0" r="7" fill="#0d9488" />
                <text x="-120" y="4" fill="#0f2e2a" fontFamily="'Space Grotesk'" fontSize="11" fontWeight="700">LA Gateway Hub</text>
              </g>

              {/* Houston Node */}
              <g transform="translate(260, 210)">
                <circle cx="0" cy="0" r="12" fill="rgba(13,148,136,0.12)" />
                <circle cx="0" cy="0" r="5" fill="#0d9488" />
                <text x="12" y="4" fill="#4b7a74" fontFamily="'Space Grotesk'" fontSize="9" fontWeight="600">Houston depot</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Lookup Facility Finder */}
      <section className="pub-section pub-section-mint" style={{ borderBottom: "1px solid #ccfbf1" }}>
        <div className="pub-container">
          <div className="pub-grid-2" style={{ alignItems: "center", gap: "64px" }}>
            <div>
              <span className="pub-section-label">Interactive Lookup</span>
              <h2 className="pub-heading-lg" style={{ margin: "8px 0 16px 0" }}>
                Find Closest SCM Facility
              </h2>
              <p className="pub-text-body" style={{ margin: "0 0 24px 0" }}>
                Select your dispatch country below to instantly calculate the closest distribution warehouse, estimated shipping transit lead times, and capacity tags.
              </p>

              <div>
                <label className="pub-label">Shipment Origin / Destination Country</label>
                <select
                  value={lookupCountry}
                  onChange={(e) => setLookupCountry(e.target.value)}
                  className="pub-select"
                  style={{ maxWidth: "360px" }}
                >
                  {LOOKUP_REGIONS.map((l) => (
                    <option key={l.country} value={l.country}>
                      {l.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lookup result display */}
            <div>
              {matchedLookup && matchedHubDetails && (
                <div className="pub-card" style={{ background: "#ffffff", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="pub-badge">Primary Route Match</span>
                    <span style={{ fontSize: "0.85rem", color: "#0ea5e9", fontWeight: 600 }}>Active link</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#7fb3ad", display: "block" }}>Closest Warehouse</span>
                    <h3 className="pub-heading-sm" style={{ margin: "4px 0 0 0", color: "#0f2e2a" }}>
                      {matchedHubDetails.name}
                    </h3>
                  </div>

                  <div className="pub-grid-2" style={{ gap: "16px", borderTop: "1px solid #ccfbf1", borderBottom: "1px solid #ccfbf1", padding: "16px 0" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#7fb3ad", display: "block" }}>Transit Time (Est)</span>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{matchedLookup.transitEst}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#7fb3ad", display: "block" }}>Storage Capacity</span>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{matchedHubDetails.capacity}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#7fb3ad", display: "block", marginBottom: "6px" }}>Hub Capability Tags</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {matchedHubDetails.features.map((f) => (
                        <span key={f} className="pub-tag">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Catalog */}
      <section className="pub-section" style={{ background: "#ffffff" }}>
        <div className="pub-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="pub-section-label">Operational Network</span>
              <h2 className="pub-heading-lg" style={{ margin: 0 }}>
                Warehouse & Port Catalogs
              </h2>
            </div>

            {/* Filter controls */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Americas", "Europe", "Asia Pacific"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  style={{
                    background: selectedRegion === reg ? "#ccfbf1" : "transparent",
                    border: selectedRegion === reg ? "1px solid #99f6e4" : "1px solid #e0f2ed",
                    borderRadius: "9999px",
                    color: selectedRegion === reg ? "#0d9488" : "#4b7a74",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    padding: "6px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="pub-grid-2">
            {filteredHubs.map((hub) => (
              <div key={hub.name} className="pub-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 className="pub-heading-sm" style={{ margin: 0 }}>{hub.name}</h3>
                    <span style={{ fontSize: "0.8rem", color: "#7fb3ad" }}>{hub.coord}</span>
                  </div>
                  <span
                    className="pub-badge"
                    style={{
                      background: "#f0fdfb",
                      borderColor: "#ccfbf1",
                      color: "#0d9488",
                      fontSize: "0.72rem",
                    }}
                  >
                    🟢 {hub.status}
                  </span>
                </div>

                <div className="pub-grid-3" style={{ background: "#f4fcf9", borderRadius: "10px", padding: "16px", border: "1px solid #ccfbf1" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7fb3ad", display: "block" }}>Region</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{hub.region}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7fb3ad", display: "block" }}>Capacity</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{hub.capacity}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7fb3ad", display: "block" }}>Occupancy</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{hub.occupancy}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {hub.features.map((feat) => (
                    <span key={feat} className="pub-tag">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
