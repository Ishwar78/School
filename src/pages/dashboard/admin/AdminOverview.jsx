import React from "react";
import {
  GraduationCap,
  Users,
  UserRound,
  School,
  Wallet,
  BookOpen,
  FileText,
  Bell,
  TrendingUp,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

import { useStudent } from "../../../context/StudentContext";
import { useTeacher } from "../../../context/TeacherContext";
import { useParent } from "../../../context/ParentContext";
import { useClass } from "../../../context/ClassContext";
import { useAttendance } from "../../../context/AttendanceContext";
import { useAssignment } from "../../../context/AssignmentContext";
import { useFee } from "../../../context/FeeContext";
import { useReport } from "../../../context/ReportContext";
import { useAnnouncement } from "../../../context/AnnouncementContext";

export default function AdminOverview({ navigate }) {
  const students = useStudent().data.items,
    teachers = useTeacher().data.items,
    parents = useParent().data.items,
    classes = useClass().data.items;
  const attendance = useAttendance().data.items,
    assignments = useAssignment().data.items,
    fees = useFee().data.items,
    reports = useReport().data.items,
    announcements = useAnnouncement().data.items;

  const today = new Date().toLocaleDateString("en-CA");

  const todayAttendance = attendance.filter((a) => a.date === today);

  const pending = fees.reduce(
    (sum, fee) => sum + Math.max(0, Number(fee.total) - Number(fee.paid)),
    0,
  );

  const cards = [
    {
      label: "Total Students",
      value: students.length,
      icon: GraduationCap,
      color: "blue",
    },
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: Users,
      color: "yellow",
    },
    {
      label: "Total Parents",
      value: parents.length,
      icon: UserRound,
      color: "purple",
    },
    {
      label: "Active Classes",
      value: classes.length,
      icon: School,
      color: "green",
    },
    {
      label: "Present Students",
      value: todayAttendance.filter(
        (a) => a.role === "student" && a.status === "Present",
      ).length,
      icon: CalendarCheck,
      color: "green",
    },
    {
      label: "Absent Students",
      value: todayAttendance.filter(
        (a) => a.role === "student" && a.status === "Absent",
      ).length,
      icon: CalendarCheck,
      color: "yellow",
    },
    {
      label: "Pending Fees",
      value: `₹${pending.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "blue",
    },
    {
      label: "Open Reports",
      value: reports.filter((r) => r.status !== "Resolved").length,
      icon: FileText,
      color: "purple",
    },
  ];

  const quick = [
    { title: "Students", page: "students", icon: GraduationCap },
    { title: "Teachers", page: "teachers", icon: Users },
    { title: "Assignments", page: "assignments", icon: BookOpen },
    { title: "Fees", page: "fees", icon: Wallet },
  ];

  return (
    <div className="overview">
      <div className="welcome">
        <div>
          <span>
            <TrendingUp size={16} /> SCHOOL ADMINISTRATION
          </span>
          <h1>Welcome to your workspace.</h1>
          <p>
            Manage your school, monitor daily activities and keep everyone
            connected.
          </p>
        </div>
        <School className="welcome-art" size={110} strokeWidth={1.1} />
      </div>

      <div className="section-title">
        <span className="eyebrow">AT A GLANCE</span>
        <h2>School Overview</h2>
        <p>Live totals calculated from your saved school records.</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.label}>
              <div className={`stat-icon ${card.color}`}>
                <Icon size={24} />
              </div>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          );
        })}
      </div>

      <div className="overview-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">YOUR WORKSPACE</span>
              <h2>Management Modules</h2>
            </div>
          </div>

          <div className="quick-grid">
            {quick.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className="quick-card"
                  key={item.page}
                  onClick={() => navigate(item.page)}
                >
                  <Icon size={25} />
                  <strong>{item.title}</strong>
                  <span>
                    Open module <ArrowRight size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SCHOOL UPDATES</span>
              <h2>Recent Announcements</h2>
            </div>
            <Bell size={20} />
          </div>
          {announcements
            .slice(-4)
            .reverse()
            .map((a) => (
              <div className="simple-row" key={a.id}>
                <div>
                  <strong>{a.title}</strong>
                  <small>
                    {a.date} · {a.audience}
                  </small>
                </div>
                <span className="status pending">{a.priority}</span>
              </div>
            ))}
          {!announcements.length && (
            <div className="empty-state">
              <Bell size={30} />
              <h3>No announcements yet</h3>
              <p>Published updates will appear here.</p>
            </div>
          )}
          <p className="muted">
            {assignments.length} assignments · {reports.length} reports
          </p>
        </section>
      </div>
    </div>
  );
}
