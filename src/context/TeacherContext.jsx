import React, { createContext, useContext, useEffect } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { getTeacherRole } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function TeacherProvider({ children }) {
  const data = useStoredData(
    "eduflow_teachers",
    demoSchoolRecords.teachers,
    true,
  );

  useEffect(() => {
    if (data.error) return;

    data.items.forEach((teacher) => {
      if (teacher.id == null) return;
      if (Array.isArray(teacher.roles) || teacher.role !== getTeacherRole(teacher)) {
        data.update(teacher.id, {
          role: getTeacherRole(teacher),
          roles: undefined,
        });
      }
    });
  }, [data.error, data.items, data.update]);

  return <Context.Provider value={{ data }}>{children}</Context.Provider>;
}

export function useTeacher() {
  const value = useContext(Context);
  if (!value) throw new Error("useTeacher must be inside TeacherProvider");
  return value;
}
