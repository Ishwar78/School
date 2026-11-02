import { reportFilters } from "./moduleFilters";

import React from "react";

import { useReport } from "../../../context/ReportContext";

import RecordManager from "./RecordManager";
import {
  REPORT_CATEGORY_OPTIONS,
  REPORT_ROLE_OPTIONS,
  REPORT_STATUS_OPTIONS,
} from "../shared/schoolOptions";

export default function Reports() {
  const { data } = useReport();

  const fields = [
    { key: "title", label: "Report Title", required: true },
    { key: "author", label: "Submitted By", required: true },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: REPORT_ROLE_OPTIONS,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: REPORT_CATEGORY_OPTIONS,
      includeDynamic: true,
    },
    { key: "date", label: "Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: REPORT_STATUS_OPTIONS,
      default: "Pending",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      table: false,
    },
    {
      key: "response",
      label: "Admin Response",
      type: "textarea",
      table: false,
    },
  ];

  return (
    <RecordManager
      title="Reports"
      description="Review concerns from students and teachers and update their status or response."
      data={data}
      fields={fields}
      filters={reportFilters}
      getLabel={(item) => item.title}
    />
  );
}
