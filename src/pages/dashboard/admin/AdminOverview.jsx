import React, { useState } from "react";
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

export default function AdminOverview({ navigate }) {
  const [stats] = useState({
    students: 1240,
    teachers: 86,
    parents: 1150,
    classes: 34,
    presentStudents: 1182,
    absentStudents: 58,
    pendingFees: 48500,
    openReports: 3,
    assignments: 24,
  });

  const [announcements] = useState([
    {
      id: 1,
      title: "Annual Sports Day Registration Open",
      date: "2026-11-05",
      audience: "All Students & Parents",
      priority: "High",
    },
    {
      id: 2,
      title: "Half-Yearly Examination Timetable Released",
      date: "2026-11-03",
      audience: "Classes 6-12",
      priority: "Important",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting Scheduled",
      date: "2026-11-01",
      audience: "All Parents",
      priority: "Normal",
    },
  ]);

  const cards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: GraduationCap,
      color: "blue",
    },
    {
      label: "Total Teachers",
      value: stats.teachers,
      icon: Users,
      color: "yellow",
    },
    {
      label: "Total Parents",
      value: stats.parents,
      icon: UserRound,
      color: "purple",
    },
    {
      label: "Active Classes",
      value: stats.classes,
      icon: School,
      color: "green",
    },
    {
      label: "Present Today",
      value: stats.presentStudents,
      icon: CalendarCheck,
      color: "green",
    },
    {
      label: "Absent Today",
      value: stats.absentStudents,
      icon: CalendarCheck,
      color: "yellow",
    },
    {
      label: "Pending Fees",
      value: `₹${stats.pendingFees.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "blue",
    },
    {
      label: "Open Reports",
      value: stats.openReports,
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
          {announcements.map((a) => (
            <div className="simple-row" key={a.id}>
              <div>
                <strong>{a.title}</strong>
                <small>
                  {a.date} &middot; {a.audience}
                </small>
              </div>
              <span className="status pending">{a.priority}</span>
            </div>
          ))}
          <p className="muted">
            {stats.assignments} assignments &middot; {stats.openReports} open reports
          </p>
        </section>
      </div>
    </div>
  );
}
