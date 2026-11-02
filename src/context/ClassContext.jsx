import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";

const Context = createContext(null);

export function ClassProvider({ children }) {
  const data = useStoredData(
    "eduflow_classes",
    demoSchoolRecords.classes,
    true,
  );

  return <Context.Provider value={{ data }}>{children}</Context.Provider>;
}

export function useClass() {
  const value = useContext(Context);
  if (!value) throw new Error("useClass must be inside ClassProvider");
  return value;
}
