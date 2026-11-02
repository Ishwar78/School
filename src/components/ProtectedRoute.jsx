import React from "react";
import { Navigate } from "react-router-dom";

import { readAuthenticatedUser } from "../pages/dashboard/shared/identity";

const dashboardRoles = ["admin", "teacher", "student", "parent"];

export default function ProtectedRoute({ role, children }) {
  const user = readAuthenticatedUser();
  const userRole =
    typeof user?.role === "string" ? user.role.toLowerCase() : "";
  const isAuthenticated =
    user?.id != null &&
    typeof user.email === "string" &&
    user.email.length > 0 &&
    dashboardRoles.includes(userRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || role !== userRole) {
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  return children;
}
