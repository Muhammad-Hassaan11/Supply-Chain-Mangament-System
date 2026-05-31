"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./ClientPortal.module.css";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

type DashboardData = {
  total_suppliers: number;
  total_products: number;
  total_warehouses: number;
  total_shipments: number;
  low_stock_count: number;
};

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.page} animate-fade-in`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageSubtitle}>{subtitle}</p>
        </div>
        <div className={styles.headerTools}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <div>
              <strong>SQL Server</strong>
              <span>Connected</span>
            </div>
            <span className={styles.chevron}>⌄</span>
          </div>
          <div className={styles.profilePill}>
            <div className={styles.profileAvatar}>AR</div>
            <div>
              <strong>Apex Retail Ltd.</strong>
              <span>Client / Buyer</span>
            </div>
            <span className={styles.chevron}>⌄</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  delta,
  tone = "mint",
}: {
  icon: string;
  title: string;
  value: string;
  delta: string;
  tone?: "mint" | "gold" | "teal" | "violet";
}) {
  return (
    <div className={styles.metricCard}>
      <div className={`${styles.metricIcon} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]}`}>{icon}</div>
      <div className={styles.metricBody}>
        <div className={styles.metricTitle}>{title}</div>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricDelta}>{delta}</div>
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>{title}</h2>
        {action ? action : null}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ text, kind = "neutral" }: { text: string; kind?: "success" | "info" | "warning" | "neutral" }) {
  return <span className={`${styles.badge} ${styles[`badge${kind[0].toUpperCase()}${kind.slice(1)}`]}`}>{text}</span>;
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapCard() {
  return (
    <div className={styles.mapCard}>
      <div className={styles.mapGlow} />
      <div className={styles.mapLabelLeft}>
        <strong>Shanghai, CN</strong>
        <span>Departed May 18</span>
      </div>
      <div className={styles.mapLabelRight}>
        <strong>New York, USA</strong>
        <span>ETA May 28</span>
      </div>
      <div className={styles.mapRoute} />
      <div className={styles.mapPinLeft} />
      <div className={styles.mapTruck}>🚚</div>
      <div className={styles.mapPinRight} />
    </div>
  );
}

function SummaryList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className={styles.summaryList}>
      {items.map((item) => (
        <div key={item.label} className={styles.summaryRow}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function ClientDashboardPage({ data, accountName }: { data: DashboardData; accountName: string | null }) {
  const router = useRouter();
  return (
    <Shell
      title="Client Dashboard"
      subtitle={`Welcome back${accountName ? `! ${accountName}` : ""}. Here's what's happening with your supply chain.`}
    >
      <div className={styles.metricsGrid}>
        <MetricCard icon="🛒" title="Active Orders" value="28" delta="▲ 12% vs last 30 days" />
        <MetricCard icon="🚛" title="In-Transit Shipments" value={`${Math.max(14, data.total_shipments)}`} delta="▲ 8% vs last 30 days" tone="teal" />
        <MetricCard icon="👥" title="Preferred Suppliers" value={`${Math.max(16, data.total_suppliers)}`} delta="No change vs last 30 days" />
        <MetricCard icon="$" title="Monthly Spend (May)" value="$1.24M" delta="▲ 18% vs Apr 2025" tone="gold" />
      </div>

      <div className={styles.twoCol}>
        <Panel title="My Orders" action={<button className={styles.linkAction} type="button" onClick={() => router.push("/client/reports")}>View all orders →</button>}>
          <DataTable
            headers={["Order #", "Supplier", "Order Date", "Status", "Order Value", "ETA / Required Date"]}
            rows={[
              ["PO-250519-1028", "Global Textiles Inc.", "May 19, 2025", <StatusBadge key="1" text="Confirmed" kind="success" />, "$128,450.00", "Jun 02, 2025"],
              ["PO-250516-0934", "Prime Packaging Co.", "May 16, 2025", <StatusBadge key="2" text="In Production" kind="info" />, "$76,230.00", "Jun 05, 2025"],
              ["PO-250515-0712", "ElectroParts Ltd.", "May 15, 2025", <StatusBadge key="3" text="Shipped" kind="neutral" />, "$212,540.00", "May 28, 2025"],
              ["PO-250512-0448", "Sunrise Metals", "May 12, 2025", <StatusBadge key="4" text="Confirmed" kind="success" />, "$98,120.00", "Jun 10, 2025"],
              ["PO-250509-0316", "Global Textiles Inc.", "May 09, 2025", <StatusBadge key="5" text="In Production" kind="info" />, "$184,760.00", "Jun 01, 2025"],
            ]}
          />
        </Panel>

        <Panel title="Shipment Tracking" action={<button className={styles.linkAction} type="button" onClick={() => router.push("/client/shipments")}>Track all shipments →</button>}>
          <div className={styles.stackList}>
            {[
              ["SHP-250518-0001", "Global Textiles Inc.", "Los Angeles, USA → New York, USA", "In Transit", "ETA: May 24, 2025"],
              ["SHP-250515-0007", "ElectroParts Ltd.", "Shanghai, China → New York, USA", "In Transit", "ETA: May 22, 2025"],
              ["SHP-250510-0012", "Prime Packaging Co.", "Houston, USA → Dallas, USA", "Out for Delivery", "ETA: May 20, 2025"],
              ["SHP-250508-0003", "Sunrise Metals", "Mumbai, India → New York, USA", "Delivered", "Delivered: May 17, 2025"],
            ].map(([id, supplier, route, status, meta]) => (
              <div key={id} className={styles.shipmentItem}>
                <div className={styles.shipmentIcon}>✈</div>
                <div className={styles.shipmentBody}>
                  <div className={styles.shipmentTop}>
                    <strong>{id}</strong>
                    <StatusBadge text={status} kind={status === "Delivered" ? "success" : status === "Out for Delivery" ? "info" : "neutral"} />
                  </div>
                  <div className={styles.shipmentSupplier}>{supplier}</div>
                  <div className={styles.shipmentRoute}>{route}</div>
                  <div className={styles.shipmentMeta}>{meta}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Supplier Performance (Top 5)" action={<button className={styles.linkAction} type="button" onClick={() => router.push("/client/reports")}>View full report →</button>}>
          <DataTable
            headers={["Supplier", "On-Time Delivery", "Quality", "Responsiveness", "Overall"]}
            rows={[
              ["Global Textiles Inc.", "95%", "4.6", "4.7", "4.6"],
              ["Prime Packaging Co.", "92%", "4.4", "4.5", "4.4"],
              ["ElectroParts Ltd.", "90%", "4.3", "4.3", "4.3"],
              ["Sunrise Metals", "88%", "4.2", "4.2", "4.2"],
              ["Value Components", "85%", "4.0", "4.1", "4.0"],
            ]}
          />
        </Panel>

        <Panel title="Reorder Recommendations">
          <div className={styles.stackList}>
            {[
              ["Polyester Yarn 40s", "Global Textiles Inc.", "Est. reorder: Jun 05, 2025"],
              ["Corrugated Boxes (M)", "Prime Packaging Co.", "Est. reorder: Jun 07, 2025"],
              ["Resistor 10K Ohm", "ElectroParts Ltd.", "Est. reorder: Jun 03, 2025"],
            ].map(([name, supplier, eta]) => (
              <div key={name} className={styles.reorderItem}>
                <div className={styles.reorderThumb} />
                <div className={styles.reorderBody}>
                  <strong>{name}</strong>
                  <span>{supplier}</span>
                  <small>{eta}</small>
                </div>
                <button className={styles.ctaSmall} type="button">Create Order</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Insights">
          <div className={styles.insights}>
            <div className={styles.insightItem}>Your on-time delivery rate is 93% this month.</div>
            <div className={styles.insightItem}>Spend is up 18% vs last month. Top category: Raw Materials.</div>
            <div className={styles.insightItem}>Average lead time is 22 days, down 2 days vs last month.</div>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function ClientReportsPage() {
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [generatedReport, setGeneratedReport] = React.useState<{ name: string; createdAt: string } | null>(null);
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportError, setReportError] = React.useState<string | null>(null);
  const downloadReport = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  const generateReport = async () => {
    try {
      setReportLoading(true);
      setReportError(null);
      const response = await api.post<{ file_name: string; content: string; generated_at: string }>("/api/client/reports/generate", {
        report_type: "Summary Overview",
        date_range: "May 1 – May 25, 2025",
      });
      setGeneratedReport({ name: response.file_name, createdAt: response.generated_at });
      setReportModalOpen(true);
      downloadReport(response.content, response.file_name);
    } catch (error: unknown) {
      setReportError(error instanceof Error ? error.message : "Failed to generate report.");
    } finally {
      setReportLoading(false);
    }
  };
  return (
    <Shell title="Reports" subtitle="Gain insights into your procurement and supply chain performance.">
      <div className={styles.metricsGrid}>
        <MetricCard icon="$" title="Monthly Spend (May)" value="$1.24M" delta="▲ 18% vs Apr 2025" />
        <MetricCard icon="◔" title="On-Time Delivery Rate" value="92%" delta="▲ 5% vs Apr 2025" tone="teal" />
        <MetricCard icon="⏱" title="Average Lead Time" value="12.4 Days" delta="▼ 1.6 days vs Apr 2025" tone="violet" />
        <MetricCard icon="★" title="Supplier Performance Score" value="4.2 / 5" delta="▲ 0.3 vs Apr 2025" />
      </div>

      <div className={styles.filterBar}>
        <div>
          <strong>Generate Report</strong>
          <span>Customize and generate reports based on your business needs.</span>
        </div>
        <div className={styles.filterInput}>May 1 – May 25, 2025</div>
        <div className={styles.filterInput}>Summary Overview</div>
        <button className={styles.primaryButton} type="button" onClick={generateReport}>{reportLoading ? "Generating..." : "Generate Report"}</button>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Monthly Spend Trend (USD)">
          <div className={styles.chartArea}>
            <div className={styles.areaLine} />
            <div className={styles.areaLabels}>
              <span>$820K</span>
              <span>$860K</span>
              <span>$1.02M</span>
              <span>$1.18M</span>
              <span>$1.05M</span>
              <span>$1.24M</span>
            </div>
          </div>
        </Panel>
        <Panel title="Supplier Performance by Category">
          <SummaryList items={[
            { label: "Packaging", value: "4.6" },
            { label: "Raw Materials", value: "4.3" },
            { label: "Electronics", value: "4.1" },
            { label: "Logistics", value: "4.0" },
            { label: "Services", value: "3.8" },
          ]} />
        </Panel>
        <Panel title="Order Status Breakdown">
          <SummaryList items={[
            { label: "Delivered", value: "78 (61%)" },
            { label: "In Transit", value: "26 (20%)" },
            { label: "In Production", value: "14 (11%)" },
            { label: "Delayed", value: "6 (5%)" },
            { label: "Cancelled", value: "4 (3%)" },
          ]} />
        </Panel>
      </div>

      <Panel title="Recent Reports" action={<button className={styles.linkAction} type="button" onClick={generateReport}>View all reports →</button>}>
        <DataTable
          headers={["Report Name", "Report Type", "Date Range", "Generated On", "Format"]}
          rows={[
            ["Monthly Spend Summary — May 2025", <StatusBadge key="a" text="Summary" kind="info" />, "May 1 – May 25, 2025", "May 25, 2025 10:30 AM", "PDF"],
            ["Supplier Performance Report — Q2 2025", <StatusBadge key="b" text="Performance" kind="success" />, "Apr 1 – Jun 30, 2025", "May 24, 2025 03:15 PM", "Excel"],
            ["Order Status Report — May 2025", <StatusBadge key="c" text="Operations" kind="warning" />, "May 1 – May 25, 2025", "May 24, 2025 09:45 AM", "PDF"],
            ["Delivery Performance Report — May 2025", <StatusBadge key="d" text="Performance" kind="success" />, "May 1 – May 25, 2025", "May 23, 2025 02:20 PM", "Excel"],
          ]}
        />
      </Panel>
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Generated" idPrefix="client-report">
        <div style={{ display: "grid", gap: "14px" }}>
          {reportError ? <div style={{ color: "#c2410c" }}>{reportError}</div> : null}
          <div>Your report is ready and has been downloaded.</div>
          <div><strong>Report:</strong> {generatedReport?.name}</div>
          <div><strong>Generated:</strong> {generatedReport?.createdAt}</div>
        </div>
      </Modal>
    </Shell>
  );
}

export function ClientSuppliersPage() {
  const router = useRouter();
  return (
    <Shell title="Suppliers" subtitle="Manage your approved and preferred suppliers.">
      <div className={styles.metricsGrid}>
        <MetricCard icon="👥" title="Active Suppliers" value="54" delta="▲ 12% vs last 30 days" />
        <MetricCard icon="☆" title="Preferred Suppliers" value="16" delta="▲ 6% vs last 30 days" tone="teal" />
        <MetricCard icon="🏅" title="Avg. Supplier Rating" value="4.3 / 5" delta="▲ 0.2 vs last 30 days" />
        <MetricCard icon="◷" title="On-Time Delivery" value="92%" delta="▲ 4% vs last 30 days" tone="teal" />
      </div>

      <div className={styles.twoCol}>
        <Panel title="All Suppliers">
          <DataTable
            headers={["Supplier Name", "Category", "Contact", "Lead Time", "Rating", "On-Time Delivery", "Status"]}
            rows={[
              ["Global Textiles Inc.", "Textiles", "John Carter", "12", "4.6", "95%", <StatusBadge key="1" text="Active" kind="success" />],
              ["Prime Packaging Co.", "Packaging", "Sarah Mitchell", "8", "4.4", "93%", <StatusBadge key="2" text="Active" kind="success" />],
              ["ElectroParts Ltd.", "Electronics", "Michael Lee", "15", "4.2", "90%", <StatusBadge key="3" text="Active" kind="success" />],
              ["Sunrise Metals", "Metals", "David Johnson", "10", "4.3", "91%", <StatusBadge key="4" text="Preferred" kind="info" />],
              ["Value Components", "Components", "Emily Davis", "7", "4.5", "94%", <StatusBadge key="5" text="Preferred" kind="info" />],
            ]}
          />
        </Panel>

        <div className={styles.sideStack}>
          <Panel title="Supplier Performance Summary">
            <div className={styles.bigRing}>
              <div>
                <strong>92%</strong>
                <span>Overall On-Time Delivery</span>
              </div>
            </div>
          </Panel>
          <Panel title="Preferred Supplier Categories" action={<button className={styles.linkAction} type="button" onClick={() => router.push("/client/suppliers")}>View all</button>}>
            <SummaryList items={[
              { label: "Packaging", value: "6" },
              { label: "Textiles", value: "4" },
              { label: "Components", value: "3" },
              { label: "Metals", value: "2" },
              { label: "Electronics", value: "1" },
            ]} />
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

export function ClientShipmentsPage() {
  const [mapExpanded, setMapExpanded] = React.useState(false);
  return (
    <Shell title="Track My Shipments" subtitle="Real-time visibility and live tracking for all your active shipments.">
      <div className={styles.metricsGrid}>
        <MetricCard icon="🚚" title="In Transit" value="14" delta="↑ 8% vs last 30 days" />
        <MetricCard icon="✈" title="Out for Delivery" value="6" delta="↑ 12% vs last 30 days" tone="teal" />
        <MetricCard icon="✓" title="Delivered This Month" value="28" delta="↑ 15% vs last month" />
        <MetricCard icon="⚠" title="Delayed Shipments" value="3" delta="↑ 1 vs last 30 days" tone="gold" />
      </div>

      <div className={styles.twoCol}>
        <Panel title="My Shipments">
          <DataTable
            headers={["Shipment ID", "Supplier", "Route", "Carrier", "ETA", "Status"]}
            rows={[
              ["SHP-250519-0017", "Global Textiles Inc.", "Shanghai → New York", "Maersk", "May 28, 2025", <StatusBadge key="1" text="In Transit" kind="success" />],
              ["SHP-250519-0018", "Prime Packaging Co.", "Shenzhen → Los Angeles", "COSCO Shipping", "May 26, 2025", <StatusBadge key="2" text="Out for Delivery" kind="info" />],
              ["SHP-250515-0009", "ElectroParts Ltd.", "Seoul → Dallas", "DHL Freight", "May 24, 2025", <StatusBadge key="3" text="Delivered" kind="success" />],
              ["SHP-250512-0007", "Sunrise Metals", "Mumbai → New York", "FedEx", "May 30, 2025", <StatusBadge key="4" text="In Transit" kind="success" />],
            ]}
          />
        </Panel>
        <Panel title="Live Tracking Map" action={<button className={styles.linkAction} type="button" onClick={() => setMapExpanded(true)}>Expand Map ↗</button>}>
          <MapCard />
        </Panel>
      </div>

      <div className={styles.threeCol}>
        <Panel title="Shipment Details">
          <div className={styles.timeline}>
            {["Order Confirmed", "Picked Up", "Departed Origin", "In Transit", "Out for Delivery", "Delivered"].map((step, index) => (
              <div key={step} className={styles.timelineStep}>
                <div className={`${styles.timelineDot} ${index < 5 ? styles.timelineDotActive : ""}`} />
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recent Tracking Updates" action={<button className={styles.linkAction} type="button" onClick={() => setMapExpanded(true)}>View all</button>}>
          <div className={styles.insights}>
            <div className={styles.insightItem}>Out for Delivery — Los Angeles, USA — May 25, 2025 07:45 AM</div>
            <div className={styles.insightItem}>Arrived at Distribution Facility — May 24, 2025 09:10 PM</div>
            <div className={styles.insightItem}>Departed Port — Long Beach, USA — May 23, 2025 06:20 AM</div>
          </div>
        </Panel>
        <Panel title="Exception Alerts" action={<button className={styles.linkAction} type="button" onClick={() => setMapExpanded(true)}>View all</button>}>
          <div className={styles.insights}>
            <div className={styles.alertItem}>Delay in customs clearance — Mumbai, IND</div>
            <div className={styles.alertItem}>Weather delay — Ho Chi Minh City, VN</div>
            <div className={styles.alertItem}>Port congestion — Singapore</div>
          </div>
        </Panel>
      </div>
      <Modal isOpen={mapExpanded} onClose={() => setMapExpanded(false)} title="Expanded Tracking Map" idPrefix="client-map">
        <div style={{ display: "grid", gap: "14px" }}>
          <MapCard />
          <div style={{ color: "#607484" }}>Active route: Shanghai, CN → Pacific Route → New York, USA</div>
        </div>
      </Modal>
    </Shell>
  );
}

export function ClientInvoicesPage() {
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("$12,000.00");
  const [lastPayment, setLastPayment] = React.useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const submitPayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      const response = await api.post<{ confirmation_message: string; paid_at: string }>("/api/client/payments", {
        amount: paymentAmount,
        invoice_reference: "INV-2025-0528",
      });
      setLastPayment(`${response.confirmation_message} (${response.paid_at})`);
      setPaymentModalOpen(false);
    } catch (error: unknown) {
      setPaymentError(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setPaymentLoading(false);
    }
  };
  return (
    <Shell title="Invoices" subtitle="View your invoices, billing history, and manage payments.">
      <div className={styles.metricsGrid}>
        <MetricCard icon="💼" title="Total Outstanding" value="$312,450.00" delta="12 invoices" />
        <MetricCard icon="✓" title="Paid This Month" value="$185,340.00" delta="▲ 18% vs last month" tone="teal" />
        <MetricCard icon="⚠" title="Overdue Invoices" value="$48,950.00" delta="5 invoices" tone="gold" />
        <MetricCard icon="▮▮▮" title="Billing Cycle Spend (May)" value="$198,750.00" delta="▲ 9% vs Apr 2025" />
      </div>

      <div className={styles.twoCol}>
        <Panel title="Invoice List">
          <DataTable
            headers={["Invoice Number", "Supplier", "Date Issued", "Due Date", "Amount", "Payment Status"]}
            rows={[
              ["INV-2025-0518", "Global Textiles Inc.", "May 18, 2025", "Jun 17, 2025", "$62,450.00", <StatusBadge key="1" text="Paid" kind="success" />],
              ["INV-2025-0512", "Prime Packaging Co.", "May 12, 2025", "Jun 11, 2025", "$38,750.00", <StatusBadge key="2" text="Partially Paid" kind="info" />],
              ["INV-2025-0505", "ElectroParts Ltd.", "May 05, 2025", "Jun 04, 2025", "$24,300.00", <StatusBadge key="3" text="Paid" kind="success" />],
              ["INV-2025-0501", "Sunrise Metals", "May 01, 2025", "May 31, 2025", "$45,600.00", <StatusBadge key="4" text="Overdue" kind="warning" />],
              ["INV-2025-0428", "Value Components", "Apr 28, 2025", "May 28, 2025", "$28,900.00", <StatusBadge key="5" text="Due" kind="warning" />],
            ]}
          />
        </Panel>

        <div className={styles.sideStack}>
          <Panel title="Payment Summary">
            <SummaryList items={[
              { label: "Total Invoiced", value: "$511,200.00" },
              { label: "Total Paid", value: "$198,750.00" },
              { label: "Total Outstanding", value: "$312,450.00" },
              { label: "Overdue Amount", value: "$48,950.00" },
            ]} />
            <button className={styles.primaryButton} type="button" onClick={() => setPaymentModalOpen(true)}>Make a Payment</button>
          </Panel>
          <Panel title="Upcoming Due Invoices" action={<button className={styles.linkAction} type="button" onClick={() => setPaymentModalOpen(true)}>View all</button>}>
            <div className={styles.insights}>
              <div className={styles.insightItem}>INV-2025-0528 — Due in 3 days</div>
              <div className={styles.insightItem}>INV-2025-0604 — Due in 10 days</div>
              <div className={styles.insightItem}>INV-2025-0611 — Due in 17 days</div>
            </div>
          </Panel>
        </div>
      </div>
      <Modal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Make a Payment" idPrefix="client-payment">
        <div style={{ display: "grid", gap: "14px" }}>
          <label className={styles.modalField}>
            <span>Payment Amount</span>
            <input className={styles.profileInput} value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          </label>
          {paymentError ? <div style={{ color: "#c2410c" }}>{paymentError}</div> : null}
          <button className={styles.primaryButton} type="button" onClick={submitPayment}>{paymentLoading ? "Processing..." : "Confirm Payment"}</button>
          {lastPayment ? <div style={{ color: "#118f87", fontWeight: 700 }}>{lastPayment}</div> : null}
        </div>
      </Modal>
    </Shell>
  );
}

export function ClientProfilePage({ accountName, userEmail }: { accountName: string | null; userEmail?: string | null }) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [editingSection, setEditingSection] = React.useState<"personal" | "company" | "contact" | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileMessage, setProfileMessage] = React.useState<string | null>(null);
  const [supportLoading, setSupportLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(() => {
    const storedName = typeof window !== "undefined" ? localStorage.getItem("account_name") : null;
    const storedCompany = typeof window !== "undefined" ? localStorage.getItem("company_name") : null;
    const storedSupportEmail = typeof window !== "undefined" ? localStorage.getItem("settings:support_email") : null;
    return {
      fullName: storedName || "James Carter",
      jobTitle: "Procurement Manager",
      email: userEmail || "james.carter@apexretail.com",
      phone: "+1 (212) 555-0148",
      altPhone: "+1 (212) 555-0199",
      emergencyPhone: "+1 (212) 555-0100",
      location: "New York, NY, USA",
      timezone: "(EST) Eastern Time (UTC-05:00)",
      language: "English (US)",
      companyName: storedCompany || accountName || "Apex Retail Ltd.",
      legalName: `${storedCompany || accountName || "Apex Retail Ltd."}, LLC`,
      headquarters: "New York, NY, USA",
      website: "www.apexretail.com",
      taxId: "47-1234567",
      clientId: "CLT-10024",
      clientType: "Client / Buyer",
      accessLevel: "Standard Access",
      assignedSince: "May 12, 2022",
      supportEmail: storedSupportEmail || "support@apexretail.com",
      billingEmail: storedSupportEmail ? storedSupportEmail.replace("support", "billing") : "billing@apexretail.com",
      managerName: "Robert Johnson",
      managerEmail: "robert.johnson@scm.com",
      memberSince: "May 12, 2022",
    };
  });
  const [toggles, setToggles] = React.useState(() => {
    const emailAlerts = typeof window !== "undefined" ? localStorage.getItem("settings:email_alerts") : null;
    const shipmentDelayAlerts = typeof window !== "undefined" ? localStorage.getItem("settings:shipment_delay_alerts") : null;
    const weeklyReports = typeof window !== "undefined" ? localStorage.getItem("settings:weekly_reports") : null;
    return {
      emailAlerts: emailAlerts !== "false",
      shipmentUpdates: shipmentDelayAlerts !== "false",
      invoiceAlerts: true,
      promotions: false,
      weeklyReports: weeklyReports === "true",
    };
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        setProfileLoading(true);
        const response = await api.get<{
          full_name: string;
          email: string;
          phone: string;
          alt_phone?: string | null;
          emergency_phone?: string | null;
          location: string;
          timezone: string;
          language: string;
          company_name: string;
          legal_name: string;
          headquarters: string;
          website: string;
          tax_id: string;
          client_id: string;
          client_type: string;
          access_level: string;
          assigned_since: string;
          support_email: string;
          billing_email: string;
          profile_image_url?: string | null;
        }>("/api/client/profile");
        setProfile((current) => ({
          ...current,
          fullName: response.full_name,
          email: response.email,
          phone: response.phone,
          altPhone: response.alt_phone || current.altPhone,
          emergencyPhone: response.emergency_phone || current.emergencyPhone,
          location: response.location,
          timezone: response.timezone,
          language: response.language,
          companyName: response.company_name,
          legalName: response.legal_name,
          headquarters: response.headquarters,
          website: response.website,
          taxId: response.tax_id,
          clientId: response.client_id,
          clientType: response.client_type,
          accessLevel: response.access_level,
          assignedSince: response.assigned_since,
          supportEmail: response.support_email,
          billingEmail: response.billing_email,
        }));
        setAvatarDataUrl(response.profile_image_url || null);
      } catch (error: unknown) {
        setProfileMessage(error instanceof Error ? error.message : "Failed to load profile.");
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  const initials = React.useMemo(() => {
    const parts = profile.fullName.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AR";
  }, [profile.fullName]);
  const onAvatarSelected = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = String(reader.result || "");
      setAvatarDataUrl(result);
      try {
        await api.put("/api/client/profile", { profile_image_url: result });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const setField = (field: keyof typeof profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const saveSection = async () => {
    try {
      setProfileMessage(null);
      await api.put("/api/client/profile", {
        full_name: profile.fullName,
        phone: profile.phone,
        alt_phone: profile.altPhone,
        emergency_phone: profile.emergencyPhone,
        location: profile.location,
        timezone: profile.timezone,
        language: profile.language,
        company_name: profile.companyName,
        website: profile.website,
        tax_id: profile.taxId,
        support_email: profile.supportEmail,
        billing_email: profile.billingEmail,
        profile_image_url: avatarDataUrl,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("account_name", profile.fullName);
        localStorage.setItem("company_name", profile.companyName);
        localStorage.setItem("settings:support_email", profile.supportEmail);
        window.dispatchEvent(new Event("scm-settings-updated"));
      }
      setProfileMessage("Profile updated successfully.");
      setEditingSection(null);
    } catch (error: unknown) {
      setProfileMessage(error instanceof Error ? error.message : "Failed to save profile.");
    }
  };

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 1500);
    } catch {
      setCopiedField(null);
    }
  };

  const togglePref = (key: keyof typeof toggles) => {
    setToggles((current) => {
      const updated = { ...current, [key]: !current[key] };
      if (typeof window !== "undefined") {
        if (key === "emailAlerts") localStorage.setItem("settings:email_alerts", String(updated[key]));
        if (key === "shipmentUpdates") localStorage.setItem("settings:shipment_delay_alerts", String(updated[key]));
        if (key === "weeklyReports") localStorage.setItem("settings:weekly_reports", String(updated[key]));
      }
      return updated;
    });
  };

  const editableRow = (
    label: string,
    field: keyof typeof profile,
    section: "personal" | "company" | "contact",
    extra?: React.ReactNode,
  ) => (
    <div className={styles.detailRow} key={label}>
      <span>{label}</span>
      {editingSection === section ? (
        <input
          className={styles.profileInput}
          value={profile[field]}
          onChange={(event) => setField(field, event.target.value)}
        />
      ) : (
        <div className={styles.detailValueWrap}>
          <strong>{profile[field]}</strong>
          {extra}
        </div>
      )}
    </div>
  );

  const contactSupport = async () => {
    try {
      setSupportLoading(true);
      setProfileMessage(null);
      const response = await api.post<{ ticket_id: string; message: string }>("/api/client/support", {
        subject: "Client support request",
        message: `Support requested by ${profile.fullName} (${profile.email}).`,
      });
      setProfileMessage(`${response.message} Ticket: ${response.ticket_id}`);
      router.push("/contact");
    } catch (error: unknown) {
      setProfileMessage(error instanceof Error ? error.message : "Failed to contact support.");
    } finally {
      setSupportLoading(false);
    }
  };

  if (profileLoading) {
    return <div className={styles.panel}>Loading profile...</div>;
  }

  return (
    <Shell title="Profile" subtitle="Manage your buyer account details, preferences, and security settings.">
      {profileMessage ? <div className={styles.clientNotice}>{profileMessage}</div> : null}
      <div className={styles.profileHero}>
        <div className={styles.profileHeroMain}>
          <div className={styles.profilePhotoWrap}>
            <div className={styles.profilePhoto}>
              {avatarDataUrl ? <img src={avatarDataUrl} alt="Profile avatar" className={styles.profilePhotoImage} /> : initials}
            </div>
            <button className={styles.photoEditBtn} type="button" onClick={() => fileInputRef.current?.click()}>✎</button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => onAvatarSelected(e.target.files?.[0])} />
          </div>
          <div className={styles.profileHeroInfo}>
            <div className={styles.profileHeroTop}>
              <div>
                <h2>{profile.fullName}</h2>
                <p>{profile.jobTitle}</p>
              </div>
              <StatusBadge text="Primary Contact" kind="success" />
            </div>
            <div className={styles.profileMetaList}>
              <span>{profile.email}</span>
              <span>{profile.phone}</span>
              <span>{profile.location}</span>
              <span>Member since {profile.memberSince}</span>
            </div>
          </div>
        </div>

        <div className={styles.profileCompanyCard}>
          <div className={styles.profileCompanyHeader}>
            <div className={styles.profileCompanyLogo}>🏢</div>
            <div>
              <h3>{profile.companyName}</h3>
              <StatusBadge text="Verified Client" kind="success" />
            </div>
          </div>
          <div className={styles.profileCompanyGrid}>
            <div><span>Client ID</span><strong>{profile.clientId}</strong></div>
            <div><span>Client Type</span><strong>{profile.clientType}</strong></div>
            <div><span>Onboarded On</span><strong>{profile.assignedSince}</strong></div>
            <div><span>Status</span><strong>Active</strong></div>
            <div><span>Region</span><strong>North America</strong></div>
            <div><span>Tax ID / EIN</span><strong>{profile.taxId}</strong></div>
          </div>
        </div>

        <div className={styles.profileStatsCard}>
          <div className={styles.profileStat}><span>Total Shipments</span><strong>1,245</strong></div>
          <div className={styles.profileStat}><span>On-Time Rate</span><strong>96.4%</strong></div>
          <div className={styles.profileStat}><span>Invoices Paid</span><strong>1,182</strong></div>
          <div className={styles.profileStat}><span>Avg. Lead Time</span><strong>2.4 Days</strong></div>
          <button className={styles.secondaryButton} type="button">View Performance →</button>
        </div>
      </div>

      <div className={styles.profileCardsGrid}>
        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Personal Information</h3>
            <button className={styles.smallAction} type="button" onClick={() => setEditingSection(editingSection === "personal" ? null : "personal")}>
              {editingSection === "personal" ? "Close" : "Edit"}
            </button>
          </div>
          {editableRow("Full Name", "fullName", "personal")}
          {editableRow("Job Title", "jobTitle", "personal")}
          {editableRow("Phone", "phone", "personal")}
          {editableRow("Email", "email", "personal")}
          {editableRow("Time Zone", "timezone", "personal")}
          {editableRow("Language", "language", "personal")}
          {editingSection === "personal" ? <button className={styles.primaryButton} type="button" onClick={() => saveSection()}>Save Personal Info</button> : null}
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Company Information</h3>
            <button className={styles.smallAction} type="button" onClick={() => setEditingSection(editingSection === "company" ? null : "company")}>
              {editingSection === "company" ? "Close" : "Edit"}
            </button>
          </div>
          {editableRow("Company Name", "companyName", "company")}
          {editableRow("Legal Name", "legalName", "company")}
          {editableRow("Headquarters", "headquarters", "company")}
          {editableRow("Website", "website", "company")}
          {editableRow("Tax ID / EIN", "taxId", "company")}
          {editingSection === "company" ? <button className={styles.primaryButton} type="button" onClick={() => saveSection()}>Save Company Info</button> : null}
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Client ID & Role</h3>
            <button className={styles.smallAction} type="button" onClick={() => copyValue("client-id", profile.clientId)}>
              {copiedField === "client-id" ? "Copied" : "Copy ID"}
            </button>
          </div>
          <div className={styles.detailRow}><span>Client ID</span><strong>{profile.clientId}</strong></div>
          <div className={styles.detailRow}><span>Client Type</span><strong>{profile.clientType}</strong></div>
          <div className={styles.detailRow}><span>Primary Role</span><strong>Buyer / Procurement</strong></div>
          <div className={styles.detailRow}><span>Access Level</span><strong>{profile.accessLevel}</strong></div>
          <div className={styles.detailRow}><span>Assigned Since</span><strong>{profile.assignedSince}</strong></div>
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Contact Details</h3>
            <button className={styles.smallAction} type="button" onClick={() => setEditingSection(editingSection === "contact" ? null : "contact")}>
              {editingSection === "contact" ? "Close" : "Edit"}
            </button>
          </div>
          {editableRow("Primary Email", "email", "contact", <StatusBadge text="Primary" kind="success" />)}
          {editableRow("Phone", "phone", "contact", <StatusBadge text="Primary" kind="success" />)}
          {editableRow("Alt. Phone", "altPhone", "contact")}
          {editableRow("Emergency Contact", "emergencyPhone", "contact")}
          {editableRow("Billing Email", "billingEmail", "contact")}
          {editingSection === "contact" ? <button className={styles.primaryButton} type="button" onClick={() => saveSection()}>Save Contact Details</button> : null}
        </section>
      </div>

      <div className={styles.profileBottomGrid}>
        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Notification Preferences</h3>
            <button className={styles.smallAction} type="button">Auto Saved</button>
          </div>
          {[
            ["Shipment Assignments", "emailAlerts"],
            ["Route Updates", "shipmentUpdates"],
            ["Invoice Updates", "invoiceAlerts"],
            ["Weekly Reports", "weeklyReports"],
            ["Promotions & News", "promotions"],
          ].map(([label, key]) => (
            <div key={label} className={styles.toggleRow}>
              <span>{label}</span>
              <button
                className={`${styles.toggleBtn} ${toggles[key as keyof typeof toggles] ? styles.toggleBtnOn : ""}`}
                type="button"
                onClick={() => togglePref(key as keyof typeof toggles)}
              >
                <span />
              </button>
            </div>
          ))}
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Security & Password</h3>
            <button className={styles.smallAction} type="button" onClick={() => setEditingSection("contact")}>Edit</button>
          </div>
          <div className={styles.detailRow}><span>Password</span><strong>••••••••</strong></div>
          <div className={styles.detailRow}><span>Last changed</span><strong>May 24, 2024</strong></div>
          <div className={styles.detailRow}><span>Two-Factor Authentication</span><strong>Enabled</strong></div>
          <div className={styles.detailRow}><span>Login Email Alerts</span><strong>Enabled</strong></div>
          <div className={styles.inlineActions}>
            <button className={styles.secondaryButton} type="button">Change Password</button>
            <button className={styles.secondaryButton} type="button">Manage 2FA</button>
          </div>
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Permissions Summary</h3>
            <button className={styles.smallAction} type="button" onClick={() => router.push("/client/shipments")}>View all</button>
          </div>
          <div className={styles.permissionList}>
            {["View Shipments", "Track Orders", "Update Preferences", "View Invoices", "Manage Documents"].map((item) => (
              <div key={item} className={styles.permissionItem}>
                <span>{item}</span>
                <StatusBadge text="Allowed" kind="success" />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.profileDetailCard}>
          <div className={styles.cardActionHeader}>
            <h3>Assigned Support Details</h3>
            <button className={styles.smallAction} type="button" onClick={() => copyValue("support-email", profile.supportEmail)}>
              {copiedField === "support-email" ? "Copied" : "Copy Email"}
            </button>
          </div>
          <div className={styles.detailRow}><span>Account Manager</span><strong>{profile.managerName}</strong></div>
          <div className={styles.detailRow}><span>Account Manager Email</span><strong>{profile.managerEmail}</strong></div>
          <div className={styles.detailRow}><span>Support Email</span><strong>{profile.supportEmail}</strong></div>
          <div className={styles.detailRow}><span>Support Phone</span><strong>+1 (800) 555-0199</strong></div>
          <button className={styles.primaryButton} type="button" onClick={contactSupport}>{supportLoading ? "Sending..." : "Contact Support"}</button>
        </section>
      </div>
    </Shell>
  );
}
