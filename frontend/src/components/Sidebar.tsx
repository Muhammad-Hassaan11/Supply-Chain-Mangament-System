"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredAccountName, getStoredAccountType } from "@/lib/api";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function navIcon(path: string) {
  const commonProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (path) {
    case "dashboard":
      return (
        <svg {...commonProps}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      );
    case "suppliers":
      return (
        <svg {...commonProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      );
    case "products":
      return (
        <svg {...commonProps}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" /></svg>
      );
    case "warehouses":
      return (
        <svg {...commonProps}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
      );
    case "inventory":
      return (
        <svg {...commonProps}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>
      );
    case "shipments":
      return (
        <svg {...commonProps}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
      );
    case "query":
      return (
        <svg {...commonProps}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      );
    case "reports":
      return (
        <svg {...commonProps}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
      );
    case "settings":
      return (
        <svg {...commonProps}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1v.17a2 2 0 0 1-4 0V21a1.65 1.65 0 0 0-.33-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H2.8a2 2 0 0 1 0-4H3a1.65 1.65 0 0 0 1-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1V2.8a2 2 0 0 1 4 0V3a1.65 1.65 0 0 0 .33 1 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c0 .39.14.76.4 1 .26.26.61.4 1 .4h.17a2 2 0 0 1 0 4H21c-.39 0-.76.14-1 .4Z" /></svg>
      );
    default:
      return (
        <svg {...commonProps}><circle cx="12" cy="12" r="9" /></svg>
      );
  }
}

function buildNavItem(label: string, href: string, iconKey: string): NavItem {
  return { label, href, icon: navIcon(iconKey) };
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [accountLabel, setAccountLabel] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const { user, logout, isAdmin } = useAuth();
  const userEmail = user?.email || null;
  const userRole = user?.role || null;

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", collapsed ? "84px" : "280px");
  }, [collapsed]);

  useEffect(() => {
    const storedAccountType = getStoredAccountType();
    const storedAccountName = getStoredAccountName();
    setAccountType(storedAccountType);
    setAccountName(storedAccountName);

    if (storedAccountType === "supplier") {
      setAccountLabel("Supplier");
    } else if (storedAccountType === "warehouse") {
      setAccountLabel("Warehouse Manager");
    } else if (storedAccountType === "client") {
      setAccountLabel("Client / Buyer");
    } else if (storedAccountType === "logistics") {
      setAccountLabel("Logistics Partner");
    } else {
      setAccountLabel(null);
    }
  }, [userEmail, userRole]);

  const navItems = useMemo(() => {
    if (isAdmin) {
      return [
        buildNavItem("Dashboard", "/dashboard", "dashboard"),
        buildNavItem("Suppliers", "/suppliers", "suppliers"),
        buildNavItem("Products", "/products", "products"),
        buildNavItem("Warehouses", "/warehouses", "warehouses"),
        buildNavItem("Inventory", "/inventory", "inventory"),
        buildNavItem("Shipments", "/shipments", "shipments"),
        buildNavItem("Query Lab", "/query-lab", "query"),
        buildNavItem("Reports", "/reports", "reports"),
        buildNavItem("Settings", "/settings", "settings"),
      ];
    }

    if (accountType === "supplier") {
      return [
        buildNavItem("Dashboard", "/dashboard", "dashboard"),
        buildNavItem("My Products", "/products", "products"),
        buildNavItem("My Orders", "/reports", "reports"),
        buildNavItem("My Shipments", "/shipments", "shipments"),
        buildNavItem("Analytics", "/reports", "reports"),
        buildNavItem("Profile", "/settings", "settings"),
        buildNavItem("Support", "/contact", "settings"),
      ];
    }

    if (accountType === "warehouse") {
      return [
        buildNavItem("Dashboard", "/dashboard", "dashboard"),
        buildNavItem("My Warehouse", "/warehouses", "warehouses"),
        buildNavItem("Inventory", "/inventory", "inventory"),
        buildNavItem("Incoming Shipments", "/shipments", "shipments"),
        buildNavItem("Outgoing Shipments", "/shipments", "shipments"),
        buildNavItem("Low Stock Alerts", "/inventory", "inventory"),
        buildNavItem("Reports", "/reports", "reports"),
        buildNavItem("Profile", "/settings", "settings"),
      ];
    }

    if (accountType === "client") {
      return [
        buildNavItem("Dashboard", "/dashboard", "dashboard"),
        buildNavItem("My Orders", "/reports", "reports"),
        buildNavItem("Track Shipments", "/shipments", "shipments"),
        buildNavItem("Suppliers", "/suppliers", "suppliers"),
        buildNavItem("Reports", "/reports", "reports"),
        buildNavItem("Invoices", "/reports", "reports"),
        buildNavItem("Profile", "/settings", "settings"),
        buildNavItem("Support", "/contact", "settings"),
      ];
    }

    if (accountType === "logistics") {
      return [
        buildNavItem("Dashboard", "/dashboard", "dashboard"),
        buildNavItem("Assigned Shipments", "/shipments", "shipments"),
        buildNavItem("Delivery Routes", "/shipments", "shipments"),
        buildNavItem("Tracking Logs", "/shipments", "shipments"),
        buildNavItem("Fleet", "/reports", "reports"),
        buildNavItem("Performance", "/reports", "reports"),
        buildNavItem("Profile", "/settings", "settings"),
        buildNavItem("Support", "/contact", "settings"),
      ];
    }

    return [
      buildNavItem("Dashboard", "/dashboard", "dashboard"),
      buildNavItem("Reports", "/reports", "reports"),
      buildNavItem("Profile", "/settings", "settings"),
    ];
  }, [accountType, isAdmin]);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`} id="sidebar-nav">
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f9a94" />
                <stop offset="100%" stopColor="#20b7b0" />
              </linearGradient>
            </defs>
            <path d="M24 4 41 13.5v21L24 44 7 34.5v-21L24 4Z" />
            <path d="M15.5 18.2 24 23l8.5-4.8M24 23v10.4" />
          </svg>
        </div>
        {!collapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>SCM</span>
            <span className={styles.brandSub}>Supply Chain Management</span>
          </div>
        )}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          id="sidebar-collapse-btn"
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              id={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              {isActive && <span className={styles.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        {userEmail ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {userEmail.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className={styles.userDetails}>
                  <span className={styles.userEmail}>{accountName || userEmail}</span>
                  <span className={`${styles.userRole} ${userRole === "Admin" ? styles.roleAdmin : styles.roleViewer}`}>
                    {userRole === "Admin" ? "Admin" : accountLabel || "Team Member"}
                  </span>
                </div>
              )}
            </div>
            <button onClick={logout} className={styles.logoutBtn} id="sidebar-logout-btn" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn} id="sidebar-login-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            {!collapsed && <span>Login</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}
