"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

function CubeLogo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 13.5v21L24 44 7 34.5v-21L24 4Z" stroke="#0f9a94" strokeWidth="3" />
      <path d="M15.5 18.2 24 23l8.5-4.8M24 23v10.4" stroke="#0f9a94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 28.8 24 33.4l8-4.6" stroke="#8bd9d3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      id="pub-navbar"
      style={{
        background: scrolled ? "rgba(255,255,255,0.94)" : "#ffffff",
        borderBottom: "1px solid #d5ebe8",
        boxShadow: scrolled ? "0 6px 24px rgba(16,39,45,0.06)" : "none",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "24px",
          height: "72px",
          justifyContent: "space-between",
          margin: "0 auto",
          maxWidth: "1280px",
          padding: "0 32px",
        }}
      >
        <Link
          href="/"
          id="pub-nav-brand"
          style={{ alignItems: "center", display: "flex", flexShrink: 0, gap: "10px" }}
        >
          <CubeLogo />
          <span
            style={{
              color: "#084b4a",
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            SCM
          </span>
        </Link>

        <nav id="pub-desktop-nav" style={{ alignItems: "center", display: "flex", gap: "34px" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: isActive(link.href) ? "#0f9a94" : "#10272d",
                fontFamily: "var(--font-heading)",
                fontSize: "0.95rem",
                fontWeight: 800,
                padding: "25px 0 22px",
                position: "relative",
              }}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  style={{
                    background: "#0f9a94",
                    bottom: "10px",
                    height: "2px",
                    left: 0,
                    position: "absolute",
                    width: "100%",
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div style={{ alignItems: "center", display: "flex", flexShrink: 0, gap: "10px" }}>
          {mounted && user ? (
            <>
              <Link className="pub-btn-primary" href="/dashboard" id="pub-nav-portal">
                Dashboard
              </Link>
              <button
                className="pub-btn-secondary"
                id="pub-nav-logout"
                onClick={logout}
                style={{ minHeight: "38px", padding: "9px 18px" }}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="pub-btn-secondary" href="/login" id="pub-nav-login" style={{ minHeight: "38px", padding: "9px 22px" }}>
                Login
              </Link>
              <Link className="pub-btn-primary" href="/signup" id="pub-nav-signup" style={{ minHeight: "38px", padding: "9px 22px" }}>
                Sign Up
              </Link>
            </>
          )}

          <button
            aria-label="Toggle navigation menu"
            id="pub-menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            style={{
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #d5ebe8",
              borderRadius: "8px",
              color: "#0f9a94",
              cursor: "pointer",
              display: "none",
              height: "40px",
              justifyContent: "center",
              width: "40px",
            }}
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="pub-mobile-menu"
          style={{
            background: "#ffffff",
            borderTop: "1px solid #d5ebe8",
            boxShadow: "0 12px 24px rgba(16,39,45,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "14px 18px 18px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                background: isActive(link.href) ? "#e8f8f6" : "transparent",
                borderRadius: "8px",
                color: isActive(link.href) ? "#0f9a94" : "#10272d",
                fontWeight: 800,
                padding: "12px 14px",
              }}
            >
              {link.label}
            </Link>
          ))}
          {mounted && !user && (
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr", marginTop: "10px" }}>
              <Link className="pub-btn-secondary" href="/login">
                Login
              </Link>
              <Link className="pub-btn-primary" href="/signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          #pub-desktop-nav,
          #pub-nav-login,
          #pub-nav-signup,
          #pub-nav-portal,
          #pub-nav-logout {
            display: none !important;
          }
          #pub-menu-toggle {
            display: flex !important;
          }
          #pub-navbar > div {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }
        }
      `}</style>
    </header>
  );
}
