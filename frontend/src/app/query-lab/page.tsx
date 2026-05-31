"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface QueryCatalogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  sql: string;
}

interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
}

export default function QueryLabPage() {
  const { isAdmin } = useAuth();
  const [catalog, setCatalog] = useState<QueryCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Execution State
  const [activeQuery, setActiveQuery] = useState<QueryCatalogItem | null>(null);
  const [customSql, setCustomSql] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const handleSelectQuery = useCallback((query: QueryCatalogItem) => {
    setActiveQuery(query);
    setCustomSql(query.sql);
    setResult(null);
    setExecutionError(null);
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<QueryCatalogItem[]>("/api/queries/catalog");
      setCatalog(data);
      if (data.length > 0) {
        handleSelectQuery(data[0]);
      }
      setError(null);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load SQL query catalog.");
    } finally {
      setLoading(false);
    }
  }, [handleSelectQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCatalog();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCatalog]);

  const handleNewCustomQuery = () => {
    setActiveQuery(null);
    setCustomSql("SELECT TOP 20 *\nFROM Product\nORDER BY product_id DESC;");
    setResult(null);
    setExecutionError(null);
  };

  const handleExecute = async () => {
    if (!customSql.trim()) return;
    
    try {
      setIsExecuting(true);
      setExecutionError(null);
      setResult(null);
      
      const start = performance.now();
      const response = await api.post<QueryResult>("/api/queries/execute", { sql: customSql });
      const end = performance.now();
      
      setResult(response);
      console.log(`Query executed in ${(end - start).toFixed(2)}ms`);
    } catch (err: unknown) {
      console.error(err);
      setExecutionError(err instanceof Error ? err.message : "Query execution failed.");
    } finally {
      setIsExecuting(false);
    }
  };

  // Group catalog by category
  const groupedCatalog = catalog.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, QueryCatalogItem[]>);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "10px" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.2rem",
            background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          SQL Query Lab
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "800px" }}>
          Run operational SQL reports against the SQL Server backend and inspect live tabular results.
          Select curated queries from the catalog or write your own analysis.
        </p>
      </div>

      <div style={{ display: "grid", gap: "24px", alignItems: "start" }} className="lab-layout-grid">
        <style jsx global>{`
          .lab-layout-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 1024px) {
            .lab-layout-grid {
              grid-template-columns: 320px 1fr;
            }
          }
        `}</style>

        {/* Left Sidebar: Query Catalog */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
          <div style={{ alignItems: "center", borderBottom: "1px solid var(--border-glass)", display: "flex", gap: "10px", justifyContent: "space-between", paddingBottom: "12px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
              Query Catalog
            </h3>
            {isAdmin && (
              <button className="glass-btn glass-btn-secondary" onClick={handleNewCustomQuery} style={{ minHeight: "34px", padding: "6px 12px" }}>
                New Query
              </button>
            )}
          </div>
          
          {loading ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading catalog...</div>
          ) : error ? (
            <div style={{ color: "var(--color-danger)", fontSize: "0.9rem" }}>{error}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {Object.entries(groupedCatalog).map(([category, items]) => (
                <div key={category} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--accent-indigo)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
                    {category} Queries
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {items.map(item => {
                      const isActive = activeQuery?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectQuery(item)}
                          style={{
                            textAlign: "left",
                            background: isActive ? "rgba(13, 148, 136, 0.08)" : "transparent",
                            border: `1px solid ${isActive ? "var(--border-glass-active)" : "transparent"}`,
                            borderRadius: "6px",
                            padding: "10px 12px",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px"
                          }}
                        >
                          <span style={{ fontWeight: isActive ? "600" : "500", fontSize: "0.95rem" }}>{item.title}</span>
                          <span style={{ fontSize: "0.75rem", opacity: isActive ? 1.0 : 0.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {item.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Area: SQL Editor and Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* SQL Editor Card */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid var(--border-glass-active)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                  {activeQuery ? activeQuery.title : "Custom Query"}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  {activeQuery ? activeQuery.description : "Write and execute your own SQL query."}
                </p>
              </div>
              {activeQuery ? (
                <span style={{ background: "rgba(13, 148, 136, 0.08)", color: "var(--accent-indigo)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {activeQuery.category}
                </span>
              ) : (
                <span style={{ background: "rgba(13, 148, 136, 0.08)", color: "var(--accent-indigo)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Custom
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "12px", right: "16px", fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>
                  T-SQL
                </div>
                <textarea
                  className="glass-input"
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                  placeholder="Write your own SQL query here..."
                  style={{
                    fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                    fontSize: "0.95rem",
                    minHeight: "160px",
                    lineHeight: "1.5",
                    padding: "16px",
                    background: "#ffffff",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-primary)",
                    resize: "vertical"
                  }}
                  spellCheck="false"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="glass-btn glass-btn-primary" 
                  onClick={handleExecute}
                  disabled={isExecuting || !customSql.trim() || !isAdmin}
                  style={{ padding: "10px 24px", letterSpacing: "0.5px" }}
                  id="execute-query-btn"
                >
                  {isExecuting ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Executing...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Run Query
                    </span>
                  )}
                </button>
              </div>
              {!isAdmin && (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Custom SQL execution is available for admin accounts.
                </p>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "300px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>Execution Results</h3>
              {result && (
                <span style={{ fontSize: "0.85rem", color: "var(--color-success)", background: "rgba(0, 230, 118, 0.1)", padding: "4px 10px", borderRadius: "12px" }}>
                  Success: {result.row_count} row{result.row_count !== 1 ? "s" : ""} returned
                </span>
              )}
            </div>

            {executionError && (
              <div style={{ background: "rgba(190, 18, 60, 0.08)", border: "1px solid rgba(190, 18, 60, 0.2)", borderRadius: "8px", padding: "20px", color: "var(--color-danger)" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "1rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  SQL Execution Error
                </h4>
                <p style={{ fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{executionError}</p>
              </div>
            )}
            
            {!result ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: "16px", opacity: 0.5 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <p>Run a query to view tabular results here.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid var(--border-glass)" }}>
                {result.rows.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
                    Query executed successfully but returned 0 rows.
                  </div>
                ) : (
                  <table className="glass-table" style={{ whiteSpace: "nowrap" }}>
                    <thead>
                      <tr>
                        {result.columns.map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {result.columns.map((col, colIndex) => {
                            const val = row[col];
                            return (
                              <td key={colIndex}>
                                {val === null ? (
                                  <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>NULL</span>
                                ) : typeof val === "boolean" ? (
                                  val ? "True" : "False"
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
