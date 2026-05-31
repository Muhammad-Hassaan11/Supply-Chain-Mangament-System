"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ClientSuppliersPage } from "@/components/client/ClientPortal";
import { useStoredAccountState } from "@/lib/useStoredAccountState";

interface Supplier {
  supplier_id: number;
  contact_id: number;
  supplier_name: string;
  rating: number;
  contact_email: string;
  phone: string;
  status: "Active" | "Inactive";
}

function buildStars(rating: number) {
  const rounded = Math.round(rating);
  return `${"*".repeat(rounded)}${"-".repeat(5 - rounded)}`;
}

export default function SuppliersPage() {
  const { isAdmin } = useAuth();
  const { accountType, isHydrated } = useStoredAccountState();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [contactId, setContactId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [rating, setRating] = useState("4");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const fetchSuppliers = useCallback(async (options?: { primeFirst?: boolean }) => {
    try {
      setLoading(true);
      const data = await api.get<Supplier[]>("/api/suppliers/");
      setSuppliers(data);
      if (options?.primeFirst && data[0]) {
        primeForm(data[0]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchSuppliers({ primeFirst: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchSuppliers]);

  function primeForm(supplier?: Supplier | null) {
    if (!supplier) {
      setEditingSupplier(null);
      setContactId("");
      setSupplierName("");
      setRating("4");
      setContactEmail("");
      setPhone("");
      setStatus("Active");
      setFormError(null);
      return;
    }

    setEditingSupplier(supplier);
    setContactId(String(supplier.contact_id));
    setSupplierName(supplier.supplier_name);
    setRating(String(supplier.rating));
    setContactEmail(supplier.contact_email);
    setPhone(supplier.phone);
    setStatus(supplier.status);
    setFormError(null);
  }

  const decoratedSuppliers = useMemo(() => {
    return suppliers.map((supplier) => {
      const number = supplier.supplier_id.toString().padStart(4, "0");
      return {
        ...supplier,
        displayId: `SUP-${number}`,
        displayContactId: `CON-${String(supplier.contact_id).padStart(4, "0")}`,
        displayName: supplier.supplier_name,
      };
    });
  }, [suppliers]);

  const filteredSuppliers = decoratedSuppliers.filter((supplier) => {
    const matchesSearch = [supplier.displayId, supplier.displayName, supplier.contact_email, supplier.phone]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && supplier.status === "Active") ||
      (statusFilter === "inactive" && supplier.status === "Inactive");

    return matchesSearch && matchesStatus;
  });

  if (!isHydrated) {
    return <div className="glass-card">Loading suppliers...</div>;
  }

  const averageRating = decoratedSuppliers.length
    ? (decoratedSuppliers.reduce((sum, item) => sum + item.rating, 0) / decoratedSuppliers.length).toFixed(1)
    : "0.0";
  const activeSuppliers = decoratedSuppliers.filter((item) => item.status === "Active").length;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const contactValue = Number(contactId);
    const ratingValue = Number(rating);

    if (!contactValue || contactValue < 1) {
      setFormError("Contact ID must be a positive number.");
      return;
    }
    if (!supplierName.trim()) {
      setFormError("Supplier name is required.");
      return;
    }
    if (!contactEmail.includes("@")) {
      setFormError("Enter a valid contact email.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    if (ratingValue < 1 || ratingValue > 5) {
      setFormError("Rating must stay between 1 and 5.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        contact_id: contactValue,
        supplier_name: supplierName.trim(),
        rating: ratingValue,
        contact_email: contactEmail,
        phone: phone.trim(),
        status,
      };

      if (editingSupplier) {
        await api.put(`/api/suppliers/${editingSupplier.supplier_id}`, payload);
      } else {
        await api.post("/api/suppliers/", payload);
      }

      await fetchSuppliers();
      primeForm(null);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Unable to save supplier.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(supplier: Supplier) {
    if (!isAdmin) return;
    if (!window.confirm(`Delete supplier ${supplier.supplier_id}?`)) return;
    await api.delete(`/api/suppliers/${supplier.supplier_id}`);
    await fetchSuppliers();
  }

  function toggleFilter() {
    setStatusFilter((current) => {
      if (current === "all") return "active";
      if (current === "active") return "inactive";
      return "all";
    });
  }

  function exportSuppliers() {
    const headers = ["Supplier ID", "Contact ID", "Supplier Name", "Rating", "Contact Email", "Phone", "Status"];
    const rows = filteredSuppliers.map((supplier) => [
      supplier.displayId,
      supplier.displayContactId,
      supplier.displayName,
      supplier.rating.toFixed(1),
      supplier.contact_email,
      supplier.phone,
      supplier.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suppliers-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (!isAdmin && accountType === "client") {
    return <ClientSuppliersPage />;
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "4px" }}>Suppliers Management</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage and monitor all suppliers in your supply chain network.</p>
        </div>
        <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
          <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
          Connected to SQL Server
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Total Suppliers</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{suppliers.length}</div>
          <div style={{ color: "var(--text-secondary)" }}>All Suppliers</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Average Rating</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{averageRating} / 5</div>
          <div style={{ color: "var(--text-secondary)" }}>Across all suppliers</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>Active Suppliers</div>
          <div style={{ color: "var(--accent-indigo)", fontSize: "2rem", fontWeight: 800 }}>{activeSuppliers}</div>
          <div style={{ color: "var(--text-secondary)" }}>Live partner records</div>
        </div>
        <div className="glass-card">
          <div style={{ color: "var(--text-secondary)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase" }}>SQL Sync Status</div>
          <div style={{ color: "var(--color-success)", fontSize: "2rem", fontWeight: 800 }}>Synced</div>
          <div style={{ color: "var(--text-secondary)" }}>Last sync: May 24, 2026</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.8fr 0.7fr" }} className="supplier-layout">
        <div className="glass-card">
          <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ flex: "1 1 340px", position: "relative" }}>
              <input
                className="glass-input"
                placeholder="Search suppliers by name, ID, email..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ paddingLeft: "42px" }}
              />
              <span style={{ color: "var(--text-muted)", left: "14px", position: "absolute", top: "12px" }}>Q</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button className="glass-btn glass-btn-secondary" onClick={toggleFilter} type="button">
                Filter: {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}
              </button>
              <button className="glass-btn glass-btn-secondary" onClick={exportSuppliers} type="button">Export</button>
              {isAdmin && (
                <button className="glass-btn glass-btn-primary" onClick={() => primeForm(null)} type="button">
                  Add Supplier
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div>Loading suppliers...</div>
          ) : error ? (
            <div style={{ color: "var(--color-danger)" }}>{error}</div>
          ) : (
            <div className="glass-table-container">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Supplier ID</th>
                    <th>Contact ID</th>
                    <th>Supplier Name</th>
                    <th>Rating</th>
                    <th>Contact Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.supplier_id}>
                      <td>{supplier.displayId}</td>
                      <td>{supplier.displayContactId}</td>
                      <td>{supplier.displayName}</td>
                      <td>
                        <span style={{ color: "#d97706", marginRight: "8px" }}>{buildStars(supplier.rating)}</span>
                        <span>{supplier.rating.toFixed(1)}</span>
                      </td>
                      <td>{supplier.contact_email}</td>
                      <td>{supplier.phone}</td>
                      <td>
                        <span className={`glass-badge ${supplier.status === "Active" ? "glass-badge-success" : "glass-badge-warning"}`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="glass-btn glass-btn-secondary" onClick={() => primeForm(supplier)} style={{ minHeight: "34px", padding: "6px 10px" }} type="button">Edit</button>
                          <button className="glass-btn glass-btn-danger" disabled={!isAdmin} onClick={() => handleDelete(supplier)} style={{ minHeight: "34px", padding: "6px 10px" }} type="button">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredSuppliers.length && (
                    <tr>
                      <td colSpan={8} style={{ color: "var(--text-secondary)", padding: "20px", textAlign: "center" }}>
                        No suppliers matched the current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: "1.55rem", marginBottom: "6px" }}>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "18px" }}>
            Fill in the details below to {editingSupplier ? "update this supplier." : "add a new supplier."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {formError && <div style={{ color: "var(--color-danger)" }}>{formError}</div>}
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Supplier ID</label>
              <input className="glass-input" value={editingSupplier ? `SUP-${String(editingSupplier.supplier_id).padStart(4, "0")}` : "Auto generated"} disabled />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Contact ID</label>
              <input className="glass-input" value={contactId} onChange={(event) => setContactId(event.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Supplier Name</label>
              <input
                className="glass-input"
                value={supplierName}
                onChange={(event) => setSupplierName(event.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Rating</label>
              <input className="glass-input" max="5" min="1" type="number" value={rating} onChange={(event) => setRating(event.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Contact Email</label>
              <input className="glass-input" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Phone</label>
              <input className="glass-input" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", marginBottom: "6px" }}>Status</label>
              <select className="glass-input" value={status} onChange={(event) => setStatus(event.target.value as "Active" | "Inactive")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button className="glass-btn glass-btn-primary" disabled={!isAdmin || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save Supplier"}
              </button>
              <button className="glass-btn glass-btn-secondary" onClick={() => primeForm(null)} type="button">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .supplier-layout {
          align-items: start;
        }

        @media (max-width: 1180px) {
          .supplier-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
