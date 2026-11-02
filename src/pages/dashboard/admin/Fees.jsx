import React, { useState } from "react";
import RecordManager from "./RecordManager";
const ACADEMIC_SESSION_OPTIONS = ["2026-2027", "2025-2026", "2024-2025"];

const FEE_TYPE_OPTIONS = [
  "Tuition Fee",
  "Examination Fee",
  "Transport Fee",
  "Library & Lab Fee",
  "Annual Charges",
  "Sports Fee",
];

const initialFees = [
  {
    id: "fee-1",
    studentName: "Aarav Sharma",
    classId: "10-A",
    type: "Tuition Fee",
    session: "2026-2027",
    total: 18000,
    paid: 18000,
    due: "2026-10-15",
    status: "Paid",
  },
  {
    id: "fee-2",
    studentName: "Diya Patel",
    classId: "10-A",
    type: "Tuition Fee",
    session: "2026-2027",
    total: 18000,
    paid: 12000,
    due: "2026-11-15",
    status: "Partial",
  },
  {
    id: "fee-3",
    studentName: "Rohan Verma",
    classId: "9-A",
    type: "Transport Fee",
    session: "2026-2027",
    total: 6000,
    paid: 0,
    due: "2026-11-10",
    status: "Pending",
  },
  {
    id: "fee-4",
    studentName: "Sneha Reddy",
    classId: "11-A",
    type: "Examination Fee",
    session: "2026-2027",
    total: 2500,
    paid: 2500,
    due: "2026-10-25",
    status: "Paid",
  },
];

export default function Fees() {
  const [fees, setFees] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_fees");
      return saved ? JSON.parse(saved) : initialFees;
    } catch {
      return initialFees;
    }
  });

  const saveFees = (updater) => {
    setFees((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_fees", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    { key: "studentName", label: "Student Name", required: true },
    { key: "classId", label: "Class", required: true },
    {
      key: "type",
      label: "Fee Type",
      type: "select",
      options: FEE_TYPE_OPTIONS,
      required: true,
    },
    {
      key: "session",
      label: "Academic Session",
      type: "select",
      options: ACADEMIC_SESSION_OPTIONS,
      default: ACADEMIC_SESSION_OPTIONS[0],
    },
    {
      key: "total",
      label: "Total Fee (₹)",
      type: "number",
      min: "0",
      required: true,
    },
    {
      key: "paid",
      label: "Paid Amount (₹)",
      type: "number",
      min: "0",
      default: "0",
      required: true,
    },
    { key: "due", label: "Due Date", type: "date", required: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Paid", "Pending", "Partial"],
      default: "Pending",
    },
  ];

  const data = {
    items: fees,
    add: (record) => {
      const total = Number(record.total) || 0;
      const paid = Number(record.paid) || 0;
      const status = paid >= total ? "Paid" : paid > 0 ? "Partial" : "Pending";
      saveFees((prev) => [
        { ...record, status, id: "fee-" + Date.now() },
        ...prev,
      ]);
    },
    update: (id, updateFields) =>
      saveFees((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updateFields } : f)),
      ),
    remove: (id) =>
      saveFees((prev) => prev.filter((f) => f.id !== id)),
  };

  const filters = [
    { key: "type", label: "Fee Type", options: FEE_TYPE_OPTIONS },
    { key: "status", label: "Payment Status", options: ["Paid", "Pending", "Partial"] },
  ];

  return (
    <RecordManager
      title="Fee Management"
      description="Track student fee payments, dues, transaction receipts and pending balances."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(f) => `${f.studentName} - ${f.type} (₹${f.total})`}
    />
  );
}
