import React, { useState } from "react";
import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";
const CLASS_OPTIONS = [
  "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B",
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
  "11-A", "11-B", "12-A", "12-B"
];
const ACADEMIC_SESSION_OPTIONS = ["2026-2027", "2025-2026", "2024-2025"];
const SCHOOL_STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

const initialParentsList = [
  { id: "par-1", parentNo: "PAR-001", name: "Vikram Sharma" },
  { id: "par-2", parentNo: "PAR-002", name: "Sunita Patel" },
  { id: "par-3", parentNo: "PAR-003", name: "Rajesh Verma" },
];

const initialStudentsList = [
  { id: "std-1", admission: "VEDA-2026-001", name: "Aarav Sharma", classId: "10-A", parentId: "par-1", status: "Active", session: "2026-2027" },
  { id: "std-2", admission: "VEDA-2026-002", name: "Diya Patel", classId: "10-A", parentId: "par-2", status: "Active", session: "2026-2027" },
  { id: "std-3", admission: "VEDA-2026-003", name: "Rohan Verma", classId: "9-B", parentId: "par-3", status: "Active", session: "2026-2027" },
  { id: "std-4", admission: "VEDA-2026-004", name: "Sneha Reddy", classId: "11-A", parentId: "", status: "Active", session: "2026-2027" },
];

export default function LinkedStudents() {
  const [parents] = useState(initialParentsList);
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_students");
      return saved ? JSON.parse(saved) : initialStudentsList;
    } catch {
      return initialStudentsList;
    }
  });

  const [parentId, setParentId] = useState("par-1");
  const [studentId, setStudentId] = useState("");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("az");

  const updateStudentParent = (targetStudentId, newParentId) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === targetStudentId ? { ...s, parentId: newParentId } : s));
      try {
        localStorage.setItem("veda_admin_students", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const linked = parentId
    ? students.filter((student) => student.parentId === parentId)
    : [];

  const filters = [
    {
      key: "classId",
      label: "Class",
      options: CLASS_OPTIONS,
      includeDynamic: true,
    },
    {
      key: "session",
      label: "Academic session",
      options: ACADEMIC_SESSION_OPTIONS,
      includeDynamic: true,
    },
    { key: "status", label: "Student status", options: SCHOOL_STATUS_OPTIONS },
  ];

  const shown = applyFilters(linked, search, filters, values, sort);

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">FAMILY CONNECTIONS</span>
          <h1>Linked Students</h1>
          <p>Connect existing student records with their parent or guardian.</p>
        </div>
      </div>

      <div className="panel form-panel">
        <div className="form-grid">
          <label>
            Choose Parent
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">Select parent</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.parentNo})
                </option>
              ))}
            </select>
          </label>
          <label>
            Choose Student to Link
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Select student</option>
              {students
                .filter((s) => s.parentId !== parentId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.classId})
                  </option>
                ))}
            </select>
          </label>
        </div>
        <button
          className="primary-btn"
          disabled={!parentId || !studentId}
          onClick={() => {
            updateStudentParent(studentId, parentId);
            setStudentId("");
          }}
        >
          Link Student
        </button>
      </div>

      <FilterPanel
        search={search}
        setSearch={setSearch}
        filters={filters}
        values={values}
        setValues={setValues}
        items={linked}
        count={shown.length}
        total={linked.length}
        sort={sort}
        setSort={setSort}
      />

      <div className="panel">
        <h2>Linked Children</h2>
        {!parentId ? (
          <p className="muted">Select a parent to see linked students.</p>
        ) : shown.length ? (
          shown.map((s) => (
            <div className="simple-row" key={s.id}>
              <div>
                <strong>{s.name}</strong>
                <small>
                  {s.admission} &middot; {s.classId}
                </small>
              </div>
              <button
                className="secondary-btn"
                onClick={() => updateStudentParent(s.id, "")}
              >
                Unlink
              </button>
            </div>
          ))
        ) : (
          <p className="muted">
            No matching linked children for this parent.
          </p>
        )}
      </div>
    </section>
  );
}
