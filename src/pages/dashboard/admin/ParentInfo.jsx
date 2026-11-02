import { useStudent } from "../../../context/StudentContext";

import { parentFilters } from "./moduleFilters";

import React from "react";

import { useParent } from "../../../context/ParentContext";

import RecordManager from "./RecordManager";
import { parentFields } from "./fields";

export default function ParentInfo() {
  const { data } = useParent();
  const { data: students } = useStudent();

  const enriched = {
    ...data,
    items: data.items.map((parent) => ({
      ...parent,
      linkedCount: students.items.filter((s) => s.parentId === parent.id)
        .length,
    })),
  };

  return (
    <RecordManager
      title="Parent Information"
      description="Manage parent and guardian contact records."
      data={enriched}
      fields={parentFields}
      filters={parentFilters}
      getLabel={(item) => item.name}
    />
  );
}
