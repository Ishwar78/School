import React from "react";
import {
  LayoutDashboard,
  UserRound,
  CalendarDays,
  CalendarCheck,
  ClipboardList,
  BookOpen,
  Bell,
  Award,
  FileText,
  Wallet,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import "./StudentSidebar.css";

const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "profile", name: "My Profile", icon: UserRound },
  { id: "timetable", name: "Class & Timetable", icon: CalendarDays },
  { id: "attendance", name: "My Attendance", icon: CalendarCheck },
  { id: "assignments", name: "Homework & Assignments", icon: BookOpen },
  { id: "notices", name: "School Notices", icon: Bell },
  { id: "examination", name: "Examination Timetable", icon: ClipboardList },
  { id: "results", name: "Marks & Results", icon: Award },
  { id: "report", name: "Report Card", icon: FileText },
  { id: "fees", name: "Fee Status & Receipts", icon: Wallet },
];

const StudentSidebar = ({
  activePage,
  onMenuClick,
  student = {},
  onLogout,
  sidebarOpen,
  onClose,
}) => {
  const studentName =
    student.name || student.fullName || student.studentName || "Student";

  const studentClass =
    student.classId || student.class || "Not Assigned";

  return (
    <>
      <div
        className={`student-sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={onClose}
      />

      <aside
        className={`student-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="student-sidebar-brand">
          <div className="student-brand-icon">
            <GraduationCap size={29} />
          </div>

          <div className="student-brand-text">
            <h2>VEDA</h2>
            <span>INTERNATIONAL SCHOOL</span>
          </div>

          <button
            className="student-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="student-sidebar-profile">
          <div className="student-sidebar-avatar">
            {studentName.charAt(0).toUpperCase()}
          </div>

          <div className="student-sidebar-user-info">
            <h4>{studentName}</h4>
            <p>
              Class {studentClass}
              {student.section ? ` - ${student.section}` : ""}
            </p>
          </div>
        </div>

        <div className="student-menu-heading">
          STUDENT MENU
        </div>

        <nav className="student-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || activePage === item.name;

            return (
              <button
                key={item.id}
                className={`student-menu-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => {
                  onMenuClick(item.id);
                  onClose?.();
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="student-sidebar-bottom">
          <div className="student-portal-info">
            <GraduationCap size={22} />
            <div>
              <h4>Student Portal</h4>
              <p>Learning Management</p>
            </div>
          </div>

          <button
            className="student-logout-btn"
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
