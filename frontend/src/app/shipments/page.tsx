"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";

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

interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
}

interface Product {
  product_id: number;
  product_name: string;
}

export default function ShipmentsPage() {
  const { isAdmin } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Shipment for Timeline Tracker
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [logs, setLogs] = useState<ShipmentLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Shipments Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Shipment");
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  // Shipment Form Fields
  const [shipmentDate, setShipmentDate] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log Milestone Form Fields (Admins append tracking logs)
  const [logEventType, setLogEventType] = useState("In Transit");
  const [logProductId, setLogProductId] = useState("");
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [logFormError, setLogFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shipmentData, warehouseData, productData] = await Promise.all([
        api.get<Shipment[]>("/api/shipments/"),
        api.get<Warehouse[]>("/api/warehouses/"),
        api.get<Product[]>("/api/products/"),
      ]);
      
      setShipments(shipmentData);
      setWarehouses(warehouseData);
      setProducts(productData);
      
      if (productData.length > 0) {
        setLogProductId(String(productData[0].product_id));
      }
      
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load database records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchShipmentLogs = async (shipmentId: number) => {
    try {
      setLoadingLogs(true);
      const logData = await api.get<ShipmentLog[]>(`/api/shipments/${shipmentId}/logs`);
      setLogs(logData);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to fetch tracking logs.");
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleTrackClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    fetchShipmentLogs(shipment.shipment_id);
  };

  const canWrite = isAdmin;

  const resetForm = () => {
    setShipmentDate(new Date().toISOString().split("T")[0]);
    setWarehouseId(warehouses.length > 0 ? String(warehouses[0].warehouse_id) : "");
    // Pre-generate standard SCM tracking format, e.g. SH-10293
    setTrackingNumber(`SH-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormError(null);
    setEditingShipment(null);
  };

  const handleAddClick = () => {
    resetForm();
    setModalTitle("Create Shipment");
    setIsModalOpen(true);
  };

  const handleEditClick = (shipment: Shipment) => {
    setEditingShipment(shipment);
    // Convert YYYY-MM-DD timestamp to input format
    const formattedDate = shipment.shipment_date.split("T")[0];
    setShipmentDate(formattedDate);
    setWarehouseId(String(shipment.warehouse_id));
    setTrackingNumber(shipment.tracking_number);
    setFormError(null);
    setModalTitle("Edit Shipment Record");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (shipment: Shipment) => {
    if (!window.confirm(`Are you sure you want to delete shipment "${shipment.tracking_number}"? This will also purge its tracking milestones cascade history.`)) {
      return;
    }
    try {
      await api.delete(`/api/shipments/${shipment.shipment_id}`);
      if (selectedShipment?.shipment_id === shipment.shipment_id) {
        setSelectedShipment(null);
        setLogs([]);
      }
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete shipment.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const whId = parseInt(warehouseId, 10);

    if (!shipmentDate) {
      setFormError("Please select a shipment date.");
      return;
    }
    if (isNaN(whId) || whId <= 0) {
      setFormError("Please select a valid origin warehouse.");
      return;
    }
    if (!trackingNumber.trim()) {
      setFormError("Tracking number cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        shipment_date: shipmentDate,
        warehouse_id: whId,
        tracking_number: trackingNumber.trim(),
      };

      if (editingShipment) {
        await api.put(`/api/shipments/${editingShipment.shipment_id}`, payload);
      } else {
        await api.post("/api/shipments/", payload);
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to save shipment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppendLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    setLogFormError(null);

    const pId = parseInt(logProductId, 10);
    if (!logEventType.trim()) {
      setLogFormError("Event type is required.");
      return;
    }
    if (isNaN(pId) || pId <= 0) {
      setLogFormError("Please select a valid product.");
      return;
    }

    try {
      setIsSubmittingLog(true);
      // Construct log payload - including dummy shipment_id and log_seq_num to pass schema validation
      const payload = {
        shipment_id: selectedShipment.shipment_id,
        log_seq_num: 1, 
        event_type: logEventType.trim(),
        product_id: pId,
      };

      await api.post(`/api/shipments/${selectedShipment.shipment_id}/logs`, payload);
      
      setLogEventType("In Transit");
      fetchShipmentLogs(selectedShipment.shipment_id);
    } catch (err: any) {
      console.error(err);
      setLogFormError(err.message || "Failed to add tracking milestone.");
    } finally {
      setIsSubmittingLog(false);
    }
  };

  const columns = [
    { header: "Shipment ID", accessor: "shipment_id" as keyof Shipment, sortable: true },
    {
      header: "Shipment Date",
      accessor: (row: Shipment) => row.shipment_date.split("T")[0],
      sortable: true,
    },
    {
      header: "Origin Warehouse",
      accessor: (row: Shipment) => (
        <span style={{ fontWeight: "500", color: "var(--accent-indigo)" }}>
          {row.warehouse_name || `Warehouse ID ${row.warehouse_id}`}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Tracking ID",
      accessor: (row: Shipment) => (
        <code style={{ background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", color: "var(--accent-cyan)", fontFamily: "monospace", letterSpacing: "1px", fontWeight: "600" }}>
          {row.tracking_number}
        </code>
      ),
      sortable: true,
    },
    {
      header: "Live Tracking",
      accessor: (row: Shipment) => {
        const isActive = selectedShipment?.shipment_id === row.shipment_id;
        return (
          <button
            className={`glass-btn ${isActive ? "glass-btn-primary" : "glass-btn-secondary"}`}
            onClick={() => handleTrackClick(row)}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
            id={`track-btn-${row.shipment_id}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            {isActive ? "Tracking..." : "Track SCM"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "6px",
            }}
          >
            SCM Shipment tracking & Milestones
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Add, update, or inspect physical supply chain shipments and append dynamic real-time chronological event logs.
          </p>
        </div>

        {canWrite && (
          <button className="glass-btn glass-btn-primary" onClick={handleAddClick} id="add-shipment-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Shipment
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", alignItems: "start" }} className="large-viewport-grid">
        <style jsx global>{`
          @media (min-width: 1024px) {
            .large-viewport-grid {
              grid-template-columns: 1.4fr 1fr !important;
            }
          }
        `}</style>

        {/* Shipment Database Cards Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="glass-card">
            <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "var(--text-primary)" }}>Shipment Archives</h3>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-secondary)" }}>
                Loading shipment records from SQL Server...
              </div>
            ) : error ? (
              <div style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
                {error}
              </div>
            ) : (
              <DataTable
                data={shipments}
                columns={columns}
                searchPlaceholder="Search shipments by tracking number..."
                searchKey="tracking_number"
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                canWrite={canWrite}
                idPrefix="shipments"
              />
            )}
          </div>
        </div>

        {/* Interactive Timeline Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "24px" }}>
          {selectedShipment ? (
            <div className="glass-card animate-fade-in" style={{ border: "1px solid var(--border-glass-active)" }}>
              {/* Timeline Header Info */}
              <div style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent-cyan)", fontWeight: "600" }}>
                    Telemetry Stream Active
                  </span>
                  <button 
                    onClick={() => setSelectedShipment(null)}
                    style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                  >
                    Close Tracking
                  </button>
                </div>
                <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <code>{selectedShipment.tracking_number}</code>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <div>
                    <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>Origin Warehouse</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedShipment.warehouse_name}</strong>
                  </div>
                  <div>
                    <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>Shipment Date</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedShipment.shipment_date.split("T")[0]}</strong>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline logs rendering */}
              <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--text-primary)" }}>Tracking Milestones</h3>
              {loadingLogs ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "30px", color: "var(--text-secondary)" }}>
                  Retrieving chronological SQL tracking history...
                </div>
              ) : logs.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--text-secondary)", textAlign: "center" }}>
                  No tracking milestones logged for this shipment.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "24px", marginBottom: "30px" }}>
                  {/* Vertical Timeline Central line */}
                  <div 
                    style={{ 
                      position: "absolute", 
                      left: "6px", 
                      top: "8px", 
                      bottom: "8px", 
                      width: "2px", 
                      background: "linear-gradient(to bottom, var(--accent-cyan), var(--accent-indigo))", 
                      opacity: 0.4 
                    }} 
                  />

                  {logs.map((log, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === logs.length - 1;
                    const isDelivered = log.event_type.toLowerCase() === "delivered";
                    const isCreated = log.event_type.toLowerCase() === "created";

                    let nodeColor = "var(--accent-indigo)";
                    let glowColor = "var(--accent-indigo-glow)";
                    if (isDelivered) {
                      nodeColor = "var(--color-success)";
                      glowColor = "rgba(0, 230, 118, 0.35)";
                    } else if (isCreated) {
                      nodeColor = "var(--accent-cyan)";
                      glowColor = "var(--accent-cyan-glow)";
                    }

                    return (
                      <div 
                        key={log.log_seq_num} 
                        style={{ 
                          position: "relative", 
                          marginBottom: isLast ? "0px" : "24px", 
                          animation: `fadeIn 0.3s ease-out ${idx * 0.05}s forwards`
                        }}
                      >
                        {/* Milestone dot */}
                        <div 
                          style={{ 
                            position: "absolute", 
                            left: "-23px", 
                            top: "4px", 
                            width: "12px", 
                            height: "12px", 
                            borderRadius: "50%", 
                            backgroundColor: nodeColor,
                            boxShadow: `0 0 12px 3px ${glowColor}`,
                            border: "2px solid #06060c",
                            zIndex: 2 
                          }} 
                        />

                        {/* Milestone info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                            <h4 style={{ color: isDelivered ? "var(--color-success)" : "var(--text-primary)", fontSize: "1rem" }}>
                              {log.event_type}
                            </h4>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                              {log.log_timestamp ? new Date(log.log_timestamp).toLocaleString() : "Date unavailable"}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            Sequence #{log.log_seq_num} - Handled Product: <span style={{ color: "var(--accent-cyan)" }}>{log.product_name || `Product ID ${log.product_id}`}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Milestone Form */}
              {canWrite && (
                <form onSubmit={handleAppendLogSubmit} style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "20px", marginTop: "20px" }}>
                  <h4 style={{ fontSize: "1rem", marginBottom: "14px", color: "var(--text-primary)" }}>Append New tracking Milestone</h4>
                     {logFormError && (
                       <div style={{ color: "var(--color-danger)", fontSize: "0.85rem", background: "rgba(190, 18, 60, 0.08)", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(190, 18, 60, 0.2)" }}>
                         {logFormError}
                       </div>
                     )}
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Milestone Event</label>
                        <select 
                          className="glass-input" 
                          value={logEventType} 
                          onChange={(e) => setLogEventType(e.target.value)}
                          style={{ padding: "8px 12px", fontSize: "0.85rem", background: "#ffffff", color: "var(--text-primary)" }}
                        >
                          <option value="In Transit" style={{ backgroundColor: "#ffffff" }}>In Transit</option>
                          <option value="Arrived at Hub" style={{ backgroundColor: "#ffffff" }}>Arrived at Hub</option>
                          <option value="Out for Delivery" style={{ backgroundColor: "#ffffff" }}>Out for Delivery</option>
                          <option value="Delivered" style={{ backgroundColor: "#ffffff" }}>Delivered</option>
                          <option value="Customs Hold" style={{ backgroundColor: "#ffffff" }}>Customs Hold</option>
                          <option value="Returned" style={{ backgroundColor: "#ffffff" }}>Returned</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Event Product</label>
                        <select 
                          className="glass-input" 
                          value={logProductId} 
                          onChange={(e) => setLogProductId(e.target.value)}
                          style={{ padding: "8px 12px", fontSize: "0.85rem", background: "#ffffff", color: "var(--text-primary)" }}
                        >
                          {products.map(p => (
                            <option key={p.product_id} value={p.product_id} style={{ backgroundColor: "#ffffff" }}>
                              {p.product_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="glass-btn glass-btn-primary" 
                      style={{ padding: "8px 16px", fontSize: "0.9rem", width: "100%" }}
                      disabled={isSubmittingLog}
                      id="submit-milestone-btn"
                    >
                      {isSubmittingLog ? "Appending Log..." : "Append Milestone"}
                    </button>
                  </form>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 40px", color: "var(--text-secondary)", border: "1px dashed var(--border-glass)", textAlign: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: "16px" }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <h4 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "8px" }}>Telemetry Status: Offline</h4>
              <p style={{ fontSize: "0.9rem", maxWidth: "280px" }}>
                Select a shipment from the archives table to open its live SQL tracking milestone timeline.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shipment CRUD Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} idPrefix="shipment-form">
        {warehouses.length === 0 ? (
          <div style={{ color: "var(--color-danger)", padding: "10px", textAlign: "center", fontSize: "0.95rem" }}>
            Cannot manage shipments: There are no warehouses registered. Please register a warehouse first.
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {formError && (
              <div 
                style={{ 
                  background: "rgba(190, 18, 60, 0.08)", 
                  border: "1px solid rgba(190, 18, 60, 0.2)", 
                  color: "var(--color-danger)", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  fontSize: "0.9rem" 
                }}
                id="form-error-msg"
              >
                {formError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Shipment Date</label>
              <input
                type="date"
                className="glass-input"
                value={shipmentDate}
                onChange={(e) => setShipmentDate(e.target.value)}
                required
                id="input-shipment-date"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Origin Warehouse</label>
              <select
                className="glass-input"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                required
                id="select-warehouse"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                {warehouses.map((wh) => (
                  <option key={wh.warehouse_id} value={wh.warehouse_id} style={{ backgroundColor: "#ffffff" }}>
                    {wh.warehouse_name} (ID {wh.warehouse_id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Tracking ID (Unique)</label>
              <input
                type="text"
                className="glass-input"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. SH-12345"
                required
                id="input-tracking-number"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
              <button
                type="button"
                className="glass-btn glass-btn-secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="glass-btn glass-btn-primary" disabled={isSubmitting} id="submit-form-btn">
                {isSubmitting ? "Creating..." : "Save Shipment"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
