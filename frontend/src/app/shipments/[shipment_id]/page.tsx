"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

interface Shipment {
  shipment_id: number;
  shipment_date: string;
  warehouse_id: number;
  tracking_number: string;
  warehouse_name?: string;
}

interface ShipmentLog {
  shipment_id: number;
  log_seq_num: number;
  log_timestamp: string;
  event_type: string;
  product_id: number;
  product_name?: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShipmentDetailPage() {
  const params = useParams<{ shipment_id: string }>();
  const shipmentId = Number(params.shipment_id);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [logs, setLogs] = useState<ShipmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!shipmentId) return;
      setLoading(true);
      setError(null);
      try {
        const [shipmentData, logData] = await Promise.all([
          api.get<Shipment>(`/api/shipments/${shipmentId}`),
          api.get<ShipmentLog[]>(`/api/shipments/${shipmentId}/logs`),
        ]);
        setShipment(shipmentData);
        setLogs(logData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load shipment details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shipmentId]);

  if (loading) {
    return <div className="glass-card">Loading shipment details...</div>;
  }

  if (error || !shipment) {
    return <div className="glass-card" style={{ color: "var(--color-danger)" }}>{error || "Shipment not found."}</div>;
  }

  const productName = logs[0]?.product_name || "Linked Product";
  const currentStatus = logs.some((log) => log.event_type.toLowerCase().includes("deliver")) ? "Delivered" : "In Transit";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Shipment Details</h1>
          <p style={{ color: "var(--text-secondary)" }}>Home / Shipments / {shipment.tracking_number}</p>
        </div>
        <Link className="glass-btn glass-btn-secondary" href="/shipments/logs">
          Back to Shipment Logs
        </Link>
      </div>

      <section className="glass-card">
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>From Warehouse</th>
                <th>Ship Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: "var(--accent-indigo)", fontWeight: 800 }}>{shipment.tracking_number}</td>
                <td>{productName}</td>
                <td>1 Unit</td>
                <td>{shipment.warehouse_name || `Warehouse ${shipment.warehouse_id}`}</td>
                <td>{formatDate(shipment.shipment_date)}</td>
                <td><span className="glass-badge glass-badge-info">{currentStatus}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-card">
        <h2 style={{ fontSize: "1.35rem", marginBottom: "18px" }}>Shipment Timeline</h2>
        <div style={{ display: "grid", gap: "0" }}>
          {logs.map((log, index) => (
            <div key={`${log.shipment_id}-${log.log_seq_num}`} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: "12px", minHeight: "78px" }}>
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <span style={{ width: 18, height: 18, borderRadius: "999px", background: "var(--accent-indigo)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, zIndex: 1 }}>✓</span>
                {index < logs.length - 1 ? <span style={{ position: "absolute", top: 18, bottom: 0, width: 2, background: "var(--border-glass)" }} /> : null}
              </div>
              <div>
                <div style={{ fontWeight: 900 }}>{log.event_type}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".9rem", marginTop: "4px" }}>
                  {log.product_name || productName} update recorded in Shipment_logs.
                </div>
              </div>
              <div style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: ".86rem" }}>
                {formatDate(log.log_timestamp)}
                <div style={{ marginTop: "5px" }}>Seq #{log.log_seq_num}</div>
              </div>
            </div>
          ))}
          {!logs.length ? (
            <div style={{ color: "var(--text-secondary)", padding: "18px" }}>No logs have been recorded for this shipment.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

