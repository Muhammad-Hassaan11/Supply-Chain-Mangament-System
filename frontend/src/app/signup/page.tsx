"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "../login/login.module.css";

type AccountType = "supplier" | "warehouse" | "client" | "logistics";

const accountTypes: {
  id: AccountType;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  { id: "supplier", title: "Supplier", desc: "I supply goods or materials", icon: <PeopleIcon /> },
  { id: "warehouse", title: "Warehouse Manager", desc: "I manage warehouse operations", icon: <WarehouseIcon /> },
  { id: "client", title: "Client / Buyer", desc: "I purchase goods or services", icon: <CartIcon /> },
  { id: "logistics", title: "Logistics Partner", desc: "I provide logistics or transportation", icon: <TruckIcon /> },
];

const roleFields: Record<AccountType, {
  heading: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  leadLabel: string;
  leadPlaceholder: string;
  certificationsLabel: string;
}> = {
  supplier: {
    heading: "Create your supplier account",
    categoryLabel: "Product category",
    categoryPlaceholder: "Select primary product category",
    leadLabel: "Average lead time",
    leadPlaceholder: "e.g., 7-14 days",
    certificationsLabel: "Certifications",
  },
  warehouse: {
    heading: "Create your warehouse account",
    categoryLabel: "Warehouse type",
    categoryPlaceholder: "Select warehouse type",
    leadLabel: "Handling capacity",
    leadPlaceholder: "e.g., 12,000 pallets",
    certificationsLabel: "Storage certifications",
  },
  client: {
    heading: "Create your buyer account",
    categoryLabel: "Buying category",
    categoryPlaceholder: "Select purchasing category",
    leadLabel: "Order frequency",
    leadPlaceholder: "e.g., Weekly",
    certificationsLabel: "Compliance needs",
  },
  logistics: {
    heading: "Create your logistics partner account",
    categoryLabel: "Transport mode",
    categoryPlaceholder: "Select transport mode",
    leadLabel: "Average transit time",
    leadPlaceholder: "e.g., 2-5 days",
    certificationsLabel: "Fleet certifications",
  },
};

export default function SignUpPage() {
  const { register } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("supplier");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [certifications, setCertifications] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const current = useMemo(() => roleFields[accountType], [accountType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!fullName.trim() || !company.trim() || !phone.trim() || !category.trim() || !leadTime.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem(
        `profile:${email.toLowerCase()}`,
        JSON.stringify({
          accountType,
          accountName: fullName,
          companyName: company,
        })
      );
      localStorage.setItem("account_type", accountType);
      localStorage.setItem("account_name", fullName);
      localStorage.setItem("company_name", company);
      await register(email, password, "Viewer", { fullName, accountType });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <Link href="/" className={styles.authLogo}>
        <CubeLogo /> SCM
      </Link>
      <div className={styles.authTopAction}>
        <span style={{ color: "#526777", fontSize: ".92rem" }}>Already have an account?</span>
        <Link className="pub-btn-secondary" href="/login">Log in</Link>
      </div>

      <div className={styles.splitGrid}>
        <LeftBrandPanel />

        <section className={styles.cardWrap}>
          <div className={styles.accountCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}><UserPlusIcon /></div>
              <div>
                <h1 className={styles.cardTitle}>Create your account</h1>
                <p className={styles.cardSubtitle}>Choose your role to get started. Your experience will be customized for you.</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.sectionTitle}>I am signing up as</h2>
              <div className={styles.roleGrid}>
                {accountTypes.map((item) => (
                  <button
                    className={`${styles.roleCard} ${accountType === item.id ? styles.roleActive : ""}`}
                    key={item.id}
                    onClick={() => setAccountType(item.id)}
                    type="button"
                  >
                    {item.icon}
                    <span>
                      <span className={styles.roleName}>{item.title}</span>
                      <span className={styles.roleDesc}>{item.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.notice}>
                <InfoIcon /> The fields you see are tailored for your selected role: {accountTypes.find((item) => item.id === accountType)?.title}.
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  <AlertIcon /> {error}
                </div>
              )}

              <div className={styles.formTitleRow}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>{current.heading}</h2>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <Field label="Full name">
                  <input className={styles.input} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required value={fullName} />
                </Field>
                <Field label="Business email">
                  <input className={styles.input} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your business email" required type="email" value={email} />
                </Field>
                <Field label="Company name">
                  <input className={styles.input} onChange={(e) => setCompany(e.target.value)} placeholder="Enter your company name" required value={company} />
                </Field>
                <Field label="Phone number">
                  <input className={styles.input} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" required value={phone} />
                </Field>
                <Field label={current.categoryLabel}>
                  <select className={styles.select} onChange={(e) => setCategory(e.target.value)} required value={category}>
                    <option value="">{current.categoryPlaceholder}</option>
                    <option>Manufacturing</option>
                    <option>Retail & eCommerce</option>
                    <option>Automotive</option>
                    <option>Pharmaceuticals</option>
                    <option>Food & Beverage</option>
                  </select>
                </Field>
                <Field label={current.leadLabel}>
                  <input className={styles.input} onChange={(e) => setLeadTime(e.target.value)} placeholder={current.leadPlaceholder} required value={leadTime} />
                </Field>
                <div className={styles.fullSpan}>
                  <label className={styles.label}>{current.certificationsLabel} <span style={{ color: "#8aa1ad", fontWeight: 600 }}>(optional)</span></label>
                  <select className={styles.select} onChange={(e) => setCertifications(e.target.value)} value={certifications}>
                    <option value="">Select all that apply</option>
                    <option>ISO 9001</option>
                    <option>GMP</option>
                    <option>Cold Chain Certified</option>
                    <option>Hazmat Certified</option>
                  </select>
                  <span style={{ color: "#718597", fontSize: ".82rem" }}>You can update certifications later from your profile.</span>
                </div>
                <Field label="Create password">
                  <input className={styles.input} minLength={6} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a strong password" required type="password" value={password} />
                </Field>
                <Field label="Confirm password">
                  <input className={styles.input} minLength={6} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required type="password" value={confirmPassword} />
                </Field>

                <button className={styles.submitBtn} disabled={loading} type="submit">
                  {loading ? <span className={styles.spinner} /> : `Create ${accountTypes.find((item) => item.id === accountType)?.title} Account`}
                </button>
                <p className={styles.terms}>
                  By creating an account, you agree to our <Link href="/contact">Terms of Service</Link> and <Link href="/contact">Privacy Policy</Link>.
                </p>
              </form>

              <div className={styles.adminNote}>
                <ShieldIcon /> Admin accounts are created internally. If you need administrator access for your organization, contact your system administrator.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label} <span style={{ color: "#dc2626" }}>*</span></label>
      {children}
    </div>
  );
}

