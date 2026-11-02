// Dedicated Admin Credentials - Stored and managed separately from demoUsers.js

export const DEFAULT_ADMIN = {
  id: "admin-master",
  name: "School Administrator",
  email: "SchoolAdmin@gmail.com",
  password: "SchoolAdmin@234@#",
  role: "admin",
  schoolName: "VEDA International School",
};

export function getAdminCredentials() {
  try {
    const customAdmin = localStorage.getItem("eduflowAdminCreds");
    if (customAdmin) {
      const parsed = JSON.parse(customAdmin);
      if (parsed && parsed.email && parsed.password) {
        return { ...DEFAULT_ADMIN, ...parsed };
      }
    }
  } catch {
    // fallback to default admin credentials
  }
  return DEFAULT_ADMIN;
}

export function authenticateAdmin(email, password) {
  if (!email || !password) return null;
  const currentAdmin = getAdminCredentials();
  const normalizedInput = email.trim().toLowerCase();
  const normalizedAdminEmail = currentAdmin.email.trim().toLowerCase();

  if (normalizedInput === normalizedAdminEmail && password === currentAdmin.password) {
    return {
      id: currentAdmin.id,
      name: currentAdmin.name,
      email: currentAdmin.email,
      role: "admin",
      schoolName: currentAdmin.schoolName,
    };
  }

  return null;
}
