import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  authenticateAdmin,
  DEFAULT_ADMIN,
} from "../data/adminCredentials";
import { loginAdminApi } from "../lib/api";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleQuickFill() {
    setEmail(DEFAULT_ADMIN.email);
    setPassword(DEFAULT_ADMIN.password);
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // 1. First attempt authentication against MongoDB backend API
      try {
        const result = await loginAdminApi(email, password);
        if (result && result.success && result.user) {
          localStorage.setItem("eduflowUser", JSON.stringify(result.user));
          navigate("/dashboard/admin", { replace: true });
          return;
        }
      } catch (apiError) {
        // If server explicitly returned 401 Unauthorized, reject login immediately
        if (apiError.status === 401) {
          setErrorMessage(
            apiError.message || "Invalid administrator credentials. Access is restricted."
          );
          setIsSubmitting(false);
          return;
        }

        // If backend server is unreachable/offline, fallback to verified local credentials
        console.warn("[Admin Login] Backend API unreachable, falling back to local credentials:", apiError.message);
        const fallbackAdmin = authenticateAdmin(email, password);
        if (fallbackAdmin) {
          localStorage.setItem("eduflowUser", JSON.stringify(fallbackAdmin));
          navigate("/dashboard/admin", { replace: true });
          return;
        }

        setErrorMessage(
          apiError.message || "Invalid administrator credentials. Access is restricted to authorized personnel."
        );
        setIsSubmitting(false);
        return;
      }

      setErrorMessage("Invalid administrator credentials. Access is restricted.");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Admin authentication error:", error);
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      {/* Background Decor */}
      <div className="admin-login-bg-glow" />
      <div className="admin-login-grid-pattern" />

      <div className="admin-login-container">
        {/* Top Header Navigation */}
        <div className="admin-login-topbar">
          <Link to="/" className="admin-login-back-btn">
            <ArrowLeft size={16} />
            <span>Back to School Website</span>
          </Link>
          <Link to="/login" className="admin-login-portal-link">
            <span>Student &amp; Staff Portal</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Main Administrative Card */}
        <div className="admin-login-card">
          {/* Card Header */}
          <div className="admin-login-header">
            <div className="admin-login-badge-row">
              <span className="admin-security-pill">
                <ShieldCheck size={15} />
                SECURE ADMINISTRATIVE ACCESS
              </span>
            </div>

            <div className="admin-icon-container">
              <Building2 size={32} className="admin-school-icon" />
            </div>

            <h1 className="admin-login-title">School Admin Console</h1>
            <p className="admin-login-subtitle">
              VEDA International School &bull; Management &amp; Oversight Portal
            </p>
          </div>

          {/* Quick Demo Fill Pill */}
          <div className="admin-demo-box">
            <div className="admin-demo-info">
              <KeyRound size={15} className="admin-demo-key-icon" />
              <span>
                Admin: <strong>{DEFAULT_ADMIN.email}</strong>
              </span>
            </div>
            <button
              type="button"
              className="admin-autofill-btn"
              onClick={handleQuickFill}
            >
              Fill Credentials
            </button>
          </div>

          {/* Alert Message */}
          {errorMessage && (
            <div className="admin-login-alert" role="alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="admin-login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="admin-form-group">
              <label htmlFor="admin-email">Admin Email Address</label>
              <div className="admin-input-wrap">
                <Mail size={18} className="admin-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="SchoolAdmin@gmail.com"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-form-group">
              <div className="admin-password-label-row">
                <label htmlFor="admin-password">Administrative Password</label>
              </div>
              <div className="admin-input-wrap">
                <LockKeyhole size={18} className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="admin-submit-btn"
              disabled={isSubmitting}
            >
              <LockKeyhole size={18} />
              <span>{isSubmitting ? "Authenticating with Database..." : "Sign In to Admin Portal"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="admin-security-footer">
            <CheckCircle2 size={15} />
            <span>Authorized administrative personnel only. Connected to Secure Database.</span>
          </div>
        </div>

        {/* Bottom copyright note */}
        <p className="admin-bottom-text">
          &copy; {new Date().getFullYear()} VEDA International School. Protected Administrative System.
        </p>
      </div>
    </div>
  );
}
