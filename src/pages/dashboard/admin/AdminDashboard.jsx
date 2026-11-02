import React, { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import StudentInfo from "./StudentInfo";
import TeacherInfo from "./TeacherInfo";
import ParentInfo from "./ParentInfo";
import LinkedStudents from "./LinkedStudents";
import ManageClasses from "./ManageClasses";
import AttendancePage from "./AttendancePage";
import Assignments from "./Assignments";
import AdminSubmissions from "./AdminSubmissions";
import Fees from "./Fees";
import Reports from "./Reports";
import Information from "./Information";
import AdminAccounts from "./AdminAccounts";
import AdminResults from "./AdminResults";
import AdminTimetable from "./AdminTimetable";
import useSchool from "../shared/useSchool";
import "./Admin.css";

const pages = {
  overview: ["Admin Overview", AdminOverview],
  students: ["Student Information", StudentInfo],
  studentAttendance: [
    "Student Attendance",
    () => <AttendancePage role="student" />,
  ],
  teachers: ["Teacher Information", TeacherInfo],
  teacherAttendance: [
    "Teacher Attendance",
    () => <AttendancePage role="teacher" />,
  ],
  classes: ["Class Management", ManageClasses],
  timetable: ["Timetable Management", AdminTimetable],
  assignments: ["Assignments & Homework", Assignments],
  submissions: ["Student Submissions", AdminSubmissions],
  results: ["Marks & Results", AdminResults],
  parents: ["Parent Information", ParentInfo],
  linkedStudents: ["Linked Students", LinkedStudents],
  fees: ["Fee Management", Fees],
  reports: ["Reports", Reports],
  announcements: ["Information & Announcements", Information],
  accounts: ["Login Accounts", AdminAccounts],
};

export default function AdminDashboard() {
  const school = useSchool();
  const [page, setPage] = useState("overview");
  const [open, setOpen] = useState(false);

  const [title, Component] = pages[page];

  return (
    <div className="dashboard">
      <AdminSidebar
        page={page}
        setPage={setPage}
        open={open}
        setOpen={setOpen}
      />
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="hamburger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <div>
              <small>EduFlow / Administration</small>
              <h2>{title}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="topbar-search">
            </span>
            <button
              className="icon-button"
              onClick={() => setPage("announcements")}
              aria-label="Announcements"
            >
              <Bell size={20} />
            </button>
            <div className="avatar">AD</div>
            <div className="profile-name">
              <strong>Administrator</strong>
              <small>School Admin</small>
            </div>
          </div>
        </header>
        <main className="content">
          {school.storageErrors.map((message) => (
            <p className="storage-warning" role="alert" key={message}>
              {message}
            </p>
          ))}
          <Component navigate={setPage} />
        </main>
      </div>
    </div>
  );
}
