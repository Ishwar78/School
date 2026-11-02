import React, { useMemo, useState } from "react";

import { Panel, Table } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import {
  deleteLocalFile,
  saveLocalFiles,
  validateFiles,
} from "../shared/assignmentFiles";
import { today } from "../shared/school";
import { getTeacherSubjects } from "../shared/school";
import { SECTION_OPTIONS } from "../shared/schoolOptions";
import TeacherAssignmentForm from "./TeacherAssignmentForm";
import AssignmentProgressModal from "./AssignmentProgressModal";

const emptyForm = {
  title: "",
  subject: "",
  classId: "",
  section: "",
  description: "",
  created: today(),
  due: "",
  maxMarks: "100",
  submissionInstructions: "",
};

export default function TeacherAssignments({ view }) {
  const { s, teacher, assigned, ids, students, assignments, subs, name } = view;
  const canCreate = view.can("createAssignments");
  const canEdit = view.can("editOwnAssignments");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const subjects = useMemo(
    () =>
      [
        ...getTeacherSubjects(teacher),
      ].filter((subject, index, all) => all.indexOf(subject) === index),
    [teacher],
  );

  function getStats(assignment) {
    const eligible = students.filter(
      (student) => String(student.classId) === String(assignment.classId),
    );
    const linked = subs.filter(
      (submission) =>
        String(submission.assignmentId) === String(assignment.id) &&
        eligible.some(
          (student) => String(student.id) === String(submission.studentId),
        ),
    );
    const latestByStudent = new Map(
      linked.map((submission) => [String(submission.studentId), submission]),
    );
    const latestSubmissions = [...latestByStudent.values()];
    const submittedIds = new Set(latestByStudent.keys());

    return {
      eligible,
      submitted: submittedIds.size,
      missing: eligible.filter(
        (student) => !submittedIds.has(String(student.id)),
      ),
      checked: latestSubmissions.filter(
        (submission) => submission.status === "Checked",
      ).length,
      resubmit: latestSubmissions.filter(
        (submission) => submission.status === "Resubmit",
      ).length,
    };
  }

  const assignmentStatus = (assignment) =>
    assignment.due && assignment.due < today() ? "Overdue" : "Active";
  const filters = [
    { key: "classId", label: "Class", options: ids },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (assignment) =>
        assignment.section || String(assignment.classId || "").split("-")[1],
    },
    {
      key: "subject",
      label: "Subject",
      options: subjects,
      includeDynamic: true,
    },
    {
      key: "status",
      label: "Assignment status",
      options: ["Active", "Overdue"],
      value: assignmentStatus,
    },
    { key: "due", label: "Due date", type: "date" },
  ];
  const filterState = useDashboardFilters(assignments, filters, [
    "title",
    "subject",
  ]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
    setSelectedFiles([]);
    setFileError("");
    setFormError("");
  }

  function editAssignment(assignment) {
    if (
      !canEdit ||
      String(assignment.teacherId) !== String(teacher?.id) ||
      !assignments.some((item) => String(item.id) === String(assignment.id))
    ) {
      setFormError("You do not have permission to edit this assignment.");
      return;
    }
    setForm({
      ...emptyForm,
      ...assignment,
      created: assignment.created || today(),
      maxMarks: String(assignment.maxMarks ?? 100),
      submissionInstructions: assignment.submissionInstructions || "",
      attachments: [...(assignment.attachments || [])],
    });
    setEditingId(assignment.id);
    setSelectedFiles([]);
    setFormError("");
    setFileError("");
  }

  function selectFiles(event) {
    const files = [...event.target.files];
    const currentCount = (form.attachments || []).length + selectedFiles.length;
    const error = validateFiles(files, currentCount);
    setFileError(error);
    if (!error) setSelectedFiles((current) => [...current, ...files]);
    event.target.value = "";
  }

  async function saveAssignment(event) {
    event.preventDefault();
    if ((editingId && !canEdit) || (!editingId && !canCreate)) {
      setFormError("You do not have permission to save this assignment.");
      return;
    }
    const title = form.title.trim();
    const marks = Number(form.maxMarks);

    if (!title) return setFormError("Enter an assignment title.");
    if (!form.classId || !ids.includes(String(form.classId))) {
      return setFormError("Choose a class assigned to you.");
    }
    if (!subjects.includes(form.subject)) {
      return setFormError("Choose a subject assigned to you.");
    }
    if (!form.created || !form.due || form.due < form.created) {
      return setFormError(
        "The due date must be the same as or later than the creation date.",
      );
    }
    if (form.created > today()) {
      return setFormError("The creation date cannot be in the future.");
    }
    if (!Number.isFinite(marks) || marks <= 0) {
      return setFormError("Maximum marks must be a number greater than zero.");
    }

    const awardedMarks = subs
      .filter(
        (submission) =>
          String(submission.assignmentId) === String(editingId),
      )
      .flatMap((submission) => [
        submission.marks,
        ...(submission.attempts || []).map((attempt) => attempt.marks),
      ])
      .filter(
        (value) =>
          value !== "" && value != null && Number.isFinite(Number(value)),
      )
      .map(Number);
    const highestAwardedMark = Math.max(0, ...awardedMarks);
    if (editingId && marks < highestAwardedMark) {
      return setFormError(
        `Maximum marks cannot be lower than the ${highestAwardedMark} marks already awarded.`,
      );
    }
    if (!form.description.trim()) {
      return setFormError("Enter the assignment instructions.");
    }

    setSaving(true);
    setFormError("");
    try {
      const assignmentId = editingId || crypto.randomUUID();
      const newAttachments = await saveLocalFiles(selectedFiles, {
        assignmentId,
        uploadedBy: teacher.id,
      });
      const previous = assignments.find(
        (assignment) => String(assignment.id) === String(editingId),
      );
      const oldAttachments = previous?.attachments || [];
      const nextAttachments = [...(form.attachments || []), ...newAttachments];
      const changes = {
        ...form,
        title,
        maxMarks: marks,
        section: form.classId.split("-")[1] || "",
        teacherId: teacher.id,
        attachments: nextAttachments,
      };

      if (previous) {
        s.assignments.updateForTeacher(editingId, changes, teacher);
        const retainedRefs = new Set(
          nextAttachments.map((file) => file.storageRef),
        );
        await Promise.all(
          oldAttachments
            .filter((file) => !retainedRefs.has(file.storageRef))
            .map((file) => deleteLocalFile(file.storageRef)),
        );
      } else {
        s.assignments.addForTeacher(
          { ...changes, id: assignmentId },
          teacher,
        );
      }
      resetForm();
    } catch (error) {
      console.error("Unable to save assignment attachments.", error);
      setFormError(error.message || "Unable to save the assignment.");
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(assignment) {
    if (
      !canEdit ||
      String(assignment.teacherId) !== String(teacher?.id) ||
      !assignments.some((item) => String(item.id) === String(assignment.id))
    ) {
      setFormError("You do not have permission to delete this assignment.");
      return;
    }
    if (
      !window.confirm(
        `Delete "${assignment.title}"? Existing student submissions will be kept.`,
      )
    ) {
      return;
    }

    try {
      s.assignments.removeForTeacher(assignment.id, teacher);
    } catch (error) {
      setFormError(error.message || "Unable to delete this assignment.");
      return;
    }
    if (String(selectedAssignment?.id) === String(assignment.id)) {
      setSelectedAssignment(null);
    }
    try {
      await Promise.all(
        (assignment.attachments || []).map((file) =>
          deleteLocalFile(file.storageRef),
        ),
      );
    } catch (error) {
      console.error(
        "Assignment was deleted but its local files could not be removed.",
        error,
      );
      setFormError(
        "The assignment was deleted, but one or more local files could not be removed.",
      );
    }
  }

  const selectedStats = selectedAssignment
    ? getStats(selectedAssignment)
    : null;

  return (
    <>
      {(canCreate || (editingId && canEdit)) && <TeacherAssignmentForm
        editingId={editingId}
        form={form}
        setForm={setForm}
        subjects={subjects}
        assigned={assigned}
        ids={ids}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        fileError={fileError}
        formError={formError}
        saving={saving}
        onSubmit={saveAssignment}
        onSelectFiles={selectFiles}
        onReset={resetForm}
      />}
      <Panel title="My assignments">
        {!canCreate && !canEdit && (
          <p className="role-note">Your account can view assignments but cannot create or edit them.</p>
        )}
        <DashboardFilters
          state={filterState}
          filters={filters}
          items={assignments}
        />
        {filterState.filteredItems.length ? (
          <Table
            headers={[
              "Assignment",
              "Subject",
              "Class",
              "Due date",
              "Submitted",
              "Status",
              "Actions",
            ]}
            rows={filterState.filteredItems.map((assignment) => {
              const stats = getStats(assignment);
              return [
                assignment.title,
                assignment.subject,
                assignment.classId,
                assignment.due,
                `${stats.submitted} / ${stats.eligible.length}`,
                assignmentStatus(assignment),
                <div className="role-actions">
                  <button
                    type="button"
                    className="role-secondary"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    View
                  </button>
                  {canEdit && <button
                    type="button"
                    className="role-secondary"
                    onClick={() => editAssignment(assignment)}
                  >
                    Edit
                  </button>}
                  {canEdit && <button
                    type="button"
                    className="role-secondary"
                    onClick={() => removeAssignment(assignment)}
                  >
                    Delete
                  </button>}
                </div>,
              ];
            })}
          />
        ) : (
          <p className="role-empty">
            {assignments.length
              ? "No assignments match your filters."
              : "You have not created any assignments yet."}
          </p>
        )}
      </Panel>
      {selectedAssignment && selectedStats && (
        <AssignmentProgressModal
          assignment={selectedAssignment}
          stats={selectedStats}
          name={name}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </>
  );
}
