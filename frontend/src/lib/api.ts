const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Centralized API client wrapper for making fetch requests to the FastAPI backend.
 * Automatically handles JSON serialization, auth token injection, and error parsing.
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  // Inject auth token from localStorage if available
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.detail || data.message || `API Error: ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Network error: Unable to connect to server.",
      0,
      null
    );
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// =============================================
// Convenience Methods
// =============================================

export const api = {
  get: <T = unknown>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "GET" }),

  post: <T = unknown>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, { method: "POST", body }),

  put: <T = unknown>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, { method: "PUT", body }),

  delete: <T = unknown>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};

// =============================================
// Auth Helpers
// =============================================

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("account_type");
    localStorage.removeItem("account_name");
    localStorage.removeItem("company_name");
  }
}

export function getStoredRole(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_role");
  }
  return null;
}

export function getStoredEmail(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_email");
  }
  return null;
}

export function getStoredAccountType(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("account_type");
  }
  return null;
}

export function getStoredAccountName(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("account_name");
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("access_token");
  }
  return false;
}
