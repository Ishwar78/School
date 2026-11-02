import React, { useState } from "react";
import RecordManager from "./RecordManager";
const REPORT_CATEGORY_OPTIONS = ["Academic", "Behavior", "Attendance", "Facilities", "Fees", "General"];
const REPORT_ROLE_OPTIONS = ["Student", "Teacher", "Parent", "Staff"];
const REPORT_STATUS_OPTIONS = ["Open", "In Review", "Resolved", "Closed"];

const initialReports = [
  {
    id: "rep-1",
    title: "Projector maintenance required in Lab 2",
    author: "Dr. Rajesh Kumar",
    role: "Teacher",
    category: "Facilities",
    date: "2026-11-01",
    status: "Open",
    description: "The HDMI connection on Lab 2 ceiling projector has intermittent signal issues.",
    response: "IT department notified for inspection.",
  },
  {
    id: "rep-2",
    title: "Library books return extension request",
    author: "Aarav Sharma",
    role: "Student",
    category: "Academic",
    date: "2026-10-28",
    status: "Resolved",
    description: "Need 3 days extension for science reference book due to science fair preparation.",
    response: "Approved for 5 days.",
  },
  {
    id: "rep-3",
    title: "Bus route timing update inquiry",
    author: "Vikram Sharma",
    role: "Parent",
    category: "General",
    date: "2026-10-30",
    status: "In Review",
    description: "Requesting confirmation of morning pick-up time at Stop 4.",
    response: "Transport in-charge reviewing schedule.",
  },
];

export default function Reports() {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_reports");
      return saved ? JSON.parse(saved) : initialReports;
    } catch {
      return initialReports;
    }
  });

  const saveReports = (updater) => {
    setReports((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_reports", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    { key: "title", label: "Report Title", required: true },
    { key: "author", label: "Submitted By", required: true },
    {
      key: "role",
      label: "User Role",
      type: "select",
      options: REPORT_ROLE_OPTIONS,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: REPORT_CATEGORY_OPTIONS,
      required: true,
    },
    { key: "date", label: "Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: REPORT_STATUS_OPTIONS,
      default: "Open",
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

  const data = {
    items: reports,
    add: (record) =>
      saveReports((prev) => [
        { ...record, id: "rep-" + Date.now() },
        ...prev,
      ]),
    update: (id, updateFields) =>
      saveReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updateFields } : r)),
      ),
    remove: (id) =>
      saveReports((prev) => prev.filter((r) => r.id !== id)),
  };

  const filters = [
    { key: "category", label: "Category", options: REPORT_CATEGORY_OPTIONS },
    { key: "status", label: "Status", options: REPORT_STATUS_OPTIONS },
    { key: "role", label: "Role", options: REPORT_ROLE_OPTIONS },
  ];

  return (
    <RecordManager
      title="Reports & Inquiries"
      description="Review concerns, grievances and inquiries from students, parents, and teachers."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(r) => `${r.title} (${r.author})`}
    />
  );
}
