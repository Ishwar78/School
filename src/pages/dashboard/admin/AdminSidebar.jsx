import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  CalendarDays,
  BookOpen,
  UserRound,
  Wallet,
  FileText,
  Bell,
  ArrowLeft,
  LogOut,
  KeyRound,
  Award,
  ChevronDown,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menu = [
  { title: "Overview", icon: LayoutDashboard, page: "overview" },
  {
    title: "Students",
    icon: GraduationCap,
    children: [
      { title: "Student Info", page: "students" },
      { title: "Student Attendance", page: "studentAttendance" },
    ],
  },
  {
    title: "Teachers",
    icon: Users,
    children: [
      { title: "Teacher Info", page: "teachers" },
      { title: "Teacher Attendance", page: "teacherAttendance" },
    ],
  },
  { title: "Classes", icon: School, page: "classes" },
  { title: "Timetable", icon: CalendarDays, page: "timetable" },
  { title: "Assignments", icon: BookOpen, page: "assignments" },
  { title: "Submissions", icon: FileText, page: "submissions" },
  { title: "Marks & Results", icon: Award, page: "results" },
  {
    title: "Parents",
    icon: UserRound,
    children: [
      { title: "Parent Info", page: "parents" },
      { title: "Linked Students", page: "linkedStudents" },
    ],
  },
  { title: "Fees", icon: Wallet, page: "fees" },
  { title: "Reports", icon: FileText, page: "reports" },
  { title: "Information", icon: Bell, page: "announcements" },
  { title: "Login Accounts", icon: KeyRound, page: "accounts" },
];

export default function AdminSidebar({ page, setPage, open, setOpen }) {
  const [expanded, setExpanded] = useState("");
  const navigate = useNavigate();

  function choose(next) {
    setPage(next);
    setOpen(false);
  }
  return (
    <>
      <div
        className={open ? "sidebar-shade visible" : "sidebar-shade"}
        onClick={() => setOpen(false)}
      />
      <aside className={open ? "sidebar opened" : "sidebar"}>
        <div className="brand">
          <span className="brand-mark">
            <GraduationCap />
          </span>
          <div>
            <strong>
              EduFlow<span>.</span>
            </strong>
            <small>ADMINISTRATION</small>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <small className="menu-label">MAIN MENU</small>
        <nav>
          {menu.map((item) => {
            const Icon = item.icon;
            const selected =
              item.page === page ||
              item.children?.some((child) => child.page === page);
            const show =
              expanded === item.title ||
              (selected && expanded !== "closed-" + item.title);

            return (
              <div key={item.title}>
                <button
                  className={selected ? "nav-item selected" : "nav-item"}
                  onClick={() =>
                    item.children
                      ? setExpanded(show ? "closed-" + item.title : item.title)
                      : choose(item.page)
                  }
                >
                  <Icon size={19} />
                  <span>{item.title}</span>
                  {item.children && (
                    <ChevronDown size={16} className={show ? "up" : ""} />
                  )}
                </button>
                {item.children && show && (
                  <div className="submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.page}
                        className={page === child.page ? "current" : ""}
                        onClick={() => choose(child.page)}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <School size={25} />
            <strong>School Workspace</strong>
            <p>One connected place for your school.</p>
          </div>
          <button onClick={() => window.location.assign("/")}>
            <ArrowLeft size={18} /> Back to Website
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("eduflowUser");
              navigate("/login", { replace: true });
            }}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
