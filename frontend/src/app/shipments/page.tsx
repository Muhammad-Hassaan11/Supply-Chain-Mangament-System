"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ClientShipmentsPage } from "@/components/client/ClientPortal";
import { useStoredAccountState } from "@/lib/useStoredAccountState";
import { useAuth } from "@/context/AuthContext";
import { portalPath } from "@/lib/portalRoutes";

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

export default function ShipmentsPage() {
  const { isAdmin } = useAuth();
  const { accountType, isHydrated } = useStoredAccountState();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [logs, setLogs] = useState<ShipmentLog[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const shipmentData = await api.get<Shipment[]>("/api/shipments/");
        setShipments(shipmentData);
        if (shipmentData[0]) {
          setSelectedShipment(shipmentData[0]);
        }
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load shipments.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function loadLogs() {
      if (!selectedShipment) return;
      try {
        const logData = await api.get<ShipmentLog[]>(`/api/shipments/${selectedShipment.shipment_id}/logs`);
        setLogs(logData);
      } catch {
        setLogs([]);
      }
    }

    loadLogs();
  }, [selectedShipment]);

  const activeDeliveries = useMemo(
    () =>
      shipments.slice(0, 5).map((shipment, index) => ({
        id: shipment.tracking_number || `SHIP-2025-0007${index}`,
        origin: index % 2 === 0 ? "Atlanta, GA" : "Memphis, TN",
        destination: index % 2 === 0 ? "Dallas, TX" : "Houston, TX",
        eta: `May ${19 + index}, 2025`,
        status: index === 2 ? "Out for Delivery" : "In Transit",
        driver: ["James Miller", "Sarah Johnson", "David Lee", "Michael Brown", "Lisa Martinez"][index],
        progress: [65, 40, 80, 55, 30][index],
      })),
    [shipments]
  );

  if (!isHydrated) {
    return <div className="glass-card">Loading logistics dashboard...</div>;
  }

  if (!isAdmin && accountType === "client") {
    return <ClientShipmentsPage />;
  }

  if (loading) {
    return <div className="glass-card">Loading logistics dashboard...</div>;
  }

  if (error) {
    return <div className="glass-card" style={{ color: "var(--color-danger)" }}>{error}</div>;
  }

  const selectedRoute = activeDeliveries[0];
  const deliveredToday = Math.min(shipments.length, Math.max(6, Math.floor(shipments.length / 2)));
  const inTransit = Math.max(1, shipments.length - deliveredToday);
  const onTimeRate = `${Math.max(92, 100 - logs.length)}%`;
  const routeRole = isAdmin ? "admin" : accountType;
  const shipmentLogsPath = isAdmin ? portalPath(routeRole, "Admin", "/shipments/logs") : accountType === "logistics" ? portalPath(routeRole, "Viewer", "/tracking-logs") : "/shipments/logs";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {isAdmin ? "Admin portal view for all shipment records and tracking activity." : "Welcome back. Here's an overview of your logistics operations."}
          </p>
        </div>
        <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
          <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
          Connected to SQL Server
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Assigned Shipments</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{shipments.length}</div>
          <div style={{ color: "var(--text-secondary)" }}>Total assigned</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Delivered Today</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{deliveredToday}</div>
          <div style={{ color: "var(--text-secondary)" }}>Deliveries completed</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>In Transit</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{inTransit}</div>
          <div style={{ color: "var(--text-secondary)" }}>Active shipments</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>On-Time Rate</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{onTimeRate}</div>
          <div style={{ color: "var(--text-secondary)" }}>Last 30 days</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.05fr 1fr" }} className="shipments-top-grid">
        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.45rem" }}>Active Deliveries</h2>
            <Link href={shipmentLogsPath} style={{ color: "var(--accent-indigo)", fontSize: "0.9rem", fontWeight: 700 }}>
              View all shipment logs -&gt;
            </Link>
          </div>
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {activeDeliveries.map((shipment) => (
                  <tr key={shipment.id} onClick={() => setSelectedShipment(shipments.find((item) => item.tracking_number === shipment.id) || null)} style={{ cursor: "pointer" }}>
                    <td style={{ color: "var(--accent-indigo)", fontWeight: 700 }}>{shipment.id}</td>
                    <td>{shipment.origin}</td>
                    <td>{shipment.destination}</td>
                    <td>{shipment.eta}</td>
                    <td>
                      <span className={`glass-badge ${shipment.status === "Out for Delivery" ? "glass-badge-success" : "glass-badge-info"}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td>{shipment.driver}</td>
                    <td>
                      <div style={{ alignItems: "center", display: "flex", gap: "10px", minWidth: "110px" }}>
                        <div style={{ background: "#e7f2f1", borderRadius: "999px", height: "8px", overflow: "hidden", width: "72px" }}>
                          <div style={{ background: "var(--accent-indigo)", height: "100%", width: `${shipment.progress}%` }} />
                        </div>
                        <span>{shipment.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.45rem" }}>Delivery Route Status</h2>
            <div style={{ color: "var(--accent-indigo)", fontSize: "0.9rem", fontWeight: 700 }}>View all routes →</div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ alignItems: "center", display: "flex", gap: "10px", marginBottom: "6px" }}>
              <strong style={{ fontSize: "1.1rem" }}>{selectedRoute.id}</strong>
              <span className="glass-badge glass-badge-info">In Transit</span>
            </div>
            <div style={{ color: "var(--text-secondary)" }}>{selectedRoute.origin} → {selectedRoute.destination}</div>
          </div>

          <div style={{ alignItems: "center", display: "grid", gap: "12px", gridTemplateColumns: "repeat(5, 1fr)", marginBottom: "18px", textAlign: "center" }}>
            {["Picked Up", "In Transit", "En Route", "Out for Delivery", "Delivered"].map((step, index) => (
              <div key={step}>
                <div style={{ alignItems: "center", background: index < 3 ? "#0f9a94" : "#eef3f4", borderRadius: "50%", color: index < 3 ? "#fff" : "var(--text-muted)", display: "flex", height: "34px", justifyContent: "center", margin: "0 auto 10px", width: "34px" }}>
                  {index < 3 ? "✓" : "○"}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{step}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(180deg, #f8fcfc, #eef7f6)", border: "1px solid var(--border-glass)", borderRadius: "8px", height: "128px", marginBottom: "16px", overflow: "hidden", padding: "20px", position: "relative" }}>
            <div style={{ background: "#cceee8", borderRadius: "999px", height: "4px", left: "34px", position: "absolute", right: "34px", top: "58px" }} />
            <svg viewBox="0 0 500 120" style={{ height: "100%", position: "absolute", width: "100%", inset: 0 }}>
              <path d="M40 70 C120 115, 170 35, 250 80 S380 35, 455 55" fill="none" stroke="#18a394" strokeWidth="4" />
            </svg>
            <div style={{ left: "32px", position: "absolute", top: "38px" }}>📍</div>
            <div style={{ left: "248px", position: "absolute", top: "66px" }}>🚚</div>
            <div style={{ right: "32px", position: "absolute", top: "28px" }}>📍</div>
          </div>
          <Link
            href={selectedShipment && isAdmin ? `/admin/shipments/${selectedShipment.shipment_id}` : selectedShipment ? `/shipments/${selectedShipment.shipment_id}` : shipmentLogsPath}
            style={{ color: "var(--accent-indigo)", fontSize: "0.92rem", fontWeight: 700 }}
          >
            View full tracking details -&gt;
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "0.85fr 0.95fr 1fr" }} className="shipments-bottom-grid">
        <div className="glass-card">
          <h2 style={{ fontSize: "1.45rem", marginBottom: "18px" }}>Fleet Utilization</h2>
          <div style={{ alignItems: "center", display: "flex", gap: "20px" }}>
            <div style={{ alignItems: "center", border: "12px solid #dff5f2", borderRadius: "50%", display: "flex", flexDirection: "column", height: "138px", justifyContent: "center", width: "138px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>78%</div>
              <div style={{ color: "var(--text-secondary)" }}>Utilized</div>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--accent-indigo)" }}>●</span><span>On the Road</span><strong>22</strong></div>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "#20b7b0" }}>●</span><span>Idle</span><strong>6</strong></div>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "#bfe9e2" }}>●</span><span>Maintenance</span><strong>2</strong></div>
              <div style={{ display: "flex", gap: "10px" }}><span style={{ color: "#b4c0c8" }}>●</span><span>Unavailable</span><strong>1</strong></div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: "1.45rem", marginBottom: "18px" }}>Fleet Summary</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Total Vehicles</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>31</div></div>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Under Maintenance</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>2</div></div>
            <div className="glass-card" style={{ background: "#f8fcfc", padding: "18px" }}><strong>Unavailable</strong><div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>1</div></div>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: "1.45rem", marginBottom: "18px" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { title: "Delivery completed", note: "Atlanta, GA → Birmingham, AL", time: "1h ago" },
              { title: "Shipment picked up", note: "Chicago, IL → Nashville, TN", time: "3h ago" },
              { title: "Location update", note: "En route via I-20 W, Shreveport, LA", time: "4h ago" },
              { title: "Vehicle maintenance scheduled", note: "May 20, 2025 at 09:00 AM", time: "6h ago" },
            ].map((item) => (
              <div key={item.title} style={{ alignItems: "flex-start", display: "grid", gap: "12px", gridTemplateColumns: "36px 1fr auto" }}>
                <div style={{ alignItems: "center", background: "#eefaf8", borderRadius: "50%", display: "flex", height: "36px", justifyContent: "center", width: "36px" }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{item.note}</div>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .shipments-top-grid,
          .shipments-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
