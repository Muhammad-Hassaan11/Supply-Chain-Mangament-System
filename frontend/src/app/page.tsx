import React from "react";
import Link from "next/link";

const heroImages = {
  port: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
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

const heroFeatures = [
  {
    description: "Track every movement as it happens.",
    icon: "shield",
    title: "Real-time Visibility",
  },
  {
    description: "Use data and insights to stay ahead.",
    icon: "chart",
    title: "Smarter Decisions",
  },
  {
    description: "Automate workflows and reduce manual work.",
    icon: "check",
    title: "Operational Efficiency",
  },
];

const trustedLogos = ["NORTHPOINT", "BluePeak", "Gridwell", "Summit", "Vertex"];

const workflowNodes = [
  { label: "Suppliers", x: 50, y: 12, icon: "users" },
  { label: "Products", x: 24, y: 40, icon: "box" },
  { label: "Warehouses", x: 22, y: 68, icon: "home" },
  { label: "Shipment Logs", x: 50, y: 82, icon: "file" },
  { label: "Shipments", x: 79, y: 68, icon: "truck" },
  { label: "Inventory", x: 77, y: 40, icon: "stack" },
];

const workflowSegments = [
  "M415 130 C350 150 300 196 270 250",
  "M238 315 C218 350 214 394 235 428",
  "M300 472 C350 540 432 562 500 532",
  "M575 532 C648 564 742 535 784 472",
  "M812 428 C836 388 832 346 805 315",
  "M730 250 C700 196 650 150 585 130",
];

const workflowPins = [
  [415, 130],
  [270, 250],
  [238, 315],
  [235, 428],
  [300, 472],
  [500, 532],
  [575, 532],
  [784, 472],
  [812, 428],
  [805, 315],
  [730, 250],
  [585, 130],
];

function WorkflowIcon({ type }: { type: string }) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {type === "users" && (
        <>
          <circle cx="9" cy="8" r="3" {...shared} />
          <circle cx="16" cy="9" r="2.4" {...shared} />
          <path d="M4.4 18c.7-3.1 2.3-4.7 4.6-4.7s3.9 1.6 4.6 4.7" {...shared} />
          <path d="M13.8 15.2c.7-.8 1.6-1.2 2.8-1.2 1.9 0 3.2 1.3 3.8 3.7" {...shared} />
        </>
      )}
      {type === "box" && (
        <>
          <path d="m12 3.6 7 3.8v8.4l-7 4.4-7-4.4V7.4l7-3.8Z" {...shared} />
          <path d="M5.5 7.7 12 11.4l6.5-3.7M12 11.4v8.2" {...shared} />
        </>
      )}
      {type === "stack" && (
        <>
          <ellipse cx="12" cy="6.5" rx="6" ry="2.6" {...shared} />
          <path d="M6 6.5v5c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-5" {...shared} />
          <path d="M6 11.5v5c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-5" {...shared} />
        </>
      )}
      {type === "home" && (
        <>
          <path d="M4.5 11.2 12 5l7.5 6.2v8H5v-8Z" {...shared} />
          <path d="M10 19.2v-5h4v5" {...shared} />
        </>
      )}
      {type === "truck" && (
        <>
          <path d="M3.8 7.2h10.4v8.9H3.8zM14.2 10h3.6l2.4 2.9v3.2h-6" {...shared} />
          <circle cx="8" cy="17" r="1.8" {...shared} />
          <circle cx="17" cy="17" r="1.8" {...shared} />
        </>
      )}
      {type === "file" && (
        <>
          <path d="M7 3.8h6.8L18 8v12.2H7z" {...shared} />
          <path d="M13.8 3.8V8H18M10 12h5M10 15.5h5M10 18.8h3" {...shared} />
        </>
      )}
    </svg>
  );
}

