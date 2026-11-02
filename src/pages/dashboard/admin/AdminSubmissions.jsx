import React, { useState } from "react";
import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";
const CLASS_OPTIONS = [
  "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B",
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
  "11-A", "11-B", "12-A", "12-B"
];

const initialSubmissions = [
  {
    id: "sub-1",
    studentName: "Aarav Sharma",
    assignmentTitle: "Thermodynamics Numerical Problems",
    classId: "10-A",
    date: "2026-11-02",
    status: "Submitted",
    marks: "23 / 25",
    content: "Solved questions 1-15 with step-by-step explanations.",
    feedback: "Excellent problem solving.",
  },
  {
    id: "sub-2",
    studentName: "Diya Patel",
    assignmentTitle: "Quadratic Equations Worksheet",
    classId: "10-A",
    date: "2026-11-01",
    status: "Graded",
    marks: "19 / 20",
    content: "Worksheet completed and attached.",
    feedback: "Very good work, check sign in question 4.",
  },
  {
    id: "sub-3",
    studentName: "Rohan Verma",
    assignmentTitle: "Essay: The Role of Technology in Education",
    classId: "9-A",
    date: "2026-11-01",
    status: "Submitted",
    marks: "Pending",
    content: "Submitted essay on digital classroom transformation.",
    feedback: "Under review.",
  },
];

export default function AdminSubmissions() {
  const [submissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("newest");

  const filters = [
    { key: "classId", label: "Class", options: CLASS_OPTIONS },
    { key: "status", label: "Status", options: ["Submitted", "Graded", "Pending"] },
  ];

  const filtered = applyFilters(
    submissions,
    search,
    filters,
    values,
    sort,
    ["studentName", "assignmentTitle", "classId", "status"]
  );

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">SCHOOL RECORDS</span>
          <h1>Student Submissions</h1>
          <p>View student assignment submissions, answers and evaluation details.</p>
        </div>
      </div>

      <FilterPanel
        search={search}
        setSearch={setSearch}
        filters={filters}
        values={values}
        setValues={setValues}
        items={submissions}
        count={filtered.length}
        total={submissions.length}
        sort={sort}
        setSort={setSort}
        searchPlaceholder="Search by student, assignment or class..."
      />

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Class</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Marks</th>
              <th>Details &amp; Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.studentName}</strong></td>
                <td>{item.assignmentTitle}</td>
                <td>{item.classId}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status ${item.status === "Graded" ? "active" : "pending"}`}>
                    {item.status}
                  </span>
                </td>
                <td><strong>{item.marks}</strong></td>
                <td>
                  <small className="muted">{item.content}</small>
                  {item.feedback && (
                    <div style={{ marginTop: "4px", color: "#0f766e" }}>
                      <small><strong>Note:</strong> {item.feedback}</small>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
