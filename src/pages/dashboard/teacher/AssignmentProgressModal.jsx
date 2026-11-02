import React from "react";

import AttachmentFiles from "../shared/AttachmentFiles";

export default function AssignmentProgressModal({
  assignment,
  stats,
  name,
  onClose,
}) {
  return (
    <div
      className="submission-modal-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <section
        className="submission-modal assignment-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-detail-title"
      >
        <header className="submission-modal-header">
          <div>
            <span className="submission-modal-kicker">ASSIGNMENT PROGRESS</span>
            <h2 id="assignment-detail-title">{assignment.title}</h2>
          </div>
          <button
            type="button"
            className="submission-modal-close"
            aria-label="Close assignment details"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="assignment-stat-grid">
          <strong>
            Total eligible <span>{stats.eligible.length}</span>
          </strong>
          <strong>
            Submitted <span>{stats.submitted}</span>
          </strong>
          <strong>
            Not submitted <span>{stats.missing.length}</span>
          </strong>
          <strong>
            Checked <span>{stats.checked}</span>
          </strong>
          <strong>
            Resubmission requested <span>{stats.resubmit}</span>
          </strong>
        </div>
        <p>
          <b>Class:</b> {assignment.classId} · <b>Due:</b> {assignment.due} ·{" "}
          <b>Maximum:</b> {assignment.maxMarks ?? "Not specified"} marks
        </p>
        <div className="submission-assignment-description">
          <h3>Instructions</h3>
          <p>{assignment.description}</p>
          {assignment.submissionInstructions && (
            <p>
              <b>Submission:</b> {assignment.submissionInstructions}
            </p>
          )}
        </div>
        <AttachmentFiles files={assignment.attachments} />
        <h3 className="missing-student-heading">
          Students who have not submitted
        </h3>
        {stats.missing.length ? (
          <ul className="missing-student-list">
            {stats.missing.map((student) => (
              <li key={student.id}>
                {name(student.id)} · {student.classId}
              </li>
            ))}
          </ul>
        ) : (
          <p className="role-empty">Every eligible student has submitted.</p>
        )}
      </section>
    </div>
  );
}
