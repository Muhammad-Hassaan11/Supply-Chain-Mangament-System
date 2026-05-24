import React from "react";
import Link from "next/link";

const stats = [
  { label: "Suppliers", value: "1,250+", detail: "Active Partners", icon: PeopleIcon },
  { label: "Products", value: "12,500+", detail: "SKUs Managed", icon: BoxIcon },
  { label: "Warehouses", value: "85+", detail: "Global Facilities", icon: WarehouseIcon },
  { label: "Shipments", value: "58,900+", detail: "On-Time Deliveries", icon: TruckIcon },
];

type IconComponent = () => React.JSX.Element;

const services: { title: string; desc: string; icon: IconComponent }[] = [
  { title: "Supply Chain Visibility", desc: "Real-time tracking and end-to-end visibility across your network.", icon: NetworkIcon },
  { title: "Inventory Management", desc: "Optimize inventory levels and reduce holding costs.", icon: BoxIcon },
  { title: "Shipment & Logistics", desc: "Streamline shipments and ensure on-time delivery.", icon: TruckIcon },
  { title: "SQL Insights & Analytics", desc: "Run SQL queries and unlock powerful business insights.", icon: DatabaseIcon },
];

const industries = [
  ["Manufacturing", "Factory-to-warehouse flow"],
  ["Pharmaceuticals", "Compliance-ready logistics"],
  ["Automotive", "Parts and assembly supply"],
  ["Retail & eCommerce", "Order fulfillment network"],
  ["Food & Beverage", "Temperature-aware routing"],
  ["Chemicals", "Controlled inventory handling"],
];

