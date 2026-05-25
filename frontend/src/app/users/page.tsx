"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type UserMetricValue = string | number;

interface UserMetrics {
  a_label: string;
  a_value: UserMetricValue;
  b_label: string;
  b_value: UserMetricValue;
}

interface AdminUser {
  user_id: number;
  email: string;
  role: "Admin" | "Viewer";
  full_name: string;
  account_type: "admin" | "supplier" | "warehouse" | "client" | "logistics" | null;
  status: "Active" | "Suspended";
  created_at: string;
  metrics?: UserMetrics;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return (first + last).toUpperCase();
}

function formatMetric(value: UserMetricValue, label: string) {
  if (label.toLowerCase() === "rating") {
    return `★ ${value}`;
  }
  return String(value);
}

function accountLabel(user: AdminUser) {
  const accountType = user.account_type || (user.role === "Admin" ? "admin" : "client");
  switch (accountType) {
    case "supplier":
      return { text: "Supplier", tone: "info" as const };
    case "warehouse":
      return { text: "Warehouse Mgr", tone: "warning" as const };
    case "client":
      return { text: "Client", tone: "success" as const };
    case "logistics":
      return { text: "Logistics", tone: "danger" as const };
    case "admin":
      return { text: "Admin", tone: "info" as const };
    default:
      return { text: "User", tone: "info" as const };
  }
}

function badgeClass(tone: "success" | "warning" | "danger" | "info") {
  if (tone === "success") return "glass-badge glass-badge-success";
  if (tone === "warning") return "glass-badge glass-badge-warning";
  if (tone === "danger") return "glass-badge glass-badge-danger";
  return "glass-badge glass-badge-info";
}

function AddUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "Viewer">("Viewer");
  const [accountType, setAccountType] = useState<AdminUser["account_type"]>("client");
  const [status, setStatus] = useState<AdminUser["status"]>("Active");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("Viewer");
      setAccountType("client");
      setStatus("Active");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await api.post<AdminUser>("/api/users", {
        full_name: fullName,
        email,
        password,
        role,
        account_type: role === "Admin" ? "admin" : accountType,
        status,
      });
      onCreated(created);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        background: "rgba(16, 39, 45, 0.28)",
        inset: 0,
        position: "fixed",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-card" style={{ maxWidth: "560px", width: "100%", padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem" }}>Add User</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Create a new account and assign role & access.</p>
          </div>
          <button className="glass-btn glass-btn-secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {error ? (
          <div style={{ marginTop: "14px" }} className="glass-badge glass-badge-danger">
            {error}
          </div>
        ) : null}

        <form onSubmit={submit} style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-fullname">
              Full name
            </label>
            <input
              id="add-user-fullname"
              className="glass-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Sara Raza"
              required
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-email">
              Email
            </label>
            <input
              id="add-user-email"
              className="glass-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-password">
              Password
            </label>
            <input
              id="add-user-password"
              className="glass-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ display: "grid", gap: "8px" }}>
              <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-role">
                Role
              </label>
              <select id="add-user-role" className="glass-input" value={role} onChange={(e) => setRole(e.target.value as "Admin" | "Viewer")}>
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-status">
                Status
              </label>
              <select id="add-user-status" className="glass-input" value={status} onChange={(e) => setStatus(e.target.value as AdminUser["status"])}>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontWeight: 700, fontSize: ".9rem" }} htmlFor="add-user-accounttype">
              Account type
            </label>
            <select
              id="add-user-accounttype"
              className="glass-input"
              value={role === "Admin" ? "admin" : accountType || "client"}
              onChange={(e) => setAccountType(e.target.value as AdminUser["account_type"])}
              disabled={role === "Admin"}
            >
              <option value="client">Client</option>
              <option value="supplier">Supplier</option>
              <option value="warehouse">Warehouse</option>
              <option value="logistics">Logistics</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
            <button className="glass-btn glass-btn-secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className={`glass-btn glass-btn-primary ${loading ? "glass-btn-disabled" : ""}`} type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: AdminUser }) {
  const badge = accountLabel(user);
  const metrics = user.metrics;

  const avatarBg = useMemo(() => {
    const type = user.account_type || (user.role === "Admin" ? "admin" : "client");
    if (type === "supplier") return "#0f9a94";
    if (type === "warehouse") return "#0284c7";
    if (type === "client") return "#6d28d9";
    if (type === "logistics") return "#f97316";
    return "#0f9a94";
  }, [user.account_type, user.role]);

  return (
    <section className="glass-card" style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            alignItems: "center",
            background: avatarBg,
            borderRadius: "50%",
            color: "#ffffff",
            display: "flex",
            fontSize: ".9rem",
            fontWeight: 800,
            height: "34px",
            justifyContent: "center",
            width: "34px",
          }}
        >
          {initials(user.full_name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, lineHeight: 1.2 }}>{user.full_name}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: ".86rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.email}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <span className={badgeClass(badge.tone)}>{badge.text}</span>
        {user.status !== "Active" ? <span className="glass-badge glass-badge-warning">Suspended</span> : null}
      </div>

      <div style={{ height: 1, background: "var(--border-glass)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <div style={{ color: "var(--text-secondary)", fontSize: ".86rem" }}>{metrics?.a_label || "—"}</div>
          <div style={{ fontWeight: 800, marginTop: "2px" }}>{metrics ? formatMetric(metrics.a_value, metrics.a_label) : "—"}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-secondary)", fontSize: ".86rem" }}>{metrics?.b_label || "—"}</div>
          <div style={{ fontWeight: 800, marginTop: "2px" }}>{metrics ? formatMetric(metrics.b_value, metrics.b_label) : "—"}</div>
        </div>
      </div>
    </section>
  );
}

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<AdminUser[]>("/api/users");
      setUsers(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    load();
  }, [isAdmin, load]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.full_name, user.email, user.role, user.account_type || "", user.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search, users]);

  if (!isAdmin) {
    return (
      <div className="animate-fade-in" style={{ display: "grid", gap: "14px", maxWidth: "720px" }}>
        <h1 style={{ fontSize: "2.1rem" }}>All Users</h1>
        <p style={{ color: "var(--text-secondary)" }}>Admin-only view — you don’t have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>All Users</h1>
          <p style={{ color: "var(--text-secondary)" }}>Admin-only view — manage roles, access, and account status.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
            <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
            SQL Server connected
          </div>
          <div style={{ position: "relative", width: "280px" }}>
            <input
              className="glass-input"
              placeholder="Search users..."
              style={{ paddingLeft: "38px" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span style={{ color: "var(--text-muted)", left: "12px", position: "absolute", top: "12px" }}>⌕</span>
          </div>
          <button className="glass-btn glass-btn-primary" onClick={() => setAddOpen(true)}>
            Add User
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-card" style={{ borderColor: "#fecaca", background: "#fef2f2", color: "#7f1d1d" }}>
          {error}{" "}
          <button className="glass-btn glass-btn-secondary" style={{ marginLeft: "12px" }} onClick={load}>
            Retry
          </button>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card glass-shimmer" style={{ height: "132px", padding: "18px" }} />
            ))
          : filteredUsers.map((user) => <UserCard key={user.user_id} user={user} />)}
      </div>
      {!loading && !filteredUsers.length ? (
        <div className="glass-card" style={{ color: "var(--text-secondary)", textAlign: "center" }}>
          No users matched your search.
        </div>
      ) : null}

      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(created) => setUsers((prev) => [created, ...prev])}
      />
    </div>
  );
}
