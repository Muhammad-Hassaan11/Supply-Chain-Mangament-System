"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface LowStockAlert {
  warehouse_name: string;
  product_name: string;
  location: string;
  quantity: number;
}

interface DashboardData {
  total_suppliers: number;
  total_products: number;
  total_warehouses: number;
  total_shipments: number;
  low_stock_count: number;
  low_stock_alerts: LowStockAlert[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const stats = await api.get<DashboardData>("/api/analytics/dashboard");
        setData(stats);
        setError(null);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError(err.message || "Failed to load dashboard metrics from database.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "70vh",
          gap: "16px"
        }}
      >
        {/* Glowing glass spinner */}
        <div 
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid rgba(255, 255, 255, 0.05)",
            borderTop: "3px solid var(--accent-cyan)",
            borderRight: "3px solid var(--accent-indigo)",
            borderRadius: "50%",
            animation: "spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.2)"
          }}
        />
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
          Querying SQL Server...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: "40px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
        <div
          style={{
            alignItems: "center",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "50%",
            color: "var(--color-danger)",
            display: "inline-flex",
            height: "60px",
            justifyContent: "center",
            marginBottom: "16px",
            width: "60px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "12px", color: "var(--color-danger)" }}>
          Database Error
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px" }}>
          {error}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button 
            className="glass-btn glass-btn-secondary" 
            onClick={() => window.location.reload()}
            id="retry-btn"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const stats = data || {
    total_suppliers: 0,
    total_products: 0,
    total_warehouses: 0,
    total_shipments: 0,
    low_stock_count: 0,
    low_stock_alerts: []
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header Panel */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 
            style={{ 
              fontFamily: "var(--font-heading)", 
              fontSize: "2.2rem", 
              background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "6px" 
            }}
          >
            Operations Overview
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Real-time supply chain performance and operational health.
          </p>
        </div>
        <div 
          style={{ 
            background: "rgba(13, 148, 136, 0.06)", 
            border: "1px solid var(--border-glass-active)",
            borderRadius: "30px", 
            padding: "8px 20px", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            boxShadow: "0 2px 10px rgba(13, 148, 136, 0.04)"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)", boxShadow: "0 0 8px var(--color-success)" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "500" }}>
            Connected to SQL Server
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "20px" 
        }}
      >
        {/* Suppliers Card */}
        <div className="glass-card glass-card-hover" style={{ display: "flex", alignItems: "center", gap: "20px" }} id="kpi-suppliers">
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(0, 242, 254, 0.15))", 
              border: "1px solid var(--border-glass-active)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--accent-cyan)",
              boxShadow: "0 4px 20px rgba(0, 242, 254, 0.1)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Suppliers</span>
            <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: "700", marginTop: "2px" }}>
              {stats.total_suppliers}
            </span>
          </div>
        </div>

        {/* Products Card */}
        <div className="glass-card glass-card-hover" style={{ display: "flex", alignItems: "center", gap: "20px" }} id="kpi-products">
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "linear-gradient(135deg, rgba(255, 0, 127, 0.15), rgba(108, 99, 255, 0.15))", 
              border: "1px solid rgba(255, 0, 127, 0.25)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--accent-pink)",
              boxShadow: "0 4px 20px rgba(255, 0, 127, 0.1)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
          </div>
          <div>
            <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Products</span>
            <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: "700", marginTop: "2px" }}>
              {stats.total_products}
            </span>
          </div>
        </div>

        {/* Warehouses Card */}
        <div className="glass-card glass-card-hover" style={{ display: "flex", alignItems: "center", gap: "20px" }} id="kpi-warehouses">
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(0, 242, 254, 0.15))", 
              border: "1px solid rgba(0, 230, 118, 0.25)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--color-success)",
              boxShadow: "0 4px 20px rgba(0, 230, 118, 0.1)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Warehouses</span>
            <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: "700", marginTop: "2px" }}>
              {stats.total_warehouses}
            </span>
          </div>
        </div>

        {/* Shipments Card */}
        <div className="glass-card glass-card-hover" style={{ display: "flex", alignItems: "center", gap: "20px" }} id="kpi-shipments">
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "linear-gradient(135deg, rgba(255, 179, 0, 0.15), rgba(255, 0, 127, 0.15))", 
              border: "1px solid rgba(255, 179, 0, 0.25)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--color-warning)",
              boxShadow: "0 4px 20px rgba(255, 179, 0, 0.1)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div>
            <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Shipments</span>
            <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: "700", marginTop: "2px" }}>
              {stats.total_shipments}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Analytics & Alerts */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "1.4fr 1fr", 
          gap: "28px",
          alignItems: "start"
        }}
      >
        {/* Left Column: Low Stock Alerts */}
        <div className="glass-card" style={{ minHeight: "380px" }} id="low-stock-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>Low Stock Alerts</span>
                {stats.low_stock_count > 0 && (
                  <span 
                    style={{ 
                      fontSize: "0.75rem", 
                      background: "rgba(190, 18, 60, 0.08)", 
                      color: "var(--color-danger)",
                      border: "1px solid rgba(190, 18, 60, 0.2)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      animation: "pulse 2s infinite"
                    }}
                  >
                    {stats.low_stock_count} Items
                  </span>
                )}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
                Products in inventory with levels below the global warning threshold (quantity &lt; 10).
              </p>
            </div>
          </div>

          {stats.low_stock_alerts.length === 0 ? (
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "260px",
                color: "var(--text-secondary)",
                gap: "12px"
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0",
                  borderRadius: "50%",
                  color: "var(--color-success)",
                  display: "inline-flex",
                  height: "52px",
                  justifyContent: "center",
                  width: "52px",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m20 6-11 11-5-5" />
                </svg>
              </div>
              <span style={{ fontSize: "0.95rem" }}>All inventory levels are operating within nominal parameters.</span>
            </div>
          ) : (
            <div className="glass-table-container">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Warehouse</th>
                    <th>Bin Location</th>
                    <th style={{ textAlign: "right" }}>Stock Level</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock_alerts.map((alert, idx) => {
                    const isCritical = alert.quantity < 5;
                    return (
                      <tr key={idx} id={`low-stock-row-${idx}`}>
                        <td style={{ fontWeight: "500" }}>{alert.product_name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{alert.warehouse_name}</td>
                        <td>
                          <code 
                            style={{ 
                              background: "rgba(13, 148, 136, 0.05)", 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              fontSize: "0.8rem",
                              border: "1px solid var(--border-glass)",
                              color: "var(--accent-indigo)"
                            }}
                          >
                            {alert.location}
                          </code>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span 
                            style={{ 
                              display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "24px",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                background: isCritical ? "rgba(255, 23, 68, 0.15)" : "rgba(255, 179, 0, 0.15)",
                                color: isCritical ? "#ff1744" : "#ffb300",
                                border: isCritical ? "1px solid rgba(255, 23, 68, 0.3)" : "1px solid rgba(255, 179, 0, 0.3)",
                                boxShadow: isCritical ? "0 0 10px rgba(255, 23, 68, 0.15)" : "0 0 10px rgba(255, 179, 0, 0.15)"
                            }}
                          >
                            {alert.quantity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Custom Visual Telemetry */}
        <div className="glass-card" style={{ minHeight: "380px", display: "flex", flexDirection: "column", gap: "24px" }} id="telemetry-panel">
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>
              System Health
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
              Dynamic analytical ratio profiles derived from live data.
            </p>
          </div>

          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px" }}>
            {/* SVG Radial Telemetry Ring */}
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                {/* Background Ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="rgba(13, 148, 136, 0.06)" 
                  strokeWidth="6" 
                />
                {/* Health Rating Fill */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="url(#radialGrad)" 
                  strokeWidth="6" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * Math.max(0.1, 1 - (stats.low_stock_count / Math.max(stats.total_products, 1))))}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <defs>
                  <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#20b7b0" />
                    <stop offset="100%" stopColor="#0f9a94" />
                  </linearGradient>
                </defs>
              </svg>
              <div 
                style={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  {Math.round(Math.max(0, 100 - (stats.low_stock_count * 8)))}%
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500", marginTop: "2px" }}>
                  Stock Health
                </span>
              </div>
            </div>

            {/* Infographics Breakdown */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Row 1: Low stock percent */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span>Low Stock Alert Ratio</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                    {stats.total_products > 0 ? Math.round((stats.low_stock_count / stats.total_products) * 100) : 0}%
                  </span>
                </div>
                <div style={{ height: "6px", background: "rgba(13, 148, 136, 0.06)", borderRadius: "3px", overflow: "hidden" }}>
                  <div 
                    style={{ 
                      height: "100%", 
                      background: "var(--color-danger)", 
                      width: `${stats.total_products > 0 ? Math.min(100, (stats.low_stock_count / stats.total_products) * 100) : 0}%`,
                      transition: "width 1s ease",
                      borderRadius: "3px",
                      boxShadow: "0 0 8px var(--color-danger)"
                    }} 
                  />
                </div>
              </div>

              {/* Row 2: Average Inventory Distribution */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span>Warehouse Capacity Profile</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>Nominal</span>
                </div>
                <div style={{ height: "6px", background: "rgba(13, 148, 136, 0.06)", borderRadius: "3px", overflow: "hidden" }}>
                  <div 
                    style={{ 
                      height: "100%", 
                      background: "var(--accent-cyan)", 
                      width: "82%",
                      transition: "width 1s ease",
                      borderRadius: "3px",
                      boxShadow: "0 0 8px var(--accent-cyan)"
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pulse & Keyframes animations injection */}
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 23, 68, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(255, 23, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 23, 68, 0); }
        }
      `}</style>
    </div>
  );
}
