import React, { useState } from "react";
import {
  Award,
  TrendingUp,
  FileCheck,
  CheckCircle,
  Download
} from "lucide-react";
import "./MarksResults.css";

const RESULTS_DATA = [
  { subject: "Mathematics", maxMarks: 100, passMarks: 33, obtained: 94, grade: "A1", remarks: "Outstanding performance in Algebra" },
  { subject: "Science", maxMarks: 100, passMarks: 33, obtained: 89, grade: "A2", remarks: "Very good concept clarity in Physics & Chem" },
  { subject: "English Language & Literature", maxMarks: 100, passMarks: 33, obtained: 88, grade: "A2", remarks: "Strong comprehension & vocabulary" },
  { subject: "Social Science", maxMarks: 100, passMarks: 33, obtained: 85, grade: "A2", remarks: "Good analytical answers in Geography" },
  { subject: "Hindi Course - A", maxMarks: 100, passMarks: 33, obtained: 86, grade: "A2", remarks: "Consistent accuracy in Grammar" },
  { subject: "Computer Applications", maxMarks: 100, passMarks: 33, obtained: 96, grade: "A1", remarks: "Excellent practical programming skills" },
];

export default function MarksResults({ student = {} }) {
  const [selectedExam, setSelectedExam] = useState("Periodic Assessment - 1 (2026)");

  const totalMax = RESULTS_DATA.reduce((acc, curr) => acc + curr.maxMarks, 0);
  const totalObtained = RESULTS_DATA.reduce((acc, curr) => acc + curr.obtained, 0);
  const percentage = ((totalObtained / totalMax) * 100).toFixed(1);

  return (
    <div className="student-results-page">
      {/* HEADER */}
      <div className="results-header">
        <div className="results-header-info">
          <span>ACADEMIC PERFORMANCE</span>
          <h2>Marks & Results</h2>
          <p>Subject-wise marks, grades, percentile rankings and teacher feedback.</p>
        </div>

        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
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
          <option value="Periodic Assessment - 1 (2026)">Periodic Assessment - 1 (2026)</option>
          <option value="Term - 1 Final Examination">Term - 1 Final Examination</option>
          <option value="Periodic Assessment - 2 (2026)">Periodic Assessment - 2 (2026)</option>
        </select>
      </div>

      {/* SUMMARY STATS */}
      <div className="results-summary-grid">
        <div className="result-card">
          <span>Overall Percentage</span>
          <h3 style={{ color: "#059669" }}>{percentage}%</h3>
        </div>

        <div className="result-card">
          <span>Total Marks</span>
          <h3>{totalObtained} <small style={{ fontSize: "14px", color: "#64748b" }}>/ {totalMax}</small></h3>
        </div>

        <div className="result-card">
          <span>Cumulative Grade</span>
          <h3 style={{ color: "#2563eb" }}>A1</h3>
        </div>

        <div className="result-card">
          <span>Class Rank</span>
          <h3 style={{ color: "#d97706" }}>3rd <small style={{ fontSize: "12px", color: "#64748b" }}>in Class</small></h3>
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="results-table-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ margin: 0, color: "#082b55", fontSize: "18px" }}>Score Card — {selectedExam}</h3>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Status: <strong style={{ color: "#15803d" }}>Passed with Distinction</strong></span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Maximum Marks</th>
                <th>Pass Marks</th>
                <th>Marks Obtained</th>
                <th>Grade</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS_DATA.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: "700", color: "#0f172a" }}>{item.subject}</td>
                  <td>{item.maxMarks}</td>
                  <td>{item.passMarks}</td>
                  <td>
                    <strong style={{ fontSize: "15px", color: "#082b55" }}>{item.obtained}</strong>
                  </td>
                  <td>
                    <span className={`grade-badge ${item.grade.toLowerCase()}`}>
                      {item.grade}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "13px" }}>{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
