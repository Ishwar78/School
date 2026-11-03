import React, { useState, useEffect } from "react";
import { getStudentProfileApi } from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  GraduationCap
} from "lucide-react";

import "./StudentDashboard.css";
import StudentSidebar from "./StudentSidebar";

// 10 INDIVIDUAL COMPONENT FILES CONNECTED
import DashboardHome from "./DashboardHome";
import MyProfile from "./MyProfile";
import ClassTimetable from "./ClassTimetable";
import MyAttendance from "./MyAttendance";
import HomeworkAssignments from "./HomeworkAssignments";
import SchoolNotices from "./SchoolNotices";
import ExaminationTimetable from "./ExaminationTimetable";
import MarksResults from "./MarksResults";
import ReportCard from "./ReportCard";
import FeeStatus from "./FeeStatus";

// MAP FOR ALL BUTTONS AND THEIR RESPECTIVE FILES
const MODULE_PAGES = {
  dashboard: { label: "Dashboard", Component: DashboardHome },
  profile: { label: "My Profile", Component: MyProfile },
  timetable: { label: "Class & Timetable", Component: ClassTimetable },
  attendance: { label: "My Attendance", Component: MyAttendance },
  assignments: { label: "Homework & Assignments", Component: HomeworkAssignments },
  notices: { label: "School Notices", Component: SchoolNotices },
  examination: { label: "Examination Timetable", Component: ExaminationTimetable },
  results: { label: "Marks & Results", Component: MarksResults },
  report: { label: "Report Card", Component: ReportCard },
  fees: { label: "Fee Status & Receipts", Component: FeeStatus },
};

// ALIAS MAP (FOR NAME-BASED CLICK EVENTS)
const NAME_TO_ID = {
  "Dashboard": "dashboard",
  "My Profile": "profile",
  "Class & Timetable": "timetable",
  "My Attendance": "attendance",
  "Homework & Assignments": "assignments",
  "School Notices": "notices",
  "Examination Timetable": "examination",
  "Marks & Results": "results",
  "Report Card": "report",
  "Fee Status & Receipts": "fees",
};

function getStudentData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("eduflowUser") || "{}"
    );
    return saved;
  } catch (error) {
    console.error("Student data load error:", error);
    return {};
  }
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [student, setStudent] = useState(getStudentData);

  // Sync latest student profile from database
  useEffect(() => {
    async function loadFreshStudent() {
      const current = getStudentData();
      const identifier = current.mobile || current.phone || current.id || current._id || current.admission;
      if (identifier) {
        try {
          const res = await getStudentProfileApi(identifier);
          if (res?.success && res.student) {
            setStudent(res.student);
            localStorage.setItem("eduflowUser", JSON.stringify(res.student));
          }
        } catch (err) {
          console.warn("Could not fetch fresh student profile:", err.message);
        }
      }
    }
    loadFreshStudent();
  }, []);

  const studentName =
    student.name ||
    student.fullName ||
    student.studentName ||
    "Student";

  const handleMenuClick = (target) => {
    const id = NAME_TO_ID[target] || target;
    if (MODULE_PAGES[id]) {
      setActivePage(id);
    }
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listen to custom menu change events (e.g. from Dashboard quick links)
  useEffect(() => {
    const handleCustomNav = (e) => {
      if (e.detail) {
        handleMenuClick(e.detail);
      }
    };

    window.addEventListener("student-menu-change", handleCustomNav);
    return () => window.removeEventListener("student-menu-change", handleCustomNav);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("eduflowUser");
    navigate("/login", { replace: true });
  };

  const currentModule = MODULE_PAGES[activePage] || MODULE_PAGES.dashboard;
  const ActiveComponent = currentModule.Component;

  return (
    <div className="student-dashboard-layout">
      {/* SIDEBAR */}
      <StudentSidebar
        activePage={activePage}
        onMenuClick={handleMenuClick}
        student={student}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN AREA */}
      <main className="student-dashboard-main">
        {/* TOPBAR */}
        <header className="student-dashboard-topbar">
          <div className="student-topbar-left">
            <button
              type="button"
              className="student-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open student menu"
            >
              <Menu size={23} />
            </button>

            <div>
              <span>STUDENT PORTAL</span>
              <h2>{currentModule.label}</h2>
            </div>
          </div>

          <div className="student-topbar-right">
            <div className="student-topbar-school">
              <GraduationCap size={19} />
              <span>VEDA International School</span>
            </div>

            <div className="student-topbar-avatar" style={{ overflow: "hidden" }}>
              {student.avatar || student.photoUrl ? (
                <img
                  src={(student.avatar || student.photoUrl).startsWith("http") ? (student.avatar || student.photoUrl) : `http://localhost:5075${student.avatar || student.photoUrl}`}
                  alt={studentName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                studentName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        {/* ACTIVE PAGE COMPONENT DYNAMICALLY RENDERED */}
        <div className="student-dashboard-page-content">
          <ActiveComponent
            student={student}
            onMenuClick={handleMenuClick}
            navigate={handleMenuClick}
          />
        </div>

        {/* FOOTER */}
        <footer className="student-dashboard-footer">
          © {new Date().getFullYear()} VEDA International School. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
