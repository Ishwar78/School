import { classFilters } from "./moduleFilters";

import React from "react";

import { useClass } from "../../../context/ClassContext";
import { useStudent } from "../../../context/StudentContext";
import { useTeacher } from "../../../context/TeacherContext";
import { useAttendance } from "../../../context/AttendanceContext";

import RecordManager from "./RecordManager";
import { CLASS_GRADE_OPTIONS, SECTION_OPTIONS } from "../shared/schoolOptions";

export default function ManageClasses() {
  const { data } = useClass();
  const { data: students } = useStudent();
  const { data: teachers } = useTeacher();
  const { data: attendance } = useAttendance();

  const today = new Date().toLocaleDateString("en-CA");

  const fields = [
    {
      key: "grade",
      label: "Class",
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
      key: "teacherId",
      label: "Class Teacher",
      type: "select",
      emptyMessage: "Add a teacher record before assigning a class teacher.",
      options: teachers.items.map((t) => ({ value: t.id, label: t.name })),
      display: (id) =>
        teachers.items.find((t) => t.id === id)?.name || "Unassigned",
    },
  ];
  const enriched = {
    ...data,
    items: data.items.map((c) => ({
      ...c,
      studentCount: students.items.filter(
        (s) => s.classId === `${c.grade}-${c.section}`,
      ).length,
      absentCount: attendance.items.filter(
        (a) =>
          a.role === "student" &&
          a.date === today &&
          a.status === "Absent" &&
          students.items.some(
            (s) =>
              s.id === a.personId && s.classId === `${c.grade}-${c.section}`,
          ),
      ).length,
    })),
  };

  const filters = classFilters.map((filter) =>
    filter.key === "teacherId"
      ? {
          ...filter,
          options: teachers.items.map((teacher) => ({
            value: teacher.id,
            label: teacher.name,
          })),
          includeDynamic: false,
        }
      : filter,
  );

  return (
    <RecordManager
      title="Class Management"
      description="Manage sections, class teachers and daily class statistics."
      data={enriched}
      fields={fields}
      filters={filters}
      getLabel={(item) => `${item.grade}-${item.section}`}
      validate={(form, items, editing) =>
        items.some(
          (schoolClass) =>
            schoolClass.id !== editing &&
            schoolClass.grade === form.grade &&
            schoolClass.section === form.section,
        )
          ? "That class and section already exists."
          : ""
      }
      extraColumns={[
        {
          label: "Students",
          render: (item) =>
            students.items.filter(
              (s) => s.classId === `${item.grade}-${item.section}`,
            ).length,
        },
        {
          label: "Absent Today",
          render: (item) =>
            attendance.items.filter(
              (a) =>
                a.role === "student" &&
                a.date === today &&
                a.status === "Absent" &&
                students.items.some(
                  (s) =>
                    s.id === a.personId &&
                    s.classId === `${item.grade}-${item.section}`,
                ),
            ).length,
        },
      ]}
    />
  );
}
