import React, { useState } from "react";
import { Search } from "lucide-react";
const CLASS_OPTIONS = [
  "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B",
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
  "11-A", "11-B", "12-A", "12-B"
];
const SUBJECT_OPTIONS = [
  "Mathematics", "English", "Science", "Physics", "Chemistry", "Biology", "Social Studies", "Hindi", "Computer Science", "Physical Education"
];

const initialResults = [
  {
    id: "res-1",
    studentName: "Aarav Sharma",
    classId: "10-A",
    exam: "Mid-Term Examination",
    subject: "Mathematics",
    marks: 92,
    maxMarks: 100,
    grade: "A+",
    session: "2026-2027",
    status: "Published",
  },
  {
    id: "res-2",
    studentName: "Aarav Sharma",
    classId: "10-A",
    exam: "Mid-Term Examination",
    subject: "Physics",
    marks: 88,
    maxMarks: 100,
    grade: "A",
    session: "2026-2027",
    status: "Published",
  },
  {
    id: "res-3",
    studentName: "Diya Patel",
    classId: "10-A",
    exam: "Mid-Term Examination",
    subject: "Mathematics",
    marks: 95,
    maxMarks: 100,
    grade: "A+",
    session: "2026-2027",
    status: "Published",
  },
  {
    id: "res-4",
    studentName: "Rohan Verma",
    classId: "9-A",
    exam: "Unit Test 1",
    subject: "English",
    marks: 78,
    maxMarks: 100,
    grade: "B+",
    session: "2026-2027",
    status: "Published",
  },
];

export default function AdminResults() {
  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_results");
      return saved ? JSON.parse(saved) : initialResults;
    } catch {
      return initialResults;
    }
  });

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const filtered = results.filter((res) => {
    const matchSearch =
      !search ||
      res.studentName.toLowerCase().includes(search.toLowerCase()) ||
      res.exam.toLowerCase().includes(search.toLowerCase());
    const matchClass = !selectedClass || res.classId === selectedClass;
    const matchSubject = !selectedSubject || res.subject === selectedSubject;
    return matchSearch && matchClass && matchSubject;
  });

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">ACADEMIC PERFORMANCE</span>
          <h1>Marks &amp; Results Management</h1>
          <p>Review student test scores, exam marks and grades across classes and subjects.</p>
        </div>
      </div>

      <div className="panel filter-panel">
        <div className="filter-grid" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search student or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="">All Classes</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="">All Subjects</option>
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Examination</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.studentName}</strong></td>
                <td>{item.classId}</td>
                <td>{item.exam}</td>
                <td>{item.subject}</td>
                <td>
                  <strong>{item.marks}</strong> / {item.maxMarks} ({Math.round((item.marks / item.maxMarks) * 100)}%)
                </td>
                <td>
                  <span className="badge" style={{ padding: "4px 8px", background: "#f0fdf4", color: "#166534", borderRadius: "6px", fontWeight: "bold" }}>
                    {item.grade}
                  </span>
                </td>
                <td>
                  <span className="status active">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
