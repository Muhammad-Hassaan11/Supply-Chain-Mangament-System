"use client";

import React from "react";
import { getStoredAccountName, getStoredAccountType } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <h2 style={{ fontSize: "1.2rem" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const accountType = getStoredAccountType();
  const accountName = getStoredAccountName();
  const roleLabel = isAdmin
    ? "Admin"
    : accountType === "supplier"
      ? "Supplier"
      : accountType === "warehouse"
        ? "Warehouse Manager"
        : accountType === "client"
          ? "Client / Buyer"
          : accountType === "logistics"
            ? "Logistics Partner"
            : "Team Member";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Settings</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {isAdmin ? "System, branding, access control, and integration settings." : "Profile and workspace preferences."}
          </p>
        </div>
        <div className="glass-badge glass-badge-info">{roleLabel}</div>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", alignItems: "start" }} className="settings-grid">
        <SettingCard title="Profile">
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Name</span><strong>{accountName || "Supply Chain User"}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Email</span><strong>{user?.email || "Not signed in"}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Role</span><strong>{roleLabel}</strong></div>
          </div>
        </SettingCard>

        {isAdmin && (
          <>
            <SettingCard title="Company and Branding">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Company Name</span><strong>Supply Chain Management</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Region</span><strong>North America</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Theme</span><strong>Light Operations UI</strong></div>
              </div>
            </SettingCard>

            <SettingCard title="Database Connection">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Server</span><strong>localhost</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Database</span><strong>SupplyChain_Management</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Status</span><strong style={{ color: "var(--color-success)" }}>Connected</strong></div>
              </div>
            </SettingCard>

            <SettingCard title="Notifications">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Low Stock Alerts</span><strong>Enabled</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Shipment Delays</span><strong>Enabled</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Weekly Reports</span><strong>Scheduled</strong></div>
              </div>
            </SettingCard>

            <SettingCard title="Security">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>JWT Sessions</span><strong>24 hours</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Admin Signup Code</span><strong>Configured</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Trusted SQL Auth</span><strong>Enabled</strong></div>
              </div>
            </SettingCard>

            <SettingCard title="Roles and Permissions">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Admin</span><strong>Full access</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Supplier</span><strong>Catalog and shipment access</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Warehouse</span><strong>Inventory and handling access</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Client / Logistics</span><strong>Operational views</strong></div>
              </div>
            </SettingCard>
          </>
        )}

        {!isAdmin && (
          <>
            <SettingCard title="Workspace">
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Dashboard Layout</span><strong>Prototype Mode</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Alerts</span><strong>Enabled</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Support Contact</span><strong>Available</strong></div>
              </div>
            </SettingCard>
          </>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
