"use client";

import React from "react";
import { api } from "@/lib/api";
import { getStoredAccountType } from "@/lib/api";
import { ClientReportsPage } from "@/components/client/ClientPortal";

type ReportId =
  | "inventory-health"
  | "shipment-performance"
  | "supplier-scorecard"
  | "product-cost-analysis"
  | "warehouse-utilisation"
  | "full-traceability";

interface ReportDef {
  id: ReportId;
  title: string;
  description: string;
  accent: string;
  sql: string;
}

interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
}

interface DashboardStats {
  total_products?: number;
  low_stock_items?: number;
  total_shipments?: number;
  total_suppliers?: number;
  total_warehouses?: number;
}

const reportCards: ReportDef[] = [
  {
    id: "inventory-health",
    title: "Inventory health report",
    description: "Full stock levels, low alerts, and warehouse capacity ratios.",
    accent: "#0f9a94",
    sql: `
SELECT
  w.warehouse_name,
  p.product_name,
  i.location,
  i.quantity,
  CASE WHEN i.quantity < 10 THEN 'Low' ELSE 'OK' END AS stock_status
FROM Inventory i
JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
JOIN Product p ON i.product_id = p.product_id
ORDER BY i.quantity ASC, w.warehouse_name ASC;
`.trim(),
  },
  {
    id: "shipment-performance",
    title: "Shipment performance",
    description: "Delivery rates, transit times, and pending shipment analysis.",
    accent: "#10a66a",
    sql: `
SELECT
  s.shipment_id,
  s.tracking_number,
  MIN(sl.log_timestamp) AS start_time,
  MAX(sl.log_timestamp) AS last_event_time,
  DATEDIFF(hour, MIN(sl.log_timestamp), MAX(sl.log_timestamp)) AS hours_in_transit,
  SUM(CASE WHEN sl.event_type = 'Delivered' THEN 1 ELSE 0 END) AS delivered_events
FROM Shipments s
JOIN Shipment_logs sl ON s.shipment_id = sl.shipment_id
GROUP BY s.shipment_id, s.tracking_number
ORDER BY last_event_time DESC;
`.trim(),
  },
  {
    id: "supplier-scorecard",
    title: "Supplier scorecard",
    description: "Ratings, lead times, and compliance across all vendors.",
    accent: "#0284c7",
    sql: `
SELECT
  s.supplier_id,
  s.contact_email,
  s.rating,
  COUNT(p.product_id) AS total_products,
  CAST(AVG(CAST(p.unit_price AS float)) AS decimal(10,2)) AS avg_unit_price,
  CAST(AVG(CAST(p.lead_time_day AS float)) AS decimal(10,1)) AS avg_lead_time_days
FROM Suppliers s
LEFT JOIN Product p ON s.supplier_id = p.supplier_id
GROUP BY s.supplier_id, s.contact_email, s.rating
ORDER BY s.rating DESC, total_products DESC;
`.trim(),
  },
  {
    id: "product-cost-analysis",
    title: "Product cost analysis",
    description: "Unit price trends and high-value product breakdown.",
    accent: "#d97706",
    sql: `
SELECT
  p.product_id,
  p.product_name,
  p.unit_price,
  p.lead_time_day,
  CASE
    WHEN p.unit_price >= 500 THEN 'High'
    WHEN p.unit_price >= 100 THEN 'Medium'
    ELSE 'Low'
  END AS cost_band
FROM Product p
ORDER BY p.unit_price DESC;
`.trim(),
  },
  {
    id: "warehouse-utilisation",
    title: "Warehouse utilisation",
    description: "Bin usage, capacity fill rates, and overflow alerts.",
    accent: "#14b8a6",
    sql: `
SELECT
  w.warehouse_id,
  w.warehouse_name,
  w.capacity,
  COALESCE(SUM(i.quantity), 0) AS total_stock,
  CAST((COALESCE(SUM(i.quantity), 0) * 100.0) / NULLIF(w.capacity, 0) AS decimal(10,1)) AS utilisation_pct
FROM Warehouse w
LEFT JOIN Inventory i ON w.warehouse_id = i.warehouse_id
GROUP BY w.warehouse_id, w.warehouse_name, w.capacity
ORDER BY utilisation_pct DESC;
`.trim(),
  },
  {
    id: "full-traceability",
    title: "Full chain traceability",
    description: "End-to-end trace from supplier to delivery per product.",
    accent: "#8b5cf6",
    sql: `
SELECT
  sl.log_timestamp,
  sl.event_type,
  p.product_name,
  w.warehouse_name,
  s.tracking_number
FROM Shipment_logs sl
JOIN Shipments s ON sl.shipment_id = s.shipment_id
JOIN Warehouse w ON s.warehouse_id = w.warehouse_id
JOIN Product p ON sl.product_id = p.product_id
ORDER BY sl.log_timestamp DESC;
`.trim(),
  },
];

