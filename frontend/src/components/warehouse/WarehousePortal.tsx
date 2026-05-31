"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import { api, getStoredAccountName, getStoredAccountType } from "@/lib/api";
import styles from "./WarehousePortal.module.css";

type StatusKind = "good" | "info" | "warn" | "danger";

type InventoryItem = {
  sku: string;
  item: string;
  category: string;
  location: string;
  onHand: number;
  reserved: number;
  available: number;
  status: string;
};

type IncomingShipment = {
  id: string;
  supplier: string;
  eta: string;
  dock: string;
  items: number;
  units: number;
  status: string;
};

type OutgoingShipment = {
  id: string;
  destination: string;
  dispatchTime: string;
  carrier: string;
  items: number;
  units: number;
  bay: string;
  status: string;
};

type LowStockItem = {
  sku: string;
  item: string;
  category: string;
  aisle: string;
  onHand: number;
  reorderLevel: number;
  daysRemaining: number;
  severity: string;
  supplier: string;
  estValue: string;
};

type FilterState = {
  query: string;
  category: string;
  status: string;
  location: string;
};

type FilterOptionSet = {
  categories: string[];
  statuses: string[];
  locations: string[];
};

const inventoryRows: InventoryItem[] = [
  { sku: "PRD-1010", item: "Industrial Bearings 6205", category: "Industrial", location: "A01 / B05", onHand: 1250, reserved: 200, available: 1050, status: "In Stock" },
  { sku: "PRD-2048", item: "Electric Motor 3HP", category: "Electrical", location: "A02 / C12", onHand: 320, reserved: 40, available: 280, status: "In Stock" },
  { sku: "PRD-3012", item: "Hydraulic Pump 10GPM", category: "Hydraulics", location: "B01 / A03", onHand: 185, reserved: 35, available: 150, status: "In Stock" },
  { sku: "PRD-4120", item: "Conveyor Belt 2m x 50ft", category: "Material Handling", location: "B02 / D07", onHand: 410, reserved: 20, available: 390, status: "In Stock" },
  { sku: "PRD-6155", item: "V-Belt A-42", category: "Power Transmission", location: "A03 / B11", onHand: 18, reserved: 0, available: 18, status: "Low Stock" },
  { sku: "PRD-7022", item: "Gearbox 20:1", category: "Mechanical", location: "C02 / D09", onHand: 5, reserved: 1, available: 4, status: "Critical" },
  { sku: "PRD-8120", item: "Solenoid Valve 24V", category: "Pneumatics", location: "B03 / A08", onHand: 22, reserved: 8, available: 14, status: "Low Stock" },
  { sku: "PRD-5055", item: "Filter Element", category: "Filters", location: "C03 / F01", onHand: 28, reserved: 5, available: 23, status: "In Stock" },
];

const incomingRows: IncomingShipment[] = [
  { id: "PO-12578", supplier: "Acme Supplies Co.", eta: "May 24, 2025 9:15 AM", dock: "Door 12", items: 14, units: 1200, status: "Arriving Today" },
  { id: "PO-12577", supplier: "Global Components Inc.", eta: "May 24, 2025 10:30 AM", dock: "Door 07", items: 18, units: 1145, status: "Arriving Today" },
  { id: "PO-98231", supplier: "Retail Express", eta: "May 24, 2025 1:45 PM", dock: "Door 03", items: 22, units: 980, status: "Arriving Today" },
  { id: "PO-98230", supplier: "Metro Distributors", eta: "May 24, 2025 3:30 PM", dock: "Door 15", items: 20, units: 1560, status: "In Transit" },
  { id: "PO-12576", supplier: "Precision Parts Ltd.", eta: "May 25, 2025 8:00 AM", dock: "Door 11", items: 16, units: 3000, status: "Scheduled" },
  { id: "PO-12575", supplier: "Tech Hardware Solutions", eta: "May 25, 2025 10:00 AM", dock: "Door 09", items: 12, units: 720, status: "Scheduled" },
  { id: "PO-77456", supplier: "Industrial Supply Group", eta: "May 25, 2025 1:00 PM", dock: "Door 02", items: 10, units: 650, status: "Scheduled" },
  { id: "PO-77455", supplier: "SupplyWorks", eta: "May 26, 2025 8:30 AM", dock: "Unassigned", items: 8, units: 410, status: "Scheduled" },
];

const outgoingRows: OutgoingShipment[] = [
  { id: "OUT-2025-0568", destination: "Dallas, TX", dispatchTime: "May 24, 2025 10:00 AM", carrier: "FedEx Freight", items: 24, units: 1280, bay: "Bay 03", status: "Ready" },
  { id: "OUT-2025-0567", destination: "Atlanta, GA", dispatchTime: "May 24, 2025 11:30 AM", carrier: "R+L Carriers", items: 19, units: 940, bay: "Bay 05", status: "Ready" },
  { id: "OUT-2025-0566", destination: "Nashville, TN", dispatchTime: "May 24, 2025 01:00 PM", carrier: "XPO Logistics", items: 31, units: 1560, bay: "Bay 02", status: "In Progress" },
  { id: "OUT-2025-0565", destination: "Orlando, FL", dispatchTime: "May 24, 2025 02:30 PM", carrier: "UPS Freight", items: 17, units: 820, bay: "Bay 04", status: "In Progress" },
  { id: "OUT-2025-0564", destination: "Charlotte, NC", dispatchTime: "May 24, 2025 03:30 PM", carrier: "Estes Express", items: 15, units: 780, bay: "Bay 06", status: "Scheduled" },
  { id: "OUT-2025-0563", destination: "Tampa, FL", dispatchTime: "May 25, 2025 09:00 AM", carrier: "Ryder", items: 21, units: 1120, bay: "Bay 01", status: "Scheduled" },
  { id: "OUT-2025-0562", destination: "Houston, TX", dispatchTime: "May 25, 2025 10:30 AM", carrier: "FedEx Freight", items: 26, units: 1350, bay: "Bay 03", status: "Scheduled" },
];

const lowStockRows: LowStockItem[] = [
  { sku: "PRD-7088", item: "Pneumatic Cylinder", category: "Hydraulics", aisle: "A-12-03", onHand: 12, reorderLevel: 25, daysRemaining: 3, severity: "Critical", supplier: "Acme Supplies Co.", estValue: "$8,640" },
  { sku: "PRD-6155", item: "V-Belt A-42", category: "Power Transmission", aisle: "B-04-07", onHand: 18, reorderLevel: 40, daysRemaining: 4, severity: "Critical", supplier: "Global Components Inc.", estValue: "$4,320" },
  { sku: "PRD-3022", item: "Gearbox 20:1", category: "Gearboxes", aisle: "C-07-02", onHand: 5, reorderLevel: 15, daysRemaining: 2, severity: "Critical", supplier: "Motion Distributors", estValue: "$32,750" },
  { sku: "PRD-8120", item: "Solenoid Valve 24V", category: "Electrical", aisle: "D-11-05", onHand: 22, reorderLevel: 30, daysRemaining: 6, severity: "Low", supplier: "Industrial Solutions Co.", estValue: "$1,125" },
  { sku: "PRD-9055", item: "Filter Element", category: "Filtration", aisle: "E-03-09", onHand: 28, reorderLevel: 50, daysRemaining: 7, severity: "Low", supplier: "Filter Specialists Ltd.", estValue: "$12,800" },
];

const recentActivities = [
  ["Shipment PO-12578 received", "10:12 AM"],
  ["Outbound OUT-2025-0566 loading started", "09:48 AM"],
  ["Low stock reviewed for PRD-6155", "09:22 AM"],
  ["Cycle count completed in Storage B-05", "08:55 AM"],
  ["Dock reassigned for PO-12577", "08:14 AM"],
];