function HeroFeatureIcon({ type }: { type: string }) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {type === "shield" && (
        <>
          <path d="M12 3.5 18.5 6v5.2c0 4.1-2.3 7.3-6.5 9.3-4.2-2-6.5-5.2-6.5-9.3V6L12 3.5Z" {...shared} />
          <path d="m9.4 12 1.8 1.8 3.6-4" {...shared} />
        </>
      )}
      {type === "chart" && (
        <>
          <path d="M4 19h16M6.5 16v-4M11 16V8M15.5 16v-6M6 10l4-4 3 3 5-5" {...shared} />
          <path d="M18 4h-3M18 4v3" {...shared} />
        </>
      )}
      {type === "check" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...shared} />
          <path d="m8.6 12.2 2.2 2.2 4.8-5" {...shared} />
        </>
      )}
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-hero-badge"><span />End-to-End Visibility</span>
              <h1 className="pub-heading-xl">
                <span className="home-headline-line">Connect every step.</span>
                <span className="home-headline-line">Move with confidence.</span>
              </h1>
              <p className="pub-text-lead">
                Manage suppliers, products, inventory, warehouses, shipments, and every update in one powerful supply chain platform.
              </p>
              <div className="home-hero-actions">
                <Link className="pub-btn-primary" href="/signup">Explore Platform <span aria-hidden="true">→</span></Link>
                <Link className="pub-btn-secondary home-secondary-cta" href="/services">See How It Works <span aria-hidden="true" /></Link>
              </div>
              <div className="home-feature-row">
                {heroFeatures.map((item) => (
                  <article className="home-feature-card" key={item.title}>
                    <span className="home-feature-icon"><HeroFeatureIcon type={item.icon} /></span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="home-trusted">
                <p>Trusted by forward-thinking companies</p>
                <div>
                  {trustedLogos.map((logo) => (
                    <span key={logo}>{logo}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-workflow" aria-label="Supply chain workflow from suppliers to shipment logs">
              <svg className="home-flow-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <filter id="flowGlow" x="-20%" y="-40%" width="140%" height="180%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker id="flowArrow" markerHeight="5" markerWidth="5" orient="auto" refX="4.5" refY="2.5">
                    <path d="M0,0 L5,2.5 L0,5 Z" fill="#17d8c2" opacity="0.74" />
                  </marker>
                </defs>
                {workflowSegments.map((path, index) => (
                  <g className="flow-segment" key={path}>
                    <path className="flow-base" d={path} />
                    <path
                      className="flow-active"
                      d={path}
                      pathLength="1"
                      style={{ animationDelay: `${index * 2}s` }}
                    />
                  </g>
                ))}
                {workflowPins.map(([x, y]) => (
                  <circle className="flow-pin" cx={x} cy={y} key={`${x}-${y}`} r="5.5" />
                ))}
              </svg>
              <div className="home-flow-particles" aria-hidden="true">
                {workflowSegments.map((_, index) => (
                  <span className={`particle-${index + 1}`} key={index} />
                ))}
              </div>
              {workflowNodes.map((node, index) => (
                <div
                  className={`home-workflow-node node-${index + 1}`}
                  key={node.label}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  <span className="home-node-icon"><WorkflowIcon type={node.icon} /></span>
                  <span className="home-node-name">{node.label}</span>
                </div>
              ))}
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
        .pub-hero > .pub-container {
          max-width: 1500px;
          padding-left: 48px;
          padding-right: 48px;
        }
        .home-hero-grid {
          align-items: center;
          display: grid;
          gap: 36px;
          grid-template-columns: minmax(0, .48fr) minmax(0, .52fr);
          min-height: 700px;
        }
        .home-hero-copy {
          display: flex;
          flex-direction: column;
          gap: 24px;
          justify-content: center;
        }
        .home-hero-copy .pub-heading-xl {
          font-size: clamp(2.7rem, 3.45vw, 3.75rem);
          letter-spacing: 0;
          line-height: 1.08;
        }
        .home-headline-line {
          display: block;
          white-space: nowrap;
        }
        .home-hero-copy .pub-text-lead {
          font-size: clamp(.98rem, 1.2vw, 1.08rem);
          line-height: 1.72;
          max-width: 570px;
        }
        .home-hero-badge {
          align-items: center;
          align-self: flex-start;
          background: rgba(240, 255, 250, .78);
          border: 1px solid rgba(20, 213, 187, .34);
          border-radius: 999px;
          color: #02a98c;
          display: inline-flex;
          font-size: .88rem;
          font-weight: 900;
          gap: 10px;
          padding: 9px 16px;
          width: fit-content;
        }
        .home-hero-badge span {
          background: #0ec7a9;
          border: 7px solid rgba(14, 199, 169, .14);
          border-radius: 50%;
          height: 20px;
          width: 20px;
        }
        .home-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
        }
        .home-feature-row {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 6px;
        }
        .home-feature-card {
          align-items: center;
          background: rgba(255, 255, 255, .82);
          border: 1px solid rgba(207, 233, 226, .94);
          border-radius: 8px;
          box-shadow: 0 18px 42px rgba(8, 38, 47, .06);
          display: flex;
          gap: 11px;
          min-height: 94px;
          padding: 14px;
        }
        .home-feature-icon {
          align-items: center;
          background:
            linear-gradient(#fff, #fff) padding-box,
            linear-gradient(135deg, #10c8aa, #0d8f86) border-box;
          border: 2px solid transparent;
          border-radius: 50%;
          color: #0ba993;
          display: flex;
          flex: 0 0 auto;
          height: 38px;
          justify-content: center;
          width: 38px;
        }
        .home-feature-icon svg {
          height: 21px;
          width: 21px;
        }
        .home-feature-card strong {
          color: var(--pub-navy);
          font-size: .82rem;
          line-height: 1.3;
        }
        .home-feature-card p {
          color: #637890;
          font-size: .76rem;
          line-height: 1.55;
          margin: 5px 0 0;
        }
        .home-trusted {
          border-top: 1px solid rgba(207, 233, 226, .95);
          margin-top: 10px;
          padding-top: 22px;
        }
        .home-trusted p {
          color: var(--pub-muted);
          font-size: .84rem;
          margin: 0 0 16px;
        }
        .home-trusted div {
          align-items: center;
          color: #708694;
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
          font-size: .86rem;
          font-weight: 900;
        }
        .home-secondary-cta span {
          border-bottom: 6px solid transparent;
          border-left: 9px solid #0eb99d;
          border-top: 6px solid transparent;
          height: 0;
          width: 0;
        }
        .home-workflow {
          background:
            radial-gradient(circle at 54% 50%, rgba(20, 213, 187, .18), transparent 47%),
            linear-gradient(rgba(12, 154, 143, .035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12, 154, 143, .035) 1px, transparent 1px);
          background-size: auto, 28px 28px, 28px 28px;
          border-radius: 8px;
          align-self: center;
          min-height: 590px;
          overflow: visible;
          position: relative;
          width: 100%;
        }
        .home-workflow::before {
          background:
            radial-gradient(circle, rgba(23, 216, 194, .11), rgba(23, 216, 194, .04) 46%, transparent 70%);
          border: 1px solid rgba(13, 154, 143, .08);
          border-radius: 50%;
          content: "";
          height: min(82%, 500px);
          left: 50%;
          opacity: .92;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(90%, 590px);
        }
        .home-workflow::after {
          background-image: radial-gradient(rgba(12, 154, 143, .22) 1.1px, transparent 1.1px);
          background-size: 18px 18px;
          border-radius: 50%;
          content: "";
          height: 320px;
          opacity: .48;
          position: absolute;
          right: -20px;
          top: 110px;
          width: 320px;
        }
        .home-flow-lines {
          height: 100%;
          inset: 0;
          overflow: visible;
          position: absolute;
          width: 100%;
          z-index: 1;
        }
        .flow-base,
        .flow-active {
          fill: none;
          marker-end: url(#flowArrow);
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .flow-base {
          filter: url(#flowGlow);
          opacity: .62;
          stroke: #12cdb5;
          stroke-width: 2.1;
        }
        .flow-pin {
          fill: #19d7c0;
          filter: url(#flowGlow);
          opacity: .86;
        }
        .flow-active {
          animation: segmentActive 12s cubic-bezier(.42, 0, .2, 1) infinite;
          filter: url(#flowGlow);
          stroke: #42ffe0;
          stroke-dasharray: .18 .82;
          stroke-dashoffset: 1;
          stroke-width: 3.4;
        }
        .home-flow-particles span {
          animation: segmentDot 12s cubic-bezier(.42, 0, .2, 1) infinite;
          background: #2dffe2;
          border-radius: 50%;
          box-shadow: 0 0 18px rgba(45, 255, 226, .85);
          height: 8px;
          opacity: 0;
          position: absolute;
          width: 8px;
          z-index: 3;
        }
        .particle-1 { offset-path: path("M415 130 C350 150 300 196 270 250"); }
        .particle-2 { animation-delay: 2s !important; offset-path: path("M238 315 C218 350 214 394 235 428"); }
        .particle-3 { animation-delay: 4s !important; offset-path: path("M300 472 C350 540 432 562 500 532"); }
        .particle-4 { animation-delay: 6s !important; offset-path: path("M575 532 C648 564 742 535 784 472"); }
        .particle-5 { animation-delay: 8s !important; offset-path: path("M812 428 C836 388 832 346 805 315"); }
        .particle-6 { animation-delay: 10s !important; offset-path: path("M730 250 C700 196 650 150 585 130"); }
        .home-workflow-node {
          align-items: center;
          animation: nodeIdle 6s ease-in-out infinite;
          background:
            radial-gradient(circle at 32% 20%, rgba(15, 67, 88, .9), #061f35 58%);
          border: 2px solid #13d3bb;
          border-radius: 12px;
          box-shadow:
            0 0 0 6px rgba(19, 211, 187, .07),
            0 0 28px rgba(19, 211, 187, .38),
            0 22px 38px rgba(8, 38, 47, .16);
          color: #ffffff;
          display: flex;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          font-size: .93rem;
          font-weight: 800;
          height: 80px;
          isolation: isolate;
          justify-content: center;
          padding: 12px 14px;
          position: absolute;
          text-align: center;
          transform: translate(-50%, -50%);
          width: 142px;
          z-index: 4;
        }
        .home-workflow-node::after {
          border-radius: 18px;
          box-shadow:
            0 0 0 8px rgba(45, 255, 226, .11),
            0 0 34px rgba(45, 255, 226, .5);
          background: rgba(45, 255, 226, .16);
          border: 1px solid rgba(45, 255, 226, .5);
          content: "";
          inset: -7px;
          opacity: 0;
          position: absolute;
          transform: scale(.98);
          z-index: -1;
        }
        .node-1::after { animation: nodeHighlightOne 12s linear infinite; }
        .node-2::after { animation: nodeHighlightTwo 12s linear infinite; }
        .node-3::after { animation: nodeHighlightThree 12s linear infinite; }
        .node-4::after { animation: nodeHighlightFour 12s linear infinite; }
        .node-5::after { animation: nodeHighlightFive 12s linear infinite; }
        .node-6::after { animation: nodeHighlightSix 12s linear infinite; }
        .home-node-icon {
          align-items: center;
          background: #052b42;
          border: 2px solid #13d3bb;
          border-radius: 50%;
          bottom: -31px;
          box-shadow:
            0 0 0 5px rgba(19, 211, 187, .08),
            0 0 24px rgba(19, 211, 187, .48);
          color: #12d9c4;
          display: flex;
          height: 50px;
          justify-content: center;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 50px;
        }
        .home-node-icon svg {
          height: 25px;
          width: 25px;
        }
        .home-node-name {
          line-height: 1.18;
          max-width: 126px;
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
          .home-hero-grid {
            min-height: auto;
          }
          .home-workflow {
            min-height: 520px;
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
          .home-feature-row {
            grid-template-columns: 1fr;
          }
          .home-workflow {
            display: flex;
            flex-direction: column;
            gap: 0;
            justify-content: center;
            min-height: auto;
            overflow: hidden;
            padding: 42px 18px 10px;
          }
          .home-flow-lines,
          .home-flow-particles {
            display: none;
          }
          .home-workflow::after {
            display: none;
          }
          .home-workflow-node {
            animation: nodeMobileIdle 6s ease-in-out infinite;
            left: auto !important;
            margin-bottom: 42px;
            position: relative;
            top: auto !important;
            transform: none;
            width: 142px;
          }
          .home-workflow-node:not(.node-6)::before {
            background: linear-gradient(180deg, rgba(19, 211, 187, .85), rgba(19, 211, 187, .2));
            border-radius: 999px;
            bottom: -42px;
            box-shadow: 0 0 16px rgba(19, 211, 187, .28);
            content: "";
            height: clamp(145px, 50vw, 195px);
            left: 50%;
            position: absolute;
            transform-origin: top;
            width: 2px;
            z-index: -1;
          }
          .node-1,
          .node-3,
          .node-5 {
            margin-left: 12px;
            margin-right: auto;
          }
          .node-2,
          .node-4,
          .node-6 {
            margin-left: auto;
            margin-right: 12px;
          }
          .node-1::before,
          .node-3::before,
          .node-5::before {
            transform: rotate(-76deg);
          }
          .node-2::before,
          .node-4::before {
            transform: rotate(76deg);
          }
          .home-headline-line {
            white-space: normal;
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
        @keyframes segmentActive {
          0%, 100% {
            opacity: 0;
            stroke-dashoffset: 1;
          }
          2% {
            opacity: 1;
          }
          18% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          22% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }
        @keyframes segmentDot {
          0%, 100% {
            offset-distance: 0%;
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          18% {
            offset-distance: 100%;
            opacity: 1;
          }
          22% {
            offset-distance: 100%;
            opacity: 0;
          }
        }
        @keyframes nodeIdle {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }
        @keyframes nodeMobileIdle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes nodeHighlightOne {
          0%, 17%, 84%, 100% { opacity: 1; transform: scale(1.04); }
          22%, 79% { opacity: 0; transform: scale(.98); }
        }
        @keyframes nodeHighlightTwo {
          0%, 34% { opacity: 1; transform: scale(1.04); }
          39%, 100% { opacity: 0; transform: scale(.98); }
        }
        @keyframes nodeHighlightThree {
          0%, 12%, 51%, 100% {
            opacity: 0;
            transform: scale(.98);
          }
          17%, 46% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        @keyframes nodeHighlightFour {
          0%, 29%, 68%, 100% {
            opacity: 0;
            transform: scale(.98);
          }
          34%, 63% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        @keyframes nodeHighlightFive {
          0%, 46%, 84%, 100% {
            opacity: 0;
            transform: scale(.98);
          }
          51%, 79% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        @keyframes nodeHighlightSix {
          0%, 63%, 100% {
            opacity: 0;
            transform: scale(.98);
          }
          68%, 96% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
      `}</style>
    </main>
  );
}
