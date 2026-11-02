import { studentFilters } from "./moduleFilters";

import React from "react";

import { useStudent } from "../../../context/StudentContext";
import { useParent } from "../../../context/ParentContext";
import { useClass } from "../../../context/ClassContext";

import RecordManager from "./RecordManager";
import { studentFields } from "./fields";
import { CLASS_OPTIONS } from "../shared/schoolOptions";

export default function StudentInfo() {
  const { data } = useStudent();
  const { data: parents } = useParent();
  const { data: classes } = useClass();

  const fields = studentFields.map((field) => {
    if (field.key === "parentId") {
      return { 
        ...field,
        emptyMessage: "Add a parent record before linking a student.",
        options: parents.items.map((parent) => ({
          value: parent.id,
          label: `${parent.name} (${parent.parentNo})`,
        })),
      };
    }

    if (field.key === "classId") {
      const savedStudentClasses = data.items
        .map((student) => student.classId) 
        .filter(Boolean);

      const savedSchoolClasses = classes.items.map(
        (schoolClass) => `${schoolClass.grade}-${schoolClass.section}`,
      );

      return {
        ...field,
        options: [
          ...new Set([
            ...CLASS_OPTIONS,
            ...savedSchoolClasses, 
            ...savedStudentClasses,
          ]), 
        ], 
      };
    }

    return field;
  });

  return (
    <RecordManager
      title="Student Information" 
      description="Register, edit, search and manage enrolled students."
      data={data} 
      fields={fields} 
      filters={studentFilters} 
      getLabel={(item) => item.name}
    />
  );
}