const defaultFilters: FilterState = {
  query: "",
  category: "All Categories",
  status: "All Statuses",
  location: "All Locations",
};

function statusKind(value: string): StatusKind {
  if (["Critical", "Delayed", "Delay"].some((item) => value.includes(item))) return "danger";
  if (["Low", "Scheduled"].some((item) => value.includes(item))) return "warn";
  if (["In Progress", "In Transit"].some((item) => value.includes(item))) return "info";
  return "good";
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function matchesText(values: Array<string | number>, query: string) {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return values.some((value) => String(value).toLowerCase().includes(normalized));
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.pill}><span>DB</span><span className={styles.dot} />Connected to SQL Server</div>
        <div className={styles.pill}><span className={styles.avatar}>WM</span><strong>Warehouse Manager</strong></div>
      </div>
    </header>
  );
}

function Metric({ icon, label, value, sub, warn = false }: { icon: string; label: string; value: string; sub: string; warn?: boolean }) {
  return (
    <div className={styles.metric}>
      <div className={`${styles.metricIcon} ${warn ? styles.metricWarn : ""}`}>{icon}</div>
      <div>
        <div className={styles.metricLabel}>{label}</div>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricSub}>{sub}</div>
      </div>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return <span className={`${styles.badge} ${styles[statusKind(value)]}`}>{value}</span>;
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows, detailsTitle = "Row Details" }: { headers: string[]; rows: string[][]; detailsTitle?: string }) {
  const [selected, setSelected] = React.useState<string[] | null>(null);
  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header) => <th key={header}>{header}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${headers[index]}`}>
                    {index === row.length - 1 && (cell.includes("Stock") || cell.includes("Ready") || cell.includes("Critical") || cell.includes("Transit") || cell.includes("Scheduled") || cell.includes("Today") || cell.includes("Progress"))
                      ? <Badge value={cell} />
                      : cell}
                  </td>
                ))}
                <td><button className={styles.iconBtn} type="button" title="View" onClick={() => setSelected(row)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={detailsTitle}>
        <div className={styles.summaryList}>
          {selected?.map((value, index) => (
            <div className={styles.summaryRow} key={`${headers[index]}-${value}`}>
              <span>{headers[index]}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div className={styles.summaryRow}><span>Status</span><strong>Synced with SQL Server</strong></div>
          <div className={styles.summaryRow}><span>Updated</span><strong>{new Date().toLocaleString()}</strong></div>
        </div>
      </Modal>
    </>
  );
}

function FilterBar({
  filters,
  options,
  onChange,
  onReset,
  onApply,
  onExport,
  locationLabel = "Aisle / Dock",
  primaryLabel,
}: {
  filters: FilterState;
  options: FilterOptionSet;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  onApply: () => void;
  onExport?: () => void;
  locationLabel?: string;
  primaryLabel?: string;
}) {
  return (
    <div className={styles.filterBar}>
      <label className={styles.field}>
        <span>Search</span>
        <input
          className={styles.input}
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search SKU, shipment, supplier..."
        />
      </label>
      <label className={styles.field}>
        <span>Category</span>
        <select className={styles.select} value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })}>
          {options.categories.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        <span>Status</span>
        <select className={styles.select} value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })}>
          {options.statuses.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        <span>{locationLabel}</span>
        <select className={styles.select} value={filters.location} onChange={(e) => onChange({ ...filters, location: e.target.value })}>
          {options.locations.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <button className={styles.secondaryBtn} type="button" onClick={onReset}>Reset Filters</button>
      <button className={styles.primaryBtn} type="button" onClick={onExport || onApply}>{primaryLabel || (onExport ? "Export" : "Apply Filters")}</button>
    </div>
  );
}

function downloadCsv(fileName: string, headers: string[], rows: string[][]) {
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function LayoutMap() {
  return (
    <div className={styles.layoutMap}>
      <div className={`${styles.zone} ${styles.zoneA}`}><strong>Storage A</strong><span>32,000 sq ft</span></div>
      <div className={`${styles.zone} ${styles.zoneB}`}><strong>Storage B</strong><span>28,000 sq ft</span></div>
      <div className={`${styles.zone} ${styles.zoneC}`}><strong>Packing</strong><span>8,500 sq ft</span></div>
      <div className={`${styles.zone} ${styles.zoneB}`}><strong>Receiving</strong><span>2 dock doors</span></div>
      <div className={`${styles.zone} ${styles.zoneA}`}><strong>Dispatch</strong><span>8 dock doors</span></div>
    </div>
  );
}

function Summary({ rows }: { rows?: Array<[string, string]> }) {
  const values = rows || [["Total Area", "100,000 sq ft"], ["Usable Area", "92,500 sq ft"], ["Locations", "512"], ["Active SKUs", "1,245"], ["Team Members", "24"], ["Safety Days", "112 days"]];
  return <div className={styles.summaryList}>{values.map(([label, value]) => <div className={styles.summaryRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function Activity({ rows = recentActivities }: { rows?: string[][] }) {
  return <div className={styles.activityList}>{rows.map(([text, time]) => <div className={styles.activityRow} key={`${text}-${time}`}><span>{text}</span><strong>{time}</strong></div>)}</div>;
}

function useTableFilters<T>({
  rows,
  getCategory,
  getStatus,
  getLocation,
  getSearchValues,
}: {
  rows: T[];
  getCategory: (row: T) => string;
  getStatus: (row: T) => string;
  getLocation: (row: T) => string;
  getSearchValues: (row: T) => Array<string | number>;
}) {
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters);
  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const categoryMatch = filters.category === "All Categories" || getCategory(row) === filters.category;
      const statusMatch = filters.status === "All Statuses" || getStatus(row) === filters.status;
      const locationMatch = filters.location === "All Locations" || getLocation(row) === filters.location;
      return categoryMatch && statusMatch && locationMatch && matchesText(getSearchValues(row), filters.query);
    });
  }, [filters, getCategory, getLocation, getSearchValues, getStatus, rows]);

  const options = React.useMemo<FilterOptionSet>(() => ({
    categories: ["All Categories", ...Array.from(new Set(rows.map(getCategory)))],
    statuses: ["All Statuses", ...Array.from(new Set(rows.map(getStatus)))],
    locations: ["All Locations", ...Array.from(new Set(rows.map(getLocation)))],
  }), [getCategory, getLocation, getStatus, rows]);

  const reset = React.useCallback(() => setFilters(defaultFilters), []);

  return { filters, setFilters, filteredRows, options, reset };
}

export function WarehouseDashboardPage() {
  const router = useRouter();
  return (
    <main className={styles.page}>
      <Header title="Dashboard" subtitle="Welcome back! Here's what's happening in your warehouse today." />
      <div className={styles.metrics}>
        <Metric icon="WH" label="Warehouse Capacity" value="68%" sub="Used: 68,245 / 100,000 sq ft" />
        <Metric icon="BX" label="Inventory Items" value="4,812" sub="Across 1,245 SKUs" />
        <Metric icon="!" label="Low Stock Alerts" value="18" sub="SKUs below reorder level" warn />
        <Metric icon="$" label="Inventory Value" value="$2.48M" sub="Total inventory value" />
      </div>
      <div className={styles.grid3}>
        <Card title="Today's Movements"><div className={styles.grid2}><Metric icon="IN" label="Inbound" value="8" sub="2,345 Units" /><Metric icon="OUT" label="Outbound" value="12" sub="3,876 Units" /></div></Card>
        <Card title="Recent Shipment Activity" action={<button className={styles.linkBtn} onClick={() => router.push("/warehouse/incoming-shipments")}>View all</button>}><Table headers={["ID", "Partner", "Time", "Units", "Status"]} rows={incomingRows.slice(0, 5).map((row) => [row.id, row.supplier, row.eta, formatNumber(row.units), "Received"])} detailsTitle="Shipment Activity" /></Card>
        <Card title="Warehouse Summary" action={<button className={styles.linkBtn} onClick={() => router.push("/warehouse/my-warehouse")}>Open</button>}><Summary /></Card>
      </div>
      <div className={styles.grid2}>
        <Card title="Top Inventory (By Value)" action={<button className={styles.linkBtn} onClick={() => router.push("/warehouse/inventory")}>View all inventory</button>}><Table headers={["SKU", "Item", "On Hand", "Available", "Reserved", "Status"]} rows={inventoryRows.slice(0, 5).map((row) => [row.sku, row.item, formatNumber(row.onHand), formatNumber(row.available), formatNumber(row.reserved), row.status])} detailsTitle="Inventory Details" /></Card>
        <Card title="Low Stock Alerts" action={<button className={styles.linkBtn} onClick={() => router.push("/warehouse/low-stock-alerts")}>View all alerts</button>}><Table headers={["SKU", "Item", "On Hand", "Reorder", "Status"]} rows={lowStockRows.map((row) => [row.sku, row.item, formatNumber(row.onHand), formatNumber(row.reorderLevel), row.severity])} detailsTitle="Low Stock Detail" /></Card>
      </div>
    </main>
  );
}

export function LegacyWarehouseFacilityPage() {
  const router = useRouter();
  return (
    <main className={styles.page}>
      <Header title="My Warehouse" subtitle="Manage and monitor your assigned facility." />
      <section className={styles.hero}>
        <div className={styles.warehouseArt}><div className={styles.building} /></div>
        <Summary rows={[["Name", "Central Distribution Center"], ["Warehouse Code", "CDC-MEM-01"], ["Zone", "South Central"], ["Manager", "Alex Morgan"], ["Operating Hours", "Mon - Sun, 24/7"], ["Security Status", "All systems normal"]]} />
      </section>
      <div className={`${styles.metrics} ${styles.metricsFive}`}>
        <Metric icon="SQ" label="Total Capacity" value="100,000 sq ft" sub="68% Utilized" />
        <Metric icon="AR" label="Usable Area" value="92,500 sq ft" sub="92.5% of total" />
        <Metric icon="DK" label="Dock Doors" value="12" sub="8 in use" />
        <Metric icon="BX" label="Active SKUs" value="1,245" sub="+5.2% vs last week" />
        <Metric icon="SF" label="Staff on Shift" value="24" sub="Across 3 shifts" />
      </div>
      <div className={styles.grid3}>
        <Card title="Warehouse Layout / Zones Overview"><LayoutMap /></Card>
        <Card title="Facility Details"><Summary rows={[["Temperature Range", "15°C - 25°C"], ["Forklifts", "18"], ["Racks / Positions", "1,450"], ["Utilization", "68%"], ["Operational Status", "Operational"], ["Inbound Accuracy", "99.4%"]]} /></Card>
        <Card title="Recent Operational Activity" action={<button className={styles.linkBtn} onClick={() => router.push("/warehouse/incoming-shipments")}>View all</button>}><Activity /></Card>
      </div>
    </main>
  );
}

type WarehouseRecord = {
  warehouse_id: number;
  warehouse_name: string;
  capacity: number;
  product_id: number;
  product_name?: string | null;
  current_stock?: number | null;
};

type WarehouseFormState = {
  warehouse_id: string;
  warehouse_name: string;
  capacity: string;
  product_id: string;
};

const emptyWarehouseForm: WarehouseFormState = {
  warehouse_id: "",
  warehouse_name: "",
  capacity: "",
  product_id: "",
};

function parseProductId(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

function warehouseLocation(warehouse: WarehouseRecord) {
  const locations = ["Chicago, IL", "New York, NY", "Los Angeles, CA", "Houston, TX", "Omaha, NE", "Seattle, WA", "Atlanta, GA", "Denver, CO"];
  return locations[(warehouse.warehouse_id - 1) % locations.length] || "Assigned location";
}

function initialsFromName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "A";
  const second = parts[1]?.[0] || "U";
  return `${first}${second}`.toUpperCase();
}

export function WarehouseFacilityPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [accountType, setAccountType] = React.useState<string | null>(null);
  const [accountName, setAccountName] = React.useState("Admin User");
  const [warehouses, setWarehouses] = React.useState<WarehouseRecord[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<number | null>(null);
  const [notice, setNotice] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<WarehouseFormState>(emptyWarehouseForm);

  React.useEffect(() => {
    setAccountType(getStoredAccountType());
    setAccountName(getStoredAccountName() || (isAdmin ? "Admin User" : "Warehouse Manager"));
  }, [isAdmin, user?.email]);

  const loadWarehouses = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await api.get<WarehouseRecord[]>("/api/warehouses/");
      setWarehouses(rows);
      setSelectedWarehouseId((current) => current ?? rows[0]?.warehouse_id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load warehouses.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (accountType === "warehouse" && !isAdmin) return;
    void loadWarehouses();
  }, [accountType, isAdmin, loadWarehouses]);

  if (authLoading || !user) {
    return (
      <main className={styles.page}>
        <div className={styles.notice}>Checking warehouse access...</div>
      </main>
    );
  }

  if (accountType === "warehouse" && !isAdmin) {
    return <LegacyWarehouseFacilityPage />;
  }

  const selectedWarehouse = warehouses.find((warehouse) => warehouse.warehouse_id === selectedWarehouseId) || warehouses[0];
  const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity, 0);
  const totalStock = warehouses.reduce((sum, warehouse) => sum + (warehouse.current_stock || 0), 0);
  const utilizationRate = totalCapacity ? Math.min(100, Math.round((totalStock / totalCapacity) * 100)) : 0;
  const linkedProducts = new Set(warehouses.map((warehouse) => warehouse.product_id)).size;

  const updateForm = (key: keyof WarehouseFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startNewWarehouse = () => {
    setSelectedWarehouseId(null);
    setForm(emptyWarehouseForm);
    setNotice("Warehouse form is ready for a new entry.");
  };

  const fillFromWarehouse = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.warehouse_id === warehouseId);
    if (!warehouse) return;
    setSelectedWarehouseId(warehouseId);
    setForm({
      warehouse_id: String(warehouse.warehouse_id),
      warehouse_name: warehouse.warehouse_name,
      capacity: String(warehouse.capacity),
      product_id: String(warehouse.product_id),
    });
    setNotice(`${warehouse.warehouse_name} loaded into the form.`);
  };

  const saveWarehouse = async () => {
    const warehouseName = form.warehouse_name.trim();
    const capacity = Number(form.capacity);
    const productId = parseProductId(form.product_id);
    if (!warehouseName || !Number.isFinite(capacity) || capacity < 0 || !Number.isInteger(productId) || productId <= 0) {
      setNotice("Please enter warehouse name, non-negative capacity, and a valid product ID.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = { warehouse_name: warehouseName, capacity, product_id: productId };
      if (form.warehouse_id) {
        await api.put(`/api/warehouses/${form.warehouse_id}`, payload);
        setNotice(`${warehouseName} updated in SQL Server.`);
      } else {
        const created = await api.post<WarehouseRecord>("/api/warehouses/", payload);
        setSelectedWarehouseId(created.warehouse_id);
        setForm((current) => ({ ...current, warehouse_id: String(created.warehouse_id) }));
        setNotice(`${warehouseName} added to SQL Server.`);
      }
      await loadWarehouses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save warehouse.");
    } finally {
      setSaving(false);
    }
  };

  const deleteWarehouse = async (warehouse: WarehouseRecord) => {
    if (!window.confirm(`Delete warehouse "${warehouse.warehouse_name}"?`)) return;
    setSaving(true);
    setError("");
    try {
      await api.delete(`/api/warehouses/${warehouse.warehouse_id}`);
      setNotice(`${warehouse.warehouse_name} deleted from SQL Server.`);
      setForm(emptyWarehouseForm);
      setSelectedWarehouseId(null);
      await loadWarehouses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete warehouse.");
    } finally {
      setSaving(false);
    }
  };

  const utilization = warehouses.slice(0, 6).map((warehouse) => ({
    name: warehouse.warehouse_name,
    value: warehouse.capacity ? Math.min(100, Math.round(((warehouse.current_stock || 0) / warehouse.capacity) * 100)) : 0,
  }));

  return (
    <main className={styles.page}>
      <section className={styles.warehouseTopbar}>
        <div className={styles.searchShell}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className={styles.searchInput} placeholder="Search warehouses..." />
          <span className={styles.shortcutKey}>Ctrl /</span>
        </div>
        <div className={styles.topbarActions}>
          <div className={styles.profileChip}>
            <span className={styles.profileAvatar}>{initialsFromName(accountName)}</span>
            <div>
              <strong>{accountName}</strong>
              <span>{isAdmin ? "Administrator" : "Team Member"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.warehouseHero}>
        <div className={styles.heroCopy}>
          <div>
            <h1 className={styles.heroTitle}>Warehouses <span>Management</span></h1>
            <p className={styles.heroText}>
              Admin portal for all warehouse locations, capacity, and linked product records stored in SQL Server.
            </p>
          </div>
          <button className={styles.heroButton} type="button" onClick={startNewWarehouse}>
            <span>+</span>
            Add Warehouse
          </button>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.visualGround} />
          <div className={styles.visualWarehouse}>
            <div className={styles.visualRoof} />
            <div className={styles.visualBody}><span /><span /><span /></div>
          </div>
          <div className={styles.visualChart}><div /><div /><div /><div /></div>
          <div className={styles.visualBoxes}><span /><span /><span /></div>
        </div>
      </section>

      {notice ? <div className={styles.notice}>{notice}</div> : null}
      {error ? <div className={styles.notice}>{error}</div> : null}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}><div className={styles.statIcon}>WH</div><div><p>Total Warehouses</p><strong>{warehouses.length}</strong><span>Warehouses</span></div></article>
        <article className={styles.statCard}><div className={styles.statIcon}>CP</div><div><p>Total Capacity</p><strong>{totalCapacity.toLocaleString()}</strong><span>Units</span></div></article>
        <article className={styles.statCard}><div className={styles.statIcon}>UT</div><div><p>Utilization Rate</p><strong>{utilizationRate}%</strong><span>Average</span></div></article>
        <article className={styles.statCard}><div className={styles.statIcon}>PR</div><div><p>Linked Products</p><strong>{linkedProducts}</strong><span>Products</span></div></article>
      </section>

      <section className={styles.managementCard}>
        <div className={styles.tableWrap}>
          <table className={styles.managementTable}>
            <thead>
              <tr>
                <th>warehouse_id</th>
                <th>warehouse_name</th>
                <th>city/location</th>
                <th>capacity</th>
                <th>linked_product_id</th>
                <th>linked_product</th>
                <th>status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}>Loading warehouses from SQL Server...</td></tr>
              ) : warehouses.length === 0 ? (
                <tr><td colSpan={8}>No warehouses found.</td></tr>
              ) : warehouses.map((warehouse) => (
                <tr key={warehouse.warehouse_id}>
                  <td className={styles.idCell}>{warehouse.warehouse_id}</td>
                  <td>{warehouse.warehouse_name}</td>
                  <td>{warehouseLocation(warehouse)}</td>
                  <td>{warehouse.capacity.toLocaleString()}</td>
                  <td>{warehouse.product_id}</td>
                  <td>{warehouse.product_name || "-"}</td>
                  <td><span className={`${styles.statusPill} ${warehouse.capacity && (warehouse.current_stock || 0) / warehouse.capacity > 0.9 ? styles.statusWarn : styles.statusActive}`}>{warehouse.capacity && (warehouse.current_stock || 0) / warehouse.capacity > 0.9 ? "Near Capacity" : "Active"}</span></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" className={styles.rowAction} onClick={() => setNotice(`Viewing ${warehouse.warehouse_name}.`)}>View</button>
                      <button type="button" className={styles.rowAction} onClick={() => fillFromWarehouse(warehouse.warehouse_id)}>Edit</button>
                      <button type="button" className={`${styles.rowAction} ${styles.rowDelete}`} onClick={() => deleteWarehouse(warehouse)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.tableFooter}><span>Showing {warehouses.length} SQL Server entries</span></div>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.managementCard}>
          <div className={styles.sectionHeader}><h2>Warehouse Form</h2></div>
          <div className={styles.formGrid}>
            <label className={styles.formField}><span>warehouse_id</span><input value={form.warehouse_id || "Auto-generated"} readOnly /></label>
            <label className={styles.formField}><span>warehouse_name *</span><input value={form.warehouse_name} onChange={(e) => updateForm("warehouse_name", e.target.value)} /></label>
            <label className={styles.formField}><span>capacity *</span><input value={form.capacity} onChange={(e) => updateForm("capacity", e.target.value)} /></label>
            <label className={styles.formField}><span>product_id *</span><input value={form.product_id} onChange={(e) => updateForm("product_id", e.target.value)} placeholder="Example: 1" /></label>
          </div>
          <div className={styles.formActions}>
            <button className={styles.heroButton} type="button" onClick={saveWarehouse} disabled={saving}><span>{saving ? "Saving" : "Save"}</span>Warehouse</button>
            <button className={styles.resetButton} type="button" onClick={() => selectedWarehouse ? fillFromWarehouse(selectedWarehouse.warehouse_id) : startNewWarehouse()}>Reset</button>
          </div>
        </div>

        <div className={styles.managementCard}>
          <div className={styles.sectionHeader}><h2>Warehouse Utilization</h2></div>
          <div className={styles.utilizationList}>
            {utilization.length ? utilization.map((item) => (
              <div key={item.name} className={styles.utilizationRow}>
                <div className={styles.utilizationHead}><span>{item.name}</span><strong>{item.value}%</strong></div>
                <div className={styles.utilizationTrack}><div className={`${styles.utilizationFill} ${item.value < 70 ? styles.utilizationMedium : ""}`} style={{ width: `${item.value}%` }} /></div>
              </div>
            )) : <div className={styles.subtitle}>No warehouse utilization data yet.</div>}
          </div>
          <div className={styles.legend}>
            <span><i className={styles.legendHigh} /> High (&gt;= 70%)</span>
            <span><i className={styles.legendMedium} /> Medium (40% - 69%)</span>
            <span><i className={styles.legendLow} /> Low (&lt; 40%)</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminWarehouseFacilityPage() {
  const warehouses = [
    { id: 1, name: "Northside Warehouse", city: "New York, NY", capacity: 2500, productId: 101, manager: "John Anderson", status: "Active" },
    { id: 2, name: "West Coast Hub", city: "Los Angeles, CA", capacity: 3200, productId: 105, manager: "Sarah Johnson", status: "Active" },
    { id: 3, name: "Central Distribution", city: "Dallas, TX", capacity: 2000, productId: 102, manager: "Michael Brown", status: "Active" },
    { id: 4, name: "Southeast Warehouse", city: "Atlanta, GA", capacity: 1800, productId: 103, manager: "Emily Davis", status: "Active" },
    { id: 5, name: "Midwest Depot", city: "Chicago, IL", capacity: 2350, productId: 104, manager: "David Wilson", status: "Maintenance" },
  ];
  const utilization = [
    { name: "West Coast Hub", value: 91 },
    { name: "Northside Warehouse", value: 82 },
    { name: "Central Distribution", value: 75 },
    { name: "Midwest Depot", value: 63 },
    { name: "Southeast Warehouse", value: 58 },
    { name: "Gulf Coast Warehouse", value: 45 },
  ];
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState(1);
  const [notice, setNotice] = React.useState("");
  const [form, setForm] = React.useState({
    warehouse_id: "6",
    warehouse_name: "Gulf Coast Warehouse",
    capacity: "2000",
    product_id: "106 - Appliance Set",
    city: "Houston, TX",
    notes: "Near port for efficient imports.",
  });

  const selectedWarehouse = warehouses.find((warehouse) => warehouse.id === selectedWarehouseId) || warehouses[0];
  const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity, 0);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const fillFromWarehouse = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId);
    if (!warehouse) return;
    setSelectedWarehouseId(warehouseId);
    setForm({
      warehouse_id: String(warehouse.id),
      warehouse_name: warehouse.name,
      capacity: String(warehouse.capacity),
      product_id: `${warehouse.productId} - Linked Product`,
      city: warehouse.city,
      notes: `${warehouse.manager} currently manages this site.`,
    });
    setNotice(`${warehouse.name} loaded into the form.`);
  };

  return (
    <main className={styles.page}>
      <section className={styles.warehouseTopbar}>
        <div className={styles.searchShell}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className={styles.searchInput} placeholder="Search across suppliers, products, warehouses..." />
          <span className={styles.shortcutKey}>Ctrl /</span>
        </div>
        <div className={styles.topbarActions}>
          <button type="button" className={styles.topbarIcon} aria-label="Notifications">3</button>
          <button type="button" className={styles.topbarIcon} aria-label="Help">?</button>
          <div className={styles.profileChip}>
            <span className={styles.profileAvatar}>AU</span>
            <div>
              <strong>Admin User</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.warehouseHero}>
        <div className={styles.heroCopy}>
          <div>
            <h1 className={styles.heroTitle}>Warehouses <span>Management</span></h1>
            <p className={styles.heroText}>
              Track and manage warehouse locations and capacity data through structured forms connected to SQL Server.
            </p>
          </div>
          <button className={styles.heroButton} type="button" onClick={() => setNotice("Warehouse form is ready for a new entry.")}>
            <span>+</span>
            Add Warehouse
          </button>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.visualGround} />
          <div className={styles.visualWarehouse}>
            <div className={styles.visualRoof} />
            <div className={styles.visualBody}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.visualChart}>
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className={styles.visualBoxes}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {notice ? <div className={styles.notice}>{notice}</div> : null}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statIcon}>⌂</div>
          <div><p>Total Warehouses</p><strong>{warehouses.length + 3}</strong><span>Warehouses</span></div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statIcon}>▤</div>
          <div><p>Total Capacity</p><strong>{totalCapacity.toLocaleString()}</strong><span>Units</span></div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statIcon}>◔</div>
          <div><p>Utilization Rate</p><strong>72%</strong><span>Average</span></div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statIcon}>◫</div>
          <div><p>Linked Products</p><strong>25</strong><span>Products</span></div>
        </article>
      </section>

      <section className={styles.managementCard}>
        <div className={styles.tableWrap}>
          <table className={styles.managementTable}>
            <thead>
              <tr>
                <th>warehouse_id</th>
                <th>warehouse_name</th>
                <th>city/location</th>
                <th>capacity</th>
                <th>linked_product_id</th>
                <th>manager</th>
                <th>status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className={styles.idCell}>{warehouse.id}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.city}</td>
                  <td>{warehouse.capacity.toLocaleString()}</td>
                  <td>{warehouse.productId}</td>
                  <td>{warehouse.manager}</td>
                  <td>
                    <span className={`${styles.statusPill} ${warehouse.status === "Maintenance" ? styles.statusWarn : styles.statusActive}`}>
                      {warehouse.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" className={styles.rowAction} onClick={() => setNotice(`Viewing ${warehouse.name}.`)}>◉</button>
                      <button type="button" className={styles.rowAction} onClick={() => fillFromWarehouse(warehouse.id)}>✎</button>
                      <button type="button" className={`${styles.rowAction} ${styles.rowDelete}`} onClick={() => setNotice(`${warehouse.name} queued for deletion review.`)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.tableFooter}>
            <span>Showing 1 to 5 of 8 entries</span>
            <div className={styles.pagination}>
              <button type="button">‹</button>
              <button type="button" className={styles.pageActive}>1</button>
              <button type="button">2</button>
              <button type="button">›</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.managementCard}>
          <div className={styles.sectionHeader}><h2>Warehouse Form</h2></div>
          <div className={styles.formGrid}>
            <label className={styles.formField}><span>warehouse_id *</span><input value={form.warehouse_id} onChange={(e) => updateForm("warehouse_id", e.target.value)} /></label>
            <label className={styles.formField}><span>warehouse_name *</span><input value={form.warehouse_name} onChange={(e) => updateForm("warehouse_name", e.target.value)} /></label>
            <label className={styles.formField}><span>capacity *</span><input value={form.capacity} onChange={(e) => updateForm("capacity", e.target.value)} /></label>
            <label className={styles.formField}>
              <span>product_id *</span>
              <select value={form.product_id} onChange={(e) => updateForm("product_id", e.target.value)}>
                <option>101 - Industrial Bearings</option>
                <option>102 - Hydraulic Pump</option>
                <option>103 - Conveyor Belt</option>
                <option>104 - Motor Kit</option>
                <option>105 - Solenoid Valve</option>
                <option>106 - Appliance Set</option>
              </select>
            </label>
            <label className={styles.formField}><span>city / location *</span><input value={form.city} onChange={(e) => updateForm("city", e.target.value)} /></label>
            <label className={styles.formField}><span>notes</span><input value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} /></label>
          </div>
          <div className={styles.formActions}>
            <button className={styles.heroButton} type="button" onClick={() => setNotice(`${form.warehouse_name} saved locally for demo flow.`)}>
              <span>Save</span>
              Warehouse
            </button>
            <button
              className={styles.resetButton}
              type="button"
              onClick={() => {
                setForm({
                  warehouse_id: String(selectedWarehouse.id),
                  warehouse_name: selectedWarehouse.name,
                  capacity: String(selectedWarehouse.capacity),
                  product_id: `${selectedWarehouse.productId} - Linked Product`,
                  city: selectedWarehouse.city,
                  notes: `${selectedWarehouse.manager} currently manages this site.`,
                });
                setNotice("Form reset to selected warehouse.");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className={styles.managementCard}>
          <div className={styles.sectionHeader}><h2>Warehouse Utilization</h2></div>
          <div className={styles.utilizationList}>
            {utilization.map((item) => (
              <div key={item.name} className={styles.utilizationRow}>
                <div className={styles.utilizationHead}>
                  <span>{item.name}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className={styles.utilizationTrack}>
                  <div className={`${styles.utilizationFill} ${item.value < 70 ? styles.utilizationMedium : ""}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <span><i className={styles.legendHigh} /> High (&ge; 70%)</span>
            <span><i className={styles.legendMedium} /> Medium (40% - 69%)</span>
            <span><i className={styles.legendLow} /> Low (&lt; 40%)</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export function WarehouseInventoryPage() {
  const [notice, setNotice] = React.useState("");
  const [openFastMoving, setOpenFastMoving] = React.useState(false);
  const { filters, setFilters, filteredRows, options, reset } = useTableFilters({
    rows: inventoryRows,
    getCategory: (row) => row.category,
    getStatus: (row) => row.status,
    getLocation: (row) => row.location,
    getSearchValues: (row) => [row.sku, row.item, row.category, row.location, row.status],
  });

  const tableRows = filteredRows.map((row) => [row.sku, row.item, row.category, row.location, formatNumber(row.onHand), formatNumber(row.reserved), formatNumber(row.available), row.status]);

  return (
    <main className={styles.page}>
      <Header title="Inventory" subtitle="Real-time view of all inventory in your assigned warehouse." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={`${styles.metrics} ${styles.metricsFive}`}>
        <Metric icon="BX" label="Total SKUs" value="1,245" sub="Active SKUs" />
        <Metric icon="UN" label="On Hand Units" value="92,500" sub="Total units" />
        <Metric icon="RS" label="Reserved Units" value="12,840" sub="Reserved units" />
        <Metric icon="OK" label="Available Units" value="79,660" sub="Ready to ship" />
        <Metric icon="$" label="Inventory Value" value="$2.48M" sub="Total inventory value" />
      </div>
      <FilterBar
        filters={filters}
        options={options}
        onChange={setFilters}
        onReset={() => { reset(); setNotice("Inventory filters cleared."); }}
        onApply={() => setNotice(`Showing ${filteredRows.length} inventory records.`)}
        onExport={() => {
          downloadCsv("warehouse-inventory.csv", ["SKU", "Item", "Category", "Aisle", "On Hand", "Reserved", "Available", "Status"], tableRows);
          setNotice(`Exported ${filteredRows.length} inventory rows.`);
        }}
      />
      <Card title={`Inventory (${filteredRows.length})`}>
        <Table headers={["SKU", "Item", "Category", "Aisle / Bin", "On Hand", "Reserved", "Available", "Status"]} rows={tableRows} detailsTitle="Inventory Item" />
      </Card>
      <div className={styles.grid3}>
        <Card title="Inventory Composition by Category"><Summary rows={[["Industrial", "$842K (33.9%)"], ["Electrical", "$512K (20.6%)"], ["Hydraulics", "$368K (14.8%)"], ["Material Handling", "$296K (11.9%)"], ["MRO", "$212K (8.9%)"], ["Other", "$248K (10%)"]]} /></Card>
        <Card title="Top Fast-Moving Items" action={<button className={styles.linkBtn} onClick={() => setOpenFastMoving(true)}>View all</button>}><Table headers={["SKU", "Item", "Units Sold", "Status"]} rows={inventoryRows.slice(0, 5).map((row, index) => [row.sku, row.item, String(1320 - index * 140), "In Stock"])} detailsTitle="Fast-Moving Item" /></Card>
        <Card title="Stock Summary by Zone"><Summary rows={[["Zone A", "28,450 units"], ["Zone B", "24,180 units"], ["Zone C", "18,920 units"], ["Zone D", "12,950 units"], ["Zone E", "8,000 units"], ["Total", "92,500 units"]]} /></Card>
      </div>
      <Modal isOpen={openFastMoving} onClose={() => setOpenFastMoving(false)} title="Top Fast-Moving Items">
        <Table headers={["SKU", "Item", "Units Sold", "Status"]} rows={inventoryRows.map((row, index) => [row.sku, row.item, String(1320 - index * 110), row.status])} detailsTitle="Fast-Moving Item" />
      </Modal>
    </main>
  );
}

