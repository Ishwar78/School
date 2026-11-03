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

/**
 * Student API endpoints connected to MongoDB Atlas
 */

/**
 * Fetch all students from database with optional filters
 * @param {object} params - { classId, status, search }
 */
export async function getStudentsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.classId) query.append("classId", params.classId);
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString();
  const endpoint = `/api/students${queryString ? `?${queryString}` : ""}`;
  return await apiRequest(endpoint, {
    method: "GET",
  });
}

/**
 * Fetch a single student by MongoDB ID
 * @param {string} id
 */
export async function getStudentByIdApi(id) {
  return await apiRequest(`/api/students/${id}`, {
    method: "GET",
  });
}

/**
 * Create a new student record in database
 * @param {object} studentData
 */
export async function createStudentApi(studentData) {
  return await apiRequest("/api/students", {
    method: "POST",
    body: studentData,
  });
}

/**
 * Update an existing student record in database
 * @param {string} id
 * @param {object} studentData
 */
export async function updateStudentApi(id, studentData) {
  return await apiRequest(`/api/students/${id}`, {
    method: "PUT",
    body: studentData,
  });
}

/**
 * Delete a student record from database
 * @param {string} id
 */
export async function deleteStudentApi(id) {
  return await apiRequest(`/api/students/${id}`, {
    method: "DELETE",
  });
}

export default {
  API_BASE_URL,
  apiRequest,
  loginAdminApi,
  checkServerHealth,
  getStudentsApi,
  getStudentByIdApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
};

