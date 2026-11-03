import React from "react";
import {
  FileText,
  Printer,
  Award,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import "./ReportCard.css";

const SCHOLASTIC_SUBJECTS = [
  { name: "English Language & Literature", term1: 88, periodic: 19, internal: 20, total: 94, grade: "A1" },
  { name: "Hindi Course - A", term1: 82, periodic: 18, internal: 19, total: 89, grade: "A2" },
  { name: "Mathematics", term1: 94, periodic: 20, internal: 20, total: 98, grade: "A1" },
  { name: "Science", term1: 89, periodic: 18, internal: 19, total: 92, grade: "A1" },
  { name: "Social Science", term1: 85, periodic: 17, internal: 19, total: 88, grade: "A2" },
  { name: "Computer Applications", term1: 96, periodic: 20, internal: 20, total: 98, grade: "A1" },
];

const CO_SCHOLASTIC = [
  { area: "Work Education / Computer Practical", grade: "A" },
  { area: "Art & Cultural Education", grade: "A" },
  { area: "Health & Physical Education (Sports)", grade: "A" },
  { area: "Discipline, Values & Regularity", grade: "A+" },
];

export default function ReportCard({ student = {} }) {
  const studentName = student.name || student.fullName || "Student Name";
  const studentClass = student.classId || student.class || "10th";
  const studentSection = student.section || "A";
  const studentRoll = student.roll || "12";
  const admissionNo = student.admission || student.admissionNo || "VEDA-2026-001";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="student-report-page">
      {/* HEADER */}
      <div className="report-header">
        <div className="report-header-info">
          <span>OFFICIAL ACADEMIC RECORD</span>
          <h2>Annual Report Card</h2>
          <p>Comprehensive Scholastic and Co-Scholastic Progress Report for Session 2026-2027.</p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#082b55",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* REPORT SHEET */}
      <div className="report-sheet-card">
        <div className="report-sheet-brand">
          <h1>VEDA INTERNATIONAL SCHOOL</h1>
          <p>Affiliated to CBSE, New Delhi &bull; Thurana (Hansi), Haryana</p>
          <span>STUDENT EVALUATION & PROGRESS REPORT (2026-2027)</span>
        </div>

        {/* STUDENT META */}
        <div className="report-student-meta">
          <div className="report-meta-item">
            <small>Student's Name</small>
            <strong>{studentName}</strong>
          </div>
          <div className="report-meta-item">
            <small>Admission No.</small>
            <strong>{admissionNo}</strong>
          </div>
          <div className="report-meta-item">
            <small>Class & Section</small>
            <strong>Class {studentClass} - {studentSection}</strong>
          </div>
          <div className="report-meta-item">
            <small>Roll Number</small>
            <strong>{studentRoll}</strong>
          </div>
          <div className="report-meta-item">
            <small>Father's Name</small>
            <strong>{student.fatherName || "Mr. Suresh Verma"}</strong>
          </div>
          <div className="report-meta-item">
            <small>Attendance</small>
            <strong>92.4% (115/125 Days)</strong>
          </div>
        </div>

        {/* SCHOLASTIC TABLE */}
        <h3 style={{ color: "#082b55", margin: "0 0 12px 0", fontSize: "16px" }}>Part 1: Scholastic Areas</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Subjects</th>
              <th>Term Exam (80)</th>
              <th>Periodic Test (20)</th>
              <th>Internal / Portfolio (20)</th>
              <th>Total Marks (100)</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {SCHOLASTIC_SUBJECTS.map((sub, i) => (
              <tr key={i}>
                <td style={{ fontWeight: "600" }}>{sub.name}</td>
                <td>{sub.term1}</td>
                <td>{sub.periodic}</td>
                <td>{sub.internal}</td>
                <td><strong>{sub.total}</strong></td>
                <td><strong style={{ color: "#059669" }}>{sub.grade}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CO-SCHOLASTIC TABLE */}
        <h3 style={{ color: "#082b55", margin: "20px 0 12px 0", fontSize: "16px" }}>Part 2: Co-Scholastic Activities & Discipline</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Activity / Trait</th>
              <th style={{ width: "160px" }}>Grade Awarded</th>
            </tr>
          </thead>
          <tbody>
            {CO_SCHOLASTIC.map((item, i) => (
              <tr key={i}>
                <td>{item.area}</td>
                <td><strong style={{ color: "#082b55" }}>{item.grade}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* REMARKS */}
        <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", margin: "20px 0" }}>
          <strong style={{ color: "#082b55" }}>Class Teacher's Remarks: </strong>
          <span style={{ color: "#475569" }}>Outstanding academic discipline, highly attentive and consistent performer. Promoted with Distinction.</span>
        </div>

        {/* SIGNATURES */}
        <div className="report-signatures">
          <div className="signature-box">
            <div className="signature-line" />
            <span>Class Teacher</span>
          </div>

          <div className="signature-box">
            <div className="signature-line" />
            <span>Parent / Guardian</span>
          </div>

          <div className="signature-box">
            <div className="signature-line" />
            <span>Principal / Head of School</span>
          </div>
        </div>
      </div>
    </div>
  );
}
