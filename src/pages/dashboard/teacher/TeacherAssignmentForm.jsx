import React from "react";

import { Panel } from "../shared/UI";
import AttachmentFiles from "../shared/AttachmentFiles";
import { formatFileSize } from "../shared/assignmentFiles";
import { today } from "../shared/school";
import { SECTION_OPTIONS } from "../shared/schoolOptions";

export default function TeacherAssignmentForm({
  editingId,
  form,
  setForm,
  subjects,
  assigned,
  ids,
  selectedFiles,
  setSelectedFiles,
  fileError,
  formError,
  saving,
  onSubmit,
  onSelectFiles,
  onReset,
}) {
  return (
    <Panel
      title={editingId ? "Edit assignment" : "Create assignment"}
      subtitle="Only your assigned classes and subjects are available. Attachments are stored in this browser for development and are not synced to other devices."
    >
      <form className="role-form assignment-form" onSubmit={onSubmit}>
        <label>
          Assignment title
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>
        <label>
          Subject
          <select
            required
            value={form.subject}
            onChange={(event) =>
              setForm({ ...form, subject: event.target.value })
            }
          >
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label>
          Class
          <select
            required
            value={form.classId}
            onChange={(event) =>
              setForm({
                ...form,
                classId: event.target.value,
                section: event.target.value.split("-")[1] || "",
              })
            }
          >
            <option value="">Select class</option>
            {assigned.map((schoolClass) => (
              <option
                key={schoolClass.id}
                value={
                  ids.find((id) => id === schoolClass.id) ||
                  schoolClass.classId ||
                  `${schoolClass.grade}-${schoolClass.section}`
                }
              >
                {schoolClass.classId ||
                  `${schoolClass.grade}-${schoolClass.section}` ||
                  schoolClass.id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Section
          <select
            required
            value={form.section}
            onChange={(event) => {
              const grade = form.classId.split("-")[0];
              const classId = `${grade}-${event.target.value}`;
              if (ids.includes(classId)) {
                setForm({
                  ...form,
                  classId,
                  section: event.target.value,
                });
              }
            }}
          >
            <option value="">Select section</option>
            {SECTION_OPTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
        <label>
          Creation date
          <input
            type="date"
            required
            max={today()}
            value={form.created}
            onChange={(event) =>
              setForm({ ...form, created: event.target.value })
            }
          />
        </label>
        <label>
          Due date
          <input
            type="date"
            required
            min={form.created}
            value={form.due}
            onChange={(event) => setForm({ ...form, due: event.target.value })}
          />
        </label>
        <label>
          Maximum marks
          <input
            type="number"
            required
            min="1"
            step="any"
            value={form.maxMarks}
            onChange={(event) =>
              setForm({ ...form, maxMarks: event.target.value })
            }
          />
        </label>
        <label className="wide">
          Detailed instructions
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        <label className="wide">
          Submission instructions (optional)
          <textarea
            value={form.submissionInstructions}
            onChange={(event) =>
              setForm({
                ...form,
                submissionInstructions: event.target.value,
              })
            }
          />
        </label>
        <label className="wide">
          Supporting files (PDF, Office documents, JPG, PNG, TXT; max 5 files,
          10 MB each)
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
            onChange={onSelectFiles}
          />
        </label>
        {(form.attachments || []).length > 0 && (
          <div className="wide">
            <AttachmentFiles
              files={form.attachments}
              title="Existing supporting files"
            />
          </div>
        )}
        {(form.attachments || []).length > 0 && (
          <div className="wide selected-file-list">
            <strong>Saved assignment files</strong>
            {form.attachments.map((file) => (
              <div key={file.id || file.storageRef}>
                <span>
                  {file.filename} · {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  className="role-secondary"
                  onClick={() =>
                    setForm({
                      ...form,
                      attachments: form.attachments.filter(
                        (item) => item.storageRef !== file.storageRef,
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        {selectedFiles.length > 0 && (
          <div className="wide selected-file-list">
            <strong>New files</strong>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                <span>
                  {file.name} · {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  className="role-secondary"
                  onClick={() =>
                    setSelectedFiles(
                      selectedFiles.filter((_, fileIndex) => fileIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        {fileError && (
          <p className="attachment-error wide" role="alert">
            {fileError}
          </p>
        )}
        {formError && (
          <p className="attachment-error wide" role="alert">
            {formError}
          </p>
        )}
        <div className="role-actions wide">
          <button
            className="role-primary"
            disabled={saving || !ids.length || !subjects.length}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Create assignment"}
          </button>
          {editingId && (
            <button
              type="button"
              className="role-secondary"
              onClick={onReset}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </Panel>
  );
}
