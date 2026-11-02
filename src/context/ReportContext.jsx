import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function ReportProvider({ children }) {
  const data = useStoredData("eduflow_reports", demoSchoolRecords.reports, true);

  function addForTeacher(report, teacher) {
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, "viewReports")
    ) {
      throw new Error("You do not have permission to submit reports.");
    }
    if (!report.title?.trim() || !report.description?.trim()) {
      throw new Error("Enter a report title and description.");
    }
    data.add({
      ...report,
      title: report.title.trim(),
      description: report.description.trim(),
      role: "Teacher",
      author: teacher.name,
      submitterId: teacher.id,
    });
  }

  return (
    <Context.Provider value={{ data: { ...data, addForTeacher } }}>
      {children}
    </Context.Provider>
  );
}

export function useReport() {
  const value = useContext(Context);
  if (!value) throw new Error("useReport must be inside ReportProvider");
  return value;
}
