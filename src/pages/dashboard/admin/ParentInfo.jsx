import React, { useState } from "react";
import RecordManager from "./RecordManager";

const RELATIONSHIP_OPTIONS = ["Father", "Mother", "Guardian"];
const SCHOOL_STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

const parentFields = [
  { key: "parentNo", label: "Parent ID", required: true },
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "alternate", label: "Alternate Phone", type: "tel", table: false },
  {
    key: "relationship",
    label: "Relationship",
    type: "select",
    options: RELATIONSHIP_OPTIONS,
  },
  { key: "occupation", label: "Occupation", table: false },
  { key: "address", label: "Address", type: "textarea", table: false },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: SCHOOL_STATUS_OPTIONS,
    default: "Active",
  },
];

const parentFilters = [
  { key: "relationship", label: "Relationship", options: RELATIONSHIP_OPTIONS },
  { key: "occupation", label: "Occupation", includeDynamic: true },
  { key: "status", label: "Status", options: SCHOOL_STATUS_OPTIONS },
  {
    key: "linked",
    label: "Children linked",
    value: (i) => (i.linkedCount > 0 ? "Yes" : "No"),
    options: ["Yes", "No"],
  },
];

const initialParents = [
  {
    id: "par-1",
    parentNo: "PAR-001",
    name: "Vikram Sharma",
    email: "vikram.sharma@eduflow.com",
    phone: "+91 98765 00001",
    alternate: "+91 98765 00002",
    relationship: "Father",
    occupation: "Civil Engineer",
    address: "Sector 14, Urban Estate, Hansi",
    status: "Active",
    linkedCount: 1,
  },
  {
    id: "par-2",
    parentNo: "PAR-002",
    name: "Sunita Patel",
    email: "sunita.patel@eduflow.com",
    phone: "+91 98765 00003",
    relationship: "Mother",
    occupation: "Professor",
    address: "Model Town, Hansi",
    status: "Active",
    linkedCount: 1,
  },
  {
    id: "par-3",
    parentNo: "PAR-003",
    name: "Rajesh Verma",
    email: "rajesh.verma@eduflow.com",
    phone: "+91 98765 00004",
    relationship: "Father",
    occupation: "Business",
    address: "Main Market, Hansi",
    status: "Active",
    linkedCount: 1,
  },
];

export default function ParentInfo() {
  const [parents, setParents] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_parents");
      return saved ? JSON.parse(saved) : initialParents;
    } catch {
      return initialParents;
    }
  });

  const saveParents = (updater) => {
    setParents((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_parents", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save parents to localStorage", e);
      }
      return next;
    });
  };

  const data = {
    items: parents,
    add: (record) =>
      saveParents((prev) => [
        { ...record, id: "par-" + Date.now(), linkedCount: 1 },
        ...prev,
      ]),
    update: (id, fields) =>
      saveParents((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...fields } : item)),
      ),
    remove: (id) =>
      saveParents((prev) => prev.filter((item) => item.id !== id)),
  };

  return (
    <RecordManager
      title="Parent Information"
      description="Manage parent and guardian contact records."
      data={data}
      fields={parentFields}
      filters={parentFilters}
      getLabel={(item) => item.name}
    />
  );
}