export function WarehouseIncomingPage() {
  const [notice, setNotice] = React.useState("");
  const [showActivity, setShowActivity] = React.useState(false);
  const { filters, setFilters, filteredRows, options, reset } = useTableFilters({
    rows: incomingRows,
    getCategory: (row) => row.supplier,
    getStatus: (row) => row.status,
    getLocation: (row) => row.dock,
    getSearchValues: (row) => [row.id, row.supplier, row.eta, row.dock, row.status],
  });

  const tableRows = filteredRows.map((row) => [row.id, row.supplier, row.eta, row.dock, String(row.items), formatNumber(row.units), row.status]);

  return (
    <main className={styles.page}>
      <Header title="Incoming Shipments" subtitle="Monitor and manage inbound shipments arriving at your warehouse." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={styles.metrics}>
        <Metric icon="IN" label="Incoming Today" value="8" sub="2,345 Units" />
        <Metric icon="CAL" label="Scheduled Arrivals" value="15" sub="5,760 Units" />
        <Metric icon="!" label="Delayed Arrivals" value="3" sub="820 Units" warn />
        <Metric icon="BX" label="Units Expected (7 Days)" value="22,140" sub="Across 28 shipments" />
      </div>
      <FilterBar
        filters={filters}
        options={{
          categories: ["All Categories", ...Array.from(new Set(incomingRows.map((row) => row.supplier)))],
          statuses: options.statuses,
          locations: options.locations,
        }}
        onChange={setFilters}
        onReset={() => { reset(); setNotice("Incoming filters reset."); }}
        onApply={() => setNotice(`Tracking ${filteredRows.length} incoming shipments.`)}
        locationLabel="Dock"
      />
      <div className={styles.grid2}>
        <Card title={`Incoming Arrivals (${filteredRows.length})`}>
          <Table headers={["Shipment ID", "Supplier", "ETA", "Dock", "Items", "Units", "Status"]} rows={tableRows} detailsTitle="Incoming Shipment" />
        </Card>
        <Card title="Receiving Schedule"><LayoutMap /></Card>
      </div>
      <div className={styles.grid3}>
        <Card title="Dock Assignments"><Summary rows={[["Total Docks", "16"], ["In Use", "7"], ["Available", "7"], ["Unassigned", "2"], ["Peak Slot", "1:00 PM"], ["Team Lead", "Alicia Brown"]]} /></Card>
        <Card title="Recent Receiving Activity" action={<button className={styles.linkBtn} onClick={() => setShowActivity(true)}>View all activity</button>}><Activity /></Card>
      </div>
      <Modal isOpen={showActivity} onClose={() => setShowActivity(false)} title="Receiving Activity">
        <Activity rows={[...recentActivities, ["PO-12570 checked-in", "08:30 AM"], ["PO-12560 delayed", "08:05 AM"]]} />
      </Modal>
    </main>
  );
}

