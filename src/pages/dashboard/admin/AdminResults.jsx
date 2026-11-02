import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import {
  ACADEMIC_SESSION_OPTIONS,
  CLASS_GRADE_OPTIONS,
  SECTION_OPTIONS,
  SUBJECT_OPTIONS,
} from "../shared/schoolOptions";
import useSchool from "../shared/useSchool";

function classParts(classId) {
  const [grade = "", section = ""] = String(classId || "").split("-");

  return { grade, section };
}

export default function AdminResults() {
  const school = useSchool();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    section: "",
    studentId: "",
    subject: "",
    exam: "",
    session: "",
  });
  const [selectedResult, setSelectedResult] = useState(null);
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  const studentsById = useMemo(
    () => new Map(school.students.items.map((student) => [String(student.id), student])),
    [school.students.items],
  );
  const teachersById = useMemo(
    () => new Map(school.teachers.items.map((teacher) => [String(teacher.id), teacher])),
    [school.teachers.items],
  );
  const availableSubjects = [
    ...new Set([
      ...SUBJECT_OPTIONS,
      ...school.results.items.map((result) => result.subject).filter(Boolean),
    ]),
  ];
  const availableExams = [
    ...new Set(school.results.items.map((result) => result.exam).filter(Boolean)),
  ];
  const availableSessions = [
    ...new Set([
      ...ACADEMIC_SESSION_OPTIONS,
      ...school.results.items.map((result) => result.session).filter(Boolean),
    ]),
  ];
  const availableGrades = [
    ...new Set([
      ...CLASS_GRADE_OPTIONS,
      ...school.students.items
        .map((student) => classParts(student.classId).grade)
        .filter(Boolean),
    ]),
  ];
  const availableSections = [
    ...new Set([
      ...SECTION_OPTIONS,
      ...school.students.items
        .filter(
          (student) =>
            !filters.grade ||
            classParts(student.classId).grade === filters.grade,
        )
        .map((student) => classParts(student.classId).section)
        .filter(Boolean),
    ]),
  ];
  const availableStudents = school.students.items.filter((student) => {
    const { grade, section } = classParts(student.classId);

    return (
      (!filters.grade || grade === filters.grade) &&
      (!filters.section || section === filters.section)
    );
  });

  const filteredResults = school.results.items.filter((result) => {
    const student = studentsById.get(String(result.studentId));
    const { grade, section } = classParts(student?.classId);
    const teacher = teachersById.get(String(result.teacherId));
    const searchText = [
      student?.name,
      student?.classId,
      result.subject,
      result.exam,
      result.session,
      teacher?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!filters.grade || grade === filters.grade) &&
      (!filters.section || section === filters.section) &&
      (!filters.studentId ||
        String(result.studentId) === String(filters.studentId)) &&
      (!filters.subject || result.subject === filters.subject) &&
      (!filters.exam || result.exam === filters.exam) &&
      (!filters.session || result.session === filters.session) &&
      (!search || searchText.includes(search.trim().toLowerCase()))
    );
  });

  function setFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "grade" ? { studentId: "" } : {}),
      ...(key === "section" ? { studentId: "" } : {}),
    }));
    setMessage("");
  }

  function openResult(result) {
    setSelectedResult(result);
    setForm({
      marks: result.marks ?? "",
      total: result.total ?? "",
      remarks: result.remarks || "",
      session: result.session || "",
    });
    setMessage("");
  }

  function closeResult() {
    setSelectedResult(null);
    setForm(null);
  }

  function saveCorrection(event) {
    event.preventDefault();

    if (!selectedResult || !form) {
      return;
    }

    school.results.update(selectedResult.id, {
      marks: form.marks,
      total: form.total,
      remarks: form.remarks,
      session: form.session,
    });
    closeResult();
    setMessage("Result correction saved.");
  }

  return (
    <section className="results-module">
      <div className="module-head">
        <div>
          <span className="eyebrow">SCHOOL ACADEMICS</span>
          <h1>Marks &amp; Results</h1>
          <p>View and correct results shared across the school.</p>
        </div>
        <span className="result-count" role="status">
          {filteredResults.length} of {school.results.items.length} results
        </span>
      </div>

      <section className="panel results-filter-panel" aria-label="Result filters">
        <label className="results-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search results</span>
          <input
            type="search"
            placeholder="Search student, subject, exam or teacher"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Class
          <select
            value={filters.grade}
            onChange={(event) => setFilter("grade", event.target.value)}
          >
            <option value="">All classes</option>
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>
        <label>
          Section
          <select
            value={filters.section}
            onChange={(event) => setFilter("section", event.target.value)}
          >
            <option value="">All sections</option>
            {availableSections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
        <label>
          Student
          <select
            value={filters.studentId}
            onChange={(event) => setFilter("studentId", event.target.value)}
          >
            <option value="">All students</option>
            {availableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Subject
          <select
            value={filters.subject}
            onChange={(event) => setFilter("subject", event.target.value)}
          >
            <option value="">All subjects</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label>
          Exam
          <select
            value={filters.exam}
            onChange={(event) => setFilter("exam", event.target.value)}
          >
            <option value="">All exams</option>
            {availableExams.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </label>
        <label>
          Academic year
          <select
            value={filters.session}
            onChange={(event) => setFilter("session", event.target.value)}
          >
            <option value="">All years</option>
            {availableSessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </label>
      </section>

      {message && (
        <p className="results-message" role="status">
          {message}
        </p>
      )}

      <div className="panel table-wrap results-table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Exam</th>
              <th>Marks</th>
              <th>Teacher</th>
              <th>Academic year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => {
              const student = studentsById.get(String(result.studentId));
              const teacher = teachersById.get(String(result.teacherId));

              return (
                <tr key={result.id}>
                  <td>{student?.name || "Unknown student"}</td>
                  <td>{student?.classId || "—"}</td>
                  <td>{result.subject || "—"}</td>
                  <td>{result.exam || "—"}</td>
                  <td>
                    {result.marks ?? "—"} / {result.total ?? "—"}
                  </td>
                  <td>{teacher?.name || "Not recorded"}</td>
                  <td>{result.session || "—"}</td>
                  <td>
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => openResult(result)}
                    >
                      View / Correct
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredResults.length === 0 && (
              <tr>
                <td className="empty-cell" colSpan={8}>
                  {school.results.items.length === 0
                    ? "No results have been published yet."
                    : "No results match these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedResult && form && (
        <div className="results-modal-shade">
          <section
            className="results-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="results-modal-title"
          >
            <header className="results-modal-head">
              <div>
                <span className="eyebrow">RESULT RECORD</span>
                <h2 id="results-modal-title">
                  {studentsById.get(String(selectedResult.studentId))?.name ||
                    "Unknown student"}
                </h2>
              </div>
              <button
                type="button"
                className="results-modal-close"
                aria-label="Close result"
                onClick={closeResult}
              >
                <X size={20} />
              </button>
            </header>

            <div className="results-record-details">
              <p>
                <strong>Class:</strong>{" "}
                {studentsById.get(String(selectedResult.studentId))?.classId ||
                  "—"}
              </p>
              <p>
                <strong>Subject:</strong> {selectedResult.subject || "—"}
              </p>
              <p>
                <strong>Exam:</strong> {selectedResult.exam || "—"}
              </p>
              <p>
                <strong>Teacher:</strong>{" "}
                {teachersById.get(String(selectedResult.teacherId))?.name ||
                  "Not recorded"}
              </p>
            </div>

            <form className="form-grid results-edit-form" onSubmit={saveCorrection}>
              <label>
                Marks obtained
                <input
                  type="number"
                  min="0"
                  required
                  value={form.marks}
                  onChange={(event) =>
                    setForm({ ...form, marks: event.target.value })
                  }
                />
              </label>
              <label>
                Maximum marks
                <input
                  type="number"
                  min="0"
                  required
                  value={form.total}
                  onChange={(event) =>
                    setForm({ ...form, total: event.target.value })
                  }
                />
              </label>
              <label>
                Academic year
                <select
                  value={form.session}
                  onChange={(event) =>
                    setForm({ ...form, session: event.target.value })
                  }
                >
                  {[...new Set([...availableSessions, form.session].filter(Boolean))].map(
                    (session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <label className="results-remarks-field">
                Remarks
                <textarea
                  value={form.remarks}
                  onChange={(event) =>
                    setForm({ ...form, remarks: event.target.value })
                  }
                />
              </label>
              <div className="form-actions results-form-actions">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={closeResult}
                >
                  Cancel
                </button>
                <button className="primary-btn" type="submit">
                  Save correction
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
