"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useMemo, useState } from "react";
import { api, getStoredAccountName, getStoredAccountType } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type ThemeMode = "Light" | "Dark" | "System";
type SessionTimeout = "15 minutes" | "30 minutes" | "1 hour" | "4 hours";

interface AdminUser {
  user_id: number;
  email: string;
  role: "Admin" | "Viewer";
  full_name: string;
  account_type: "admin" | "supplier" | "warehouse" | "client" | "logistics" | null;
  status: "Active" | "Suspended";
  created_at: string;
}

function SettingCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <h2 style={{ fontSize: "1.12rem" }}>{title}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: ".88rem", marginTop: "4px" }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function applyVisualSettings(primaryColor: string, accentColor: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent-indigo", primaryColor);
  root.style.setProperty("--border-glass-active", primaryColor);
  root.style.setProperty("--accent-cyan", accentColor);
  root.style.setProperty("--accent-indigo-glow", `${primaryColor}24`);
  root.style.setProperty("--accent-cyan-glow", `${accentColor}24`);
}

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const accountType = getStoredAccountType();
  const accountName = getStoredAccountName();

  const [fullName, setFullName] = useState<string>("");
  const [supportEmail, setSupportEmail] = useState<string>("support@supplychain.com");
  const [companyName, setCompanyName] = useState<string>("Supply Chain Management");
  const [primaryColor, setPrimaryColor] = useState<string>("#0f9a94");

  const [dbServerHost, setDbServerHost] = useState<string>("localhost");
  const [dbName, setDbName] = useState<string>("SupplyChain_Management");
  const [dbUsername, setDbUsername] = useState<string>("");
  const [dbPassword, setDbPassword] = useState<string>("");
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [lastConnected, setLastConnected] = useState<string | null>(null);
  const [testingDb, setTestingDb] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [shipmentDelayAlerts, setShipmentDelayAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState<SessionTimeout>("30 minutes");

  const [themeMode, setThemeMode] = useState<ThemeMode>("Light");
  const [accentColor, setAccentColor] = useState<string>("#0f9a94");
  const [tableDensity, setTableDensity] = useState<"Comfortable" | "Compact">("Comfortable");

  const [apiKey, setApiKey] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<"Excel (.xlsx)" | "CSV (.csv)">("Excel (.xlsx)");

  const [dirty, setDirty] = useState(false);
  const [snapshot, setSnapshot] = useState<string>("");
  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({});

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

  const timezoneLabel = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local timezone";
    } catch {
      return "Local timezone";
    }
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("account_name") || accountName || "Supply Chain User";
    const storedCompany = localStorage.getItem("company_name") || "Supply Chain Management";

    setFullName(storedName);
    setCompanyName(storedCompany);
    setSupportEmail(localStorage.getItem("settings:support_email") || "support@supplychain.com");
    setPrimaryColor(localStorage.getItem("settings:primary_color") || "#0f9a94");

    setDbServerHost(localStorage.getItem("settings:db_server_host") || "localhost");
    setDbName(localStorage.getItem("settings:db_name") || "SupplyChain_Management");
    setDbUsername(localStorage.getItem("settings:db_username") || "");
    setDbPassword(localStorage.getItem("settings:db_password") || "");
    setLastConnected(localStorage.getItem("settings:last_connected") || null);

    setEmailAlerts(localStorage.getItem("settings:email_alerts") !== "false");
    setLowStockAlerts(localStorage.getItem("settings:low_stock_alerts") !== "false");
    setShipmentDelayAlerts(localStorage.getItem("settings:shipment_delay_alerts") !== "false");
    setWeeklyReports(localStorage.getItem("settings:weekly_reports") === "true");

    setTwoFaEnabled(localStorage.getItem("settings:2fa") === "true");
    setSessionTimeout((localStorage.getItem("settings:session_timeout") as SessionTimeout) || "30 minutes");

    setThemeMode((localStorage.getItem("settings:theme") as ThemeMode) || "Light");
    setAccentColor(localStorage.getItem("settings:accent_color") || "#0f9a94");
    setTableDensity((localStorage.getItem("settings:table_density") as "Comfortable" | "Compact") || "Comfortable");

    setApiKey(localStorage.getItem("settings:api_key") || "");
    setExportFormat((localStorage.getItem("settings:export_format") as "Excel (.xlsx)" | "CSV (.csv)") || "Excel (.xlsx)");
    applyVisualSettings(
      localStorage.getItem("settings:primary_color") || "#0f9a94",
      localStorage.getItem("settings:accent_color") || "#0f9a94"
    );

    const snap = JSON.stringify({
      fullName: storedName,
      companyName: storedCompany,
      supportEmail: localStorage.getItem("settings:support_email") || "support@supplychain.com",
      primaryColor: localStorage.getItem("settings:primary_color") || "#0f9a94",
      dbServerHost: localStorage.getItem("settings:db_server_host") || "localhost",
      dbName: localStorage.getItem("settings:db_name") || "SupplyChain_Management",
      dbUsername: localStorage.getItem("settings:db_username") || "",
      dbPassword: localStorage.getItem("settings:db_password") || "",
      emailAlerts: localStorage.getItem("settings:email_alerts") !== "false",
      lowStockAlerts: localStorage.getItem("settings:low_stock_alerts") !== "false",
      shipmentDelayAlerts: localStorage.getItem("settings:shipment_delay_alerts") !== "false",
      weeklyReports: localStorage.getItem("settings:weekly_reports") === "true",
      twoFaEnabled: localStorage.getItem("settings:2fa") === "true",
      sessionTimeout: (localStorage.getItem("settings:session_timeout") as SessionTimeout) || "30 minutes",
      themeMode: (localStorage.getItem("settings:theme") as ThemeMode) || "Light",
      accentColor: localStorage.getItem("settings:accent_color") || "#0f9a94",
      tableDensity: (localStorage.getItem("settings:table_density") as "Comfortable" | "Compact") || "Comfortable",
      apiKey: localStorage.getItem("settings:api_key") || "",
      exportFormat: (localStorage.getItem("settings:export_format") as "Excel (.xlsx)" | "CSV (.csv)") || "Excel (.xlsx)",
    });
    setSnapshot(snap);
    setDirty(false);

    if (isAdmin) {
      api
        .get<AdminUser[]>("/api/users")
        .then((usersList) => {
          const counts: { [key: string]: number } = {
            Admin: 0,
            Supplier: 0,
            "Warehouse Manager": 0,
            Client: 0,
            "Logistics Partner": 0,
          };
          for (const u of usersList) {
            if (u.role === "Admin") counts["Admin"] += 1;
            const t = u.account_type || "client";
            if (t === "supplier") counts["Supplier"] += 1;
            else if (t === "warehouse") counts["Warehouse Manager"] += 1;
            else if (t === "logistics") counts["Logistics Partner"] += 1;
            else counts["Client"] += 1;
          }
          setRoleCounts(counts);
        })
        .catch(() => setRoleCounts({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    const current = JSON.stringify({
      fullName,
      companyName,
      supportEmail,
      primaryColor,
      dbServerHost,
      dbName,
      dbUsername,
      dbPassword,
      emailAlerts,
      lowStockAlerts,
      shipmentDelayAlerts,
      weeklyReports,
      twoFaEnabled,
      sessionTimeout,
      themeMode,
      accentColor,
      tableDensity,
      apiKey,
      exportFormat,
    });
    setDirty(current !== snapshot);
  }, [
    fullName,
    companyName,
    supportEmail,
    primaryColor,
    dbServerHost,
    dbName,
    dbUsername,
    dbPassword,
    emailAlerts,
    lowStockAlerts,
    shipmentDelayAlerts,
    weeklyReports,
    twoFaEnabled,
    sessionTimeout,
    themeMode,
    accentColor,
    tableDensity,
    apiKey,
    exportFormat,
    snapshot,
  ]);

  const save = () => {
    localStorage.setItem("account_name", fullName);
    localStorage.setItem("company_name", companyName);
    localStorage.setItem("settings:support_email", supportEmail);
    localStorage.setItem("settings:primary_color", primaryColor);
    localStorage.setItem("settings:db_server_host", dbServerHost);
    localStorage.setItem("settings:db_name", dbName);
    localStorage.setItem("settings:db_username", dbUsername);
    localStorage.setItem("settings:db_password", dbPassword);
    localStorage.setItem("settings:last_connected", lastConnected || "");
    localStorage.setItem("settings:email_alerts", String(emailAlerts));
    localStorage.setItem("settings:low_stock_alerts", String(lowStockAlerts));
    localStorage.setItem("settings:shipment_delay_alerts", String(shipmentDelayAlerts));
    localStorage.setItem("settings:weekly_reports", String(weeklyReports));
    localStorage.setItem("settings:2fa", String(twoFaEnabled));
    localStorage.setItem("settings:session_timeout", sessionTimeout);
    localStorage.setItem("settings:theme", themeMode);
    localStorage.setItem("settings:accent_color", accentColor);
    localStorage.setItem("settings:table_density", tableDensity);
    localStorage.setItem("settings:api_key", apiKey);
    localStorage.setItem("settings:export_format", exportFormat);
    applyVisualSettings(primaryColor, accentColor);
    window.dispatchEvent(new Event("scm-settings-updated"));

    setSnapshot(
      JSON.stringify({
        fullName,
        companyName,
        supportEmail,
        primaryColor,
        dbServerHost,
        dbName,
        dbUsername,
        dbPassword,
        emailAlerts,
        lowStockAlerts,
        shipmentDelayAlerts,
        weeklyReports,
        twoFaEnabled,
        sessionTimeout,
        themeMode,
        accentColor,
        tableDensity,
        apiKey,
        exportFormat,
      })
    );
    setDirty(false);
  };

  const cancel = () => {
    try {
      const snap = JSON.parse(snapshot) as Record<string, unknown>;
      setFullName(String(snap.fullName ?? fullName));
      setCompanyName(String(snap.companyName ?? companyName));
      setSupportEmail(String(snap.supportEmail ?? supportEmail));
      setPrimaryColor(String(snap.primaryColor ?? primaryColor));
      setDbServerHost(String(snap.dbServerHost ?? dbServerHost));
      setDbName(String(snap.dbName ?? dbName));
      setDbUsername(String(snap.dbUsername ?? dbUsername));
      setDbPassword(String(snap.dbPassword ?? dbPassword));
      setEmailAlerts(Boolean(snap.emailAlerts ?? emailAlerts));
      setLowStockAlerts(Boolean(snap.lowStockAlerts ?? lowStockAlerts));
      setShipmentDelayAlerts(Boolean(snap.shipmentDelayAlerts ?? shipmentDelayAlerts));
      setWeeklyReports(Boolean(snap.weeklyReports ?? weeklyReports));
      setTwoFaEnabled(Boolean(snap.twoFaEnabled ?? twoFaEnabled));
      setSessionTimeout((snap.sessionTimeout as SessionTimeout) || sessionTimeout);
      setThemeMode((snap.themeMode as ThemeMode) || themeMode);
      setAccentColor(String(snap.accentColor ?? accentColor));
      setTableDensity((snap.tableDensity as "Comfortable" | "Compact") || tableDensity);
      setApiKey(String(snap.apiKey ?? apiKey));
      setExportFormat((snap.exportFormat as "Excel (.xlsx)" | "CSV (.csv)") || exportFormat);
    } catch {
      // ignore
    }
    setDirty(false);
  };

  const testConnection = async () => {
    setTestingDb(true);
    try {
      await api.get("/");
      setDbConnected(true);
      const now = new Date();
      setLastConnected(now.toLocaleString());
    } catch {
      setDbConnected(false);
    } finally {
      setTestingDb(false);
    }
  };

  const roleRows = useMemo(
    () => [
      { role: "Admin", users: roleCounts["Admin"] ?? "—", perms: "Full Access", status: "Active" },
      { role: "Supplier", users: roleCounts["Supplier"] ?? "—", perms: "Limited Access", status: "Active" },
      { role: "Warehouse Manager", users: roleCounts["Warehouse Manager"] ?? "—", perms: "Inventory & Shipments", status: "Active" },
      { role: "Client", users: roleCounts["Client"] ?? "—", perms: "View Only", status: "Active" },
      { role: "Logistics Partner", users: roleCounts["Logistics Partner"] ?? "—", perms: "Shipments & Tracking", status: "Active" },
    ],
    [roleCounts]
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.15rem", marginBottom: "4px" }}>Settings</h1>
          <p style={{ color: "var(--text-secondary)" }}>System configuration and admin preferences.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div className="glass-badge glass-badge-success" style={{ padding: "10px 14px" }}>
            <span style={{ background: dbConnected ? "#10a66a" : "#dc2626", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
            {dbConnected ? "Connected to SQL Server" : "Disconnected"}
          </div>
          <div className="glass-badge glass-badge-info">{roleLabel}</div>
          <button className="glass-btn glass-btn-secondary" onClick={cancel} disabled={!dirty}>
            Cancel
          </button>
          <button className={`glass-btn glass-btn-primary ${!dirty ? "glass-btn-disabled" : ""}`} onClick={save} disabled={!dirty}>
            Save Changes
          </button>
        </div>
      </div>

      <div
        className="settings-grid"
        style={{
          display: "grid",
          gap: "18px",
          gridTemplateColumns: isAdmin ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
          alignItems: "start",
        }}
      >
        <SettingCard title="Admin Profile" subtitle="Manage your personal information.">
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "96px 1fr", alignItems: "center" }}>
            <div style={{ position: "relative", width: "92px", height: "92px" }}>
              <div style={{ width: "92px", height: "92px", borderRadius: "999px", background: "#eefaf8", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-indigo)" }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <button className="glass-btn glass-btn-secondary" type="button" style={{ position: "absolute", bottom: "-6px", right: "-6px", padding: "8px 10px", minHeight: "auto" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-fullname">Full Name</label>
                <input id="settings-fullname" className="glass-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-email">Email</label>
                <input id="settings-email" className="glass-input" value={user?.email || ""} readOnly />
              </div>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ display: "grid", gap: "6px" }}>
                  <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-role">Role</label>
                  <select id="settings-role" className="glass-input" value={isAdmin ? "Administrator" : "Viewer"} disabled>
                    <option value="Administrator">Administrator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div style={{ display: "grid", gap: "6px" }}>
                  <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-timezone">Timezone</label>
                  <select id="settings-timezone" className="glass-input" value={timezoneLabel} disabled>
                    <option value={timezoneLabel}>{timezoneLabel}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {isAdmin ? (
          <SettingCard title="Company & Branding" subtitle="Manage company information and branding.">
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gap: "6px" }}>
              <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-company">Company Name</label>
              <input id="settings-company" className="glass-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-support-email">Support Email</label>
              <input id="settings-support-email" className="glass-input" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            </div>

            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ border: "1px dashed #cfe4e2", borderRadius: "10px", padding: "14px", background: "#f8fdfc" }}>
                <div style={{ fontWeight: 800, marginBottom: "6px" }}>Company Logo</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".88rem" }}>Upload logo (PNG, JPG or SVG)</div>
                <button className="glass-btn glass-btn-secondary" type="button" style={{ marginTop: "10px", width: "100%" }}>
                  Upload Logo
                </button>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ fontWeight: 800 }}>Primary Color</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["#0f9a94", "#20b7b0", "#0284c7", "#6d28d9", "#ef4444", "#f97316", "#94a3b8"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "999px",
                        background: c,
                        border: primaryColor === c ? "3px solid #ffffff" : "1px solid rgba(16, 39, 45, 0.12)",
                        boxShadow: primaryColor === c ? "0 0 0 2px rgba(15, 154, 148, 0.22)" : "none",
                        cursor: "pointer",
                      }}
                      aria-label={`Primary color ${c}`}
                    />
                  ))}
                </div>
                <div style={{ border: "1px solid var(--border-glass)", borderRadius: "10px", background: "#f8fdfc", padding: "10px" }}>
                  <div style={{ fontWeight: 800, marginBottom: "6px" }}>Theme Preview</div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <div style={{ height: 8, borderRadius: 999, background: "#dfeeed" }} />
                    <div style={{ height: 8, borderRadius: 999, background: primaryColor, opacity: 0.35 }} />
                    <div style={{ height: 8, borderRadius: 999, background: primaryColor, opacity: 0.18 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </SettingCard>
        ) : null}

        {isAdmin ? (
          <SettingCard title="SQL Server / Database Connection" subtitle="Configure your database connection.">
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-db-server">Server Host</label>
                <input id="settings-db-server" className="glass-input" value={dbServerHost} onChange={(e) => setDbServerHost(e.target.value)} />
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-db-name">Database Name</label>
                <input id="settings-db-name" className="glass-input" value={dbName} onChange={(e) => setDbName(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-db-user">Username</label>
                <input id="settings-db-user" className="glass-input" value={dbUsername} onChange={(e) => setDbUsername(e.target.value)} placeholder="e.g., scm_admin" />
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-db-pass">Password</label>
                <input id="settings-db-pass" className="glass-input" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} type="password" placeholder="••••••••" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <div style={{ fontWeight: 800 }}>Connection Status</div>
                <div style={{ color: dbConnected ? "var(--color-success)" : "var(--color-danger)", fontWeight: 800 }}>
                  {dbConnected ? "Connected" : "Disconnected"}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>
                  Last connected: {lastConnected || "—"}
                </div>
              </div>
              <button className="glass-btn glass-btn-secondary" onClick={testConnection} disabled={testingDb}>
                {testingDb ? "Testing..." : "Test Connection"}
              </button>
            </div>
          </div>
          </SettingCard>
        ) : null}

        <SettingCard title="Notifications" subtitle="Configure system email and alert preferences.">
          {[
            { label: "Email Alerts", desc: "Receive general system notifications.", value: emailAlerts, set: setEmailAlerts },
            { label: "Low Stock Alerts", desc: "Get notified when inventory is low", value: lowStockAlerts, set: setLowStockAlerts },
            { label: "Shipment Delay Alerts", desc: "Receive alerts for delayed shipments", value: shipmentDelayAlerts, set: setShipmentDelayAlerts },
            { label: "Weekly Reports", desc: "Receive weekly summary reports", value: weeklyReports, set: setWeeklyReports },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "grid", gap: "2px" }}>
                <div style={{ fontWeight: 800 }}>{row.label}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>{row.desc}</div>
              </div>
              <input className="glass-toggle" type="checkbox" checked={row.value} onChange={(e) => row.set(e.target.checked)} />
            </div>
          ))}
          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-notify-email">Notification Email</label>
            <input id="settings-notify-email" className="glass-input" value={user?.email || ""} readOnly />
          </div>
        </SettingCard>

        <SettingCard title="Security" subtitle="Manage password, 2FA and security preferences.">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 800 }}>Change Password</div>
            <button className="glass-btn glass-btn-secondary" type="button">Change Password</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "grid", gap: "2px" }}>
              <div style={{ fontWeight: 800 }}>Two-Factor Authentication (2FA)</div>
              <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Add an extra layer of security</div>
            </div>
            <input className="glass-toggle" type="checkbox" checked={twoFaEnabled} onChange={(e) => setTwoFaEnabled(e.target.checked)} />
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-session-timeout">Session Timeout</label>
            <select id="settings-session-timeout" className="glass-input" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value as SessionTimeout)}>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="4 hours">4 hours</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: "2px" }}>
              <div style={{ fontWeight: 800 }}>IP Allowlist</div>
              <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Restrict access to trusted IP addresses</div>
            </div>
            <button className="glass-btn glass-btn-secondary" type="button">Manage IPs</button>
          </div>
        </SettingCard>

        {isAdmin ? (
          <SettingCard title="User Roles & Permissions" subtitle="Manage roles and access levels.">
          <div className="glass-table-container">
            <table className="glass-table" style={{ minWidth: "640px" }}>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Users</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roleRows.map((r) => (
                  <tr key={r.role}>
                    <td style={{ fontWeight: 800 }}>{r.role}</td>
                    <td>{r.users}</td>
                    <td><span className="glass-badge glass-badge-info">{r.perms}</span></td>
                    <td><span className="glass-badge glass-badge-success">{r.status}</span></td>
                    <td>
                      <button className="glass-btn glass-btn-secondary" type="button" style={{ padding: "8px 10px", minHeight: "auto" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="glass-btn glass-btn-secondary" type="button" style={{ alignSelf: "flex-start" }}>
            Manage all roles & permissions →
          </button>
          </SettingCard>
        ) : null}

        <SettingCard title="Appearance" subtitle="Customize the look and feel of the platform.">
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gap: "6px" }}>
              <div style={{ fontWeight: 800 }}>Theme</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {(["Light", "Dark", "System"] as ThemeMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`glass-btn ${themeMode === mode ? "glass-btn-primary" : "glass-btn-secondary"}`}
                    onClick={() => setThemeMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
              <div style={{ fontWeight: 800 }}>Accent Color</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["#0f9a94", "#0284c7", "#6d28d9", "#ef4444", "#f97316", "#94a3b8"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccentColor(c)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "999px",
                      background: c,
                      border: accentColor === c ? "3px solid #ffffff" : "1px solid rgba(16, 39, 45, 0.12)",
                      boxShadow: accentColor === c ? "0 0 0 2px rgba(15, 154, 148, 0.22)" : "none",
                      cursor: "pointer",
                    }}
                    aria-label={`Accent color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
              <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-table-density">Table Density</label>
              <select id="settings-table-density" className="glass-input" value={tableDensity} onChange={(e) => setTableDensity(e.target.value as "Comfortable" | "Compact")}>
                <option value="Comfortable">Comfortable</option>
                <option value="Compact">Compact</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {isAdmin ? (
          <SettingCard title="Integrations" subtitle="Connect and configure external services.">
          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "grid", gap: "6px" }}>
              <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-api-key">API Key</label>
              <input id="settings-api-key" className="glass-input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="•••• •••• •••• •••• 7a3b" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: "2px" }}>
                <div style={{ fontWeight: 800 }}>Webhooks</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Configure outgoing webhooks</div>
              </div>
              <button className="glass-btn glass-btn-secondary" type="button">Configure</button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: "2px" }}>
                <div style={{ fontWeight: 800 }}>ERP Integration</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Connect to your ERP system</div>
              </div>
              <div className="glass-badge glass-badge-success">
                <span style={{ background: "#10a66a", borderRadius: "50%", display: "inline-block", height: "8px", width: "8px" }} />
                Connected
              </div>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
              <label style={{ fontSize: ".88rem", fontWeight: 700 }} htmlFor="settings-export-format">Export Settings</label>
              <select id="settings-export-format" className="glass-input" value={exportFormat} onChange={(e) => setExportFormat(e.target.value as "Excel (.xlsx)" | "CSV (.csv)")}>
                <option value="Excel (.xlsx)">Excel (.xlsx)</option>
                <option value="CSV (.csv)">CSV (.csv)</option>
              </select>
            </div>
          </div>
          </SettingCard>
        ) : null}

        {isAdmin ? (
          <SettingCard title="System Information" subtitle="View system details and environment info.">
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              ["System Version", "v2.4.1"],
              ["Environment", "Production"],
              ["Server Time", new Date().toLocaleString()],
              ["Uptime", "15 days, 6 hours, 24 minutes"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: "2px" }}>
                <div style={{ fontWeight: 800 }}>Data Backup</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>Last backup: {lastConnected || "—"}</div>
              </div>
              <button className="glass-btn glass-btn-secondary" type="button">Backup Now</button>
            </div>
          </div>
          </SettingCard>
        ) : null}
      </div>

      <style jsx>{`
        @media (max-width: 1220px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
