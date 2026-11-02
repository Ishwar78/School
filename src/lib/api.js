/**
 * API Client Library
 * Handles communication between the frontend React application and the Express/MongoDB backend.
 */

// Base API URL from environment variables without trailing slash or /api
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5075";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "").replace(/\/api\/?$/, "");

/**
 * Generic fetch wrapper for API calls
 */
export async function apiRequest(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Admin Login against MongoDB database backend
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, message: string, user: object }>}
 */
export async function loginAdminApi(email, password) {
  return await apiRequest("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });
}

/**
 * Check backend service health & connectivity
 */
export async function checkServerHealth() {
  return await apiRequest("/api/health", {
    method: "GET",
  });
}

export default {
  API_BASE_URL,
  apiRequest,
  loginAdminApi,
  checkServerHealth,
};

