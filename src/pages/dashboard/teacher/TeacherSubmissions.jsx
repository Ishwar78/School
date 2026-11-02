import React, { useState } from "react";

import { Empty, Panel, Table } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import AttachmentFiles from "../shared/AttachmentFiles";
import {
  SECTION_OPTIONS,
  SUBMISSION_STATUS_OPTIONS,
} from "../shared/schoolOptions";

export default function TeacherSubmissions({ view }) {
  const { s, assignments, subs, name } = view;
  const [selectedId, setSelectedId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [marks, setMarks] = useState("");
  const [reviewError, setReviewError] = useState("");

  const selectedSubmission = subs.find(
    (submission) => String(submission.id) === String(selectedId),
  );
  const assignment = selectedSubmission
    ? assignments.find(
        (item) => String(item.id) === String(selectedSubmission.assignmentId),
      )
    : null;
  const relatedAssignment = (submission) =>
    assignments.find(
      (item) => String(item.id) === String(submission.assignmentId),
    );
  const filters = [
    {
      key: "assignmentId",
      label: "Assignment",
      includeDynamic: true,
      value: (submission) => relatedAssignment(submission)?.title,
    },
    {
      key: "classId",
      label: "Class",
      includeDynamic: true,
      value: (submission) => relatedAssignment(submission)?.classId,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (submission) =>
        String(relatedAssignment(submission)?.classId || "").split("-")[1],
    },
    {
      key: "studentId",
      label: "Student",
      includeDynamic: true,
      value: (submission) => name(submission.studentId),
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
  const filterState = useDashboardFilters(subs, filters, [
    "content",
    "date",
    "status",
    { value: (submission) => name(submission.studentId) },
    { value: (submission) => relatedAssignment(submission)?.title },
  ]);

  if (!view.can("reviewSubmissions")) {
    return <Empty>Your account does not have permission to review submissions.</Empty>;
  }

  function openSubmission(submission) {
    if (
      !view.can("reviewSubmissions") ||
      !subs.some((item) => String(item.id) === String(submission.id))
    ) {
      setReviewError("You do not have permission to review this submission.");
      return;
    }
    setSelectedId(submission.id);
    setFeedback(submission.feedback || "");
    setMarks(
      submission.marks === undefined || submission.marks === null
        ? ""
        : String(submission.marks),
    );
    setReviewError("");
  }

  function saveReview(status) {
    if (!view.can("reviewSubmissions")) {
      setReviewError("You do not have permission to review submissions.");
      return;
    }
    if (
      !selectedSubmission ||
      !assignment ||
      !subs.some((item) => String(item.id) === String(selectedSubmission.id))
    ) {
      setReviewError("This submission is outside your authorised assignments.");
      return;
    }
    const normalizedMarks = marks.trim() === "" ? "" : Number(marks);
    if (normalizedMarks !== "") {
      const maximum = Number(assignment.maxMarks);
      if (!Number.isFinite(maximum) || maximum <= 0) {
        setReviewError(
          "Set a valid maximum mark on the assignment before entering marks.",
        );
        return;
      }
      if (
        !Number.isFinite(normalizedMarks) ||
        normalizedMarks < 0 ||
        normalizedMarks > maximum
      ) {
        setReviewError(`Marks must be between 0 and ${maximum}.`);
        return;
      }
    }

    try {
      s.submissions.reviewForTeacher(
        selectedSubmission.id,
        {
          feedback: feedback.trim(),
          marks: normalizedMarks,
          status,
          reviewedAt: new Date().toISOString(),
        },
        view.teacher,
        assignments,
        s.students.items,
      );
      setSelectedId("");
    } catch (error) {
      setReviewError(error.message || "Unable to save this review.");
    }
  }

  const latestAttempt =
    selectedSubmission?.attempts?.[selectedSubmission.attempts.length - 1];
  const latestFiles =
    latestAttempt?.attachments ||
    selectedSubmission?.attachments ||
    [];

  return (
    <>
      <Panel title="Review student submissions">
        <DashboardFilters state={filterState} filters={filters} items={subs} />
        {filterState.filteredItems.length ? (
          <Table
            headers={["Student", "Assignment", "Class", "Submission date", "Status", "Marks", "Actions"]}
            rows={filterState.filteredItems.map((submission) => {
              const item = relatedAssignment(submission);
              return [
                name(submission.studentId),
                item?.title || "Assignment unavailable",
                item?.classId || "—",
                submission.date || "—",
                submission.status || "Submitted",
                submission.marks === "" || submission.marks == null
                  ? "—"
                  : `${submission.marks} / ${item?.maxMarks ?? "—"}`,
                <button
                  type="button"
                  className="role-primary"
                  onClick={() => openSubmission(submission)}
                >
                  View Submission
                </button>,
              ];
            })}
          />
        ) : (
          <p className="role-empty">{subs.length ? "No submissions match the current filters." : "No student submissions have been received yet."}</p>
        )}
      </Panel>

      {selectedSubmission && (
        <div
          className="submission-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId("");
          }}
        >
          <section
            className="submission-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-modal-title"
          >
            <header className="submission-modal-header">
              <div>
                <span className="submission-modal-kicker">
                  {latestAttempt ? `LATEST ATTEMPT ${selectedSubmission.attempts.length}` : "STUDENT SUBMISSION"}
                </span>
                <h2 id="submission-modal-title">
                  {assignment?.title || "Assignment unavailable"}
                </h2>
              </div>
              <button
                className="submission-modal-close"
                type="button"
                aria-label="Close submission"
                onClick={() => setSelectedId("")}
              >
                ×
              </button>
            </header>

            <div className="submission-modal-details">
              <div><span>Student</span><strong>{name(selectedSubmission.studentId)}</strong></div>
              <div><span>Class</span><strong>{assignment?.classId || "—"}</strong></div>
              <div><span>Submitted</span><strong>{selectedSubmission.date || "Not specified"}</strong></div>
              <div><span>Status</span><strong>{selectedSubmission.status || "Submitted"}</strong></div>
              <div><span>Review</span><strong>{selectedSubmission.status === "Checked" ? "Reviewed" : "Unreviewed"}</strong></div>
              <div><span>Attempt</span><strong>{selectedSubmission.attempts?.length || 1}</strong></div>
            </div>

            {assignment && (
              <div className="submission-assignment-description">
                <h3>Assignment instructions</h3>
                <p>{assignment.description || "No instructions provided."}</p>
                {assignment.submissionInstructions && <p><b>Submission instructions:</b> {assignment.submissionInstructions}</p>}
                <p><b>Maximum marks:</b> {assignment.maxMarks}</p>
              </div>
            )}

            <div className="submission-answer">
              <h3>Written answer</h3>
              <p>{latestAttempt?.content ?? selectedSubmission.content ?? "No written answer was submitted."}</p>
            </div>
            <AttachmentFiles files={latestFiles} title="Submitted files" />

            <form
              className="role-form submission-review-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveReview("Checked");
              }}
            >
              <h3 className="wide">Teacher feedback and grading</h3>
              <label className="wide">
                Feedback
                <textarea
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Write feedback for the student"
                />
              </label>
              <label>
                Marks (maximum {assignment?.maxMarks ?? "not set"})
                <input
                  type="number"
                  min="0"
                  max={assignment?.maxMarks}
                  step="any"
                  value={marks}
                  onChange={(event) => setMarks(event.target.value)}
                  placeholder="Optional"
                />
              </label>
              {reviewError && <p className="attachment-error wide" role="alert">{reviewError}</p>}
              <div className="submission-review-actions wide">
                <button className="role-primary" type="submit">Mark as Checked</button>
                <button className="role-secondary" type="button" onClick={() => saveReview("Resubmit")}>
                  Request resubmission
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
