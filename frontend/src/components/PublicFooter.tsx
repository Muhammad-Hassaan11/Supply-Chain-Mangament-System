"use client";

import React from "react";
import Link from "next/link";

function CubeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 13.5v21L24 44 7 34.5v-21L24 4Z" stroke="#0f9a94" strokeWidth="3" />
      <path d="M15.5 18.2 24 23l8.5-4.8M24 23v10.4" stroke="#0f9a94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <footer
      id="pub-footer"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #d5ebe8",
        color: "#526777",
      }}
    >
      <div
        className="pub-container"
        style={{
          display: "grid",
          gap: "28px",
          gridTemplateColumns: "1.6fr 0.8fr 0.9fr 1.2fr",
          paddingBottom: "26px",
          paddingTop: "26px",
        }}
      >
        <div>
          <Link href="/" style={{ alignItems: "center", display: "inline-flex", gap: "8px" }}>
            <CubeLogo />
            <span style={{ color: "#084b4a", fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800 }}>
              SCM
            </span>
          </Link>
          <p className="pub-text-sm" style={{ margin: "10px 0 0", maxWidth: "280px" }}>
            Smart Supply Chain Solutions for a connected, efficient, and sustainable future.
          </p>
        </div>

        <FooterList
          title="Platform"
          links={[
            ["Services", "/services"],
            ["Industries", "/industries"],
            ["Locations", "/locations"],
            ["Dashboard", "/dashboard"],
          ]}
        />
        <FooterList
          title="Company"
          links={[
            ["About Us", "/about"],
            ["Contact", "/contact"],
            ["Login", "/login"],
            ["Sign Up", "/signup"],
          ]}
        />

        <div>
          <h4 style={{ color: "#10272d", fontFamily: "var(--font-heading)", fontSize: "0.95rem", marginBottom: "10px" }}>
            Stay Connected
          </h4>
          <p className="pub-text-sm" style={{ margin: "0 0 12px" }}>
            Subscribe for supply chain updates and insights.
          </p>
          <form
            onSubmit={(event) => event.preventDefault()}
            style={{ display: "flex", gap: "8px" }}
          >
            <input className="pub-input" placeholder="Enter your email" style={{ minHeight: "38px", padding: "8px 10px" }} />
            <button className="pub-btn-primary" style={{ minHeight: "38px", padding: "8px 14px" }} type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #edf4f5", padding: "12px 0" }}>
        <div className="pub-container" style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.78rem" }}>(c) {new Date().getFullYear()} SCM. All rights reserved.</span>
          <div style={{ display: "flex", gap: "18px", fontSize: "0.78rem" }}>
            <Link href="/contact">Privacy Policy</Link>
            <Link href="/contact">Terms of Service</Link>
            <Link href="/contact">System Status</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #pub-footer .pub-container:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          #pub-footer .pub-container:first-child {
            grid-template-columns: 1fr !important;
          }
          #pub-footer form {
            flex-direction: column !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 style={{ color: "#10272d", fontFamily: "var(--font-heading)", fontSize: "0.95rem", marginBottom: "10px" }}>
        {title}
      </h4>
      <ul style={{ display: "flex", flexDirection: "column", gap: "7px", listStyle: "none", margin: 0, padding: 0 }}>
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} style={{ fontSize: "0.86rem" }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
