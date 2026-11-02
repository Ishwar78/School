import { assignmentFilters } from "./moduleFilters";

import React from "react";

import { useAssignment } from "../../../context/AssignmentContext";
import { useTeacher } from "../../../context/TeacherContext";

import RecordManager from "./RecordManager";
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from "../shared/schoolOptions";

export default function Assignments() {
  const { data } = useAssignment();
  const { data: teachers } = useTeacher();

  const fields = [
    { key: "title", label: "Title", required: true },
    {
      key: "subject",
      label: "Subject",
      type: "select",
      options: SUBJECT_OPTIONS,
      includeDynamic: true,
      required: true,
    },
    {
      key: "classId",
      label: "Class",
      type: "select",
      options: CLASS_OPTIONS,
      includeDynamic: true,
      required: true,
    },
    {
      key: "teacherId",
      label: "Teacher",
      type: "select",
      emptyMessage: "Add a teacher record before selecting a teacher.",
      options: teachers.items.map((t) => ({ value: t.id, label: t.name })),
      display: (id) => teachers.items.find((t) => t.id === id)?.name || "—",
    },
    { key: "due", label: "Due Date", type: "date", required: true },
    {
      key: "maxMarks",
      label: "Maximum Marks",
      type: "number",
      min: 1,
      table: false,
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      table: false,
    },
    {
      key: "submissionInstructions",
      label: "Submission Instructions",
      type: "textarea",
      table: false,
    },
  ];

  const filters = assignmentFilters.map((filter) =>
    filter.key === "teacherId"
      ? {
          ...filter,
          options: teachers.items.map((teacher) => ({
            value: teacher.id,
            label: teacher.name,
          })),
          includeDynamic: true,
        }
      : filter,
  );

  return (
    <RecordManager
      title="Assignments"
      description="Monitor homework by class, teacher, subject and deadline. Teachers will use the same shared records."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(item) => item.title}
    />
  );
}
