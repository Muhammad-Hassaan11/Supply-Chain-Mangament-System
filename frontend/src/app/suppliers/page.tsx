"use client";

import React, { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";

interface Supplier {
  supplier_id: number;
  contact_id: number;
  rating: number;
  contact_email: string;
}

export default function SuppliersPage() {
  const { isAdmin } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Supplier");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  // Form input fields
  const [contactId, setContactId] = useState("");
  const [rating, setRating] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  
  // Form validation/error states
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.get<Supplier[]>("/api/suppliers/");
      setSuppliers(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch suppliers.");
    } finally {
      setLoading(false);
    }
  };

  const canWrite = isAdmin;

  const resetForm = () => {
    setContactId("");
    setRating("");
    setContactEmail("");
    setFormError(null);
    setEditingSupplier(null);
  };

  const handleAddClick = () => {
    resetForm();
    setModalTitle("Add New Supplier");
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setContactId(String(supplier.contact_id));
    setRating(String(supplier.rating));
    setContactEmail(supplier.contact_email);
    setFormError(null);
    setModalTitle("Edit Supplier");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (supplier: Supplier) => {
    if (!window.confirm(`Are you sure you want to delete supplier ID ${supplier.supplier_id}?`)) {
      return;
    }
    try {
      await api.delete(`/api/suppliers/${supplier.supplier_id}`);
      fetchSuppliers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete supplier.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Simple Form Validation
    const cId = parseInt(contactId, 10);
    const rat = parseInt(rating, 10);

    if (isNaN(cId) || cId <= 0) {
      setFormError("Contact ID must be a positive integer.");
      return;
    }
    if (isNaN(rat) || rat < 1 || rat > 5) {
      setFormError("Rating must be an integer between 1 and 5.");
      return;
    }
    if (!contactEmail || !contactEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        contact_id: cId,
        rating: rat,
        contact_email: contactEmail,
      };

      if (editingSupplier) {
        await api.put(`/api/suppliers/${editingSupplier.supplier_id}`, payload);
      } else {
        await api.post("/api/suppliers/", payload);
      }

      setIsModalOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "An error occurred while saving the supplier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "Supplier ID", accessor: "supplier_id" as keyof Supplier, sortable: true },
    { header: "Contact ID", accessor: "contact_id" as keyof Supplier, sortable: true },
    {
      header: "Rating",
      accessor: (row: Supplier) => (
        <span style={{ color: "var(--color-warning)", fontWeight: "600" }}>
          {row.rating}/5
        </span>
      ),
      sortable: true,
    },
    { header: "Contact Email", accessor: "contact_email" as keyof Supplier, sortable: true },
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
            Suppliers Management
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Add, update, or remove SCM vendors and adjust their relational metrics.
          </p>
        </div>

        {canWrite && (
          <button className="glass-btn glass-btn-primary" onClick={handleAddClick} id="add-supplier-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Supplier
          </button>
        )}
      </div>

      {/* Main content table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading SCM suppliers database...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
            {error}
          </div>
        ) : (
          <DataTable
            data={suppliers}
            columns={columns}
            searchPlaceholder="Search suppliers by email..."
            searchKey="contact_email"
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            canWrite={canWrite}
            idPrefix="suppliers"
          />
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} idPrefix="supplier-form">
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
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Contact ID</label>
            <input
              type="number"
              className="glass-input"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              placeholder="e.g. 104"
              required
              id="input-contact-id"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Supplier Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              className="glass-input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g. 5"
              required
              id="input-rating"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>Contact Email</label>
            <input
              type="email"
              className="glass-input"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. contact@supplier.com"
              required
              id="input-email"
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
              {isSubmitting ? "Saving..." : "Save Supplier"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
