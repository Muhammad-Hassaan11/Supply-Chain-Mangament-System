"use client";

import React, { useState, useEffect } from "react";
import { api, getStoredAccountType } from "@/lib/api";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import { WarehouseInventoryPage } from "@/components/warehouse/WarehousePortal";

interface InventoryItem {
  warehouse_id: number;
  product_id: number;
  location: string;
  quantity: number;
  warehouse_name: string;
  product_name: string;
}

interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
}

interface Product {
  product_id: number;
  product_name: string;
}

function GenericInventoryPage() {
  const { isAdmin } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Stock Allocation");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form inputs
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invData, whsData, prodsData] = await Promise.all([
        api.get<InventoryItem[]>("/api/inventory/"),
        api.get<Warehouse[]>("/api/warehouses/"),
        api.get<Product[]>("/api/products/"),
      ]);
      setInventory(invData);
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
    setWarehouseId("");
    setProductId("");
    setLocation("");
    setQuantity("");
    setFormError(null);
    setEditingItem(null);
  };

  const handleAddClick = () => {
    resetForm();
    if (warehouses.length > 0) setWarehouseId(String(warehouses[0].warehouse_id));
    if (products.length > 0) setProductId(String(products[0].product_id));
    setModalTitle("Add New Stock Allocation");
    setIsModalOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setWarehouseId(String(item.warehouse_id));
    setProductId(String(item.product_id));
    setLocation(item.location);
    setQuantity(String(item.quantity));
    setFormError(null);
    setModalTitle("Adjust Stock Allocation");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (item: InventoryItem) => {
    if (!window.confirm(`Are you sure you want to delete the stock allocation for "${item.product_name}" in "${item.warehouse_name}"?`)) {
      return;
    }
    try {
      await api.delete(`/api/inventory/${item.warehouse_id}/${item.product_id}`);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete stock record.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const wId = parseInt(warehouseId, 10);
    const pId = parseInt(productId, 10);
    const qty = parseInt(quantity, 10);

    if (isNaN(wId) || wId <= 0) {
      setFormError("Please select a valid warehouse.");
      return;
    }
    if (isNaN(pId) || pId <= 0) {
      setFormError("Please select a valid product.");
      return;
    }
    if (!location.trim()) {
      setFormError("Storage bin location is required (e.g., Row B-12).");
      return;
    }
    if (isNaN(qty) || qty < 0) {
      setFormError("Quantity must be a non-negative integer.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        warehouse_id: wId,
        product_id: pId,
        location: location,
        quantity: qty,
      };

      if (editingItem) {
        await api.put(`/api/inventory/${editingItem.warehouse_id}/${editingItem.product_id}`, payload);
      } else {
        await api.post("/api/inventory/", payload);
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "An error occurred while saving stock allocation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "Warehouse", accessor: "warehouse_name" as keyof InventoryItem, sortable: true },
    { header: "Product Stored", accessor: "product_name" as keyof InventoryItem, sortable: true },
    {
      header: "Bin Location",
      accessor: (row: InventoryItem) => (
        <code
          style={{
            background: "rgba(13, 148, 136, 0.05)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.85rem",
            border: "1px solid var(--border-glass)",
            color: "var(--accent-indigo)",
          }}
        >
          {row.location}
        </code>
      ),
      sortable: true,
    },
    {
      header: "Quantity Stored",
      accessor: (row: InventoryItem) => {
        const isCritical = row.quantity < 5;
        const isWarning = row.quantity < 10;
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: "600" }}>{row.quantity}</span>
            {isWarning && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: isCritical ? "rgba(255, 23, 68, 0.15)" : "rgba(255, 179, 0, 0.15)",
                  color: isCritical ? "#ff1744" : "#ffb300",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  border: isCritical ? "1px solid rgba(255, 23, 68, 0.3)" : "1px solid rgba(255, 179, 0, 0.3)",
                }}
              >
                {isCritical ? "Critical Low" : "Low Stock"}
              </span>
            )}
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
            Inventory Stock Balances
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Track physical product bins in each warehouse, trigger restock thresholds, and record volume levels.
          </p>
        </div>

        {canWrite && (
          <button className="glass-btn glass-btn-primary" onClick={handleAddClick} id="add-inventory-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Stock Allocation
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Retrieving master SCM stock counts...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
            {error}
          </div>
        ) : (
          <DataTable
            data={inventory}
            columns={columns}
            searchPlaceholder="Search inventory by product name..."
            searchKey="product_name"
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            canWrite={canWrite}
            idPrefix="inventory"
          />
        )}
      </div>

      {/* Inventory Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} idPrefix="inventory-form">
        {warehouses.length === 0 || products.length === 0 ? (
          <div style={{ color: "var(--color-danger)", padding: "10px", textAlign: "center", fontSize: "0.95rem" }}>
            Cannot manage stock: Both warehouses and products must exist first.
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
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Origin Warehouse</label>
              <select
                className="glass-input"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                required
                disabled={!!editingItem}
                id="select-warehouse"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  cursor: editingItem ? "not-allowed" : "pointer",
                }}
              >
                {warehouses.map((w) => (
                  <option key={w.warehouse_id} value={w.warehouse_id} style={{ backgroundColor: "#ffffff" }}>
                    {w.warehouse_name} (ID {w.warehouse_id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Stored Product</label>
              <select
                className="glass-input"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                disabled={!!editingItem}
                id="select-product"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  cursor: editingItem ? "not-allowed" : "pointer",
                }}
              >
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id} style={{ backgroundColor: "#ffffff" }}>
                    {p.product_name} (ID {p.product_id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Storage Location (Bin / Row)</label>
              <input
                type="text"
                className="glass-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shelf A-42, Bin 3"
                required
                id="input-location"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                className="glass-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 150"
                required
                id="input-quantity"
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
                {isSubmitting ? "Adjusting..." : "Save Stock Allocation"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function InventoryPage() {
  const [accountType] = useState<string | null>(() => getStoredAccountType());
  if (accountType === "warehouse") {
    return <WarehouseInventoryPage />;
  }
  return <GenericInventoryPage />;
}
