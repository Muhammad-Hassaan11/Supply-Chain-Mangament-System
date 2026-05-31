export type AccountType = "admin" | "supplier" | "warehouse" | "client" | "logistics";

export function normalizeAccountType(accountType: string | null | undefined, role?: string | null): AccountType {
  if (role === "Admin") return "admin";
  if (accountType === "supplier" || accountType === "warehouse" || accountType === "client" || accountType === "logistics") {
    return accountType;
  }
  return "client";
}

export function getPortalBase(accountType: string | null | undefined, role?: string | null) {
  return `/${normalizeAccountType(accountType, role)}`;
}

export function portalPath(accountType: string | null | undefined, role: string | null | undefined, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPortalBase(accountType, role)}${cleanPath}`;
}

export function getPortalDashboardPath(accountType: string | null | undefined, role?: string | null) {
  return portalPath(accountType, role, "/dashboard");
}
