import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function AttendanceProvider({ children }) {
  const data = useStoredData(
    "eduflow_attendance",
    demoSchoolRecords.attendance,
    true,
  );

  function saveForTeacher({ student, date, status }, teacher, students) {
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, "manageAttendance")
    ) {
      throw new Error("You do not have permission to manage attendance.");
    }
    if (
      !student?.id ||
      !students.some((assignedStudent) =>
        String(assignedStudent.id) === String(student.id),
      )
    ) {
      throw new Error("This student is outside your authorised classes.");
    }
    if (
      !date ||
      !["Present", "Absent", "Leave"].includes(status)
    ) {
      throw new Error("Choose a valid attendance date and status.");
    }
    const existing = data.items.find(
      (record) =>
        record.role === "student" &&
        String(record.personId) === String(student.id) &&
        record.date === date,
    );
    const changes = {
      role: "student",
      personId: student.id,
      classId: student.classId,
      date,
      status,
      recordedBy: teacher.name,
    };
    if (existing) data.update(existing.id, changes);
    else data.add(changes);
  }

  return (
    <Context.Provider value={{ data: { ...data, saveForTeacher } }}>
      {children}
    </Context.Provider>
  );
}

export function useAttendance() {
  const value = useContext(Context);
  if (!value)
    throw new Error("useAttendance must be inside AttendanceProvider");

  return value;
}
