"use client";

import React from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { WarehouseInventoryPage } from "@/components/warehouse/WarehousePortal";
import { useStoredAccountState } from "@/lib/useStoredAccountState";

type InventoryRecord = {
  warehouse_id: number;
  product_id: number;
  location: string;
  quantity: number;
  product_name?: string | null;
  warehouse_name?: string | null;
};

const emptyForm = {
  warehouse_id: "",
  product_id: "",
  location: "",
  quantity: "",
};

function AdminInventoryPage() {
  const [rows, setRows] = React.useState<InventoryRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState<InventoryRecord | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const loadInventory = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<InventoryRecord[]>("/api/inventory/");
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.warehouse_id,
        row.product_id,
        row.location,
        row.quantity,
        row.product_name || "",
        row.warehouse_name || "",
      ].join(" ").toLowerCase().includes(query)
    );
  }, [rows, search]);

  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);
  const warehouseCount = new Set(rows.map((row) => row.warehouse_id)).size;
  const productCount = new Set(rows.map((row) => row.product_id)).size;
  const lowStockCount = rows.filter((row) => row.quantity < 10).length;

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setNotice("Inventory form is ready for a new allocation.");
  };

  const editRow = (row: InventoryRecord) => {
    setEditing(row);
    setForm({
      warehouse_id: String(row.warehouse_id),
      product_id: String(row.product_id),
      location: row.location,
      quantity: String(row.quantity),
    });
    setNotice(`Editing inventory for Warehouse ${row.warehouse_id}, Product ${row.product_id}.`);
  };

  const saveInventory = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const warehouseId = Number(form.warehouse_id);
    const productId = Number(form.product_id);
    const quantity = Number(form.quantity);

    if (!Number.isInteger(warehouseId) || warehouseId <= 0 || !Number.isInteger(productId) || productId <= 0) {
      setError("Warehouse ID and Product ID must be positive integers.");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative number.");
      return;
    }

    const payload = {
      warehouse_id: warehouseId,
      product_id: productId,
      location: form.location.trim(),
      quantity,
    };

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/inventory/${editing.warehouse_id}/${editing.product_id}`, payload);
        setNotice("Inventory allocation updated in SQL Server.");
      } else {
        await api.post("/api/inventory/", payload);
        setNotice("Inventory allocation added to SQL Server.");
      }
      setEditing(null);
      setForm(emptyForm);
      await loadInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save inventory.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (row: InventoryRecord) => {
    if (!window.confirm(`Delete inventory allocation W${row.warehouse_id} / P${row.product_id}?`)) return;
    setSaving(true);
    setError("");
    try {
      await api.delete(`/api/inventory/${row.warehouse_id}/${row.product_id}`);
      setNotice("Inventory allocation deleted from SQL Server.");
      await loadInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inventory.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Inventory Management</h1>
          <p style={{ color: "var(--text-secondary)" }}>Admin portal view for all warehouse inventory allocations.</p>
        </div>
        <button className="glass-btn glass-btn-primary" type="button" onClick={startNew}>Add Inventory</button>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        {[
          ["Allocations", rows.length],
          ["Total Units", totalQuantity.toLocaleString()],
          ["Warehouses", warehouseCount],
          ["Linked Products", productCount],
          ["Low Stock", lowStockCount],
        ].map(([label, value]) => (
          <div className="glass-card" key={label} style={{ padding: "16px" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: ".82rem", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
            <div style={{ color: "var(--accent-indigo)", fontSize: "1.85rem", fontWeight: 900, marginTop: "6px" }}>{value}</div>
          </div>
        ))}
      </div>

      {notice ? <div className="glass-card" style={{ color: "var(--color-success)", padding: "12px 16px" }}>{notice}</div> : null}
      {error ? <div className="glass-card" style={{ color: "var(--color-danger)", padding: "12px 16px" }}>{error}</div> : null}

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.6fr .8fr" }} className="inventory-admin-grid">
        <section className="glass-card">
          <div style={{ alignItems: "center", display: "flex", gap: "12px", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>All Inventory Allocations</h2>
            <input className="glass-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory..." style={{ maxWidth: "280px" }} />
          </div>
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}>Loading inventory from SQL Server...</td></tr>
                ) : filteredRows.length ? filteredRows.map((row) => (
                  <tr key={`${row.warehouse_id}-${row.product_id}`}>
                    <td>{row.warehouse_name || `Warehouse ${row.warehouse_id}`}<br /><span style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>ID {row.warehouse_id}</span></td>
                    <td>{row.product_name || `Product ${row.product_id}`}<br /><span style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>ID {row.product_id}</span></td>
                    <td>{row.location}</td>
                    <td>{row.quantity.toLocaleString()}</td>
                    <td><span className={`glass-badge ${row.quantity < 10 ? "glass-badge-danger" : "glass-badge-success"}`}>{row.quantity < 10 ? "Low Stock" : "In Stock"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button className="glass-btn glass-btn-secondary" type="button" onClick={() => editRow(row)} style={{ minHeight: 32, padding: "7px 10px" }}>Edit</button>
                        <button className="glass-btn glass-btn-secondary" type="button" onClick={() => deleteRow(row)} style={{ minHeight: 32, padding: "7px 10px" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}>No inventory records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>{editing ? "Edit Allocation" : "Add Allocation"}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: ".9rem", marginBottom: "16px" }}>Use existing warehouse and product IDs.</p>
          <form onSubmit={saveInventory} style={{ display: "grid", gap: "12px" }}>
            <label><span style={{ display: "block", fontSize: ".84rem", marginBottom: 6 }}>Warehouse ID</span><input className="glass-input" value={form.warehouse_id} onChange={(e) => updateForm("warehouse_id", e.target.value)} readOnly={Boolean(editing)} /></label>
            <label><span style={{ display: "block", fontSize: ".84rem", marginBottom: 6 }}>Product ID</span><input className="glass-input" value={form.product_id} onChange={(e) => updateForm("product_id", e.target.value)} readOnly={Boolean(editing)} /></label>
            <label><span style={{ display: "block", fontSize: ".84rem", marginBottom: 6 }}>Location</span><input className="glass-input" value={form.location} onChange={(e) => updateForm("location", e.target.value)} /></label>
            <label><span style={{ display: "block", fontSize: ".84rem", marginBottom: 6 }}>Quantity</span><input className="glass-input" value={form.quantity} onChange={(e) => updateForm("quantity", e.target.value)} /></label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="glass-btn glass-btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Inventory"}</button>
              <button className="glass-btn glass-btn-secondary" type="button" onClick={startNew}>Reset</button>
            </div>
          </form>
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .inventory-admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function InventoryPage() {
  const { isAdmin } = useAuth();
  const { accountType, isHydrated } = useStoredAccountState();

  if (!isHydrated) {
    return <div className="glass-card">Loading inventory...</div>;
  }

  if (isAdmin) {
    return <AdminInventoryPage />;
  }

  if (accountType === "warehouse") {
    return <WarehouseInventoryPage />;
  }

  return <AdminInventoryPage />;
}
