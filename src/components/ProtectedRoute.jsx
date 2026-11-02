import React from "react";
import { Navigate } from "react-router-dom";

function readAuthenticatedUser() {
  try {
    const raw = localStorage.getItem("eduflowUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children }) {
  const user = readAuthenticatedUser();
  const userRole = typeof user?.role === "string" ? user.role.toLowerCase() : "";
  const isAuthenticated = Boolean(user && userRole === "admin");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login-school" replace />;
  }

  return children;
}
