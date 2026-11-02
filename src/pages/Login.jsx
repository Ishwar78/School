
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSchool } from "../context/SchoolContext";
import { readAdditionalAccounts } from "../data/demoAccounts";
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
  },
  {
    name: "Admin",
    icon: Landmark,
    description: "Manage school"
  }
];

export default function Login() {
  const navigate = useNavigate();
  const school = useSchool();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function chooseRole(name) {
    setRole(name);
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    let users;

    try {
      users = [...school.users, ...readAdditionalAccounts()];
    } catch (error) {
      console.error("Unable to load saved demo accounts.", error);
      setMessage(
        "Saved demo accounts could not be loaded. Please contact the administrator.",
      );
      return;
    }

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setMessage("Incorrect email or password. Please try again.");
      return;
    }

    if (user.role !== role.toLowerCase()) {
      setMessage(
        `This account belongs to the ${user.role} dashboard. Please select the correct role.`
      );
      return;
    }

    const loggedInUser = {
      id: user.id,
      recordId: user.recordId,
      name: user.name,
      email: user.email,
      role: user.role,
      classId: user.classId,
      childId: user.childId
    };

    localStorage.setItem(
      "eduflowUser",
      JSON.stringify(loggedInUser)
    );

    navigate(`/dashboard/${user.role}`, { replace: true });
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

              <div className="login-handwritten">
                Better learning,
                <span>brighter futures.</span>
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

              {/* LOGIN FORM */}

              <form className="login-form" onSubmit={handleSubmit}>

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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                <p className="login-demo-note">
                  Demo mode — use one of your test accounts to sign in.
                </p>

                {message && (
                  <p className="login-message" role="alert">
                    {message}
                  </p>
                )}

                <button type="submit" className="login-submit">
                  Sign In as {role}
                  <ArrowRight size={19} />
                </button>

              </form>

              {/* EXPLORE */}

              <div className="login-divider">
                <span>OR EXPLORE EDUFLOW</span>
              </div>

              <Link to="/features" className="login-explore">
                <BookOpen size={19} />
                Discover our features
                <ArrowRight size={18} />
              </Link>

              <p className="login-card-bottom">
                New to EduFlow?{" "}
                <Link to="/about">Get to know us</Link>
              </p>

            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
