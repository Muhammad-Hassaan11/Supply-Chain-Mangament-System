"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";

interface WarehouseStats {
  warehouse_id: number;
  warehouse_name: string;
  capacity: number;
  product_id: number;
  product_name: string;
  current_stock: number;
}

interface Product {
  product_id: number;
  product_name: string;
}

export default function WarehousesPage() {
  const { isAdmin } = useAuth();
  const [warehouses, setWarehouses] = useState<WarehouseStats[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Warehouse");
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseStats | null>(null);

  // Form inputs
  const [warehouseName, setWarehouseName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [productId, setProductId] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [whsData, prodsData] = await Promise.all([
        api.get<WarehouseStats[]>("/api/warehouses/"),
        api.get<Product[]>("/api/products/"),
      ]);
      setWarehouses(whsData);
      setProducts(prodsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load database records.");
    } finally {
      setLoading(false);
    }
  };

  const canWrite = isAdmin;

  const resetForm = () => {
    setWarehouseName("");
    setCapacity("");
    setProductId("");
    setFormError(null);
    setEditingWarehouse(null);
  };

  const handleAddClick = () => {
    resetForm();
    if (products.length > 0) {
      setProductId(String(products[0].product_id));
    }
    setModalTitle("Add New Warehouse");
    setIsModalOpen(true);
  };

  const handleEditClick = (warehouse: WarehouseStats) => {
    setEditingWarehouse(warehouse);
    setWarehouseName(warehouse.warehouse_name);
    setCapacity(String(warehouse.capacity));
    setProductId(String(warehouse.product_id));
    setFormError(null);
    setModalTitle("Edit Warehouse");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (warehouse: WarehouseStats) => {
    if (!window.confirm(`Are you sure you want to delete warehouse "${warehouse.warehouse_name}"?`)) {
      return;
    }
    try {
      await api.delete(`/api/warehouses/${warehouse.warehouse_id}`);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete warehouse.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cap = parseInt(capacity, 10);
    const pId = parseInt(productId, 10);

    if (!warehouseName.trim()) {
      setFormError("Warehouse name cannot be empty.");
      return;
    }
    if (isNaN(cap) || cap < 0) {
      setFormError("Total capacity must be a non-negative integer.");
      return;
    }
    if (isNaN(pId) || pId <= 0) {
      setFormError("Please select a valid main handled product.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        warehouse_name: warehouseName,
        capacity: cap,
        product_id: pId,
      };

      if (editingWarehouse) {
        await api.put(`/api/warehouses/${editingWarehouse.warehouse_id}`, payload);
      } else {
        await api.post("/api/warehouses/", payload);
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "An error occurred while saving warehouse.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "ID", accessor: "warehouse_id" as keyof WarehouseStats, sortable: true },
    { header: "Warehouse Name", accessor: "warehouse_name" as keyof WarehouseStats, sortable: true },
    {
      header: "Main Product",
      accessor: (row: WarehouseStats) => (
        <span style={{ color: "var(--accent-indigo)", fontWeight: "600" }}>
          {row.product_name || `Product ID ${row.product_id}`}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Visual Capacity Status",
      accessor: (row: WarehouseStats) => {
        const percent = Math.min(
          100,
          row.capacity > 0 ? Math.round((row.current_stock / row.capacity) * 100) : 0
        );
        let color = "var(--color-success)";
        let glow = "rgba(0, 230, 118, 0.25)";
        if (percent > 90) {
          color = "var(--color-danger)";
          glow = "rgba(255, 23, 68, 0.25)";
        } else if (percent > 70) {
          color = "var(--color-warning)";
          glow = "rgba(255, 179, 0, 0.25)";
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", minWidth: "160px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>
                {row.current_stock} / {row.capacity} items
              </span>
              <span style={{ color: color, fontWeight: "600" }}>{percent}% Full</span>
            </div>
            <div style={{ height: "8px", background: "rgba(13, 148, 136, 0.06)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-glass)" }}>
              <div
                style={{
                  height: "100%",
                  background: color,
                  width: `${percent}%`,
                  transition: "width 0.8s ease-out",
                  borderRadius: "4px",
                  boxShadow: `0 0 10px ${glow}`,
                }}
              />
            </div>
          </div>
        );
      },
      sortable: true,
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
            Warehouses Capacity Telemetry
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Monitor physical SCM storage centers, visual utilization percentages, and main handled allocations.
          </p>
        </div>

        {canWrite && (
          <button className="glass-btn glass-btn-primary" onClick={handleAddClick} id="add-warehouse-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Warehouse
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading SCM warehouse capacity profiles...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
            {error}
          </div>
        ) : (
          <DataTable
            data={warehouses}
            columns={columns}
            searchPlaceholder="Search warehouses by name..."
            searchKey="warehouse_name"
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            canWrite={canWrite}
            idPrefix="warehouses"
          />
        )}
      </div>

      {/* Warehouse Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} idPrefix="warehouse-form">
        {products.length === 0 ? (
          <div style={{ color: "var(--color-danger)", padding: "10px", textAlign: "center", fontSize: "0.95rem" }}>
            Cannot add warehouses: There are no products registered in the database. Please add a product first.
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
                  fontSize: "0.9rem",
                }}
                id="form-error-msg"
              >
                {formError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Warehouse Name</label>
              <input
                type="text"
                className="glass-input"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="e.g. Seattle North Hub"
                required
                id="input-warehouse-name"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Total Capacity (Units)</label>
              <input
                type="number"
                min="0"
                className="glass-input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 5000"
                required
                id="input-capacity"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Main Handled Product</label>
              <select
                className="glass-input"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                id="select-product"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id} style={{ backgroundColor: "#ffffff" }}>
                    {p.product_name} (ID {p.product_id})
                  </option>
                ))}
              </select>
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
                {isSubmitting ? "Saving..." : "Save Warehouse"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
