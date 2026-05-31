"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, setAuthToken, clearAuthToken, getStoredEmail, getStoredRole } from "@/lib/api";
import { getPortalDashboardPath } from "@/lib/portalRoutes";

interface User {
  email: string;
  role: "Admin" | "Viewer";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "Admin" | "Viewer",
    options?: { secretCode?: string; fullName?: string; accountType?: string }
  ) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isViewer: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PUBLIC_ROUTES = ["/", "/about", "/services", "/industries", "/locations", "/contact", "/login", "/signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // Read user from localStorage on mount
      const email = getStoredEmail();
      const role = getStoredRole() as "Admin" | "Viewer" | null;
      const token = localStorage.getItem("access_token");

      const isPublic = PUBLIC_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
      );

      if (token && email && role) {
        setUser({ email, role });
        if (pathname === "/login" || pathname === "/signup") {
          router.push(getPortalDashboardPath(localStorage.getItem("account_type"), role));
        }
      } else {
        // Clear any partial/stale auth state
        clearAuthToken();
        setUser(null);
        if (!isPublic) {
          router.push("/login");
        }
      }
      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
        role: "Admin" | "Viewer";
        email: string;
        full_name?: string | null;
        account_type?: string | null;
      }>("/api/auth/login", { email, password });

      setAuthToken(response.access_token);
      localStorage.setItem("user_email", response.email);
      localStorage.setItem("user_role", response.role);
      localStorage.removeItem("account_type");
      localStorage.removeItem("account_name");
      localStorage.removeItem("company_name");
      let nextAccountType = response.account_type || (response.role === "Admin" ? "admin" : null);
      if (response.account_type) {
        localStorage.setItem("account_type", response.account_type);
      }
      if (response.full_name) {
        localStorage.setItem("account_name", response.full_name);
      }
      const savedProfile = localStorage.getItem(`profile:${response.email.toLowerCase()}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as {
          accountType?: string;
          accountName?: string;
          companyName?: string;
        };
        if (parsedProfile.accountType) {
          nextAccountType = parsedProfile.accountType;
          localStorage.setItem("account_type", parsedProfile.accountType);
        }
        if (parsedProfile.accountName) {
          localStorage.setItem("account_name", parsedProfile.accountName);
        }
        if (parsedProfile.companyName) {
          localStorage.setItem("company_name", parsedProfile.companyName);
        }
      }

      setUser({ email: response.email, role: response.role });
      
      // Navigate to dashboard
      router.push(getPortalDashboardPath(nextAccountType, response.role));
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "Admin" | "Viewer",
    options?: { secretCode?: string; fullName?: string; accountType?: string }
  ) => {
    try {
      const secretCode = options?.secretCode;
      const response = await api.post<{
        access_token: string;
        token_type: string;
        role: "Admin" | "Viewer";
        email: string;
        full_name?: string | null;
        account_type?: string | null;
      }>(
        "/api/auth/register",
        {
          email,
          password,
          role,
          secret_code: secretCode || null,
          full_name: options?.fullName || null,
          account_type: options?.accountType || null,
        }
      );

      setAuthToken(response.access_token);
      localStorage.setItem("user_email", response.email);
      localStorage.setItem("user_role", response.role);
      localStorage.removeItem("account_type");
      localStorage.removeItem("account_name");
      localStorage.removeItem("company_name");
      let nextAccountType = response.account_type || options?.accountType || (response.role === "Admin" ? "admin" : null);
      if (response.account_type) {
        localStorage.setItem("account_type", response.account_type);
      }
      if (response.full_name) {
        localStorage.setItem("account_name", response.full_name);
      }
      const savedProfile = localStorage.getItem(`profile:${response.email.toLowerCase()}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as {
          accountType?: string;
          accountName?: string;
          companyName?: string;
        };
        if (parsedProfile.accountType) {
          nextAccountType = parsedProfile.accountType;
          localStorage.setItem("account_type", parsedProfile.accountType);
        }
        if (parsedProfile.accountName) {
          localStorage.setItem("account_name", parsedProfile.accountName);
        }
        if (parsedProfile.companyName) {
          localStorage.setItem("company_name", parsedProfile.companyName);
        }
      }

      setUser({ email: response.email, role: response.role });
      
      // Navigate to dashboard
      router.push(getPortalDashboardPath(nextAccountType, response.role));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push("/login");
  };

  const isAdmin = user?.role === "Admin";
  const isViewer = user?.role === "Viewer";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isViewer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
