import React, { useState } from "react";

import { Panel } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import AttachmentFiles from "../shared/AttachmentFiles";
import {
  formatFileSize,
  saveLocalFiles,
  validateFiles,
} from "../shared/assignmentFiles";
import { today } from "../shared/school";
import { SUBMISSION_STATUS_OPTIONS } from "../shared/schoolOptions";

export default function StudentAssignments({ view }) {
  const { s, student, teacher, a, submission } = view;
  const [answers, setAnswers] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [keptFiles, setKeptFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [savingId, setSavingId] = useState("");

  const assignmentStatus = (assignment) =>
    submission(assignment.id)?.status || "Pending";
  const filters = [
    { key: "subject", label: "Subject", includeDynamic: true },
    {
      key: "status",
      label: "Status",
      options: SUBMISSION_STATUS_OPTIONS,
      value: assignmentStatus,
    },
    { key: "due", label: "Due date", type: "date" },
  ];
  const filterState = useDashboardFilters(a, filters, [
    "title",
    "subject",
    "description",
    "due",
    { value: assignmentStatus },
  ]);

  function currentFiles(assignmentId, sub) {
    if (keptFiles[assignmentId]) return keptFiles[assignmentId];
    const latest = sub?.attempts?.[sub.attempts.length - 1];
    return latest?.attachments || sub?.attachments || [];
  }

  function chooseFiles(event, assignmentId, sub) {
    const files = [...event.target.files];
    const existingCount = currentFiles(assignmentId, sub).length;
    const error = validateFiles(files, existingCount);
    setErrors((current) => ({ ...current, [assignmentId]: error }));
    if (!error) {
      setSelectedFiles((current) => ({
        ...current,
        [assignmentId]: [...(current[assignmentId] || []), ...files],
      }));
    }
    event.target.value = "";
  }

  async function submitWork(event, assignment, existing) {
    event.preventDefault();
    const answer = (answers[assignment.id] || "").trim();
    const attached = selectedFiles[assignment.id] || [];
    const retained = currentFiles(assignment.id, existing);

    if (!answer && !attached.length && !retained.length) {
      setErrors((current) => ({
        ...current,
        [assignment.id]: "Enter a written answer or attach at least one file.",
      }));
      return;
    }
    if (existing && existing.status !== "Resubmit") {
      setErrors((current) => ({
        ...current,
        [assignment.id]: "This assignment has already been submitted.",
      }));
      return;
    }

    setSavingId(assignment.id);
    setErrors((current) => ({ ...current, [assignment.id]: "" }));
    try {
      const submissionId = existing?.id || crypto.randomUUID();
      const uploaded = await saveLocalFiles(attached, {
        assignmentId: assignment.id,
        submissionId,
        uploadedBy: student.id,
      });
      const date = today();
      const attachments = [...retained, ...uploaded];
      const currentAttempt = {
        content: answer,
        attachments,
        date,
        feedback: "",
        marks: "",
        status: "Submitted",
      };
      const attemptsBeforeLatest = existing
        ? [...(existing.attempts || [])]
        : [];
      if (existing) {
        const reviewedAttempt = {
          content: existing.content || "",
          attachments: existing.attachments || [],
          date: existing.date || "",
          feedback: existing.feedback || "",
          marks: existing.marks ?? "",
          status: existing.status || "Submitted",
        };
        if (attemptsBeforeLatest.length) {
          attemptsBeforeLatest[attemptsBeforeLatest.length - 1] =
            reviewedAttempt;
        } else {
          attemptsBeforeLatest.push(reviewedAttempt);
        }
      }
      const attempts = [...attemptsBeforeLatest, currentAttempt];
      const changes = {
        assignmentId: assignment.id,
        studentId: student.id,
        content: answer,
        attachments,
        date,
        status: "Submitted",
        feedback: "",
        marks: "",
        reviewedAt: "",
        reviewedBy: "",
        attempts,
        latestAttempt: attempts.length,
      };

      if (existing) {
        s.submissions.update(existing.id, changes);
      } else {
        s.submissions.add({ ...changes, id: submissionId });
      }
      setAnswers((current) => ({ ...current, [assignment.id]: "" }));
      setSelectedFiles((current) => ({ ...current, [assignment.id]: [] }));
      setKeptFiles((current) => ({ ...current, [assignment.id]: attachments }));
    } catch (error) {
      console.error("Unable to save student submission files.", error);
      setErrors((current) => ({
        ...current,
        [assignment.id]: error.message || "Unable to save your submission.",
      }));
    } finally {
      setSavingId("");
    }
  }

  return (
    <Panel
      title="My homework"
      subtitle="Files are stored in this browser for development and are not synced to other devices."
    >
      <DashboardFilters state={filterState} filters={filters} items={a} />
      {filterState.filteredItems.length ? (
        filterState.filteredItems.map((assignment) => {
          const sub = submission(assignment.id);
          const canSubmit = !sub || sub.status === "Resubmit";
          const attachments = currentFiles(assignment.id, sub);
          const chosen = selectedFiles[assignment.id] || [];

          return (
            <article className="role-list homework-card" key={assignment.id}>
              <strong>{assignment.title} · {assignment.subject}</strong>
              <small>
                {teacher(assignment.teacherId)} · {assignment.classId} · Due {assignment.due} ·{" "}
                <span className={`homework-status status-${(sub?.status || "Pending").toLowerCase()}`}>
                  {sub?.status || "Pending"}
                </span>
              </small>
              <div className="submission-assignment-description">
                <h3>Assignment instructions</h3>
                <p>{assignment.description || "No instructions provided."}</p>
                {assignment.submissionInstructions && (
                  <p><b>Submission instructions:</b> {assignment.submissionInstructions}</p>
                )}
                <p><b>Maximum marks:</b> {assignment.maxMarks ?? "Not specified"}</p>
              </div>
              <AttachmentFiles files={assignment.attachments} title="Teacher's supporting files" />

              {sub && (
                <div className="student-review-summary">
                  <p><b>Current submission:</b> {sub.content || "File submission"}</p>
                  <p><b>Submitted:</b> {sub.date || "Not specified"}</p>
                  <p><b>Teacher feedback:</b> {sub.feedback || "No feedback yet."}</p>
                  <p><b>Marks:</b> {sub.marks === "" || sub.marks == null ? "Not graded" : `${sub.marks} / ${assignment.maxMarks}`}</p>
                  <AttachmentFiles files={sub.attachments || []} title="Your submitted files" />
                  {sub.attempts?.length > 1 && (
                    <details className="submission-attempt-history">
                      <summary>Previous attempts ({sub.attempts.length - 1})</summary>
                      {sub.attempts.slice(0, -1).map((attempt, index) => (
                        <div key={`${attempt.date}-${index}`}>
                          <p><b>Attempt {index + 1} · {attempt.date}</b> · {attempt.status}</p>
                          <p>{attempt.content || "File-only submission"}</p>
                          {attempt.feedback && <p><b>Teacher feedback:</b> {attempt.feedback}</p>}
                          {attempt.marks !== "" && attempt.marks != null && <p><b>Marks:</b> {attempt.marks} / {assignment.maxMarks}</p>}
                          <AttachmentFiles files={attempt.attachments} title="Files in this attempt" />
                        </div>
                      ))}
                    </details>
                  )}
                </div>
              )}

              {canSubmit ? (
                <form className="role-form student-submission-form" onSubmit={(event) => submitWork(event, assignment, sub)}>
                  <label className="wide">
                    {sub ? "Revised answer" : "Your answer"}
                    <textarea
                      value={answers[assignment.id] || ""}
                      onChange={(event) => setAnswers({ ...answers, [assignment.id]: event.target.value })}
                      placeholder="Type your answer here (optional when attaching a file)"
                    />
                  </label>
                  {attachments.length > 0 && (
                    <div className="wide selected-file-list">
                      <strong>Files carried into this submission</strong>
                      {attachments.map((file) => (
                        <div key={file.id || file.storageRef}>
                          <span>{file.filename} · {formatFileSize(file.size)}</span>
                          <button
                            type="button"
                            className="role-secondary"
                            onClick={() => setKeptFiles({
                              ...keptFiles,
                              [assignment.id]: attachments.filter((item) => item.storageRef !== file.storageRef),
                            })}
                          >
                            Remove from new attempt
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="wide">
                    Attach files (PDF, DOC/DOCX, PPT/PPTX, JPG/JPEG, PNG, TXT; max 5 files, 10 MB each)
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                      onChange={(event) => chooseFiles(event, assignment.id, sub)}
                    />
                  </label>
                  {chosen.length > 0 && (
                    <div className="wide selected-file-list">
                      <strong>New files</strong>
                      {chosen.map((file, index) => (
                        <div key={`${file.name}-${index}`}>
                          <span>{file.name} · {formatFileSize(file.size)}</span>
                          <button type="button" className="role-secondary" onClick={() => setSelectedFiles({ ...selectedFiles, [assignment.id]: chosen.filter((_, fileIndex) => fileIndex !== index) })}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors[assignment.id] && <p className="attachment-error wide" role="alert">{errors[assignment.id]}</p>}
                  <button className="role-primary" disabled={savingId === assignment.id}>
                    {savingId === assignment.id ? "Saving..." : sub ? "Resubmit homework" : "Submit homework"}
                  </button>
                </form>
              ) : (
                <p className="role-note">Your work is saved. You can submit again if your teacher requests resubmission.</p>
              )}
            </article>
          );
        })
      ) : (
        <p className="role-empty">{a.length ? "No assignments match the current filters." : "No assignments for your class yet."}</p>
      )}
    </Panel>
  );
}
