import React, { createContext, useContext } from "react";

import useStoredData from "./useStoredData";
import { demoSchoolRecords } from "../data/demoSchoolRecords";
import { teacherHasPermission } from "../pages/dashboard/shared/school";

const Context = createContext(null);

export function AnnouncementProvider({ children }) {
  const data = useStoredData(
    "eduflow_announcements",
    demoSchoolRecords.announcements,
    true,
  );

  function checkTeacher(teacher) {
    if (
      !teacher ||
      teacher.status === "Inactive" ||
      !teacherHasPermission(teacher, "manageAnnouncements")
    ) {
      throw new Error("You do not have permission to manage announcements.");
    }
  }

  function addForTeacher(announcement, teacher) {
    checkTeacher(teacher);
    data.add({
      ...announcement,
      audience: "Teachers",
      author: teacher.name,
      createdBy: teacher.id,
    });
  }

  function updateForTeacher(id, announcement, teacher) {
    checkTeacher(teacher);
    const existing = data.items.find(
      (item) => String(item.id) === String(id),
    );
    if (
      !existing ||
      String(existing.createdBy || existing.teacherId || "") !==
        String(teacher.id)
    ) {
      throw new Error("You can only edit announcements you created.");
    }
    data.update(existing.id, {
      ...announcement,
      audience: "Teachers",
      author: teacher.name,
      createdBy: teacher.id,
    });
  }

  function removeForTeacher(id, teacher) {
    checkTeacher(teacher);
    const existing = data.items.find(
      (item) => String(item.id) === String(id),
    );
    if (
      !existing ||
      String(existing.createdBy || existing.teacherId || "") !==
        String(teacher.id)
    ) {
      throw new Error("You can only delete announcements you created.");
    }
    data.remove(existing.id);
  }

  return (
    <Context.Provider
      value={{
        data: { ...data, addForTeacher, updateForTeacher, removeForTeacher },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAnnouncement() {
  const value = useContext(Context);
  if (!value)
    throw new Error("useAnnouncement must be inside AnnouncementProvider");

  return value;
}