export function WarehouseOutgoingPage() {
  const [notice, setNotice] = React.useState("");
  const [showActivity, setShowActivity] = React.useState(false);
  const { filters, setFilters, filteredRows, options, reset } = useTableFilters({
    rows: outgoingRows,
    getCategory: (row) => row.destination,
    getStatus: (row) => row.status,
    getLocation: (row) => row.bay,
    getSearchValues: (row) => [row.id, row.destination, row.dispatchTime, row.carrier, row.bay, row.status],
  });

  const tableRows = filteredRows.map((row) => [row.id, row.destination, row.dispatchTime, row.carrier, String(row.items), formatNumber(row.units), row.bay, row.status]);

  return (
    <main className={styles.page}>
      <Header title="Outgoing Shipments" subtitle="Manage and monitor all outbound shipments from your warehouse." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={styles.metrics}>
        <Metric icon="RD" label="Shipments Ready" value="23" sub="Ready for dispatch" />
        <Metric icon="DT" label="Dispatches Today" value="37" sub="+12% vs yesterday" />
        <Metric icon="!" label="Delayed Dispatches" value="4" sub="Require attention" warn />
        <Metric icon="BX" label="Units Outbound" value="5,784" sub="+8.6% vs yesterday" />
      </div>
      <FilterBar
        filters={filters}
        options={{
          categories: ["All Categories", ...Array.from(new Set(outgoingRows.map((row) => row.destination)))],
          statuses: options.statuses,
          locations: options.locations,
        }}
        onChange={setFilters}
        onReset={() => { reset(); setNotice("Outgoing filters reset."); }}
        onApply={() => setNotice(`Tracking ${filteredRows.length} outbound shipments.`)}
        onExport={() => {
          downloadCsv("outgoing-shipments.csv", ["Shipment", "Destination", "Dispatch", "Carrier", "Items", "Units", "Bay", "Status"], tableRows);
          setNotice(`Exported ${filteredRows.length} outgoing shipments.`);
        }}
        locationLabel="Loading Bay"
      />
      <Card title={`Outgoing Shipments (${filteredRows.length})`}>
        <Table headers={["Shipment ID", "Destination", "Dispatch Time", "Carrier", "Items", "Units", "Loading Bay", "Status"]} rows={tableRows} detailsTitle="Outgoing Shipment" />
      </Card>
      <div className={styles.grid3}>
        <Card title="Dispatch Schedule"><Summary rows={[["09:00 AM", "2 shipments"], ["10:00 AM", "3 shipments"], ["11:00 AM", "2 shipments"], ["01:00 PM", "2 shipments"], ["02:00 PM", "1 shipment"], ["Utilization", "76%"]]} /></Card>
        <Card title="Loading Progress"><Summary rows={[["Overall Progress", "68%"], ["Loaded Units", "4,040"], ["Loading Units", "1,744"], ["Pending Units", "2,746"], ["Remaining Units", "1,744"], ["Current Shift", "Day Shift"]]} /></Card>
        <Card title="Recent Outbound Activity" action={<button className={styles.linkBtn} onClick={() => setShowActivity(true)}>View all activity</button>}><Activity /></Card>
      </div>
      <Modal isOpen={showActivity} onClose={() => setShowActivity(false)} title="Outbound Activity">
        <Activity rows={[...recentActivities, ["Shipment OUT-2025-0563 scheduled", "08:21 AM"], ["Delay alert updated for OUT-2025-0562", "07:48 AM"]]} />
      </Modal>
    </main>
  );
}

