import React, { createContext, useContext } from "react";

import { demoUsers } from "../data/demoUsers";
import DashboardDataProvider from "./SchoolProvider";

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  return (
    <DashboardDataProvider>
      <SchoolContext.Provider value={{ users: demoUsers }}>
        {children}
      </SchoolContext.Provider>
    </DashboardDataProvider>
  );
}

export function useSchool() {
  const school = useContext(SchoolContext);

  if (!school) {
    throw new Error("useSchool must be inside SchoolProvider");
  }

  return school;
}
