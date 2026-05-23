"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";

interface Product {
  product_id: number;
  product_name: string;
  unit_price: number;
  lead_time_day: number;
  supplier_id: number;
}

interface Supplier {
  supplier_id: number;
  contact_email: string;
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Product");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form inputs
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodsData, suppsData] = await Promise.all([
        api.get<Product[]>("/api/products/"),
        api.get<Supplier[]>("/api/suppliers/"),
      ]);
      setProducts(prodsData);
      setSuppliers(suppsData);
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
    setProductName("");
    setUnitPrice("");
    setLeadTime("");
    setSupplierId("");
    setFormError(null);
    setEditingProduct(null);
  };

  const handleAddClick = () => {
    resetForm();
    if (suppliers.length > 0) {
      setSupplierId(String(suppliers[0].supplier_id));
    }
    setModalTitle("Add New Product");
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.product_name);
    setUnitPrice(String(product.unit_price));
    setLeadTime(String(product.lead_time_day));
    setSupplierId(String(product.supplier_id));
    setFormError(null);
    setModalTitle("Edit Product");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete product "${product.product_name}"?`)) {
      return;
    }
    try {
      await api.delete(`/api/products/${product.product_id}`);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const price = parseFloat(unitPrice);
    const lt = parseInt(leadTime, 10);
    const sId = parseInt(supplierId, 10);

    if (!productName.trim()) {
      setFormError("Product name cannot be empty.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setFormError("Unit price must be a non-negative number.");
      return;
    }
    if (isNaN(lt) || lt < 0) {
      setFormError("Lead time must be a non-negative integer.");
      return;
    }
    if (isNaN(sId) || sId <= 0) {
      setFormError("Please select a valid supplier.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        product_name: productName,
        unit_price: price,
        lead_time_day: lt,
        supplier_id: sId,
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.product_id}`, payload);
      } else {
        await api.post("/api/products/", payload);
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "An error occurred while saving product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "Product ID", accessor: "product_id" as keyof Product, sortable: true },
    { header: "Product Name", accessor: "product_name" as keyof Product, sortable: true },
    {
      header: "Unit Price",
      accessor: (row: Product) => (
        <span style={{ fontFamily: "monospace", fontWeight: "600" }}>
          ${Number(row.unit_price).toFixed(2)}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Lead Time",
      accessor: (row: Product) => `${row.lead_time_day} days`,
      sortable: true,
    },
    {
      header: "Supplier Link",
      accessor: (row: Product) => {
        const matchingSupp = suppliers.find((s) => s.supplier_id === row.supplier_id);
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--accent-indigo)", fontWeight: "600" }}>
              Supplier ID {row.supplier_id}
            </span>
            {matchingSupp && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {matchingSupp.contact_email}
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
            Products Catalog
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Manage SCM inventory products, set unit pricing, lead times and connect supplier relationships.
          </p>
        </div>

        {canWrite && (
          <button className="glass-btn glass-btn-primary" onClick={handleAddClick} id="add-product-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Querying active SCM products list...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
            {error}
          </div>
        ) : (
          <DataTable
            data={products}
            columns={columns}
            searchPlaceholder="Search products by name..."
            searchKey="product_name"
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            canWrite={canWrite}
            idPrefix="products"
          />
        )}
      </div>

      {/* Product Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} idPrefix="product-form">
        {suppliers.length === 0 ? (
          <div style={{ color: "var(--color-danger)", padding: "10px", textAlign: "center", fontSize: "0.95rem" }}>
            Cannot add products: There are no suppliers registered in the database. Please add a supplier first.
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
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Product Name</label>
              <input
                type="text"
                className="glass-input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Copper Wire Coils"
                required
                id="input-product-name"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="glass-input"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g. 49.99"
                required
                id="input-unit-price"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Lead Time (Days)</label>
              <input
                type="number"
                min="0"
                className="glass-input"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="e.g. 5"
                required
                id="input-lead-time"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Assigned Supplier</label>
              <select
                className="glass-input"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                id="select-supplier"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                {suppliers.map((s) => (
                  <option key={s.supplier_id} value={s.supplier_id} style={{ backgroundColor: "#ffffff" }}>
                    Supplier ID {s.supplier_id} ({s.contact_email})
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
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