export function WarehouseLowStockPage() {
  const [notice, setNotice] = React.useState("");
  const [showQueue, setShowQueue] = React.useState(false);
  const { filters, setFilters, filteredRows, options, reset } = useTableFilters({
    rows: lowStockRows,
    getCategory: (row) => row.category,
    getStatus: (row) => row.severity,
    getLocation: (row) => row.aisle,
    getSearchValues: (row) => [row.sku, row.item, row.category, row.aisle, row.supplier, row.severity],
  });

  const alertRows = filteredRows.map((row) => [row.sku, row.item, row.category, row.aisle, String(row.onHand), String(row.reorderLevel), String(row.daysRemaining), row.severity]);
  const queueRows = filteredRows.map((row) => [row.sku, row.item, String(row.onHand), String(row.daysRemaining), row.estValue, "Replenish"]);

  return (
    <main className={styles.page}>
      <Header title="Low Stock Alerts" subtitle="Items below reorder level that need your attention." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={styles.metrics}>
        <Metric icon="!" label="Critical Items" value="28" sub="Require immediate action" warn />
        <Metric icon="BX" label="Low Stock Items" value="134" sub="Below reorder level" warn />
        <Metric icon="$" label="Urgent Replenishments" value="$152K" sub="Est. value at risk" />
        <Metric icon="TG" label="Affected Categories" value="12" sub="With stock risk" />
      </div>
      <FilterBar
        filters={filters}
        options={options}
        onChange={setFilters}
        onReset={() => { reset(); setNotice("Alert filters cleared."); }}
        onApply={() => setNotice(`Showing ${filteredRows.length} low stock alerts.`)}
      />
      <div className={styles.grid2}>
        <Card title={`Low Stock Alerts (${filteredRows.length})`} action={<button className={styles.secondaryBtn} onClick={() => { downloadCsv("low-stock-alerts.csv", ["SKU", "Item", "Category", "Aisle", "On Hand", "Reorder", "Days", "Severity"], alertRows); setNotice(`Exported ${filteredRows.length} alert rows.`); }}>Export</button>}>
          <Table headers={["SKU", "Item", "Category", "Aisle / Bin", "On Hand", "Reorder Level", "Days Remaining", "Severity"]} rows={alertRows} detailsTitle="Low Stock Alert" />
        </Card>
        <Card title="Priority Replenishment Queue" action={<button className={styles.linkBtn} onClick={() => setShowQueue(true)}>View full queue</button>}>
          <Table headers={["SKU", "Item", "On Hand", "Days Rem.", "Est. Value", "Action"]} rows={queueRows} detailsTitle="Replenishment Queue Item" />
        </Card>
      </div>
      <Modal isOpen={showQueue} onClose={() => setShowQueue(false)} title="Priority Replenishment Queue">
        <Table headers={["SKU", "Item", "On Hand", "Days Remaining", "Preferred Supplier", "Severity"]} rows={filteredRows.map((row) => [row.sku, row.item, String(row.onHand), String(row.daysRemaining), row.supplier, row.severity])} detailsTitle="Replenishment Detail" />
      </Modal>
    </main>
  );
}

