import React from "react";

const locations = [
  ["Rotterdam Gateway Hub", "Europe", "Port operations, customs staging, rail freight", "82%", "https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&w=900&q=80"],
  ["Singapore Port Terminal", "Asia Pacific", "Ocean freight, climate storage, bonded cargo", "78%", "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80"],
  ["Los Angeles Cargo Gateway", "North America", "Container intake, cross-dock, highway routing", "89%", "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80"],
  ["Houston Distribution Center", "North America", "Bulk inventory, refrigerated racks, regional dispatch", "68%", "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"],
  ["Dubai Regional Hub", "Middle East", "Air freight, regional transfer, high-value storage", "74%", "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80"],
  ["Hamburg Warehouse Campus", "Europe", "Warehouse staging, inland freight, supplier consolidation", "71%", "https://images.unsplash.com/photo-1586528116493-9a8f2b3c9f71?auto=format&fit=crop&w=900&q=80"],
];

const stats = [
  ["30+", "Countries represented"],
  ["85+", "Warehouses and hubs"],
  ["14", "Regional freight lanes"],
  ["24/7", "Tracking coverage"],
];

export default function LocationsPage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="locations-hero">
            <div>
              <span className="pub-badge">Global Network</span>
              <h1 className="pub-heading-xl">Map hubs, warehouses, and route visibility across regions.</h1>
              <p className="pub-text-lead">
                Use SCM to model global and regional logistics hubs with location cards, warehouse stats, capacity snapshots, and operational routing context.
              </p>
            </div>
            <div className="locations-map-card">
              <div className="locations-route route-a" />
              <div className="locations-route route-b" />
              {["LA", "Houston", "Rotterdam", "Dubai", "Singapore"].map((node, index) => (
                <span className={`locations-node loc-${index + 1}`} key={node}>{node}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="locations-stats-section">
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
              <span className="pub-section-label">Location Cards</span>
              <h2 className="pub-heading-lg">Dummy hub data for a realistic logistics network.</h2>
            </div>
          </div>
          <div className="locations-grid">
            {locations.map(([name, region, desc, occupancy, image]) => (
              <article className="pub-image-card" key={name}>
                <img src={image} alt={`${name} logistics hub`} />
                <div className="pub-image-card-body">
                  <span className="pub-tag">{region}</span>
                  <h3 className="pub-heading-sm" style={{ margin: "16px 0 10px" }}>{name}</h3>
                  <p className="pub-text-body" style={{ margin: "0 0 16px" }}>{desc}</p>
                  <div className="locations-capacity">
                    <span>Occupancy</span>
                    <strong>{occupancy}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .locations-hero {
          align-items: center;
          display: grid;
          gap: 44px;
          grid-template-columns: .95fr 1.05fr;
        }
        .locations-map-card {
          background:
            linear-gradient(rgba(12,154,143,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,154,143,.08) 1px, transparent 1px),
            radial-gradient(circle at 40% 40%, rgba(17,184,127,.16), transparent 30%),
            #ffffff;
          background-size: 42px 42px, 42px 42px, auto, auto;
          border: 1px solid var(--pub-border);
          border-radius: 34px;
          box-shadow: var(--pub-shadow);
          height: 480px;
          overflow: hidden;
          position: relative;
        }
        .locations-route {
          border-top: 3px dashed rgba(12,154,143,.42);
          position: absolute;
          width: 70%;
        }
        .route-a {
          left: 10%;
          top: 50%;
          transform: rotate(-12deg);
        }
        .route-b {
          left: 22%;
          top: 48%;
          transform: rotate(22deg);
        }
        .locations-node {
          align-items: center;
          background: var(--pub-teal);
          border: 8px solid #dff7ef;
          border-radius: 50%;
          color: #fff;
          display: flex;
          font-size: .72rem;
          font-weight: 900;
          height: 58px;
          justify-content: center;
          position: absolute;
          width: 58px;
        }
        .loc-1 { left: 11%; top: 48%; }
        .loc-2 { left: 23%; top: 62%; }
        .loc-3 { left: 49%; top: 31%; }
        .loc-4 { left: 63%; top: 53%; }
        .loc-5 { left: 78%; top: 67%; }
        .locations-stats-section {
          margin-top: -34px;
          position: relative;
          z-index: 2;
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
        .locations-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(3, 1fr);
        }
        .locations-capacity {
          align-items: center;
          background: var(--pub-mint-2);
          border: 1px solid var(--pub-border);
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          padding: 13px 14px;
        }
        .locations-capacity span {
          color: var(--pub-muted);
          font-weight: 800;
        }
        .locations-capacity strong {
          color: var(--pub-teal);
        }
        @media (max-width: 1000px) {
          .locations-hero,
          .locations-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 680px) {
          .locations-map-card {
            height: 340px;
          }
          .home-stats {
            grid-template-columns: 1fr;
          }
          .home-stats > div {
            border-bottom: 1px solid var(--pub-border);
            border-right: 0;
          }
        }
      `}</style>
    </main>
  );
}
