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

  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      console.error(`[API Connection Error] Backend server not reachable at ${API_BASE_URL}`);
      const friendlyErr = new Error("Backend server is not running or unreachable at port 5075. Please ensure the backend is started.");
      friendlyErr.original = err;
      throw friendlyErr;
    }
    throw err;
  }
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
export async function checkBackendHealth() {
  return await apiRequest("/api/health", {
    method: "GET",
  });
}

/**
 * Get all students from database
 */
export async function getStudentsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.classId) query.append("classId", params.classId);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString();
  return await apiRequest(`/api/students${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
}

/**
 * Add a new student to database
 */
export async function addStudentApi(studentData) {
  return await apiRequest("/api/students", {
    method: "POST",
    body: studentData,
  });
}

export const createStudentApi = addStudentApi;

async function _ignoredAddStudent(studentData) {
  return await apiRequest("/api/students", {
    method: "POST",
    body: studentData,
  });
}

/**
 * Update an existing student
 */
export async function updateStudentApi(id, studentData) {
  return await apiRequest(`/api/students/${id}`, {
    method: "PUT",
    body: studentData,
  });
}

/**
 * Delete a student from database
 */
export async function deleteStudentApi(id) {
  return await apiRequest(`/api/students/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get Razorpay Key ID
 */
export async function getRazorpayKeyApi() {
  return await apiRequest("/api/payment/razorpay-key", {
    method: "GET",
  });
}

/**
 * Create Razorpay Order for ₹1000
 */
export async function createRazorpayOrderApi() {
  return await apiRequest("/api/payment/create-order", {
    method: "POST",
  });
}

/**
 * Upload student profile photo to backend /uploads folder
 * @param {File} file
 * @returns {Promise<{ success: boolean, photoUrl: string, filename: string }>}
 */
export async function uploadStudentPhotoApi(file) {
  const formData = new FormData();
  formData.append("photo", file);

  return await apiRequest("/api/student-registration/upload-photo", {
    method: "POST",
    body: formData,
  });
}

/**
 * Register student with verified payment & uploaded photo
 * @param {object} registrationData
 */
export async function registerStudentApi(registrationData) {
  return await apiRequest("/api/student-registration/register", {
    method: "POST",
    body: registrationData,
  });
}

/**
 * Get all registered students for Admin
 * @param {object} params - { studentClass, search }
 */
export async function getRegisteredStudentsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.studentClass) query.append("studentClass", params.studentClass);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString();
  return await apiRequest(`/api/student-registration/all${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
}

/**
 * Get single student registration details by ID
 * @param {string} id
 */
export async function getRegistrationByIdApi(id) {
  return await apiRequest(`/api/student-registration/${id}`, {
    method: "GET",
  });
}

/**
 * Send demo OTP to student mobile
 * @param {string} mobile
 */
export async function sendStudentLoginOtpApi(mobile) {
  return await apiRequest("/api/auth/send-login-otp", {
    method: "POST",
    body: { mobile },
  });
}

/**
 * Verify demo OTP for student mobile login
 * @param {string} mobile
 * @param {string} otp
 */
export async function verifyStudentLoginOtpApi(mobile, otp) {
  return await apiRequest("/api/auth/verify-login-otp", {
    method: "POST",
    body: { mobile, otp },
  });
}


/**
 * Fetch complete student profile by identifier (mobile, reg number, or ID)
 * @param {string} identifier
 */
export async function getStudentProfileApi(identifier) {
  return await apiRequest(`/api/student-registration/student-profile/${encodeURIComponent(identifier)}`, {
    method: "GET",
  });
}
