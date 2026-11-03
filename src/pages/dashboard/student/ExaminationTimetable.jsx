import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  AlertCircle,
  FileCheck,
  Award,
  Download
} from "lucide-react";
import "./ExaminationTimetable.css";

const EXAMS = [
  {
    date: "18 Nov 2026",
    day: "Wednesday",
    subject: "Mathematics",
    code: "MATH-041",
    time: "09:00 AM - 12:00 PM",
    maxMarks: 80,
    room: "Room 101-104",
    syllabus: "Ch 1 to Ch 8 (Algebra, Geometry, Trigonometry, Statistics)"
  },
  {
    date: "20 Nov 2026",
    day: "Friday",
    subject: "English Language & Literature",
    code: "ENG-184",
    time: "09:00 AM - 12:00 PM",
    maxMarks: 80,
    room: "Room 101-104",
    syllabus: "Reading Comprehension, Writing Skills, Grammar, First Flight & Footprints"
  },
  {
    date: "23 Nov 2026",
    day: "Monday",
    subject: "Science (Physics, Chem, Bio)",
    code: "SCI-086",
    time: "09:00 AM - 12:00 PM",
    maxMarks: 80,
    room: "Room 101-104",
    syllabus: "Chemical Reactions, Acids & Bases, Life Processes, Light, Electricity"
  },
  {
    date: "25 Nov 2026",
    day: "Wednesday",
    subject: "Social Science",
    code: "SST-087",
    time: "09:00 AM - 12:00 PM",
    maxMarks: 80,
    room: "Room 101-104",
    syllabus: "History Ch 1-2, Geography Ch 1-3, Pol. Science Ch 1-2, Economics Ch 1-2"
  },
  {
    date: "27 Nov 2026",
    day: "Friday",
    subject: "Hindi Course - A",
    code: "HIN-002",
    time: "09:00 AM - 12:00 PM",
    maxMarks: 80,
    room: "Room 101-104",
    syllabus: "Kshitij Part 2, Kritika Part 2, Vyakaran, Lekhan Vidha"
  },
  {
    date: "30 Nov 2026",
    day: "Monday",
    subject: "Computer Applications",
    code: "CA-165",
    time: "09:00 AM - 11:00 AM",
    maxMarks: 50,
    room: "Computer Lab 1",
    syllabus: "HTML, CSS, Cyber Ethics, Scratch Programming"
  }
];

export default function ExaminationTimetable({ student = {} }) {
  const [selectedTerm, setSelectedTerm] = useState("Half-Yearly Examination 2026-2027");

  const studentClass = student.classId || student.class || "10th";
  const studentSection = student.section || "A";

  return (
    <div className="student-exam-page">
      {/* HEADER */}
      <div className="exam-header">
        <div className="exam-header-info">
          <span>EXAMINATION PORTAL</span>
          <h2>Examination Timetable</h2>
          <p>Official date sheet, time slots, exam halls and guidelines for Class {studentClass}-{studentSection}.</p>
        </div>

        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
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
          <option value="Half-Yearly Examination 2026-2027">Half-Yearly Examination 2026-2027</option>
          <option value="Pre-Board Examination 2027">Pre-Board Examination 2027</option>
          <option value="Periodic Assessment 2">Periodic Assessment 2</option>
        </select>
      </div>

      {/* HIGHLIGHT BANNER */}
      <div className="exam-highlight-banner">
        <div>
          <h3>{selectedTerm}</h3>
          <p>Commencing from 18th November 2026 to 30th November 2026</p>
        </div>

        <div className="exam-timing-badge">
          Standard Timing: 09:00 AM - 12:00 PM
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      <div className="exam-schedule-card">
        <div className="exam-table-responsive">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Date & Day</th>
                <th>Subject & Code</th>
                <th>Exam Timing</th>
                <th>Max Marks</th>
                <th>Seating Hall</th>
                <th>Syllabus Outline</th>
              </tr>
            </thead>
            <tbody>
              {EXAMS.map((exam, idx) => (
                <tr key={idx}>
                  <td className="exam-date-cell">
                    <strong>{exam.date}</strong>
                    <small>{exam.day}</small>
                  </td>

                  <td>
                    <span className="exam-subject-title">{exam.subject}</span>
                    <span className="exam-subject-code">{exam.code}</span>
                  </td>

                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={14} color="#64748b" /> {exam.time}
                    </span>
                  </td>

                  <td>
                    <strong>{exam.maxMarks}</strong> Marks
                  </td>

                  <td>
                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
                      {exam.room}
                    </span>
                  </td>

                  <td style={{ maxWidth: "260px", fontSize: "12px", color: "#475569" }}>
                    {exam.syllabus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RULES & GUIDELINES */}
      <div className="exam-rules-card">
        <h4>
          <AlertCircle size={18} /> Important Examination Instructions
        </h4>
        <ul>
          <li>All students must report in full school uniform at least 30 minutes before exam time (08:30 AM).</li>
          <li>Carrying the official Admit Card / School ID card is mandatory for entry into examination rooms.</li>
          <li>Electronic devices including smartwatches, mobile phones, and calculators are strictly prohibited.</li>
          <li>Students will be given 15 minutes of dedicated reading time before the writing duration commences.</li>
        </ul>
      </div>
    </div>
  );
}
