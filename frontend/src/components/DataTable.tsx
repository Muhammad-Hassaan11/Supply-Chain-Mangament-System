"use client";

import React, { useState } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  canWrite?: boolean;
  actionsLabel?: string;
  idPrefix?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKey,
  onEdit,
  onDelete,
  canWrite = true,
  actionsLabel = "Actions",
  idPrefix = "table-row",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search Logic
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item) => {
      const value = item[searchKey];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort Logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const hasActions = onEdit || onDelete;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Search bar & Controls */}
      {searchKey && (
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          <input
            type="text"
            className="glass-input"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            id={`${idPrefix}-search`}
            style={{ paddingLeft: "40px" }}
          />
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
        </div>
      )}

      {/* Main Glass Table Container */}
      <div className="glass-table-container">
        <table className="glass-table" id={`${idPrefix}-table`}>
          <thead>
            <tr>
              {columns.map((col, idx) => {
                const isSortable = col.sortable && typeof col.accessor === "string";
                const isCurrentSort = sortConfig && sortConfig.key === col.accessor;
                return (
                  <th
                    key={idx}
                    onClick={() => isSortable && handleSort(col.accessor as string)}
                    style={{ cursor: isSortable ? "pointer" : "default", userSelect: "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{col.header}</span>
                      {isSortable && (
                        <span style={{ opacity: isCurrentSort ? 1 : 0.3, color: isCurrentSort ? "var(--accent-cyan)" : "inherit" }}>
                          {isCurrentSort && sortConfig.direction === "asc" ? "^" : "v"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {hasActions && <th>{actionsLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} id={`${idPrefix}-row-${rowIdx}`}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor as string] ?? "-")}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {onEdit && (
                          <button
                            className={`glass-btn glass-btn-secondary ${!canWrite ? "glass-btn-disabled" : ""}`}
                            onClick={() => canWrite && onEdit(row)}
                            disabled={!canWrite}
                            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                            id={`${idPrefix}-edit-${rowIdx}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className={`glass-btn glass-btn-danger ${!canWrite ? "glass-btn-disabled" : ""}`}
                            onClick={() => canWrite && onDelete(row)}
                            disabled={!canWrite}
                            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                            id={`${idPrefix}-delete-${rowIdx}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {sortedData.length > itemsPerPage && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`glass-btn glass-btn-secondary ${currentPage === 1 ? "glass-btn-disabled" : ""}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            >
              Previous
            </button>
            <button
              className={`glass-btn glass-btn-secondary ${currentPage === totalPages ? "glass-btn-disabled" : ""}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