function toCsv(columns: string[], rows: Record<string, unknown>[]) {
  const escape = (value: unknown) => {
    const raw = value === null || value === undefined ? "" : String(value);
    const needsQuotes = /[",\n]/.test(raw);
    const cleaned = raw.replace(/"/g, '""');
    return needsQuotes ? `"${cleaned}"` : cleaned;
  };

  const header = columns.map(escape).join(",");
  const body = rows.map((row) => columns.map((c) => escape(row[c])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

export default function ReportsPage() {
  const [accountType] = React.useState<string | null>(() => getStoredAccountType());
  const [active, setActive] = React.useState<ReportDef | null>(null);
  const [result, setResult] = React.useState<QueryResult | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [resultSearch, setResultSearch] = React.useState("");
  const [showSql, setShowSql] = React.useState(false);
  const [generatedAt, setGeneratedAt] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api.get<DashboardStats>("/api/analytics/dashboard").then(setStats).catch(() => setStats(null));
  }, []);

  const runReport = async (report: ReportDef) => {
    setActive(report);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<QueryResult>("/api/queries/execute", { sql: report.sql });
      setResult(res);
      setGeneratedAt(new Date().toLocaleString());
      setResultSearch("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = React.useMemo(() => {
    if (!result) return [];
    const query = resultSearch.trim().toLowerCase();
    if (!query) return result.rows;
    return result.rows.filter((row) => result.columns.some((column) => String(row[column] ?? "").toLowerCase().includes(query)));
  }, [result, resultSearch]);

  const exportCsv = () => {
    if (!active || !result) return;
    const csv = toCsv(result.columns, filteredRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${active.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    if (!active || !result) return;
    const blob = new Blob([JSON.stringify({ report: active.title, generated_at: generatedAt, rows: filteredRows }, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${active.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (accountType === "client") {
    return <ClientReportsPage />;
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)", fontSize: "2.05rem", marginBottom: "6px" }}>
            Reports
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Generate and export analytical reports from live data.
          </p>
        </div>
        <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
          <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
          SQL Server connected
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {[
          ["Products", stats?.total_products ?? "-"],
          ["Low Stock", stats?.low_stock_items ?? "-"],
          ["Shipments", stats?.total_shipments ?? "-"],
          ["Suppliers", stats?.total_suppliers ?? "-"],
          ["Warehouses", stats?.total_warehouses ?? "-"],
        ].map(([label, value]) => (
          <div key={label} className="glass-card" style={{ padding: "16px" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: ".82rem", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
            <div style={{ color: "var(--accent-indigo)", fontSize: "1.8rem", fontWeight: 900, marginTop: "6px" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {reportCards.map((card) => (
          <section key={card.id} className="glass-card glass-card-hover" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${card.accent}14`, border: `1px solid ${card.accent}2a` }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{card.title}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".9rem", marginTop: "4px" }}>{card.description}</div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <button className="glass-btn glass-btn-secondary" onClick={() => runReport(card)} disabled={loading}>
              {loading && active?.id === card.id ? "Generating..." : "Generate report"}
            </button>
          </section>
        ))}
      </div>

      {active ? (
        <section className="glass-card" style={{ padding: "20px" }}>
          <div style={{ alignItems: "start", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem" }}>{active.title}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: ".9rem", marginTop: "4px" }}>
                {result ? `${result.row_count} rows generated.` : "Run the report to see live output from SQL Server."}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button className="glass-btn glass-btn-secondary" onClick={() => runReport(active)} disabled={loading}>
                Refresh
              </button>
              <button className="glass-btn glass-btn-secondary" onClick={() => setShowSql((value) => !value)}>
                {showSql ? "Hide SQL" : "Show SQL"}
              </button>
              <button className={`glass-btn glass-btn-secondary ${!result ? "glass-btn-disabled" : ""}`} onClick={exportJson} disabled={!result}>
                Export JSON
              </button>
              <button className={`glass-btn glass-btn-primary ${!result ? "glass-btn-disabled" : ""}`} onClick={exportCsv} disabled={!result}>
                Export CSV
              </button>
            </div>
          </div>

          {error ? (
            <div className="glass-card" style={{ borderColor: "#fecaca", background: "#fef2f2", color: "#7f1d1d", marginTop: "14px", padding: "14px" }}>
              {error}
            </div>
          ) : null}

          {showSql ? (
            <pre style={{ background: "#0f252b", borderRadius: "10px", color: "#dff5f2", marginTop: "14px", overflowX: "auto", padding: "14px" }}>
              {active.sql}
            </pre>
          ) : null}

          {result ? (
            <>
            <div style={{ alignItems: "center", display: "flex", gap: "12px", justifyContent: "space-between", marginTop: "14px", flexWrap: "wrap" }}>
              <div className="glass-badge glass-badge-info">
                Showing {filteredRows.length} of {result.row_count} rows{generatedAt ? ` - ${generatedAt}` : ""}
              </div>
              <input className="glass-input" value={resultSearch} onChange={(e) => setResultSearch(e.target.value)} placeholder="Search report rows..." style={{ maxWidth: 320 }} />
            </div>
            <div style={{ marginTop: "14px" }} className="glass-table-container">
              <table className="glass-table" style={{ minWidth: "880px" }}>
                <thead>
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.slice(0, 100).map((row, idx) => (
                    <tr key={idx}>
                      {result.columns.map((c) => (
                        <td key={c}>{String(row[c] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div style={{ marginTop: "14px", color: "var(--text-secondary)" }}>
              {loading ? "Running SQL report..." : "Select a report above to generate output."}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
