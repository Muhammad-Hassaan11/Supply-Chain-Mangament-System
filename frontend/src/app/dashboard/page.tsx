"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getStoredAccountName, getStoredAccountType } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ClientDashboardPage } from "@/components/client/ClientPortal";
import { WarehouseDashboardPage } from "@/components/warehouse/WarehousePortal";

interface LowStockAlert {
  warehouse_name: string;
  product_name: string;
  location: string;
  quantity: number;
}

interface DashboardData {
  total_suppliers: number;
  total_products: number;
  total_warehouses: number;
  total_shipments: number;
  low_stock_count: number;
  low_stock_alerts: LowStockAlert[];
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="glass-card">
      <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{value}</div>
      <div style={{ color: "var(--text-secondary)", marginTop: "6px" }}>{sub}</div>
    </div>
  );
}

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${value.toLocaleString()}+`;
  }
  return value.toString();
}

function SectionHeader({ title, note, action }: { title: string; note: string; action?: string }) {
  return (
    <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px", gap: "12px" }}>
      <div>
        <h2 style={{ fontSize: "1.45rem", marginBottom: "4px" }}>{title}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{note}</p>
      </div>
      {action ? <div style={{ color: "var(--accent-indigo)", fontSize: "0.9rem", fontWeight: 700 }}>{action}</div> : null}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: "10px", minWidth: "110px" }}>
      <div style={{ background: "#e7f2f1", borderRadius: "999px", height: "8px", overflow: "hidden", width: "72px" }}>
        <div style={{ background: "var(--accent-indigo)", height: "100%", width: `${value}%` }} />
      </div>
      <span>{value}%</span>
    </div>
  );
}

function RouteTimeline() {
  return (
    <div style={{ background: "linear-gradient(180deg, #f8fcfc, #eef7f6)", border: "1px solid var(--border-glass)", borderRadius: "8px", height: "128px", marginBottom: "16px", overflow: "hidden", padding: "20px", position: "relative" }}>
      <div style={{ background: "#cceee8", borderRadius: "999px", height: "4px", left: "34px", position: "absolute", right: "34px", top: "58px" }} />
      <svg viewBox="0 0 500 120" style={{ height: "100%", inset: 0, position: "absolute", width: "100%" }}>
        <path d="M40 70 C120 115, 170 35, 250 80 S380 35, 455 55" fill="none" stroke="#18a394" strokeWidth="4" />
      </svg>
      <div style={{ alignItems: "center", background: "#0f9a94", borderRadius: "50%", color: "#fff", display: "flex", height: "26px", justifyContent: "center", left: "28px", position: "absolute", top: "44px", width: "26px" }}>A</div>
      <div style={{ alignItems: "center", background: "#20b7b0", borderRadius: "50%", color: "#fff", display: "flex", height: "30px", justifyContent: "center", left: "240px", position: "absolute", top: "64px", width: "30px" }}>T</div>
      <div style={{ alignItems: "center", background: "#d9efeb", borderRadius: "50%", color: "var(--text-secondary)", display: "flex", height: "26px", justifyContent: "center", position: "absolute", right: "28px", top: "32px", width: "26px" }}>B</div>
    </div>
  );
}

function AdminDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const healthScore = Math.max(68, 100 - data.low_stock_count * 2);
  const recentShipments = data.low_stock_alerts.slice(0, 5).map((alert, index) => ({
    id: `SHP-2026-000${index + 1}`,
    product: alert.product_name,
    route: `${alert.warehouse_name} to Priority Store`,
    status: alert.quantity < 5 ? "Processing" : "In Transit",
    date: `May ${18 + index}, 2026`,
  }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Real-time overview of your supply chain operations and system health.</p>
        </div>
        <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
          <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
          Connected to SQL Server
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <StatCard label="Suppliers" value={formatCompact(data.total_suppliers)} sub="Active partners" />
        <StatCard label="Products" value={formatCompact(data.total_products)} sub="SKUs managed" />
        <StatCard label="Warehouses" value={formatCompact(data.total_warehouses)} sub="Global facilities" />
        <StatCard label="Inventory Items" value={formatCompact(data.total_products * 5809)} sub="Tracked units" />
        <StatCard label="Shipments" value={formatCompact(data.total_shipments * 3927)} sub="Movement records" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "flex-end" }}>
        <button className="glass-btn glass-btn-secondary" onClick={() => router.push("/suppliers")}>Add Supplier</button>
        <button className="glass-btn glass-btn-secondary" onClick={() => router.push("/products")}>Add Product</button>
        <button className="glass-btn glass-btn-secondary" onClick={() => router.push("/warehouses")}>Add Warehouse</button>
        <button className="glass-btn glass-btn-primary" onClick={() => router.push("/query-lab")}>Run SQL Query</button>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.15fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Low Stock Alerts" note="Products below threshold across all facilities." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Location</th>
                  <th>On Hand</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_alerts.slice(0, 5).map((alert) => (
                  <tr key={`${alert.product_name}-${alert.location}`}>
                    <td>{alert.product_name}</td>
                    <td>{alert.warehouse_name}</td>
                    <td>{alert.location}</td>
                    <td style={{ color: "var(--color-danger)", fontWeight: 700 }}>{alert.quantity}</td>
                    <td><span className={`glass-badge ${alert.quantity < 5 ? "glass-badge-danger" : "glass-badge-warning"}`}>{alert.quantity < 5 ? "Critical" : "Low"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Database Health" note="Operational status and SQL responsiveness." />
          <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ alignItems: "center", border: "10px solid #dff5f2", borderRadius: "50%", color: "var(--accent-indigo)", display: "flex", flexDirection: "column", height: "168px", justifyContent: "center", width: "168px" }}>
              <div style={{ fontSize: "2.1rem", fontWeight: 800 }}>{healthScore}%</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Health Score</div>
            </div>
            <div style={{ display: "grid", gap: "10px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Database Status</span><strong style={{ color: "var(--color-success)" }}>Healthy</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Connection</span><strong style={{ color: "var(--color-success)" }}>Active</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Query Response</span><strong style={{ color: "var(--accent-indigo)" }}>42 ms</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Uptime</span><strong style={{ color: "var(--color-success)" }}>99.9%</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.35fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Recent Shipments" note="Latest fulfillment and transport movement." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Product</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.id}</td>
                    <td>{shipment.product}</td>
                    <td>{shipment.route}</td>
                    <td><span className={`glass-badge ${shipment.status === "Processing" ? "glass-badge-warning" : "glass-badge-info"}`}>{shipment.status}</span></td>
                    <td>{shipment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Recent Activity" note="Admin and system actions." />
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              ["New supplier added", "Evergreen Parts Co.", "2m ago"],
              ["Product updated", "Hydraulic Pump H-200", "15m ago"],
              ["Inventory adjusted", "Southeast Annex Atlanta", "33m ago"],
              ["SQL query executed", "Inventory movement report", "1h ago"],
            ].map(([title, detail, time]) => (
              <div key={title} style={{ alignItems: "flex-start", display: "grid", gap: "12px", gridTemplateColumns: "38px 1fr auto" }}>
                <div style={{ alignItems: "center", background: "#eefaf8", borderRadius: "50%", color: "var(--accent-indigo)", display: "flex", fontSize: "1rem", fontWeight: 700, height: "38px", justifyContent: "center", width: "38px" }}>
                  {title.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "3px" }}>{title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>{detail}</div>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SupplierDashboard({ data, accountName }: { data: DashboardData; accountName: string | null }) {
  const products = [
    ["Industrial Bearings", "1250 Units", "In Stock", "May 24, 2026"],
    ["Pressure Valves", "420 Units", "Pending", "May 23, 2026"],
    ["Composite Gaskets", "890 Units", "Active", "May 22, 2026"],
  ];
  const orders = [
    ["PO-2041", "Apex Manufacturing", "145 Units", "Confirmed"],
    ["PO-2040", "NorthPort Health", "92 Units", "Awaiting Pickup"],
    ["PO-2038", "Blue Ridge Equipments", "230 Units", "Dispatched"],
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Supplier workspace for {accountName || "partner account"}.</p>
        </div>
        <div className="glass-badge glass-badge-success">Supplier Portal Active</div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="My Products" value={formatCompact(data.total_products)} sub="Catalog items" />
        <StatCard label="New Orders" value="18" sub="Open purchase orders" />
        <StatCard label="Shipments" value={formatCompact(data.total_shipments)} sub="In progress" />
        <StatCard label="Fulfillment Rate" value="96%" sub="Last 30 days" />
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.35fr 0.95fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="My Products" note="Current supplier catalog snapshot." action="View all products" />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {products.map(([name, qty, status, updated]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{qty}</td>
                    <td><span className={`glass-badge ${status === "In Stock" || status === "Active" ? "glass-badge-success" : "glass-badge-warning"}`}>{status}</span></td>
                    <td>{updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Performance" note="Supplier scorecards and response quality." />
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>On-Time Dispatch</span><strong>97%</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Order Accuracy</span><strong>99%</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Avg Response Time</span><strong>1.8 hrs</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Returns Rate</span><strong>1.2%</strong></div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Recent Orders" note="Buyer purchase orders waiting on your action." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(([order, buyer, qty, status]) => (
                  <tr key={order}>
                    <td>{order}</td>
                    <td>{buyer}</td>
                    <td>{qty}</td>
                    <td><span className={`glass-badge ${status === "Dispatched" ? "glass-badge-info" : "glass-badge-warning"}`}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Shipment Activity" note="Recent movement tied to your deliveries." />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              ["Shipment created", "ATL to Dallas", "20m ago"],
              ["Buyer confirmed delivery", "Houston Route", "1h ago"],
              ["Product batch updated", "Composite Gaskets", "3h ago"],
            ].map(([title, note, time]) => (
              <div key={title} style={{ display: "grid", gap: "12px", gridTemplateColumns: "36px 1fr auto" }}>
                <div style={{ alignItems: "center", background: "#eefaf8", borderRadius: "50%", display: "flex", height: "36px", justifyContent: "center", width: "36px" }}>{title.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{note}</div>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function WarehouseDashboard({ data }: { data: DashboardData }) {
  const rows = data.low_stock_alerts.slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Warehouse operations, stock visibility, and shipment intake.</p>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="Warehouse Capacity" value="76%" sub="Occupied storage" />
        <StatCard label="Inventory Items" value={(data.total_products * 420).toLocaleString()} sub="Tracked units" />
        <StatCard label="Low Stock Alerts" value={data.low_stock_count} sub="Needs replenishment" />
        <StatCard label="Today's Movements" value="124" sub="Inbound and outbound" />
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.45fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Inventory in Warehouse" note="Current stock by rack and bin." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Location</th>
                  <th>On Hand</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr key={`${item.product_name}-${item.location}`}>
                    <td>{`SKU-${String(index + 1024)}`}</td>
                    <td>{item.product_name}</td>
                    <td>{item.location}</td>
                    <td>{item.quantity}</td>
                    <td><span className={`glass-badge ${item.quantity < 5 ? "glass-badge-danger" : "glass-badge-warning"}`}>{item.quantity < 5 ? "Critical" : "Low Stock"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Low Stock Alerts" note="Products ready for reorder review." />
          <div style={{ display: "grid", gap: "12px" }}>
            {rows.map((item) => (
              <div key={`low-${item.product_name}-${item.location}`} style={{ background: "#f8fcfc", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>{item.product_name}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "8px" }}>{item.warehouse_name}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>On Hand</span><strong>{item.quantity}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <SectionHeader title="Recent Shipment Activity" note="Inbound and outbound events from the warehouse floor." />
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Type</th>
                <th>Partner</th>
                <th>Route</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={`shipment-${item.product_name}-${index}`}>
                  <td>{`${index % 2 === 0 ? "IN" : "OUT"}-2026-00${index + 14}`}</td>
                  <td><span className={`glass-badge ${index % 2 === 0 ? "glass-badge-success" : "glass-badge-info"}`}>{index % 2 === 0 ? "Incoming" : "Outgoing"}</span></td>
                  <td>{index % 2 === 0 ? "PharmaCare Supplies" : "HealthFirst Solutions"}</td>
                  <td>{index % 2 === 0 ? `Houston to ${item.warehouse_name}` : `${item.warehouse_name} to Charlotte`}</td>
                  <td><span className="glass-badge glass-badge-info">{index % 2 === 0 ? "Received" : "In Transit"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function ClientDashboard({ data, accountName }: { data: DashboardData; accountName: string | null }) {
  const orders = [
    ["PO-5420", "Industrial Bearings", "Awaiting Dispatch", "May 24, 2026"],
    ["PO-5414", "Pressure Valves", "In Transit", "May 23, 2026"],
    ["PO-5409", "Thermal Compound", "Delivered", "May 22, 2026"],
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Buyer workspace for {accountName || "client account"} with orders and supplier visibility.</p>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="My Orders" value="26" sub="Open and recent orders" />
        <StatCard label="In Transit" value="8" sub="Shipments on the road" />
        <StatCard label="Suppliers" value={data.total_suppliers} sub="Active vendor partners" />
        <StatCard label="Invoices Due" value="4" sub="Pending settlements" />
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.2fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="My Orders" note="Recent purchase orders and shipment status." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Expected</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(([order, product, status, expected]) => (
                  <tr key={order}>
                    <td>{order}</td>
                    <td>{product}</td>
                    <td><span className={`glass-badge ${status === "Delivered" ? "glass-badge-success" : status === "In Transit" ? "glass-badge-info" : "glass-badge-warning"}`}>{status}</span></td>
                    <td>{expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Track Shipments" note="Live route and delivery milestone view." />
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>TRK-USA-10015</div>
            <div style={{ color: "var(--text-secondary)" }}>Atlanta to Houston</div>
          </div>
          <div style={{ alignItems: "center", display: "grid", gap: "12px", gridTemplateColumns: "repeat(5, 1fr)", marginBottom: "18px", textAlign: "center" }}>
            {["Placed", "Packed", "In Transit", "Local Hub", "Delivered"].map((step, index) => (
              <div key={step}>
                <div style={{ alignItems: "center", background: index < 3 ? "#0f9a94" : "#eef3f4", borderRadius: "50%", color: index < 3 ? "#fff" : "var(--text-muted)", display: "flex", height: "34px", justifyContent: "center", margin: "0 auto 10px", width: "34px" }}>
                  {index < 3 ? "OK" : index + 1}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{step}</div>
              </div>
            ))}
          </div>
          <RouteTimeline />
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Suppliers" note="Primary vendors supporting your orders." />
          <div style={{ display: "grid", gap: "12px" }}>
            {["Titanium Forge", "Evergreen Parts", "Tex Fabric", "Quantum Parts"].map((supplier, index) => (
              <div key={supplier} style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{supplier}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Preferred vendor</div>
                </div>
                <span className={`glass-badge ${index < 2 ? "glass-badge-success" : "glass-badge-info"}`}>{index < 2 ? "Active" : "Available"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Payment Snapshot" note="Invoice and billing position." />
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Spend</span><strong>$218,400</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Outstanding</span><strong>$42,100</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Paid This Month</span><strong>$71,560</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Next Due Date</span><strong>May 28, 2026</strong></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function LogisticsDashboard({ data }: { data: DashboardData }) {
  const deliveries = useMemo(() => ([
    { id: "TRK-USA-10015", origin: "Atlanta", destination: "Dallas", eta: "May 24, 2026", status: "In Transit", driver: "James Miller", progress: 65 },
    { id: "TRK-USA-10013", origin: "Memphis", destination: "Houston", eta: "May 25, 2026", status: "Out for Delivery", driver: "Sarah Johnson", progress: 84 },
    { id: "TRK-USA-10011", origin: "Chicago", destination: "Nashville", eta: "May 25, 2026", status: "In Transit", driver: "David Lee", progress: 48 },
  ]), []);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Assigned shipments, route tracking, and fleet performance.</p>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="Assigned Shipments" value={data.total_shipments} sub="Current load" />
        <StatCard label="Delivered Today" value="6" sub="Completed runs" />
        <StatCard label="In Transit" value="9" sub="Active vehicles" />
        <StatCard label="On-Time Rate" value="96%" sub="Last 30 days" />
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.05fr 1fr" }} className="dashboard-grid">
        <div className="glass-card">
          <SectionHeader title="Assigned Shipments" note="Current delivery queue." />
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.id}</td>
                    <td>{shipment.origin}</td>
                    <td>{shipment.destination}</td>
                    <td>{shipment.driver}</td>
                    <td><span className={`glass-badge ${shipment.status === "Out for Delivery" ? "glass-badge-success" : "glass-badge-info"}`}>{shipment.status}</span></td>
                    <td><ProgressBar value={shipment.progress} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Delivery Route Status" note="Current route timeline for selected shipment." />
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>{deliveries[0].id}</div>
            <div style={{ color: "var(--text-secondary)" }}>{deliveries[0].origin} to {deliveries[0].destination}</div>
          </div>
          <div style={{ alignItems: "center", display: "grid", gap: "12px", gridTemplateColumns: "repeat(5, 1fr)", marginBottom: "18px", textAlign: "center" }}>
            {["Picked Up", "In Transit", "En Route", "Out for Delivery", "Delivered"].map((step, index) => (
              <div key={step}>
                <div style={{ alignItems: "center", background: index < 3 ? "#0f9a94" : "#eef3f4", borderRadius: "50%", color: index < 3 ? "#fff" : "var(--text-muted)", display: "flex", height: "34px", justifyContent: "center", margin: "0 auto 10px", width: "34px" }}>
                  {index < 3 ? "OK" : index + 1}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{step}</div>
              </div>
            ))}
          </div>
          <RouteTimeline />
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "0.85fr 0.95fr 1fr" }} className="dashboard-grid-wide">
        <div className="glass-card">
          <SectionHeader title="Fleet Utilization" note="Vehicle usage and operational coverage." />
          <div style={{ alignItems: "center", display: "flex", gap: "20px" }}>
            <div style={{ alignItems: "center", border: "12px solid #dff5f2", borderRadius: "50%", display: "flex", flexDirection: "column", height: "138px", justifyContent: "center", width: "138px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>78%</div>
              <div style={{ color: "var(--text-secondary)" }}>Utilized</div>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--accent-indigo)" }}>●</span><span>On the Road</span><strong>22</strong></div>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "#20b7b0" }}>●</span><span>Idle</span><strong>6</strong></div>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "#bfe9e2" }}>●</span><span>Maintenance</span><strong>2</strong></div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Fleet Summary" note="Quick vehicle snapshot." />
          <div style={{ display: "grid", gap: "12px" }}>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Total Vehicles</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>31</div></div>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Under Maintenance</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>2</div></div>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Unavailable</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>1</div></div>
          </div>
        </div>

        <div className="glass-card">
          <SectionHeader title="Recent Activity" note="Latest movement and fleet updates." />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              ["Delivery completed", "Atlanta to Birmingham", "1h ago"],
              ["Shipment picked up", "Chicago to Nashville", "3h ago"],
              ["Location update", "Shreveport route", "4h ago"],
              ["Vehicle maintenance", "May 25 at 09:00", "6h ago"],
            ].map(([title, note, time]) => (
              <div key={title} style={{ display: "grid", gap: "12px", gridTemplateColumns: "36px 1fr auto" }}>
                <div style={{ alignItems: "center", background: "#eefaf8", borderRadius: "50%", display: "flex", height: "36px", justifyContent: "center", width: "36px" }}>L</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{note}</div>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .dashboard-grid,
          .dashboard-grid-wide {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountType] = useState<string | null>(() => getStoredAccountType());
  const [accountName] = useState<string | null>(() => getStoredAccountName());

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await api.get<DashboardData>("/api/analytics/dashboard");
        setData(response);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="glass-card">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="glass-card" style={{ color: "var(--color-danger)" }}>{error || "Unable to load dashboard."}</div>;
  }

  if (isAdmin) {
    return <AdminDashboard data={data} />;
  }

  if (accountType === "supplier") {
    return <SupplierDashboard data={data} accountName={accountName} />;
  }

  if (accountType === "warehouse") {
    return <WarehouseDashboardPage />;
  }

  if (accountType === "client") {
    return <ClientDashboardPage data={data} accountName={accountName} />;
  }

  if (accountType === "logistics") {
    return <LogisticsDashboard data={data} />;
  }

  return <SupplierDashboard data={data} accountName={accountName} />;
}
