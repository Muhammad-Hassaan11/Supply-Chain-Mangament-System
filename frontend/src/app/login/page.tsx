"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
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
        <span style={{ color: "#526777", fontSize: ".92rem" }}>New to SCM?</span>
        <Link className="pub-btn-primary" href="/signup">Create Account</Link>
      </div>

      <div className={styles.splitGrid}>
        <aside className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <span className={styles.badge}><ShieldIcon /> Secure Supply Chain Access</span>
            <h1 className={styles.headline}>Welcome back to your operations hub</h1>
            <p className={styles.lead}>Log in to manage suppliers, products, warehouses, inventory, shipments, reports, and live SQL-backed insights from one connected platform.</p>
            <div className={styles.benefits}>
              {[
                ["Real-time Visibility", "Monitor critical operational signals as they change."],
                ["Connected Teams", "Coordinate activity across every supply chain partner."],
                ["Reliable Controls", "Keep business processes protected and traceable."],
              ].map(([title, text], index) => (
                <div className={styles.benefit} key={title}>
                  <span className={styles.benefitIcon}>{index === 0 ? <ChartIcon /> : index === 1 ? <NetworkIcon /> : <ShieldIcon />}</span>
                  <span>
                    <span className={styles.benefitTitle}>{title}</span>
                    <p className={styles.benefitText}>{text}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className={styles.cardWrap}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}><LoginIcon /></div>
              <div>
                <h1 className={styles.cardTitle}>Log in to SCM</h1>
                <p className={styles.cardSubtitle}>Access your supply chain workspace securely.</p>
              </div>
            </div>
            <div className={styles.cardBody}>
              {error && <div className={styles.errorAlert}><AlertIcon /> {error}</div>}
              <form className={styles.formSingle} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">Business email</label>
                  <input className={styles.input} disabled={loading} id="email" onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required type="email" value={email} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <input className={styles.input} disabled={loading} id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required type="password" value={password} />
                </div>
                <button className={styles.submitBtn} disabled={loading} type="submit">
                  {loading ? <span className={styles.spinner} /> : "Log in"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function CubeLogo() { return <svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M24 4 41 13.5v21L24 44 7 34.5v-21L24 4Z" stroke="#0f9a94" strokeWidth="3"/><path d="M15.5 18.2 24 23l8.5-4.8M24 23v10.4" stroke="#0f9a94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function LoginIcon() { return <Icon><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></Icon>; }
function AlertIcon() { return <Icon><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></Icon>; }
function ShieldIcon() { return <Icon><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-5"/></Icon>; }
function ChartIcon() { return <Icon><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M19 9h-5"/></Icon>; }
function NetworkIcon() { return <Icon><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4"/><path d="m10.5 12-4 5"/><path d="m13.5 12 4 5"/></Icon>; }
