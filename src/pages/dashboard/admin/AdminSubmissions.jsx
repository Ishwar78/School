import React, { useState } from "react";

import { useSubmission } from "../../../context/SubmissionContext";
import { useAssignment } from "../../../context/AssignmentContext";
import { useStudent } from "../../../context/StudentContext";
import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";
import { Table } from "../shared/UI";
import {
  SECTION_OPTIONS,
  SUBMISSION_STATUS_OPTIONS,
} from "../shared/schoolOptions";

export default function AdminSubmissions() {
  const { data: submissions } = useSubmission();
  const { data: assignments } = useAssignment();
  const { data: students } = useStudent();
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("newest");

  const assignmentFor = (submission) =>
    assignments.items.find(
      (assignment) =>
        String(assignment.id) === String(submission.assignmentId),
    );
  const studentName = (studentId) =>
    students.items.find((student) => String(student.id) === String(studentId))
      ?.name || "Unknown student";
  const filters = [
    {
      key: "classId",
      label: "Class",
      includeDynamic: true,
      value: (submission) => assignmentFor(submission)?.classId,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (submission) =>
        String(assignmentFor(submission)?.classId || "").split("-")[1],
    },
    {
      key: "assignmentId",
      label: "Assignment",
      includeDynamic: true,
      value: (submission) => assignmentFor(submission)?.title,
    },
    {
      key: "studentId",
      label: "Student",
      includeDynamic: true,
      value: (submission) => studentName(submission.studentId),
    },
    { key: "status", label: "Submission status", options: SUBMISSION_STATUS_OPTIONS },
    { key: "date", label: "Submission date", type: "date" },
    {
      key: "reviewState",
      label: "Reviewed",
      options: ["Reviewed", "Unreviewed"],
      value: (submission) =>
        submission.reviewedAt ||
        ["Checked", "Resubmit"].includes(submission.status)
          ? "Reviewed"
          : "Unreviewed",
    },
  ];
  const searchable = [
    "content",
    "date",
    "status",
    { value: (submission) => studentName(submission.studentId) },
    { value: (submission) => assignmentFor(submission)?.title },
  ];
  const filtered = applyFilters(
    submissions.items,
    search,
    filters,
    values,
    sort,
    searchable,
  );

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">SCHOOL RECORDS</span>
          <h1>Student submissions</h1>
          <p>View shared submission progress, student answers and review status across the school.</p>
        </div>
      </div>
      <FilterPanel
        search={search}
        setSearch={setSearch}
        filters={filters}
        values={values}
        setValues={setValues}
        items={submissions.items}
        count={filtered.length}
        total={submissions.items.length}
        sort={sort}
        setSort={setSort}
        searchPlaceholder="Search submissions, students or assignments..."
      />
      {filtered.length ? (
        <Table
          headers={["Student", "Assignment", "Class", "Submitted", "Status", "Marks", "Review details"]}
          rows={filtered.map((submission) => {
            const assignment = assignmentFor(submission);
            const latest =
              submission.attempts?.[submission.attempts.length - 1];
            const attachments =
              latest?.attachments || submission.attachments || [];

            return [
              studentName(submission.studentId),
              assignment?.title || "Assignment unavailable",
              assignment?.classId || "—",
              submission.date || "—",
              submission.status || "Submitted",
              submission.marks === "" || submission.marks == null
                ? "—"
                : `${submission.marks} / ${assignment?.maxMarks ?? "—"}`,
              <details className="admin-submission-details">
                <summary>Answer and review</summary>
                <p><b>Answer:</b> {latest?.content ?? submission.content ?? "No written answer."}</p>
                <p><b>Feedback:</b> {submission.feedback || "No feedback yet."}</p>
                <p><b>Files:</b> {attachments.length ? attachments.map((file) => file.filename).join(", ") : "None"}</p>
                {assignment && <p><b>Instructions:</b> {assignment.description || "None provided."}</p>}
              </details>,
            ];
          })}
        />
      ) : (
        <p className="role-empty">{submissions.items.length ? "No submissions match the current filters." : "No student submissions have been received yet."}</p>
      )}
    </section>
  );
}
