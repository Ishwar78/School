import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";

import React, { useState } from "react";

import { useStudent } from "../../../context/StudentContext";
import { useParent } from "../../../context/ParentContext";

import {
  ACADEMIC_SESSION_OPTIONS,
  CLASS_OPTIONS,
  SCHOOL_STATUS_OPTIONS,
} from "../shared/schoolOptions";

export default function LinkedStudents() {
  const { data: students } = useStudent();
  const { data: parents } = useParent();
  const [parentId, setParentId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("az");

  const linked = parentId
    ? students.items.filter((student) => student.parentId === parentId)
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
              {parents.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.parentNo})
                </option>
              ))}
            </select>
          </label>
          <label>
            Choose Student
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Select student</option>
              {students.items.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classId})
                </option>
              ))}
            </select>
          </label>
        </div>
        {parents.items.length === 0 && (
          <p className="muted">Add a parent record before linking students.</p>
        )}
        {students.items.length === 0 && (
          <p className="muted">Add a student record before linking children.</p>
        )}
        <button
          className="primary-btn"
          disabled={!parentId || !studentId}
          onClick={() => {
            students.update(studentId, { parentId });
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
                  {s.admission} · {s.classId}
                </small>
              </div>
              <button
                className="secondary-btn"
                onClick={() => students.update(s.id, { parentId: "" })}
              >
                Unlink
              </button>
            </div>
          ))
        ) : (
          <p className="muted">
            No matching linked children. Try clearing filters.
          </p>
        )}
      </div>
    </section>
  );
}
