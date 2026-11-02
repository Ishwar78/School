import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const LESSON_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function hasOverlap(firstStart, firstEnd, secondStart, secondEnd) {
  return firstStart < secondEnd && secondStart < firstEnd;
}

const Context = createContext(null);

export function TimetableProvider({ children }) {
  const data = useStoredData(
    "eduflow_timetables",
    demoSchoolRecords.timetable,
    true,
  );

  function updateForTeacher(id, changes, teacher, classIds, subjects) {
    if (
      !teacherHasPermission(teacher, "manageTimetable") ||
      teacher?.status === "Inactive"
    ) {
      throw new Error("You do not have permission to manage timetable entries.");
    }
    const original = data.items.find(
      (period) => String(period.id) === String(id),
    );
    if (
      !original ||
      String(original.teacherId) !== String(teacher.id)
    ) {
      throw new Error("You can only edit timetable entries assigned to you.");
    }
    if (
      changes.teacherId != null &&
      String(changes.teacherId) !== String(teacher.id)
    ) {
      throw new Error("You cannot assign a period to another teacher.");
    }
    if (
      !LESSON_DAYS.includes(changes.day) ||
      !changes.start ||
      !changes.end ||
      changes.start >= changes.end ||
      !Number.isInteger(Number(changes.period)) ||
      Number(changes.period) < 1
    ) {
      throw new Error("Enter a valid weekday, period number, and time range.");
    }
    if (!classIds.map(String).includes(String(changes.classId))) {
      throw new Error("This class is outside your authorised assignments.");
    }
    if (!subjects.map(String).includes(String(changes.subject))) {
      throw new Error("This subject is outside your authorised assignments.");
    }

    const conflict = data.items.find(
      (period) =>
        String(period.id) !== String(original.id) &&
        period.day === changes.day &&
        hasOverlap(changes.start, changes.end, period.start, period.end) &&
        (String(period.teacherId) === String(teacher.id) ||
          String(period.classId) === String(changes.classId)),
    );
    if (conflict) {
      throw new Error(
        String(conflict.teacherId) === String(teacher.id)
          ? "You already have a period scheduled during that time."
          : "The selected class already has a period during that time.",
      );
    }
    data.update(original.id, {
      ...changes,
      teacherId: teacher.id,
      period: Number(changes.period),
    });
  }

  return (
    <Context.Provider value={{ data: { ...data, updateForTeacher } }}>
      {children}
    </Context.Provider>
  );
}

export function useTimetable() {
  const value = useContext(Context);
  if (!value) throw new Error("useTimetable requires TimetableProvider");
  return value;
}
