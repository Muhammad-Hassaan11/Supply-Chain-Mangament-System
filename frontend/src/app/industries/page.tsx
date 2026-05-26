import React from "react";

const industries = [
  ["Manufacturing", "Production lines, component suppliers, and factory replenishment.", "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=900&q=80"],
  ["Healthcare", "Medical supplies, controlled inventory, and reliable delivery lanes.", "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80"],
  ["Retail & eCommerce", "High-volume fulfillment, supplier coordination, and shipment tracking.", "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80"],
  ["Automotive", "Parts flow, warehouse staging, and just-in-time movement visibility.", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"],
  ["Food & Beverages", "Batch visibility, regional distribution, and temperature-aware operations.", "https://images.pexels.com/photos/10359555/pexels-photo-10359555.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Chemicals", "Hazard-aware storage, compliance records, and careful shipment logs.", "https://images.pexels.com/photos/11703173/pexels-photo-11703173.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Technology", "Serial-tracked hardware, global suppliers, and secure fulfillment.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"],
  ["Pharma", "Cold-chain readiness, lot tracking, and auditable distribution paths.", "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80"],
];

export default function IndustriesPage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <span className="pub-badge">Industries</span>
          <h1 className="pub-heading-xl" style={{ maxWidth: 920 }}>Built for the industries where movement, stock, and timing matter.</h1>
          <p className="pub-text-lead" style={{ maxWidth: 760 }}>
            SCM adapts to manufacturing, healthcare, retail, automotive, food, chemicals, technology, and pharma workflows through clean data models and role-specific portals.
          </p>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="industries-grid">
            {industries.map(([title, desc, image]) => (
              <article className="pub-image-card industry-card" key={title}>
                <img src={image} alt={`${title} logistics operations`} />
                <div className="pub-image-card-body">
                  <h2 className="pub-heading-sm">{title}</h2>
                  <p className="pub-text-body" style={{ margin: "10px 0 16px" }}>{desc}</p>
                  <span className="pub-tag">Supply chain ready</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="pub-cta-banner">
            <h2 className="pub-heading-lg">One product experience, many operational realities.</h2>
            <p className="pub-text-lead">Use the same SQL-powered foundation to manage different stock rules, shipment flows, supplier networks, and reporting needs.</p>
          </div>
        </div>
      </section>

      <style>{`
        .industries-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(4, 1fr);
        }
        .industry-card img {
          height: 250px;
        }
        @media (max-width: 1100px) {
          .industries-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .industries-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
