"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
  capacity: number;
  product_id: number;
}

interface Shipment {
  shipment_id: number;
  shipment_date: string;
  warehouse_id: number;
  tracking_number: string;
}

export default function CreateShipmentPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [shipmentDate, setShipmentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [trackingNumber, setTrackingNumber] = useState(() => `SHP-${Date.now().toString().slice(-6)}`);
  const [created, setCreated] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Warehouse[]>("/api/warehouses/")
      .then((rows) => {
        setWarehouses(rows);
        if (rows[0]) setWarehouseId(String(rows[0].warehouse_id));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load warehouses."));
  }, []);

  const selectedWarehouse = useMemo(
    () => warehouses.find((warehouse) => String(warehouse.warehouse_id) === warehouseId),
    [warehouseId, warehouses]
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCreated(null);
    try {
      const shipment = await api.post<Shipment>("/api/shipments/", {
        shipment_date: shipmentDate,
        warehouse_id: Number(warehouseId),
        tracking_number: trackingNumber.trim(),
      });
      setCreated(shipment);
      setTrackingNumber(`SHP-${Date.now().toString().slice(-6)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create shipment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.1rem", marginBottom: "4px" }}>Create Shipment</h1>
          <p style={{ color: "var(--text-secondary)" }}>Admin shipment entry with stock validation and initial shipment log.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link className="glass-btn glass-btn-secondary" href="/shipments">All Shipments</Link>
          <Link className="glass-btn glass-btn-secondary" href="/shipments/logs">Shipment Logs</Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "minmax(0, 1fr) 360px" }} className="shipments-top-grid">
        <form onSubmit={submit} className="glass-card" style={{ display: "grid", gap: "14px" }}>
          {error ? <div className="glass-badge glass-badge-danger">{error}</div> : null}
          {created ? (
            <div className="glass-card" style={{ background: "#ecfdf5", borderColor: "#bbf7d0", padding: "14px" }}>
              <strong>Shipment created:</strong> #{created.shipment_id} ({created.tracking_number}){" "}
              <Link href={`/shipments/${created.shipment_id}`} style={{ color: "var(--accent-indigo)", fontWeight: 800 }}>View details</Link>
            </div>
          ) : null}

          <label style={{ display: "grid", gap: "8px", fontWeight: 800 }}>
            Origin Warehouse
            <select className="glass-input" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required>
              {warehouses.map((warehouse) => (
                <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                  {warehouse.warehouse_name} (ID {warehouse.warehouse_id})
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "8px", fontWeight: 800 }}>
            Shipment Date
            <input className="glass-input" type="date" value={shipmentDate} onChange={(e) => setShipmentDate(e.target.value)} required />
          </label>

          <label style={{ display: "grid", gap: "8px", fontWeight: 800 }}>
            Tracking Number
            <input className="glass-input" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} required />
          </label>

          <button className={`glass-btn glass-btn-primary ${loading ? "glass-btn-disabled" : ""}`} type="submit" disabled={loading || !warehouseId}>
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </form>

        <aside className="glass-card" style={{ display: "grid", gap: "12px", alignContent: "start" }}>
          <h2 style={{ fontSize: "1.2rem" }}>What happens next?</h2>
          <p style={{ color: "var(--text-secondary)" }}>The system checks warehouse stock, creates the shipment, reduces inventory by 1, and writes a first Created event in Shipment_logs.</p>
          <div style={{ height: 1, background: "var(--border-glass)" }} />
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Selected warehouse</div>
            <strong>{selectedWarehouse?.warehouse_name || "No warehouse selected"}</strong>
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Handled product ID</div>
            <strong>{selectedWarehouse?.product_id || "-"}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
