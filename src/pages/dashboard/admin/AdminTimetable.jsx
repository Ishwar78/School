import React from "react";

import { useClass } from "../../../context/ClassContext";
import { useTeacher } from "../../../context/TeacherContext";
import { useTimetable } from "../../../context/TimetableContext";
import { DAY_OPTIONS, SUBJECT_OPTIONS } from "../shared/schoolOptions";
import { schoolClassId } from "../shared/school";
import RecordManager from "./RecordManager";

const LESSON_DAYS = DAY_OPTIONS.filter((day) => day !== "Sunday");
const TIMETABLE_FILTER_DAYS = [...DAY_OPTIONS, "Sunday"];

function overlaps(firstStart, firstEnd, secondStart, secondEnd) {
  return firstStart < secondEnd && secondStart < firstEnd;
}

function teacherClasses(teacher) {
  if (Array.isArray(teacher?.classes)) {
    return teacher.classes.map(String);
  }
  return String(teacher?.classes || "")
    .split(",")
    .map((classId) => classId.trim())
    .filter(Boolean);
}

function teacherSubjects(teacher) {
  const subjects = Array.isArray(teacher?.subjects)
    ? teacher.subjects
    : String(teacher?.subject || "").split(",");
  return subjects.map((subject) => String(subject).trim()).filter(Boolean);
}

function validatePeriod(form, periods, editingId, teachers, classes) {
  if (!form.classId || !form.teacherId || !form.day || !form.subject) {
    return "Choose a class, teacher, day, and subject.";
  }
  if (!LESSON_DAYS.includes(form.day)) {
    return "Lessons can only be scheduled Monday through Saturday.";
  }
  if (!form.start || !form.end || form.start >= form.end) {
    return "The end time must be later than the start time.";
  }
  if (!Number.isInteger(Number(form.period)) || Number(form.period) < 1) {
    return "Enter a valid period number.";
  }

  const selectedTeacher = teachers.find(
    (teacher) => String(teacher.id) === String(form.teacherId),
  );
  const selectedClass = classes.find(
    (schoolClass) =>
      String(schoolClassId(schoolClass)) === String(form.classId),
  );

  if (!selectedTeacher || !selectedClass) {
    return "Choose an existing teacher and class.";
  }
  if (
    !teacherClasses(selectedTeacher).includes(String(form.classId)) &&
    String(selectedClass.teacherId) !== String(selectedTeacher.id)
  ) {
    return "This teacher is not assigned to the selected class.";
  }
  if (!teacherSubjects(selectedTeacher).includes(String(form.subject))) {
    return "This teacher is not assigned to the selected subject.";
  }

  const conflict = periods.find(
    (period) =>
      String(period.id) !== String(editingId) &&
      period.day === form.day &&
      overlaps(form.start, form.end, period.start, period.end) &&
      (String(period.teacherId) === String(form.teacherId) ||
        String(period.classId) === String(form.classId)),
  );

  if (conflict) {
    const sameTeacher =
      String(conflict.teacherId) === String(form.teacherId);
    return sameTeacher
      ? "This teacher already has a lesson during that time."
      : "This class already has a lesson during that time.";
  }
  return "";
}

export default function AdminTimetable() {
  const timetable = useTimetable();
  const { data: classes } = useClass();
  const { data: teachers } = useTeacher();
  const classOptions = classes.items.map((schoolClass) => ({
    value: String(schoolClassId(schoolClass)),
    label: String(schoolClassId(schoolClass)),
  }));
  const teacherOptions = teachers.items.map((teacher) => ({
    value: String(teacher.id),
    label: teacher.name,
  }));
  const subjects = [
    ...new Set([
      ...SUBJECT_OPTIONS,
      ...timetable.data.items.map((period) => period.subject).filter(Boolean),
    ]),
  ];
  const fields = [
    { key: "day", label: "Day", type: "select", options: LESSON_DAYS },
    {
      key: "period",
      label: "Period number",
      type: "number",
      min: 1,
      required: true,
    },
    { key: "start", label: "Start time", type: "time", required: true },
    { key: "end", label: "End time", type: "time", required: true },
    {
      key: "classId",
      label: "Class",
      type: "select",
      options: classOptions,
      required: true,
      display: (value) => String(value || "—"),
      emptyMessage: "Add a class before creating a timetable period.",
    },
    {
      key: "teacherId",
      label: "Teacher",
      type: "select",
      options: teacherOptions,
      required: true,
      display: (value) =>
        teachers.items.find((teacher) => String(teacher.id) === String(value))
          ?.name || String(value || "—"),
      emptyMessage: "Add a teacher before creating a timetable period.",
    },
    {
      key: "subject",
      label: "Subject",
      type: "select",
      options: subjects,
      required: true,
    },
  ];

  return (
    <RecordManager
      title="Timetable Management"
      description="Create and manage shared weekly teaching periods. Sunday is reserved as a holiday."
      data={timetable.data}
      fields={fields}
      filters={[
        { key: "day", label: "Day", options: TIMETABLE_FILTER_DAYS },
        { key: "classId", label: "Class", options: classOptions },
        { key: "teacherId", label: "Teacher", options: teacherOptions },
        { key: "subject", label: "Subject", options: subjects },
      ]}
      getLabel={(period) =>
        `${period.day} period ${period.period} (${period.classId})`
      }
      validate={(form, periods, editingId) =>
        validatePeriod(
          form,
          periods,
          editingId,
          teachers.items,
          classes.items,
        )
      }
    />
  );
}
