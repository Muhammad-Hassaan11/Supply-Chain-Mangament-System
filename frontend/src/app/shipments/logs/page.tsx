"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface ShipmentLogRow {
  log_seq_num: number;
  shipment_id: number;
  tracking_number: string;
  product_id: number;
  product_name: string;
  event_type: string;
  log_timestamp: string;
  warehouse_id: number;
  warehouse_name: string;
  status: "Info" | "In Transit" | "Update" | "Completed";
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

function statusClass(status: string) {
  if (status === "Completed") return "glass-badge glass-badge-success";
  if (status === "Update") return "glass-badge glass-badge-warning";
  if (status === "Info") return "glass-badge glass-badge-info";
  return "glass-badge glass-badge-info";
}

export default function ShipmentLogsPage() {
  const [logs, setLogs] = useState<ShipmentLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("All Events");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await api.get<ShipmentLogRow[]>("/api/shipments/logs/all");
      setLogs(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load shipment logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const eventTypes = useMemo(() => ["All Events", ...Array.from(new Set(logs.map((row) => row.event_type)))], [logs]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return logs.filter((row) => {
      const matchesEvent = eventType === "All Events" || row.event_type === eventType;
      const matchesSearch =
        !query ||
        [
          row.tracking_number,
          row.product_name,
          row.event_type,
          row.warehouse_name,
          row.status,
          String(row.shipment_id),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesEvent && matchesSearch;
    });
  }, [logs, search, eventType]);

  const todaysLogs = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter((row) => new Date(row.log_timestamp).toDateString() === today).length;
  }, [logs]);

  const inTransit = logs.filter((row) => row.status === "In Transit").length;
  const delivered = logs.filter((row) => row.status === "Completed").length;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Shipment Logs</h1>
          <p style={{ color: "var(--text-secondary)" }}>Home / Shipments / Shipment Logs</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "320px" }}>
            <input
              className="glass-input"
              placeholder="Search shipment, product, event..."
              style={{ paddingLeft: "38px" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span style={{ color: "var(--text-muted)", left: "12px", position: "absolute", top: "12px" }}>⌕</span>
          </div>
          <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
            <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
            Connected to SQL Server
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        {[
          ["Total Logs", logs.length.toLocaleString(), "All time logs"],
          ["Today's Logs", todaysLogs.toLocaleString(), "Current day"],
          ["In Transit Events", inTransit.toLocaleString(), "Active updates"],
          ["Delivered Events", delivered.toLocaleString(), "Completed"],
        ].map(([label, value, note]) => (
          <section className="glass-card" key={label} style={{ padding: "18px" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: ".84rem", fontWeight: 800 }}>{label}</div>
            <div style={{ color: "var(--accent-indigo)", fontSize: "1.8rem", fontWeight: 900, marginTop: "6px" }}>{value}</div>
            <div style={{ color: "var(--text-secondary)", marginTop: "4px" }}>{note}</div>
          </section>
        ))}
      </div>

      <section className="glass-card" style={{ padding: "18px" }}>
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "14px" }}>
          <select className="glass-input" value={eventType} onChange={(event) => setEventType(event.target.value)}>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button className="glass-btn glass-btn-primary" type="button">
            Filter
          </button>
          <button
            className="glass-btn glass-btn-secondary"
            type="button"
            onClick={() => {
              const rows = filteredLogs
                .map((row) => [row.log_seq_num, row.tracking_number, row.product_name, row.event_type, formatDate(row.log_timestamp), row.status].join(","))
                .join("\n");
              const blob = new Blob([`Log Seq,Shipment,Product,Event,Timestamp,Status\n${rows}\n`], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "shipment-logs.csv";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </button>
        </div>

        {error ? (
          <div style={{ color: "var(--color-danger)", padding: "18px" }}>
            {error} <button className="glass-btn glass-btn-secondary" onClick={load}>Retry</button>
          </div>
        ) : loading ? (
          <div style={{ color: "var(--text-secondary)", padding: "18px" }}>Loading shipment logs...</div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Log Seq No.</th>
                  <th>Shipment ID</th>
                  <th>Product</th>
                  <th>Event Type</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((row) => (
                  <tr key={`${row.shipment_id}-${row.log_seq_num}`}>
                    <td>{row.log_seq_num}</td>
                    <td>
                      <Link href={`/shipments/${row.shipment_id}`} style={{ color: "var(--accent-indigo)", fontWeight: 800 }}>
                        {row.tracking_number}
                      </Link>
                    </td>
                    <td>{row.product_name}</td>
                    <td>{row.event_type}</td>
                    <td>{formatDate(row.log_timestamp)}</td>
                    <td><span className={statusClass(row.status)}>{row.status}</span></td>
                  </tr>
                ))}
                {!filteredLogs.length ? (
                  <tr>
                    <td colSpan={6} style={{ color: "var(--text-secondary)", padding: "28px", textAlign: "center" }}>
                      No shipment logs matched your filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
