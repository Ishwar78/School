import React, { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Info
} from "lucide-react";
import "./MyAttendance.css";

const ATTENDANCE_LOG = [
  { date: "03 Nov 2026", day: "Tuesday", status: "Present", punch: "08:15 AM", remarks: "On time" },
  { date: "02 Nov 2026", day: "Monday", status: "Present", punch: "08:18 AM", remarks: "On time" },
  { date: "31 Oct 2026", day: "Saturday", status: "Present", punch: "08:22 AM", remarks: "On time" },
  { date: "30 Oct 2026", day: "Friday", status: "Present", punch: "08:14 AM", remarks: "On time" },
  { date: "29 Oct 2026", day: "Thursday", status: "Leave", punch: "—", remarks: "Medical Leave Approved" },
  { date: "28 Oct 2026", day: "Wednesday", status: "Present", punch: "08:10 AM", remarks: "On time" },
  { date: "27 Oct 2026", day: "Tuesday", status: "Present", punch: "08:20 AM", remarks: "On time" },
  { date: "26 Oct 2026", day: "Monday", status: "Absent", punch: "—", remarks: "Informed leave not submitted" },
  { date: "24 Oct 2026", day: "Saturday", status: "Holiday", punch: "—", remarks: "Diwali Celebration Break" },
  { date: "23 Oct 2026", day: "Friday", status: "Present", punch: "08:12 AM", remarks: "On time" },
];

export default function MyAttendance({ student = {} }) {
  const [selectedMonth, setSelectedMonth] = useState("November 2026");

  const overall = 92.4;
  const totalDays = 125;
  const presentDays = 115;
  const absentDays = 6;
  const leaves = 4;

  return (
    <div className="student-attendance-page">
      {/* HEADER */}
      <div className="attendance-header">
        <div className="attendance-header-info">
          <span>ACADEMIC ATTENDANCE RECORD</span>
          <h2>My Attendance</h2>
          <p>Track your daily attendance percentage, presence record and leave logs.</p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontWeight: "600",
            color: "#082b55",
            fontSize: "14px",
            background: "#ffffff"
          }}
        >
          <option value="November 2026">November 2026</option>
          <option value="October 2026">October 2026</option>
          <option value="September 2026">September 2026</option>
        </select>
      </div>

      {/* STATS */}
      <div className="attendance-stat-grid">
        <div className="att-card">
          <div className="att-card-icon percentage">
            <CalendarCheck size={24} />
          </div>
          <div className="att-card-details">
            <span>Overall Attendance</span>
            <h3 style={{ color: "#059669" }}>{overall}%</h3>
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-icon present">
            <CheckCircle2 size={24} />
          </div>
          <div className="att-card-details">
            <span>Total Present</span>
            <h3>{presentDays} <small style={{ fontSize: "12px", color: "#64748b" }}>/ {totalDays} Days</small></h3>
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-icon absent">
            <XCircle size={24} />
          </div>
          <div className="att-card-details">
            <span>Absent Count</span>
            <h3 style={{ color: "#dc2626" }}>{absentDays} Days</h3>
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-icon leave">
            <Clock size={24} />
          </div>
          <div className="att-card-details">
            <span>Approved Leaves</span>
            <h3 style={{ color: "#d97706" }}>{leaves} Days</h3>
          </div>
        </div>
      </div>

      {/* RECENT ATTENDANCE TABLE */}
      <div className="attendance-table-card">
        <div className="attendance-table-header">
          <h3>Daily Attendance Record ({selectedMonth})</h3>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Required for Exam Eligibility: <strong>75%</strong></span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>Date & Day</th>
                <th style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>Status</th>
                <th style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>Arrival Punch</th>
                <th style={{ padding: "14px 16px", fontSize: "13px", color: "#475569" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {ATTENDANCE_LOG.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>
                    {item.date} <span style={{ color: "#64748b", fontWeight: "normal", fontSize: "12px" }}>({item.day})</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569", fontSize: "13px" }}>
                    {item.punch}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "13px" }}>
                    {item.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
