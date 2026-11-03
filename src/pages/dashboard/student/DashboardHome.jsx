
import React from "react";
import {
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  Wallet,
  Bell,
  Clock,
  ArrowRight,
  GraduationCap,
  FileText,
  CalendarCheck,
} from "lucide-react";

import "./DashboardHome.css";

const DashboardHome = ({ student = {} }) => {
  const studentName =
    student.name || student.fullName || "Student";

  const stats = [
    {
      title: "Attendance",
      value: "92%",
      subtitle: "Overall attendance",
      icon: ClipboardCheck,
      className: "attendance",
    },
    {
      title: "Assignments",
      value: "04",
      subtitle: "Pending assignments",
      icon: BookOpen,
      className: "assignments",
    },
    {
      title: "Upcoming Exams",
      value: "02",
      subtitle: "Examinations scheduled",
      icon: CalendarDays,
      className: "exams",
    },
    {
      title: "Fee Status",
      value: "Paid",
      subtitle: "Current fee status",
      icon: Wallet,
      className: "fees",
    },
  ];

  const notices = [
    {
      title: "School Assembly",
      description:
        "All students are requested to attend the morning assembly on time.",
      date: "03 Nov 2026",
      type: "General",
    },
    {
      title: "Upcoming Examination",
      description:
        "Examination schedule will be available in the examination section.",
      date: "05 Nov 2026",
      type: "Examination",
    },
    {
      title: "Assignment Submission",
      description:
        "Students should complete and submit their pending assignments.",
      date: "07 Nov 2026",
      type: "Academic",
    },
  ];

  const schedule = [
    {
      time: "08:30 AM - 09:15 AM",
      subject: "English",
      teacher: "Subject Teacher",
    },
    {
      time: "09:15 AM - 10:00 AM",
      subject: "Mathematics",
      teacher: "Subject Teacher",
    },
    {
      time: "10:00 AM - 10:45 AM",
      subject: "Science",
      teacher: "Subject Teacher",
    },
    {
      time: "11:15 AM - 12:00 PM",
      subject: "Social Studies",
      teacher: "Subject Teacher",
    },
  ];

  return (
    <div className="student-home-page">

      {/* Welcome Section */}
      <section className="student-welcome-banner">
        <div className="student-welcome-content">
          <span>VEDA STUDENT PORTAL</span>

          <h2>
            Welcome Back, {studentName}!
          </h2>

          <p>
            Stay updated with your attendance, assignments,
            examinations and school activities.
          </p>

          <div className="student-welcome-meta">
            <div>
              <GraduationCap size={17} />
              <span>
                Class: {student.class || "Not Assigned"}
              </span>
            </div>

            <div>
              <CalendarCheck size={17} />
              <span>
                Section: {student.section || "Not Assigned"}
              </span>
            </div>
          </div>
        </div>

        <div className="student-welcome-icon">
          <GraduationCap size={95} strokeWidth={1.2} />
        </div>
      </section>

      {/* Statistics */}
      <section className="student-stats-grid">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              className={`student-stat-card ${item.className}`}
              key={index}
            >
              <div className="student-stat-top">
                <div className="student-stat-icon">
                  <Icon size={23} />
                </div>

                <span>{item.title}</span>
              </div>

              <h3>{item.value}</h3>

              <p>{item.subtitle}</p>
            </div>
          );
        })}
      </section>

      {/* Main Content */}
      <section className="student-home-content">

        {/* Today's Schedule */}
        <div className="student-home-card student-schedule-card">
          <div className="student-card-heading">
            <div>
              <span className="student-section-label">
                DAILY ROUTINE
              </span>
              <h3>Today's Schedule</h3>
            </div>

            <div className="student-card-heading-icon">
              <Clock size={21} />
            </div>
          </div>

          <div className="student-schedule-list">
            {schedule.map((item, index) => (
              <div className="student-schedule-item" key={index}>
                <div className="student-schedule-time">
                  <Clock size={15} />
                  <span>{item.time}</span>
                </div>

                <div className="student-schedule-info">
                  <h4>{item.subject}</h4>
                  <p>{item.teacher}</p>
                </div>

                <div className="student-period-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>

          <button
            className="student-view-all-btn"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("student-menu-change", {
                  detail: "Class & Timetable",
                })
              )
            }
          >
            View Full Timetable <ArrowRight size={16} />
          </button>
        </div>

        {/* Notices */}
        <div className="student-home-card student-notices-card">
          <div className="student-card-heading">
            <div>
              <span className="student-section-label">
                SCHOOL UPDATES
              </span>
              <h3>Recent Notices</h3>
            </div>

            <div className="student-card-heading-icon">
              <Bell size={21} />
            </div>
          </div>

          <div className="student-notices-list">
            {notices.map((notice, index) => (
              <div className="student-notice-item" key={index}>
                <div className="student-notice-icon">
                  <FileText size={19} />
                </div>

                <div className="student-notice-content">
                  <div className="student-notice-title">
                    <h4>{notice.title}</h4>
                    <span>{notice.type}</span>
                  </div>

                  <p>{notice.description}</p>

                  <small>
                    <CalendarDays size={13} />
                    {notice.date}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <button
            className="student-view-all-btn"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("student-menu-change", {
                  detail: "School Notices",
                })
              )
            }
          >
            View All Notices <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Bottom Information */}
      <section className="student-home-bottom">
        <div className="student-bottom-info">
          <div className="student-bottom-icon">
            <BookOpen size={23} />
          </div>

          <div>
            <h4>Homework & Assignments</h4>
            <p>Check your pending homework and submission dates.</p>
          </div>

          <ArrowRight size={20} />
        </div>

        <div className="student-bottom-info">
          <div className="student-bottom-icon">
            <Wallet size={23} />
          </div>

          <div>
            <h4>Fee Information</h4>
            <p>View your fee status and payment receipts.</p>
          </div>

          <ArrowRight size={20} />
        </div>
      </section>

    </div>
  );
};

export default DashboardHome;
