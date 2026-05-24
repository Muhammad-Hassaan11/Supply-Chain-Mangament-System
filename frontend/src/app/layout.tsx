import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/public.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "SCM | Smart Supply Chain Management",
  description:
    "Three-tier Supply Chain Management Database System with real-time analytics, CRUD operations, and interactive SQL Query Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
