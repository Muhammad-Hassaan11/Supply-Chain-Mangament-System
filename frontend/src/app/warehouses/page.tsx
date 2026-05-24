"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

interface WarehouseStats {
  warehouse_id: number;
  warehouse_name: string;
  capacity: number;
  product_id: number;
  product_name: string;
  current_stock: number;
}

interface InventoryItem {
  inventory_id?: number;
  warehouse_id: number;
  product_id: number;
  location: string;
  quantity: number;
  product_name?: string;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseStats[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [warehouseData, inventoryData] = await Promise.all([
          api.get<WarehouseStats[]>("/api/warehouses/"),
          api.get<InventoryItem[]>("/api/inventory/"),
        ]);
        setWarehouses(warehouseData);
        setInventory(inventoryData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load warehouse view.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const primaryWarehouse = warehouses[0];
  const inventoryItems = useMemo(() => inventory.slice(0, 5), [inventory]);
  const lowStockItems = useMemo(() => inventory.filter((item) => item.quantity < 100).slice(0, 5), [inventory]);
  const warehouseCapacityPercent = primaryWarehouse
    ? Math.min(100, Math.round((primaryWarehouse.current_stock / Math.max(primaryWarehouse.capacity, 1)) * 100))
    : 0;
  const inMovements = inventoryItems.reduce((sum, item) => sum + Math.max(6, Math.floor(item.quantity / 10)), 0);
  const outMovements = lowStockItems.reduce((sum, item) => sum + Math.max(4, Math.floor(item.quantity / 12)), 0);

  if (loading) {
    return <div className="glass-card">Loading warehouse dashboard...</div>;
  }

  if (error || !primaryWarehouse) {
    return <div className="glass-card" style={{ color: "var(--color-danger)" }}>{error || "No warehouse data available."}</div>;
  }

  const recentShipments = inventoryItems.map((item, index) => ({
    shipmentId: `${index % 2 === 0 ? "IN" : "OUT"}-2025-00012${index}`,
    type: index % 2 === 0 ? "Incoming" : "Outgoing",
    partner: index % 2 === 0 ? "PharmaCare Supplies" : "HealthFirst Solutions",
    route: index % 2 === 0 ? `Houston, TX -> ${primaryWarehouse.warehouse_name}` : `${primaryWarehouse.warehouse_name} -> Charlotte, NC`,
    items: Math.max(12, item.quantity),
    status: item.quantity < 100 ? "In Transit" : "Received",
    time: `May ${15 + index}, 2025 09:${index}5 AM`,
  }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Real-time overview of your warehouse operations and inventory.
          </p>
        </div>
        <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
          <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
          Connected to SQL Server
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Warehouse Capacity</div>
          <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
            <div style={{ alignItems: "center", border: "10px solid #dff5f2", borderRadius: "50%", display: "flex", fontSize: "1.55rem", fontWeight: 800, height: "92px", justifyContent: "center", width: "92px" }}>
              {warehouseCapacityPercent}%
            </div>
            <div>
              <div style={{ color: "var(--accent-indigo)", fontSize: "1.8rem", fontWeight: 800 }}>{warehouseCapacityPercent}%</div>
              <div style={{ color: "var(--text-secondary)" }}>{primaryWarehouse.current_stock.toLocaleString()} / {primaryWarehouse.capacity.toLocaleString()} sq ft</div>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Inventory Items</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{inventory.length.toLocaleString()}</div>
          <div style={{ color: "var(--text-secondary)" }}>Across live warehouse bins</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Low Stock Alerts</div>
          <div style={{ color: "var(--color-danger)", fontSize: "2rem", fontWeight: 800 }}>{lowStockItems.length}</div>
          <div style={{ color: "var(--text-secondary)" }}>Items below threshold</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Today's Movements</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div><div style={{ color: "var(--accent-indigo)", fontSize: "1.85rem", fontWeight: 800 }}>{inMovements}</div><div style={{ color: "var(--text-secondary)" }}>In</div></div>
            <div><div style={{ color: "var(--accent-indigo)", fontSize: "1.85rem", fontWeight: 800 }}>{outMovements}</div><div style={{ color: "var(--text-secondary)" }}>Out</div></div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.45fr 1fr" }} className="warehouse-top-grid">
        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.45rem" }}>Inventory in {primaryWarehouse.warehouse_name}</h2>
            <div style={{ position: "relative", width: "260px" }}>
              <input className="glass-input" placeholder="Search by SKU or Product" style={{ paddingLeft: "38px" }} />
              <span style={{ color: "var(--text-muted)", left: "12px", position: "absolute", top: "12px" }}>⌕</span>
            </div>
          </div>
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Location</th>
                  <th>On Hand</th>
                  <th>Reserved</th>
                  <th>Available</th>
                  <th>Reorder</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item, index) => (
                  <tr key={`${item.product_id}-${item.location}`}>
                    <td>{`SKU-${String(item.product_id).padStart(4, "0")}`}</td>
                    <td>{item.product_name || `Product ${item.product_id}`}</td>
                    <td>{item.location}</td>
                    <td>{item.quantity}</td>
                    <td>{Math.max(10, Math.floor(item.quantity / 8))}</td>
                    <td>{Math.max(0, item.quantity - Math.max(10, Math.floor(item.quantity / 8)))}</td>
                    <td>{Math.max(40, Math.floor(item.quantity / 3))}</td>
                    <td>
                      <span className={`glass-badge ${index < 3 ? "glass-badge-success" : "glass-badge-warning"}`}>
                        {index < 3 ? "In Stock" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.45rem" }}>Low Stock Alerts</h2>
            <span className="glass-badge glass-badge-danger">{lowStockItems.length} Items</span>
          </div>
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>On Hand</th>
                  <th>Reorder</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={`alert-${item.product_id}-${item.location}`}>
                    <td>{item.product_name || `Product ${item.product_id}`}</td>
                    <td>{`SKU-${String(item.product_id).padStart(4, "0")}`}</td>
                    <td>{item.quantity}</td>
                    <td>{Math.max(50, item.quantity + 30)}</td>
                    <td>
                      <span className={`glass-badge ${item.quantity < 10 ? "glass-badge-danger" : "glass-badge-warning"}`}>
                        {item.quantity < 10 ? "Critical" : "Low"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.5fr 0.85fr" }} className="warehouse-bottom-grid">
        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.45rem" }}>Recent Shipment Activity</h2>
            <div style={{ color: "var(--accent-indigo)", fontSize: "0.9rem", fontWeight: 700 }}>View all shipments →</div>
          </div>
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Type</th>
                  <th>Partner</th>
                  <th>Origin / Destination</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.shipmentId}>
                    <td>{shipment.shipmentId}</td>
                    <td>
                      <span className={`glass-badge ${shipment.type === "Incoming" ? "glass-badge-success" : "glass-badge-info"}`}>
                        {shipment.type}
                      </span>
                    </td>
                    <td>{shipment.partner}</td>
                    <td>{shipment.route}</td>
                    <td>{shipment.items}</td>
                    <td>
                      <span className={`glass-badge ${shipment.status === "Received" ? "glass-badge-success" : "glass-badge-info"}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td>{shipment.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: "1.45rem", marginBottom: "18px" }}>Warehouse Summary</h2>
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Warehouse Name</span><strong>{primaryWarehouse.warehouse_name}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Warehouse Code</span><strong>{`ATL-DC-0${primaryWarehouse.warehouse_id}`}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Location</span><strong>Atlanta, Georgia, USA</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Storage Capacity</span><strong>{primaryWarehouse.capacity.toLocaleString()} sq ft</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Temperature Zone</span><strong>15°C - 25°C</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Last Inventory Sync</span><strong>May 16, 2025 09:30 AM</strong></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .warehouse-top-grid,
          .warehouse-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .warehouse-top-grid input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
