"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, setAuthToken, clearAuthToken, getStoredEmail, getStoredRole } from "@/lib/api";

interface User {
  email: string;
  role: "Admin" | "Viewer";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: "Admin" | "Viewer", secretCode?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isViewer: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const PUBLIC_ROUTES = ["/", "/about", "/services", "/industries", "/locations", "/contact", "/login", "/signup"];

  useEffect(() => {
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
        router.push("/dashboard");
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
  }, [pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
        role: "Admin" | "Viewer";
        email: string;
      }>("/api/auth/login", { email, password });

      setAuthToken(response.access_token);
      localStorage.setItem("user_email", response.email);
      localStorage.setItem("user_role", response.role);
      const savedProfile = localStorage.getItem(`profile:${response.email.toLowerCase()}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as {
          accountType?: string;
          accountName?: string;
          companyName?: string;
        };
        if (parsedProfile.accountType) {
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
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "Admin" | "Viewer",
    secretCode?: string
  ) => {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
        role: "Admin" | "Viewer";
        email: string;
      }>("/api/auth/register", { email, password, role, secret_code: secretCode || null });

      setAuthToken(response.access_token);
      localStorage.setItem("user_email", response.email);
      localStorage.setItem("user_role", response.role);
      const savedProfile = localStorage.getItem(`profile:${response.email.toLowerCase()}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as {
          accountType?: string;
          accountName?: string;
          companyName?: string;
        };
        if (parsedProfile.accountType) {
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
      router.push("/dashboard");
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
