"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  idPrefix?: string;
}

export default function Modal({ isOpen, onClose, title, children, idPrefix = "modal" }: ModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(16, 39, 45, 0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "modalFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      }}
      onClick={onClose}
      id={`${idPrefix}-overlay`}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          position: "relative",
          animation: "modalZoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          boxShadow: "0 24px 64px rgba(16, 39, 45, 0.18), var(--glass-glow-indigo)",
          borderColor: "var(--border-glass-active)",
          padding: "28px",
        }}
        onClick={(e) => e.stopPropagation()}
        id={`${idPrefix}-container`}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.4rem",
              color: "var(--text-primary)",
            }}
            id={`${idPrefix}-title`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "50%",
              transition: "var(--transition-smooth)",
            }}
            id={`${idPrefix}-close-btn`}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div id={`${idPrefix}-body`}>{children}</div>

        {/* Keyframe animations injection */}
        <style jsx global>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalZoomIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
