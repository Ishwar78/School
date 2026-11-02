import { feeFilters } from "./moduleFilters";

import React from "react";

import { useFee } from "../../../context/FeeContext";
import { useStudent } from "../../../context/StudentContext";

import RecordManager from "./RecordManager";
import { feeStatus } from "../shared/school";
import {
  ACADEMIC_SESSION_OPTIONS,
  FEE_TYPE_OPTIONS,
} from "../shared/schoolOptions";

export default function Fees() {
  const { data } = useFee();
  const { data: students } = useStudent();

  const fields = [
    {
      key: "studentId",
      label: "Student",
      type: "select",
      emptyMessage: "Add a student record before creating a fee record.",
      required: true,
      options: students.items.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.classId})`,
      })),
      display: (id) =>
        students.items.find((s) => s.id === id)?.name || "Unknown",
    },
    {
      key: "type",
      label: "Fee Type",
      type: "select",
      options: FEE_TYPE_OPTIONS,
      required: true,
    },
    {
      key: "session",
      label: "Session",
      type: "select",
      options: ACADEMIC_SESSION_OPTIONS,
      default: ACADEMIC_SESSION_OPTIONS[0],
      includeDynamic: true,
    },
    {
      key: "total",
      label: "Total (₹)",
      type: "number",
      min: "0",
      required: true,
    },
    {
      key: "paid",
      label: "Paid (₹)",
      type: "number",
      min: "0",
      default: "0",
      required: true,
    },
    { key: "due", label: "Due Date", type: "date", required: true },
    {
      key: "balance",
      label: "Balance (₹)",
      table: true,
      display: (_, item) =>
        `₹${Math.max(0, Number(item.total) - Number(item.paid))}`,
    },
  ].filter((f) => f.key !== "balance");
  const enriched = {
    ...data,
    items: data.items.map((f) => ({
      ...f,
      studentClass:
        students.items.find((s) => s.id === f.studentId)?.classId || "",
      paymentStatus: feeStatus(f),
    })),
  };

  return (
    <RecordManager
      title="Fee Management"
      description="Record student fees, payments and outstanding balances."
      data={enriched}
      fields={fields}
      filters={feeFilters}
      getLabel={(item) => item.type}
      extraColumns={[
        {
          label: "Balance",
          render: (item) =>
            `₹${Math.max(0, Number(item.total) - Number(item.paid))}`,
        },
        {
          label: "Status",
          render: (item) => (
            <span className={`status ${feeStatus(item).toLowerCase()}`}>
              {feeStatus(item)}
            </span>
          ),
        },
      ]}
    />
  );
}
