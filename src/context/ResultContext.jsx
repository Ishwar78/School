import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function ResultProvider({ children }) {
  const data = useStoredData(
    "eduflow_results",
    demoSchoolRecords.results,
    true,
  );

  function saveForTeacher(result, teacher, students, subjects) {
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, "enterMarks")
    ) {
      throw new Error("You do not have permission to enter marks.");
    }
    if (
      String(result.teacherId) !== String(teacher.id) ||
      !students.some(
        (student) => String(student.id) === String(result.studentId),
      ) ||
      !String(result.exam || "").trim() ||
      !subjects.map(String).includes(String(result.subject))
    ) {
      throw new Error(
        "Enter an examination and choose a student and subject within your authorised scope.",
      );
    }
    const marks = Number(result.marks);
    const total = Number(result.total);
    if (
      !Number.isFinite(marks) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      marks < 0 ||
      marks > total
    ) {
      throw new Error("Marks must be between zero and the maximum marks.");
    }
    const existing = data.items.find(
      (item) =>
        String(item.studentId) === String(result.studentId) &&
        String(item.subject) === String(result.subject) &&
        String(item.exam) === String(result.exam),
    );
    if (existing && String(existing.teacherId) !== String(teacher.id)) {
      throw new Error("You cannot change another teacher's result.");
    }
    const changes = { ...result, marks, total, teacherId: teacher.id };
    if (existing) data.update(existing.id, changes);
    else data.add(changes);
  }

  return (
    <Context.Provider value={{ data: { ...data, saveForTeacher } }}>
      {children}
    </Context.Provider>
  );
}

export function useResult() {
  const value = useContext(Context);
  if (!value) throw new Error("useResult requires ResultProvider");
  return value;
}
