
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

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
import { PrivacyPolicy, TermsConditions } from "./pages/Legal";

// SHARED COMPONENTS

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// DASHBOARDS

import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import ParentDashboard from "./pages/dashboard/parent/ParentDashboard";
import TeacherDashboard from "./pages/dashboard/teacher/TeacherDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

// SHARED CONTEXT

import { SchoolProvider } from "./context/SchoolContext";

// DASHBOARD STYLES

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition:  true, v7_relativeSplatPath: true }}>
      <SchoolProvider>
        <ScrollToTop />

        <Routes>

          {/* VEDA PUBLIC WEBSITE */}

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


          {/* DASHBOARD REDIRECT */}

          <Route
            path="/dashboard"
            element={<ProtectedRoute />}
          />


          {/* STUDENT DASHBOARD */}

          <Route
            path="/dashboard/student/*"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />


          {/* PARENT DASHBOARD */}

          <Route
            path="/dashboard/parent/*"
            element={
              <ProtectedRoute role="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />


          {/* TEACHER DASHBOARD */}

          <Route
            path="/dashboard/teacher/*"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />


          {/* ADMIN DASHBOARD */}

          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* UNKNOWN ROUTES */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </SchoolProvider>
    </BrowserRouter>
  );
}
