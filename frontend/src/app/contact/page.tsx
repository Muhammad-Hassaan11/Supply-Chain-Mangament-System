"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../login/login.module.css";

const inquiryTypes = [
  "Platform consultation",
  "Supplier onboarding",
  "Warehouse operations",
  "Logistics partnership",
  "Enterprise support",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pub-anim-fade-up">
      <section className="pub-section-mint" style={{ borderBottom: "1px solid #d5ebe8", padding: "64px 0" }}>
        <div className="pub-container">
          <div className="pub-grid-2" style={{ alignItems: "center", gap: "48px" }}>
            <div>
              <span className="pub-badge"><ShieldIcon /> End-to-End Supply Chain Intelligence</span>
              <h1 className="pub-heading-xl" style={{ color: "#084b4a", margin: "22px 0 16px" }}>
                Let us help optimize your supply chain
              </h1>
              <p className="pub-text-lead" style={{ margin: "0 0 26px" }}>
                Talk to our operations team about supplier onboarding, warehouse visibility, shipment tracking, and enterprise-grade reporting.
              </p>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  ["Real-time Visibility", "Track orders, inventory, and shipments across your entire network."],
                  ["Trusted & Secure", "Protect partner data with controlled access and auditable activity."],
                  ["Collaborate Seamlessly", "Bring suppliers, warehouses, clients, and logistics teams into one workflow."],
                ].map(([title, text], index) => (
                  <div className={styles.benefit} key={title}>
                    <span className={styles.benefitIcon}>{index === 0 ? <ChartIcon /> : index === 1 ? <ShieldIcon /> : <NetworkIcon />}</span>
                    <span>
                      <span className={styles.benefitTitle}>{title}</span>
                      <p className={styles.benefitText}>{text}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerIcon}><MailIcon /></div>
                <div>
                  <h2 className={styles.cardTitle}>Contact our team</h2>
                  <p className={styles.cardSubtitle}>Share your details and we will route your request to the right specialist.</p>
                </div>
              </div>

              <div className={styles.cardBody}>
                {submitted ? (
                  <div className={styles.successAlert}>
                    <CheckIcon /> Thanks. Your request has been received and our team will contact you shortly.
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <Field label="Full name">
                      <input className={styles.input} placeholder="Enter your full name" required />
                    </Field>
                    <Field label="Business email">
                      <input className={styles.input} placeholder="Enter your business email" required type="email" />
                    </Field>
                    <Field label="Company name">
                      <input className={styles.input} placeholder="Enter your company name" required />
                    </Field>
                    <Field label="Phone number">
                      <input className={styles.input} placeholder="(555) 123-4567" required />
                    </Field>
                    <Field label="Inquiry type">
                      <select className={styles.select} required>
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                    <Field label="Company size">
                      <select className={styles.select} required>
                        <option value="">Select company size</option>
                        <option>1-50 employees</option>
                        <option>51-250 employees</option>
                        <option>251-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    </Field>
                    <div className={styles.fullSpan}>
                      <label className={styles.label}>Message <span style={{ color: "#dc2626" }}>*</span></label>
                      <textarea className={styles.textarea} placeholder="Tell us about your supply chain goals..." required />
                    </div>
                    <button className={styles.submitBtn} type="submit">Send Message</button>
                    <p className={styles.terms}>
                      Prefer account access? <Link href="/signup">Create your SCM account</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
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

function Icon({ children }: { children: React.ReactNode }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function ShieldIcon() { return <Icon><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-5"/></Icon>; }
function ChartIcon() { return <Icon><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M19 9h-5"/></Icon>; }
function NetworkIcon() { return <Icon><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4"/><path d="m10.5 12-4 5"/><path d="m13.5 12 4 5"/></Icon>; }
function MailIcon() { return <Icon><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></Icon>; }
function CheckIcon() { return <Icon><path d="m20 6-11 11-5-5"/></Icon>; }