function LeftBrandPanel() {
  const benefits = [
    ["Real-time Visibility", "Track orders, inventory, and shipments across your entire supply chain."],
    ["Trusted & Secure", "Enterprise-grade account controls keep business data safe and compliant."],
    ["Collaborate Seamlessly", "Work with suppliers, warehouses, clients, and partners in one platform."],
    ["Data-Driven Decisions", "Use operational analytics to move faster with more confidence."],
  ];

  return (
    <aside className={styles.leftPanel}>
      <div className={styles.leftContent}>
        <span className={styles.badge}><ShieldIcon /> End-to-End Supply Chain Intelligence</span>
        <h2 className={styles.headline}>Join the smarter way to manage supply chains</h2>
        <p className={styles.lead}>Create your account and connect to a powerful network of partners, tools, and insights built to streamline operations and accelerate growth.</p>
        <div className={styles.benefits}>
          {benefits.map(([title, text], index) => (
            <div className={styles.benefit} key={title}>
              <span className={styles.benefitIcon}>{index === 0 ? <ChartIcon /> : index === 1 ? <ShieldIcon /> : index === 2 ? <NetworkIcon /> : <TrendIcon />}</span>
              <span>
                <span className={styles.benefitTitle}>{title}</span>
                <p className={styles.benefitText}>{text}</p>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.visualStrip}><MiniLogisticsVisual /></div>
    </aside>
  );
}

function MiniLogisticsVisual() {
  return (
    <svg viewBox="0 0 520 220" width="100%" height="100%" fill="none" aria-hidden="true">
      <rect x="84" y="48" width="210" height="110" rx="8" fill="#fff" stroke="#b9dfdc" />
      <rect x="100" y="64" width="60" height="34" rx="6" fill="#eefaf8" />
      <circle cx="130" cy="81" r="16" fill="#0f9a94" opacity=".18" />
      <path d="M104 130c30-26 54 10 88-12 30-18 42-8 76-24" stroke="#0f9a94" strokeWidth="5" strokeLinecap="round" />
      <path d="M300 108 404 68l100 40v78H300v-78Z" fill="#edf7f5" stroke="#b9dfdc" />
      <path d="M292 108 404 58l112 50" stroke="#0f9a94" strokeWidth="13" strokeLinecap="round" />
      <rect x="376" y="132" width="58" height="54" fill="#254650" />
      <rect x="48" y="164" width="38" height="30" fill="#c9955f" stroke="#ab7846" />
      <rect x="88" y="150" width="38" height="44" fill="#c9955f" stroke="#ab7846" />
      <rect x="130" y="166" width="38" height="28" fill="#c9955f" stroke="#ab7846" />
      <rect x="382" y="166" width="110" height="38" rx="4" fill="#dfe8eb" stroke="#8fa8b1" />
      <path d="M332 166h58v38h-72v-20c0-10 6-18 14-18Z" fill="#0f9a94" />
      <circle cx="350" cy="206" r="11" fill="#213946" />
      <circle cx="456" cy="206" r="11" fill="#213946" />
    </svg>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function CubeLogo() { return <svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M24 4 41 13.5v21L24 44 7 34.5v-21L24 4Z" stroke="#0f9a94" strokeWidth="3"/><path d="M15.5 18.2 24 23l8.5-4.8M24 23v10.4" stroke="#0f9a94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function PeopleIcon() { return <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>; }
function WarehouseIcon() { return <Icon><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-8h6v8"/><path d="M7 11h10"/></Icon>; }
function CartIcon() { return <Icon><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L22 7H5.12"/></Icon>; }
function TruckIcon() { return <Icon><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Icon>; }
function UserPlusIcon() { return <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></Icon>; }
function InfoIcon() { return <Icon><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></Icon>; }
function AlertIcon() { return <Icon><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></Icon>; }
function ShieldIcon() { return <Icon><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-5"/></Icon>; }
function ChartIcon() { return <Icon><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M19 9h-5"/></Icon>; }
function NetworkIcon() { return <Icon><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4"/><path d="m10.5 12-4 5"/><path d="m13.5 12 4 5"/></Icon>; }
function TrendIcon() { return <Icon><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-7"/><path d="M19 6v5h-5"/></Icon>; }
