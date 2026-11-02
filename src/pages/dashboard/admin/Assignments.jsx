import React, { useState } from "react";
import RecordManager from "./RecordManager";
const CLASS_OPTIONS = [
  "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B",
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
  "11-A", "11-B", "12-A", "12-B"
];
const SUBJECT_OPTIONS = [
  "Mathematics", "English", "Science", "Physics", "Chemistry", "Biology", "Social Studies", "Hindi", "Computer Science", "Physical Education"
];

const initialAssignments = [
  {
    id: "asg-1",
    title: "Thermodynamics Numerical Problems",
    subject: "Physics",
    classId: "10-A",
    teacherName: "Dr. Rajesh Kumar",
    due: "2026-11-10",
    maxMarks: 25,
    description: "Solve problems 1 to 15 from Chapter 4 of the NCERT textbook.",
  },
  {
    id: "asg-2",
    title: "Quadratic Equations Worksheet",
    subject: "Mathematics",
    classId: "10-A",
    teacherName: "Ananya Gupta",
    due: "2026-11-08",
    maxMarks: 20,
    description: "Complete all questions from Worksheet 3.2.",
  },
  {
    id: "asg-3",
    title: "Essay: The Role of Technology in Education",
    subject: "English",
    classId: "9-A",
    teacherName: "Sunita Mehra",
    due: "2026-11-12",
    maxMarks: 15,
    description: "Write an argumentative essay of 300-350 words.",
  },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_assignments");
      return saved ? JSON.parse(saved) : initialAssignments;
    } catch {
      return initialAssignments;
    }
  });

  const saveAssignments = (updater) => {
    setAssignments((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_assignments", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    { key: "title", label: "Assignment Title", required: true },
    {
      key: "subject",
      label: "Subject",
      type: "select",
      options: SUBJECT_OPTIONS,
      required: true,
    },
    {
      key: "classId",
      label: "Target Class",
      type: "select",
      options: CLASS_OPTIONS,
      required: true,
    },
    {
      key: "teacherName",
      label: "Assigning Teacher",
      required: true,
    },
    { key: "due", label: "Due Date", type: "date", required: true },
    {
      key: "maxMarks",
      label: "Max Marks",
      type: "number",
      default: 20,
    },
    {
      key: "description",
      label: "Instructions / Description",
      type: "textarea",
      table: false,
    },
  ];

  const data = {
    items: assignments,
    add: (record) =>
      saveAssignments((prev) => [
        { ...record, id: "asg-" + Date.now() },
        ...prev,
      ]),
    update: (id, updateFields) =>
      saveAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updateFields } : a)),
      ),
    remove: (id) =>
      saveAssignments((prev) => prev.filter((a) => a.id !== id)),
  };

  const filters = [
    { key: "classId", label: "Class", options: CLASS_OPTIONS },
    { key: "subject", label: "Subject", options: SUBJECT_OPTIONS },
  ];

  return (
    <RecordManager
      title="Assignments & Homework"
      description="Monitor classwork and homework assignments by class, teacher, subject and deadline."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(a) => `${a.title} (${a.classId})`}
    />
  );
}