export function WarehouseReportsPage() {
  const [notice, setNotice] = React.useState("");
  const [dateRange, setDateRange] = React.useState("May 18, 2025 - May 24, 2025");
  const [reportType, setReportType] = React.useState("Operational");
  const [selectedReport, setSelectedReport] = React.useState<string | null>(null);

  const generate = React.useCallback((name?: string) => {
    const reportName = name || `${reportType} Summary`;
    downloadCsv("warehouse-operational-report.csv", ["Report", "Date Range", "Metric", "Value"], [
      [reportName, dateRange, "Inventory Accuracy", "98.6%"],
      [reportName, dateRange, "Fill Rate", "96.3%"],
      [reportName, dateRange, "Dock Utilization", "72%"],
    ]);
    setNotice(`${reportName} generated for ${dateRange}.`);
  }, [dateRange, reportType]);

  return (
    <main className={styles.page}>
      <Header title="Reports" subtitle="Warehouse performance insights and operational reports for Central Distribution Center." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={styles.metrics}>
        <Metric icon="AC" label="Inventory Accuracy" value="98.6%" sub="vs target 98%" />
        <Metric icon="FR" label="Fill Rate" value="96.3%" sub="vs target 95%" />
        <Metric icon="DK" label="Dock Utilization" value="72%" sub="vs target 70%" />
        <Metric icon="TM" label="Order Turnaround" value="15.2 hrs" sub="vs target 18 hrs" />
      </div>
      <div className={styles.filterBar}>
        <label className={styles.field}>
          <span>Date Range</span>
          <select className={styles.select} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option>May 18, 2025 - May 24, 2025</option>
            <option>May 11, 2025 - May 17, 2025</option>
            <option>May 4, 2025 - May 10, 2025</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Report Type</span>
          <select className={styles.select} value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option>Operational</option>
            <option>Inventory</option>
            <option>Dispatch</option>
            <option>Receiving</option>
          </select>
        </label>
        <button className={styles.primaryBtn} type="button" onClick={() => generate()}>Generate Report</button>
      </div>
      <div className={styles.grid3}>
        {["Inventory Health", "Receiving Performance", "Dispatch Performance", "Warehouse Utilization", "Low Stock Trends", "Cycle Count Summary"].map((name) => (
          <Card key={name} title={name} action={<button className={styles.linkBtn} onClick={() => setSelectedReport(name)}>View Report</button>}>
            <p className={styles.subtitle}>Operational report snapshot for {reportType.toLowerCase()} metrics.</p>
          </Card>
        ))}
      </div>
      <Card title="Recent Generated Reports">
        <Table headers={["Report Name", "Report Type", "Date Range", "Generated On", "Format"]} rows={[
          ["Inventory Health Report", "Operational", "May 18 - May 24", "May 24, 2025", "PDF"],
          ["Dispatch Performance Report", "Operational", "May 11 - May 17", "May 17, 2025", "PDF"],
          ["Receiving Performance Report", "Operational", "May 4 - May 10", "May 10, 2025", "Excel"],
        ]} detailsTitle="Generated Report" />
      </Card>
      <Modal isOpen={Boolean(selectedReport)} onClose={() => setSelectedReport(null)} title={selectedReport || "Report Preview"}>
        <Summary rows={[["Report", selectedReport || ""], ["Type", reportType], ["Date Range", dateRange], ["Warehouse", "Central Distribution Center"], ["Status", "Ready to export"], ["Action", "Use Generate Report to download"]]} />
        <div style={{ marginTop: 16 }}>
          <button className={styles.primaryBtn} type="button" onClick={() => selectedReport ? generate(selectedReport) : generate()}>Download This Report</button>
        </div>
      </Modal>
    </main>
  );
}

