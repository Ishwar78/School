import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";

const Context = createContext(null);

export function StudentProvider({ children }) {
  const data = useStoredData(
    "eduflow_students",
    demoSchoolRecords.students,
    true,
  );

  return <Context.Provider value={{ data }}>{children}</Context.Provider>;
}

export function useStudent() {
  const value = useContext(Context);
  if (!value) throw new Error("useStudent must be inside StudentProvider");
  return value;
}