export default function HomePage() {
  return (
    <main className="pub-anim-fade-up">
      <section
        className="pub-section-mint"
        style={{
          borderBottom: "1px solid #d5ebe8",
          overflow: "hidden",
          padding: "32px 0 44px",
          position: "relative",
        }}
      >
        <div className="pub-container">
          <div
            style={{
              alignItems: "center",
              display: "grid",
              gap: "34px",
              gridTemplateColumns: "0.8fr 1.2fr",
            }}
            className="home-hero-grid"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "560px" }}>
              <span className="pub-badge" style={{ alignSelf: "flex-start" }}>
                <LeafIcon /> End-to-End Supply Chain Intelligence
              </span>
              <h1 className="pub-heading-xl" style={{ color: "#084b4a", margin: 0 }}>
                Smart Supply Chain Solutions
              </h1>
              <p className="pub-text-lead" style={{ margin: 0 }}>
                Manage your entire supply chain from suppliers and products to warehouses, inventory, and shipments. Get real-time visibility and SQL-powered insights to make faster decisions.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <Link className="pub-btn-primary" href="/login">
                  Explore Platform <ArrowIcon />
                </Link>
                <Link className="pub-btn-secondary" href="/contact">
                  Talk to Sales <CalendarIcon />
                </Link>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {["Real-time Visibility", "Data-Driven Insights", "Secure & Reliable"].map((item) => (
                  <span key={item} className="pub-tag" style={{ background: "#ffffff" }}>
                    <CheckIcon /> {item}
                  </span>
                ))}
              </div>
            </div>

            <SupplyChainHeroVisual />
          </div>
        </div>
      </section>

      <section style={{ marginTop: "-28px", position: "relative", zIndex: 2 }}>
        <div className="pub-container">
          <div
            className="pub-card"
            style={{
              display: "grid",
              gap: "0",
              gridTemplateColumns: "repeat(4, 1fr)",
              padding: 0,
            }}
            id="home-stats-strip"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    alignItems: "center",
                    borderRight: index < stats.length - 1 ? "1px solid #d5ebe8" : "none",
                    display: "flex",
                    gap: "16px",
                    padding: "24px 32px",
                  }}
                >
                  <div className="pub-icon-box pub-icon-box-lg">
                    <Icon />
                  </div>
                  <div>
                    <div style={{ color: "#526777", fontSize: "0.88rem", fontWeight: 700 }}>{stat.label}</div>
                    <div className="pub-stat-value">{stat.value}</div>
                    <div className="pub-stat-label">{stat.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pub-section" style={{ background: "#ffffff", paddingTop: "42px" }}>
        <div className="pub-container">
          <div className="home-overview-grid">
            <Panel title="Our Services" href="/services" linkLabel="View all services">
              <div className="home-services-grid">
                {services.map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="pub-card pub-card-sm" style={{ boxShadow: "none", textAlign: "center" }}>
                    <div className="pub-icon-box" style={{ margin: "0 auto 12px" }}>
                      <Icon />
                    </div>
                    <h3 style={{ fontSize: "0.95rem", marginBottom: "8px" }}>{title}</h3>
                    <p className="pub-text-sm" style={{ margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Industries We Serve" href="/industries" linkLabel="View all industries">
              <div className="industry-grid">
                {industries.map(([title, desc]) => (
                  <div key={title} style={{ border: "1px solid #d5ebe8", borderRadius: "8px", padding: "14px" }}>
                    <h3 style={{ color: "#0f9a94", fontSize: "0.92rem", marginBottom: "4px" }}>{title}</h3>
                    <p className="pub-text-sm" style={{ margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Global Locations" href="/locations" linkLabel="View all locations">
              <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "1.4fr 1fr" }}>
                <WorldMap />
                <div style={{ display: "grid", gap: "8px" }}>
                  {[
                    ["North America", "25+"],
                    ["Europe", "20+"],
                    ["Asia Pacific", "30+"],
                    ["Middle East", "5+"],
                    ["South America", "5+"],
                  ].map(([region, value]) => (
                    <div key={region} style={{ display: "flex", justifyContent: "space-between", color: "#526777", fontSize: "0.88rem" }}>
                      <span>{region}</span>
                      <strong style={{ color: "#10272d" }}>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <p className="pub-text-body" style={{ margin: "14px 0 0", textAlign: "center" }}>
                Operating in <strong style={{ color: "#0f9a94" }}>85+</strong> warehouses across <strong style={{ color: "#0f9a94" }}>30+</strong> countries.
              </p>
            </Panel>
          </div>

          <div className="home-action-grid" style={{ marginTop: "18px" }}>
            <div className="pub-card">
              <h2 className="pub-heading-sm" style={{ marginBottom: "6px" }}>Track Your Shipment</h2>
              <p className="pub-text-sm" style={{ marginBottom: "14px" }}>Enter your tracking number to get real-time shipment updates.</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input className="pub-input" placeholder="Enter tracking number" />
                <button className="pub-btn-primary" type="button">Track Now</button>
              </div>
              <div className="pub-tag" style={{ marginTop: "14px" }}>
                Example: TRK-USA-10015, In Transit, ETA May 28, 2026
              </div>
            </div>

            <div className="pub-card portal-card">
              <div>
                <h2 className="pub-heading-sm" style={{ marginBottom: "6px" }}>Admin Portal</h2>
                <p className="pub-text-sm" style={{ marginBottom: "16px" }}>Powerful tools to manage suppliers, products, warehouses, inventory, and shipments.</p>
                <Link className="pub-btn-secondary" href="/login">Admin Login <ArrowIcon /></Link>
              </div>
              <img alt="Admin dashboard preview" src="/prototype/admin-dashboard.png" />
            </div>

            <div className="pub-card portal-card">
              <div>
                <h2 className="pub-heading-sm" style={{ marginBottom: "6px" }}>User Portal</h2>
                <p className="pub-text-sm" style={{ marginBottom: "16px" }}>Access orders, shipments, and real-time updates in one place.</p>
                <Link className="pub-btn-secondary" href="/signup">User Login <ArrowIcon /></Link>
              </div>
              <img alt="Signup portal preview" src="/prototype/signup-page.png" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-overview-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1.1fr 1fr 1.1fr;
        }
        .home-services-grid,
        .industry-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .home-action-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr 1fr;
        }
        .portal-card {
          align-items: center;
          display: grid;
          gap: 18px;
          grid-template-columns: 1.1fr 0.9fr;
          overflow: hidden;
        }
        .portal-card img {
          border: 1px solid #d5ebe8;
          border-radius: 8px;
          height: 120px;
          object-fit: cover;
          object-position: 38% 18%;
          width: 100%;
        }
        @media (max-width: 1080px) {
          .home-hero-grid,
          .home-overview-grid,
          .home-action-grid {
            grid-template-columns: 1fr !important;
          }
          #home-stats-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          #home-stats-strip,
          .home-services-grid,
          .industry-grid,
          .portal-card {
            grid-template-columns: 1fr !important;
          }
          #home-stats-strip > div {
            border-right: none !important;
            border-bottom: 1px solid #d5ebe8;
          }
        }
      `}</style>
    </main>
  );
}

function Panel({ title, href, linkLabel, children }: { title: string; href: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <section className="pub-card" style={{ boxShadow: "var(--pub-shadow-sm)" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 className="pub-heading-sm">{title}</h2>
        <Link className="pub-btn-ghost" href={href}>{linkLabel} <ArrowIcon /></Link>
      </div>
      {children}
    </section>
  );
}

function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function PeopleIcon() { return <IconBase><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>; }
function BoxIcon() { return <IconBase><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></IconBase>; }
function WarehouseIcon() { return <IconBase><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-8h6v8" /><path d="M7 11h10" /></IconBase>; }
function TruckIcon() { return <IconBase><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></IconBase>; }
function DatabaseIcon() { return <IconBase><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></IconBase>; }
function NetworkIcon() { return <IconBase><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 7v4" /><path d="m10.5 12-4 5" /><path d="m13.5 12 4 5" /></IconBase>; }
function LeafIcon() { return <IconBase><path d="M5 21c8 0 14-7 14-14V4h-3C9 4 5 8 5 15v6Z" /><path d="M5 21 19 7" /></IconBase>; }
function CheckIcon() { return <IconBase><path d="M20 6 9 17l-5-5" /></IconBase>; }
function CalendarIcon() { return <IconBase><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></IconBase>; }
function ArrowIcon() { return <IconBase><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></IconBase>; }

function WorldMap() {
  return (
    <svg viewBox="0 0 420 210" style={{ height: "100%", minHeight: "150px", width: "100%" }} aria-hidden="true">
      <path d="M24 74c45-28 82-10 124-6 43 4 69-30 112-15 40 14 67 4 124 18" fill="none" stroke="#b9dfdc" strokeDasharray="3 5" strokeWidth="3" />
      <path d="M34 140c53-24 88 10 129 4 45-7 70-32 109-18 42 15 77 10 113-12" fill="none" stroke="#b9dfdc" strokeDasharray="3 5" strokeWidth="3" />
      {[[95, 88], [180, 70], [252, 118], [312, 82], [350, 128]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="12" fill="#dff5f2" />
          <circle cx={x} cy={y} r="5" fill="#0f9a94" />
        </g>
      ))}
    </svg>
  );
}

function SupplyChainHeroVisual() {
  return (
    <div className="hero-visual" aria-label="Supply chain dashboard, warehouse, and truck visual">
      <div className="hero-node hero-node-left">
        <PeopleIcon />
        <span>Suppliers</span>
      </div>
      <div className="hero-node hero-node-mid">
        <BoxIcon />
        <span>Products</span>
      </div>
      <div className="hero-node hero-node-right-top">
        <WarehouseIcon />
        <span>Warehouses</span>
      </div>
      <div className="hero-node hero-node-right">
        <TruckIcon />
        <span>Shipments</span>
      </div>

      <div className="hero-dashboard">
        <div className="hero-dashboard-title">Supply Chain Overview</div>
        <div className="hero-mini-grid">
          <div className="hero-mini-card">
            <PeopleIcon />
            <div className="hero-line-chart" />
          </div>
          <div className="hero-mini-card">
            <div className="hero-ring">76%</div>
          </div>
          <div className="hero-mini-card">
            <div className="hero-bars">
              <span /><span /><span /><span /><span />
            </div>
          </div>
        </div>
        <WorldMap />
      </div>

      <div className="hero-warehouse">
        <div className="hero-roof" />
        <div className="hero-building">
          <span /><span /><span />
          <div className="hero-door" />
        </div>
      </div>

      <div className="hero-boxes">
        <span /><span /><span /><span /><span />
      </div>

      <div className="hero-truck">
        <div className="hero-trailer" />
        <div className="hero-cab" />
        <span className="wheel wheel-one" />
        <span className="wheel wheel-two" />
        <span className="wheel wheel-three" />
      </div>

      <style>{`
        .hero-visual {
          background:
            linear-gradient(180deg, rgba(255,255,255,.86), rgba(229,247,244,.76)),
            radial-gradient(circle at 70% 40%, rgba(15,154,148,.16), transparent 32%);
          border: 1px solid #d5ebe8;
          border-radius: 8px;
          min-height: 430px;
          overflow: hidden;
          position: relative;
        }
        .hero-visual::before {
          border: 1px dashed rgba(15,154,148,.32);
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          content: "";
          height: 170px;
          left: 22%;
          position: absolute;
          top: 72px;
          width: 60%;
        }
        .hero-dashboard {
          background: #fff;
          border: 8px solid #213946;
          border-radius: 8px;
          box-shadow: 0 20px 34px rgba(16,39,45,.16);
          left: 27%;
          padding: 14px;
          position: absolute;
          top: 36px;
          width: 46%;
          z-index: 3;
        }
        .hero-dashboard-title {
          color: #10272d;
          font-size: .84rem;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .hero-mini-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, 1fr);
        }
        .hero-mini-card {
          align-items: center;
          background: #f5fbfa;
          border: 1px solid #d5ebe8;
          border-radius: 8px;
          color: #0f9a94;
          display: flex;
          height: 74px;
          justify-content: center;
        }
        .hero-line-chart {
          border-bottom: 3px solid #0f9a94;
          border-radius: 50%;
          height: 34px;
          margin-left: 8px;
          transform: rotate(-10deg);
          width: 64px;
        }
        .hero-ring {
          align-items: center;
          border: 10px solid #dff5f2;
          border-right-color: #0f9a94;
          border-radius: 50%;
          color: #0f9a94;
          display: flex;
          font-size: .85rem;
          font-weight: 800;
          height: 58px;
          justify-content: center;
          width: 58px;
        }
        .hero-bars {
          align-items: end;
          display: flex;
          gap: 7px;
          height: 48px;
        }
        .hero-bars span {
          background: #9edbd6;
          border-radius: 4px 4px 0 0;
          display: block;
          width: 10px;
        }
        .hero-bars span:nth-child(1) { height: 24px; }
        .hero-bars span:nth-child(2) { height: 38px; }
        .hero-bars span:nth-child(3) { height: 28px; }
        .hero-bars span:nth-child(4) { height: 46px; }
        .hero-bars span:nth-child(5) { height: 34px; }
        .hero-dashboard svg {
          height: 90px !important;
          min-height: 90px !important;
          margin-top: 8px;
        }
        .hero-node {
          align-items: center;
          background: rgba(255,255,255,.86);
          border: 1px solid #b9dfdc;
          border-radius: 50%;
          color: #0f9a94;
          display: flex;
          flex-direction: column;
          font-size: .76rem;
          font-weight: 800;
          gap: 4px;
          height: 86px;
          justify-content: center;
          position: absolute;
          width: 86px;
          z-index: 4;
        }
        .hero-node-left { left: 18%; top: 32px; }
        .hero-node-mid { left: 18%; top: 156px; }
        .hero-node-right-top { right: 8%; top: 42px; }
        .hero-node-right { right: 7%; top: 170px; }
        .hero-warehouse {
          bottom: 62px;
          height: 150px;
          left: 51%;
          position: absolute;
          width: 250px;
          z-index: 5;
        }
        .hero-roof {
          border-bottom: 46px solid #0f9a94;
          border-left: 125px solid transparent;
          border-right: 125px solid transparent;
          filter: drop-shadow(0 10px 12px rgba(16,39,45,.14));
          height: 0;
          width: 0;
        }
        .hero-building {
          background: #edf7f5;
          border: 1px solid #b9dfdc;
          height: 104px;
          position: relative;
        }
        .hero-building > span {
          background: #5b8790;
          display: inline-block;
          height: 18px;
          margin: 22px 9px 0;
          width: 32px;
        }
        .hero-door {
          background: #234650;
          bottom: 0;
          height: 68px;
          left: 84px;
          position: absolute;
          width: 84px;
        }
        .hero-boxes {
          bottom: 52px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          left: 37%;
          position: absolute;
          width: 150px;
          z-index: 6;
        }
        .hero-boxes span {
          background: #c9955f;
          border: 1px solid #ab7846;
          display: block;
          height: 38px;
          width: 42px;
        }
        .hero-truck {
          bottom: 54px;
          height: 82px;
          position: absolute;
          right: 7%;
          width: 300px;
          z-index: 7;
        }
        .hero-trailer {
          background: #dfe8eb;
          border: 2px solid #a4b8bf;
          border-radius: 4px;
          height: 58px;
          position: absolute;
          right: 0;
          top: 8px;
          width: 210px;
        }
        .hero-cab {
          background: #0f9a94;
          border-radius: 12px 6px 6px 6px;
          height: 62px;
          left: 18px;
          position: absolute;
          top: 4px;
          width: 88px;
        }
        .wheel {
          background: #213946;
          border: 5px solid #6f858b;
          border-radius: 50%;
          bottom: 0;
          height: 30px;
          position: absolute;
          width: 30px;
        }
        .wheel-one { left: 48px; }
        .wheel-two { right: 56px; }
        .wheel-three { right: 118px; }
        @media (max-width: 720px) {
          .hero-visual {
            min-height: 360px;
          }
          .hero-dashboard {
            left: 9%;
            top: 26px;
            width: 72%;
          }
          .hero-node {
            display: none;
          }
          .hero-warehouse {
            left: 24%;
            transform: scale(.76);
          }
          .hero-truck {
            right: -28px;
            transform: scale(.72);
          }
          .hero-boxes {
            left: 12%;
          }
        }
      `}</style>
    </div>
  );
}
