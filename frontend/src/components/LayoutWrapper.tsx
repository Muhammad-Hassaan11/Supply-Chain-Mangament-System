"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const PublicNavbar = dynamic(() => import("./PublicNavbar"), { ssr: false });
const PublicFooter = dynamic(() => import("./PublicFooter"), { ssr: false });

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/industries",
  "/locations",
  "/contact",
  "/login",
  "/signup",
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine if current pathname is in public routes
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }

  if (isPublic) {
    return (
      <div className="public-theme">
        <PublicNavbar />
        {children}
        <PublicFooter />
      </div>
    );
  }

  // Private dashboard layout with dark theme
  return (
    <>
      <Sidebar />
      <main className="admin-shell-main">{children}</main>
    </>
  );
}