export function WarehouseProfilePage() {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("Michael Anderson");
  const [email, setEmail] = React.useState("michael.anderson@logisticsco.com");
  const [phone, setPhone] = React.useState("(901) 555-0148");
  const [alternatePhone, setAlternatePhone] = React.useState("(901) 555-0199");
  const [address, setAddress] = React.useState("1234 Warehouse Ln, Memphis, TN 38118");
  const [emergencyContact, setEmergencyContact] = React.useState("Sarah Anderson (Spouse) • (901) 555-0172");
  const [toggles, setToggles] = React.useState([true, true, true, true, false]);
  const [showActivity, setShowActivity] = React.useState(false);
  const [showSessions, setShowSessions] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
    setAvatar(localStorage.getItem("warehouse_avatar"));
    setName(localStorage.getItem("warehouse_manager_name") || "Michael Anderson");
    setEmail(localStorage.getItem("warehouse_manager_email") || "michael.anderson@logisticsco.com");
    setPhone(localStorage.getItem("warehouse_manager_phone") || "(901) 555-0148");
    setAlternatePhone(localStorage.getItem("warehouse_manager_alt_phone") || "(901) 555-0199");
    setAddress(localStorage.getItem("warehouse_manager_address") || "1234 Warehouse Ln, Memphis, TN 38118");
    setEmergencyContact(localStorage.getItem("warehouse_manager_emergency") || "Sarah Anderson (Spouse) • (901) 555-0172");
    const savedToggles = localStorage.getItem("warehouse_manager_toggles");
    if (savedToggles) {
      try {
        setToggles(JSON.parse(savedToggles) as boolean[]);
      } catch {
        localStorage.removeItem("warehouse_manager_toggles");
      }
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const saveProfile = () => {
    localStorage.setItem("warehouse_manager_name", name);
    localStorage.setItem("warehouse_manager_email", email);
    localStorage.setItem("warehouse_manager_phone", phone);
    localStorage.setItem("warehouse_manager_alt_phone", alternatePhone);
    localStorage.setItem("warehouse_manager_address", address);
    localStorage.setItem("warehouse_manager_emergency", emergencyContact);
    localStorage.setItem("warehouse_manager_toggles", JSON.stringify(toggles));
    localStorage.setItem("account_name", name);
    setEditing(false);
    setNotice("Warehouse profile saved.");
  };

  const upload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      setAvatar(value);
      localStorage.setItem("warehouse_avatar", value);
      setNotice("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  };

  const togglePreference = (index: number) => {
    setToggles((current) => {
      const next = current.map((value, itemIndex) => itemIndex === index ? !value : value);
      localStorage.setItem("warehouse_manager_toggles", JSON.stringify(next));
      return next;
    });
    setNotice("Notification preference updated.");
  };

  return (
    <main className={styles.page}>
      <Header title="Profile" subtitle="View and manage your profile and preferences." />
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <section className={`${styles.card} ${styles.profileHero}`}>
        <div className={styles.profilePhoto}>
          {avatar ? <img src={avatar} alt="Profile" /> : "MA"}
          <button className={`${styles.iconBtn} ${styles.profileEdit}`} type="button" onClick={() => fileRef.current?.click()}>Cam</button>
          <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
        </div>
        <div>
          {editing ? (
            <>
              <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
              <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          ) : (
            <>
              <h2>{name}</h2>
              <p>{email}</p>
              <p>{phone}</p>
            </>
          )}
          <button className={styles.secondaryBtn} type="button" onClick={() => editing ? saveProfile() : setEditing(true)}>{editing ? "Save" : "Edit"}</button>
        </div>
        {[["Employee ID", "EMP-20481"], ["Assigned Warehouse", "Central Distribution Center"], ["Role", "Warehouse Manager"], ["Status", "Active"]].map(([label, value]) => <div key={label}><span className={styles.subtitle}>{label}</span><strong>{value}</strong></div>)}
      </section>
      <div className={styles.grid3}>
        <Card title="Personal Information" action={<button className={styles.linkBtn} onClick={() => setEditing(true)}>Edit</button>}>
          <Summary rows={[["Full Name", name], ["Email", email], ["Phone", phone], ["Alternate Phone", alternatePhone], ["Address", address], ["Emergency Contact", emergencyContact]]} />
          {editing ? (
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <input className={styles.input} value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} placeholder="Alternate phone" />
              <input className={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
              <input className={styles.input} value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Emergency contact" />
            </div>
          ) : null}
        </Card>
        <Card title="Notification Preferences" action={<button className={styles.linkBtn} onClick={saveProfile}>Save</button>}>
          {["Low stock alerts", "Incoming shipment updates", "Outgoing shipment updates", "System announcements", "Email digest"].map((label, index) => (
            <div className={styles.summaryRow} key={label}>
              <span>{label}</span>
              <button className={`${styles.toggle} ${toggles[index] ? styles.toggleOn : ""}`} type="button" onClick={() => togglePreference(index)}><span /></button>
            </div>
          ))}
        </Card>
        <Card title="Performance Summary"><Summary rows={[["Orders Processed", "1,248"], ["Shipments Overseeing", "312"], ["Inventory Accuracy", "99.4%"], ["On-Time Shipments", "96.6%"], ["Issues Resolved", "28"], ["Team Utilization", "87%"]]} /></Card>
      </div>
      <div className={styles.grid2}>
        <Card title="Recent Activity Log" action={<button className={styles.linkBtn} onClick={() => setShowActivity(true)}>View all</button>}><Activity /></Card>
        <Card title="Connected Devices & Sessions" action={<button className={styles.linkBtn} onClick={() => setShowSessions(true)}>View all</button>}><Activity rows={[["Windows • Chrome • Current Session", "8:46 AM"], ["iPhone 14 • Safari", "7:25 AM"], ["Windows • Edge", "9:03 AM"]]} /></Card>
      </div>
      <Modal isOpen={showActivity} onClose={() => setShowActivity(false)} title="Recent Activity Log">
        <Activity rows={[...recentActivities, ["Approved outgoing shipment SO-92331", "09:15 AM"], ["Updated reorder level for PRD-2048", "08:03 AM"], ["Logged in from Chrome on Windows", "07:40 AM"]]} />
      </Modal>
      <Modal isOpen={showSessions} onClose={() => setShowSessions(false)} title="Connected Devices & Sessions">
        <Summary rows={[["Windows • Chrome", "Current Session • Memphis, TN"], ["iPhone 14 • Safari", "May 23, 2025 • IP 192.168.1.78"], ["Windows • Edge", "May 22, 2025 • IP 192.168.1.91"], ["Session Timeout", "4 hours"], ["2FA", "Enabled"], ["Password Updated", "Apr 10, 2025"]]} />
      </Modal>
    </main>
  );
}
