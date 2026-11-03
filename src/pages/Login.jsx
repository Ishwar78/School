import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sendStudentLoginOtpApi, verifyStudentLoginOtpApi } from "../lib/api";
import "./Login.css";

const roles = [
  {
    name: "Student",
    icon: GraduationCap,
    description: "Learn and grow"
  },
  {
    name: "Teacher",
    icon: BookOpen,
    description: "Manage classes"
  },
  {
    name: "Parent",
    icon: Users,
    description: "Follow progress"
  }
];

const portalUsers = [
  { id: 1, name: "Aarav Sharma", email: "student@eduflow.com", password: "student123", role: "student" },
  { id: 2, name: "Priya Sharma", email: "parent@eduflow.com", password: "parent123", role: "parent" },
  { id: 3, name: "Ananya Gupta", email: "teacher@eduflow.com", password: "teacher123", role: "teacher" },
];

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [loginMethod, setLoginMethod] = useState("otp"); // 'otp' or 'password'
  
  // Password credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Student Mobile OTP credentials
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  function chooseRole(name) {
    setRole(name);
    setMessage("");
    if (name !== "Student") {
      setLoginMethod("password");
    }
  }

  // Handle Send OTP
  async function handleSendOtp() {
    setMessage("");
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      setMessageType("error");
      setMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setLoadingOtp(true);
      const res = await sendStudentLoginOtpApi(mobile.trim());
      if (res && res.success) {
        setOtpSent(true);
        setMessageType("success");
        setMessage("Demo OTP generated! Please enter 123456 to login.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to send OTP. Please ensure you are registered.");
    } finally {
      setLoadingOtp(false);
    }
  }

  // Handle Verify OTP & Login
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setMessage("");

    if (!otpSent) {
      setMessageType("error");
      setMessage("Please request OTP first.");
      return;
    }

    if (otp.trim() !== "123456") {
      setMessageType("error");
      setMessage("Invalid OTP. Please enter the demo OTP 123456.");
      return;
    }

    try {
      setLoadingOtp(true);
      const res = await verifyStudentLoginOtpApi(mobile.trim(), otp.trim());
      if (res && res.success && res.user) {
        localStorage.setItem("eduflowUser", JSON.stringify(res.user));
        setMessageType("success");
        setMessage("Login successful! Redirecting to Student Dashboard...");
        setTimeout(() => {
          navigate("/dashboard/student");
        }, 800);
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to verify OTP.");
    } finally {
      setLoadingOtp(false);
    }
  }

  // Handle standard Password Login
  function handlePasswordSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (role === "Student") {
      // Allow demo student login
      if (email === "student@eduflow.com" && password === "student123") {
        localStorage.setItem(
          "eduflowUser",
          JSON.stringify({
            name: "Aarav Sharma",
            studentName: "Aarav Sharma",
            email: "student@eduflow.com",
            mobile: "9876543210",
            phone: "9876543210",
            class: "Class 10",
            classId: "Class 10",
            section: "A",
            roll: "101",
            admission: "VEDA-2026-0001",
            dob: "2010-05-15",
            gender: "Male",
            admissionDate: "2026-04-01",
            academicSession: "2026-2027",
            session: "2026-2027",
            fatherName: "Rajesh Sharma",
            motherName: "Sunita Sharma",
            fatherMobile: "9876543211",
            motherMobile: "9876543212",
            address: "House 42, Green Avenue, Hansi",
            city: "Hansi",
            state: "Haryana",
            pinCode: "125033",
            aadhaar: "987654321098",
            feeAmount: 1000,
            paymentStatus: "Paid",
            role: "student"
          })
        );
        navigate("/dashboard/student");
        return;
      }
    }

    const user = portalUsers.find(
      (item) =>
        item.email?.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setMessageType("error");
      setMessage("Incorrect email or password. Please try again.");
      return;
    }

    if (user.role !== role.toLowerCase()) {
      setMessageType("error");
      setMessage(`This account belongs to the ${user.role} role.`);
      return;
    }

    if (user.role === "student") {
      localStorage.setItem("eduflowUser", JSON.stringify(user));
      navigate("/dashboard/student");
    } else {
      setMessageType("info");
      setMessage(`${role} dashboard is in development. Please use Student or Admin Portal.`);
    }
  }

  return (
    <>
      <Navbar />

      <main className="login-page">
        <div className="login-container">

          {/* LEFT SIDE */}
          <section className="login-showcase">
            <div className="login-showcase-copy">
              <span className="login-eyebrow">
                YOUR EDUCATION PLATFORM
              </span>

              <h1>
                Learning today.
                <span>Leading tomorrow.</span>
              </h1>

              <p>
                One simple platform for students, teachers,
                parents and schools. Everything you need to
                learn, grow and succeed together.
              </p>

              <div className="login-benefits">
                <div className="login-benefit">
                  <span className="login-benefit-icon yellow">
                    <Users size={22} />
                  </span>

                  <div>
                    <strong>Connected Community</strong>
                    <small>Students, teachers, parents & schools</small>
                  </div>
                </div>

                <div className="login-benefit">
                  <span className="login-benefit-icon blue">
                    <BookOpen size={22} />
                  </span>

                  <div>
                    <strong>Smarter Management</strong>
                    <small>Classes, attendance, progress & more</small>
                  </div>
                </div>

                <div className="login-benefit">
                  <span className="login-benefit-icon green">
                    <ShieldCheck size={22} />
                  </span>

                  <div>
                    <strong>Better School Experience</strong>
                    <small>Clear information, better communication</small>
                  </div>
                </div>
              </div>
            </div>

            {/* PHOTO COLLAGE */}
            <div className="login-collage">
              <span className="login-shape login-shape-one" />
              <span className="login-shape login-shape-two" />
              <span className="login-shape login-shape-three" />

              <div className="login-collage-photo login-photo-campus">
                <img
                  src="/images/veda-campus.jpg"
                  alt="School campus"
                />
              </div>

              <div className="login-collage-photo login-photo-students">
                <img
                  src="/images/highlight-academics.jpg"
                  alt="Students learning together"
                />
              </div>

              <div className="login-collage-photo login-photo-teacher">
                <img
                  src="/images/highlight-teachers.jpg"
                  alt="Teacher helping students"
                />
              </div>

              <div className="login-collage-photo login-photo-family">
                <img
                  src="/images/veda-activities.jpg"
                  alt="Families and students sharing a school community moment"
                />
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="login-form-side">
            <div className="login-card">

              <div className="login-card-heading">
                <span className="login-card-kicker">
                  WELCOME BACK
                </span>

                <h2>Sign in to your account</h2>

                <p>
                  Choose your role and enter your details to continue.
                </p>
              </div>

              {/* ROLE SELECTION */}
              <div className="login-role-heading">
                <strong>Continue as</strong>
                <span>Choose your role</span>
              </div>

              <div className="login-role-picker">
                {roles.map((item) => {
                  const Icon = item.icon;
                  const active = role === item.name;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      className={`login-role-option ${
                        active ? "active" : ""
                      }`}
                      onClick={() => chooseRole(item.name)}
                      aria-pressed={active}
                    >
                      <Icon size={25} strokeWidth={1.9} />
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                    </button>
                  );
                })}
              </div>

              {/* STUDENT LOGIN METHOD TABS */}
              {role === "Student" && (
                <div style={{ display: "flex", gap: "8px", margin: "16px 0", background: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod("otp"); setMessage(""); }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      background: loginMethod === "otp" ? "#082b55" : "transparent",
                      color: loginMethod === "otp" ? "#ffffff" : "#475569"
                    }}
                  >
                    Mobile OTP Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod("password"); setMessage(""); }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      background: loginMethod === "password" ? "#082b55" : "transparent",
                      color: loginMethod === "password" ? "#ffffff" : "#475569"
                    }}
                  >
                    Password Login
                  </button>
                </div>
              )}

              {/* STUDENT OTP LOGIN FORM */}
              {role === "Student" && loginMethod === "otp" ? (
                <form className="login-form" onSubmit={handleVerifyOtp}>
                  <label htmlFor="student-mobile">
                    Registered Mobile Number
                  </label>

                  <div className="login-input" style={{ display: "flex", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                      <Phone size={19} />
                      <input
                        id="student-mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, ""));
                          setOtpSent(false);
                          setMessage("");
                        }}
                        required
                        style={{ width: "100%", border: "none", outline: "none" }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loadingOtp || mobile.length !== 10}
                      style={{
                        padding: "0 14px",
                        background: otpSent ? "#059669" : "#082b55",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>

                  {otpSent && (
                    <>
                      <label htmlFor="student-otp" style={{ marginTop: "14px" }}>
                        Enter 6-Digit OTP <small style={{ color: "#059669" }}>(Demo OTP: 123456)</small>
                      </label>

                      <div className="login-input">
                        <LockKeyhole size={19} />
                        <input
                          id="student-otp"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {message && (
                    <p
                      className="login-message"
                      role="alert"
                      style={{
                        color: messageType === "success" ? "#059669" : "#dc2626",
                        backgroundColor: messageType === "success" ? "#ecfdf5" : "#fef2f2",
                        border: `1px solid ${messageType === "success" ? "#a7f3d0" : "#fecaca"}`
                      }}
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="login-submit"
                    disabled={loadingOtp || !otpSent}
                  >
                    {loadingOtp ? "Verifying..." : "Verify OTP & Open Dashboard"}
                    <ArrowRight size={19} />
                  </button>

                  <div style={{ marginTop: "14px", textAlign: "center", fontSize: "13px" }}>
                    <span>New student seeking admission? </span>
                    <Link
                      to="/student-register"
                      style={{ color: "#082b55", fontWeight: "700", textDecoration: "underline" }}
                    >
                      Register &amp; Pay ₹1000 &rarr;
                    </Link>
                  </div>
                </form>
              ) : (
                /* PASSWORD LOGIN FORM */
                <form className="login-form" onSubmit={handlePasswordSubmit}>
                  <label htmlFor="login-email">
                    Email address
                  </label>

                  <div className="login-input">
                    <Mail size={19} />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <div className="login-input">
                    <LockKeyhole size={19} />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="login-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>

                  {message && (
                    <p className="login-message" role="alert">
                      {message}
                    </p>
                  )}

                  <button type="submit" className="login-submit">
                    Sign In as {role}
                    <ArrowRight size={19} />
                  </button>

                  {role === "Student" && (
                    <div style={{ marginTop: "14px", textAlign: "center", fontSize: "13px" }}>
                      <span>New student seeking admission? </span>
                      <Link
                        to="/student-register"
                        style={{ color: "#082b55", fontWeight: "700", textDecoration: "underline" }}
                      >
                        Register &amp; Pay ₹1000 &rarr;
                      </Link>
                    </div>
                  )}
                </form>
              )}

              <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.86rem", color: "#64748b" }}>School Administrator? </span>
                <Link
                  to="/admin/login-school"
                  style={{
                    fontSize: "0.86rem",
                    fontWeight: "600",
                    color: "#0f766e",
                    textDecoration: "underline",
                  }}
                >
                  Admin Portal Login &rarr;
                </Link>
              </div>

              {/* EXPLORE */}
              <div className="login-divider">
                <span>OR EXPLORE VEDA</span>
              </div>

              <Link to="/about" className="login-explore">
                <BookOpen size={19} />
                Discover our school
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
