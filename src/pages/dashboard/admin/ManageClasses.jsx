import React, { useState } from "react";
import RecordManager from "./RecordManager";
const CLASS_GRADE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SECTION_OPTIONS = ["A", "B", "C", "D"];

const initialClasses = [
  { id: "cls-1", grade: "10", section: "A", teacherName: "Ananya Gupta", studentCount: 38, room: "Room 201" },
  { id: "cls-2", grade: "10", section: "B", teacherName: "Sunita Mehra", studentCount: 36, room: "Room 202" },
  { id: "cls-3", grade: "9", section: "A", teacherName: "Dr. Rajesh Kumar", studentCount: 40, room: "Room 105" },
  { id: "cls-4", grade: "11", section: "A", teacherName: "Praveen Sharma", studentCount: 32, room: "Lab 3" },
  { id: "cls-5", grade: "12", section: "A", teacherName: "Meenakshi Joshi", studentCount: 30, room: "Lab 1" },
];

export default function ManageClasses() {
  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_classes");
      return saved ? JSON.parse(saved) : initialClasses;
    } catch {
      return initialClasses;
    }
  });

  const saveClasses = (updater) => {
    setClasses((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_classes", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    {
      key: "grade",
      label: "Grade / Class",
      type: "select",
      options: CLASS_GRADE_OPTIONS,
      required: true,
    },
    {
      key: "section",
      label: "Section",
      type: "select",
      options: SECTION_OPTIONS,
      required: true,
    },
    {
      key: "teacherName",
      label: "Class Teacher",
      required: true,
    },
    {
      key: "room",
      label: "Classroom / Room No",
    },
    {
      key: "studentCount",
      label: "Enrolled Students",
      type: "number",
      default: 35,
    },
  ];

  const data = {
    items: classes,
    add: (record) =>
      saveClasses((prev) => [
        { ...record, id: "cls-" + Date.now() },
        ...prev,
      ]),
    update: (id, updateFields) =>
      saveClasses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updateFields } : c)),
      ),
    remove: (id) =>
      saveClasses((prev) => prev.filter((c) => c.id !== id)),
  };

  const classFilters = [
    { key: "grade", label: "Grade", options: CLASS_GRADE_OPTIONS },
    { key: "section", label: "Section", options: SECTION_OPTIONS },
  ];

  return (
    <RecordManager
      title="Class Management"
      description="Add, edit and manage academic classes, sections and assigned class teachers."
      data={data}
      fields={fields}
      filters={classFilters}
      getLabel={(c) => `Class ${c.grade}-${c.section}`}
    />
  );
}
