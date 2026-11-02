import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function SubmissionProvider({ children }) {
  const data = useStoredData(
    "eduflow_submissions",
    demoSchoolRecords.submissions,
    true,
  );

  function reviewForTeacher(id, changes, teacher, assignments, students) {
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, "reviewSubmissions")
    ) {
      throw new Error("You do not have permission to review submissions.");
    }
    const submission = data.items.find(
      (item) => String(item.id) === String(id),
    );
    const assignment = submission &&
      assignments.find(
        (item) => String(item.id) === String(submission.assignmentId),
      );
    const assignedClasses = Array.isArray(teacher?.classes)
      ? teacher.classes.map(String)
      : String(teacher?.classes || "")
          .split(",")
          .map((classId) => classId.trim())
          .filter(Boolean);
    const assignedSubjects = Array.isArray(teacher?.subjects)
      ? teacher.subjects.map((subject) => String(subject).trim())
      : String(teacher?.subject || "")
          .split(",")
          .map((subject) => subject.trim())
          .filter(Boolean);
    const studentIsAssigned = students.some(
      (student) =>
        String(student.id) === String(submission?.studentId) &&
        String(student.classId) === String(assignment?.classId),
    );
    if (
      !submission ||
      !assignment ||
      String(assignment.teacherId) !== String(teacher.id) ||
      !assignedClasses.includes(String(assignment.classId)) ||
      !assignedSubjects.includes(String(assignment.subject)) ||
      !studentIsAssigned
    ) {
      throw new Error("This submission is outside your authorised assignments.");
    }
    const reviewFields = {
      feedback: String(changes.feedback || ""),
      marks: changes.marks,
      status: changes.status,
      reviewedAt: changes.reviewedAt,
      reviewedBy: teacher.id,
    };
    if (!["Checked", "Resubmit"].includes(reviewFields.status)) {
      throw new Error("Choose a valid submission review status.");
    }
    if (reviewFields.marks !== "" && reviewFields.marks != null) {
      const marks = Number(reviewFields.marks);
      const maximum = Number(assignment.maxMarks);
      if (
        !Number.isFinite(marks) ||
        !Number.isFinite(maximum) ||
        marks < 0 ||
        marks > maximum
      ) {
        throw new Error(`Marks must be between 0 and ${maximum}.`);
      }
      reviewFields.marks = marks;
    }
    data.update(submission.id, reviewFields);
  }

  return (
    <Context.Provider value={{ data: { ...data, reviewForTeacher } }}>
      {children}
    </Context.Provider>
  );
}

export function useSubmission() {
  const value = useContext(Context);
  if (!value) throw new Error("useSubmission requires SubmissionProvider");
  return value;
}
