import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function AssignmentProvider({ children }) {
  const data = useStoredData(
    "eduflow_assignments",
    demoSchoolRecords.assignments,
    true,
  );

  function validateTeacherAssignment(teacher, assignment, permission) {
    const classes = Array.isArray(teacher?.classes)
      ? teacher.classes
      : String(teacher?.classes || "")
          .split(",")
          .map((classId) => classId.trim())
          .filter(Boolean);
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, permission)
    ) {
      throw new Error("You do not have permission to manage assignments.");
    }
    if (
      String(assignment.teacherId) !== String(teacher.id) ||
      !classes.map(String).includes(String(assignment.classId))
    ) {
      throw new Error("This class or assignment is outside your authorised scope.");
    }
    const subjects = Array.isArray(teacher.subjects)
      ? teacher.subjects
      : String(teacher.subject || "").split(",");
    if (
      !subjects
        .map((subject) => String(subject).trim())
        .includes(String(assignment.subject))
    ) {
      throw new Error("This subject is outside your authorised scope.");
    }
  }

  function addForTeacher(assignment, teacher) {
    validateTeacherAssignment(teacher, assignment, "createAssignments");
    validateAssignmentFields(assignment);
    data.add(assignment);
  }

  function updateForTeacher(id, changes, teacher) {
    const current = data.items.find(
      (assignment) => String(assignment.id) === String(id),
    );
    if (!current) throw new Error("This assignment no longer exists.");
    validateTeacherAssignment(teacher, current, "editOwnAssignments");
    const updated = { ...current, ...changes };
    if (String(updated.teacherId) !== String(teacher.id)) {
      throw new Error("You cannot transfer an assignment to another teacher.");
    }
    validateTeacherAssignment(teacher, updated, "editOwnAssignments");
    validateAssignmentFields(updated);
    data.update(current.id, changes);
  }

  function removeForTeacher(id, teacher) {
    const current = data.items.find(
      (assignment) => String(assignment.id) === String(id),
    );
    if (!current) throw new Error("This assignment no longer exists.");
    validateTeacherAssignment(teacher, current, "editOwnAssignments");
    data.remove(current.id);
  }

  function validateAssignmentFields(assignment) {
    const marks = Number(assignment.maxMarks);
    if (!String(assignment.title || "").trim()) {
      throw new Error("Enter an assignment title.");
    }
    if (!String(assignment.description || "").trim()) {
      throw new Error("Enter the assignment instructions.");
    }
    if (
      !assignment.created ||
      !assignment.due ||
      assignment.due < assignment.created
    ) {
      throw new Error("Enter valid creation and due dates.");
    }
    if (!Number.isFinite(marks) || marks <= 0) {
      throw new Error("Maximum marks must be greater than zero.");
    }
  }

  return (
    <Context.Provider
      value={{
        data: {
          ...data,
          addForTeacher,
          updateForTeacher,
          removeForTeacher,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAssignment() {
  const value = useContext(Context);
  if (!value)
    throw new Error("useAssignment must be inside AssignmentProvider");

  return value;
}
