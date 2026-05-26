"use client";

import React, { useState } from "react";
import Link from "next/link";

const supportCards = [
  ["Sales", "Discuss onboarding, roles, and module fit for your organization."],
  ["Support", "Get help with account access, dashboards, and operational workflows."],
  ["Partnerships", "Coordinate supplier, logistics, warehouse, or buyer portal needs."],
];

const offices = [
  ["North America", "Los Angeles Cargo Gateway", "la.ops@scm.local"],
  ["Europe", "Rotterdam Gateway Hub", "eu.ops@scm.local"],
  ["Asia Pacific", "Singapore Port Terminal", "apac.ops@scm.local"],
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="pub-anim-fade-up">
      <section className="pub-hero pub-section-mint">
        <div className="pub-container">
          <div className="contact-hero">
            <div>
              <span className="pub-badge">Contact SCM</span>
              <h1 className="pub-heading-xl">Talk to the team behind your supply chain workspace.</h1>
              <p className="pub-text-lead">
                Send a message about supplier onboarding, warehouse operations, client access, logistics partnerships, SQL reports, or dashboard support.
              </p>
              <div className="pub-kicker-row">
                <span className="pub-tag">Response within 1 business day</span>
                <span className="pub-tag">Role-aware support</span>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80" alt="Modern operations office for logistics support" />
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-white">
        <div className="pub-container">
          <div className="contact-grid">
            <form className="pub-card contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <div>
                <span className="pub-section-label">Message Us</span>
                <h2 className="pub-heading-md">Route your request to the right operations team.</h2>
              </div>
              {submitted ? (
                <div className="contact-success">Thanks. Your request has been received and routed to the SCM team.</div>
              ) : (
                <>
                  <div className="contact-form-grid">
                    <Field label="Full name"><input className="pub-input" required placeholder="Your name" /></Field>
                    <Field label="Business email"><input className="pub-input" required type="email" placeholder="you@company.com" /></Field>
                    <Field label="Company"><input className="pub-input" required placeholder="Company name" /></Field>
                    <Field label="Inquiry type">
                      <select className="pub-select" required>
                        <option value="">Select inquiry</option>
                        <option>Platform consultation</option>
                        <option>Supplier onboarding</option>
                        <option>Warehouse operations</option>
                        <option>Logistics partnership</option>
                        <option>SQL / reports support</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Message"><textarea className="pub-textarea" required placeholder="Tell us what you want to improve..." /></Field>
                  <button className="pub-btn-primary" type="submit">Send Message</button>
                </>
              )}
            </form>

            <aside className="contact-side">
              {supportCards.map(([title, desc]) => (
                <article className="pub-card" key={title}>
                  <span className="pub-tag">{title}</span>
                  <p className="pub-text-body" style={{ margin: "14px 0 0" }}>{desc}</p>
                </article>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="pub-section pub-section-mint">
        <div className="pub-container">
          <div className="pub-section-head">
            <div>
              <span className="pub-section-label">Office Locations</span>
              <h2 className="pub-heading-lg">Regional support close to logistics hubs.</h2>
            </div>
            <Link className="pub-btn-secondary" href="/locations">View network</Link>
          </div>
          <div className="pub-grid-3">
            {offices.map(([region, office, email]) => (
              <article className="pub-card" key={region}>
                <span className="pub-tag">{region}</span>
                <h3 className="pub-heading-sm" style={{ margin: "16px 0 8px" }}>{office}</h3>
                <p className="pub-text-body" style={{ margin: 0 }}>{email}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .contact-hero,
        .contact-grid {
          align-items: center;
          display: grid;
          gap: 42px;
          grid-template-columns: 1fr 1fr;
        }
        .contact-hero img {
          border: 1px solid var(--pub-border);
          border-radius: 34px;
          box-shadow: var(--pub-shadow);
          height: 500px;
          object-fit: cover;
          width: 100%;
        }
        .contact-form {
          display: grid;
          gap: 22px;
        }
        .contact-form-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, 1fr);
        }
        .contact-side {
          display: grid;
          gap: 16px;
        }
        .contact-success {
          background: var(--pub-mint-2);
          border: 1px solid var(--pub-border);
          border-radius: 18px;
          color: var(--pub-teal-dark);
          font-weight: 850;
          padding: 18px;
        }
        @media (max-width: 900px) {
          .contact-hero,
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-hero img {
            height: 340px;
          }
        }
        @media (max-width: 620px) {
          .contact-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="pub-label">{label}</span>
      {children}
    </label>
  );
}
