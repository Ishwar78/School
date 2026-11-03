import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// VEDA WEBSITE PAGES
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import FeeStructure from "./pages/Feestructure";
import Classes from "./pages/Classes";
import Faculty from "./pages/Faculty";
import Facilities from "./pages/Facilities";
import Admissions from "./pages/Admissions";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/Blogdetail";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import { PrivacyPolicy, TermsConditions } from "./pages/Legal";

// SHARED COMPONENTS
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// STUDENT PORTAL
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import StudentRegistration from "./pages/dashboard/student/StudentRegistration";

// ADMIN DASHBOARD ONLY
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blog-news" element={<News />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/login" element={<Login />} />

        {/* STUDENT PORTAL & REGISTRATION */}
        <Route path="/student-register" element={<StudentRegistration />} />
        <Route path="/student/register" element={<Navigate to="/student-register" replace />} />
        <Route path="/register" element={<Navigate to="/student-register" replace />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />

        {/* DEDICATED ADMIN LOGIN */}
        <Route path="/admin/login-school" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/admin/login-school" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/login-school" replace />} />

        {/* DASHBOARD ROUTE (ONLY ADMIN) */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
