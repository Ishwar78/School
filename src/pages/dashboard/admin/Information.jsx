import React, { useState } from "react";
import RecordManager from "./RecordManager";
const ANNOUNCEMENT_AUDIENCE_OPTIONS = ["All", "Students", "Teachers", "Parents", "Classes 6-12", "All Students & Parents"];
const ANNOUNCEMENT_PRIORITY_OPTIONS = ["High", "Important", "Normal", "Low"];

const initialAnnouncements = [
  {
    id: "ann-1",
    title: "Annual Sports Day Registration Open",
    date: "2026-11-05",
    audience: "All Students & Parents",
    priority: "High",
    description: "Students interested in track events and team sports should submit entries by Friday.",
  },
  {
    id: "ann-2",
    title: "Half-Yearly Examination Timetable Released",
    date: "2026-11-03",
    audience: "Classes 6-12",
    priority: "Important",
    description: "The official datesheet for the upcoming semester exams has been published.",
  },
  {
    id: "ann-3",
    title: "Parent-Teacher Meeting Scheduled",
    date: "2026-11-01",
    audience: "All Parents",
    priority: "Normal",
    description: "The term-end PTM will be held this Saturday from 9:00 AM to 1:00 PM.",
  },
];

export default function Information() {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_announcements");
      return saved ? JSON.parse(saved) : initialAnnouncements;
    } catch {
      return initialAnnouncements;
    }
  });

  const saveAnnouncements = (updater) => {
    setAnnouncements((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_announcements", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    { key: "title", label: "Announcement Title", required: true },
    { key: "date", label: "Publish Date", type: "date", required: true },
    {
      key: "audience",
      label: "Audience",
      type: "select",
      options: ANNOUNCEMENT_AUDIENCE_OPTIONS,
      default: "All",
      required: true,
    },
    {
      key: "priority",
      label: "Priority",
      type: "select",
      options: ANNOUNCEMENT_PRIORITY_OPTIONS,
      default: "Normal",
    },
    {
      key: "description",
      label: "Announcement Content",
      type: "textarea",
      required: true,
      table: false,
    },
  ];

  const data = {
    items: announcements,
    add: (record) =>
      saveAnnouncements((prev) => [
        { ...record, id: "ann-" + Date.now() },
        ...prev,
      ]),
    update: (id, updateFields) =>
      saveAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updateFields } : a)),
      ),
    remove: (id) =>
      saveAnnouncements((prev) => prev.filter((a) => a.id !== id)),
  };

  const filters = [
    { key: "audience", label: "Audience", options: ANNOUNCEMENT_AUDIENCE_OPTIONS },
    { key: "priority", label: "Priority", options: ANNOUNCEMENT_PRIORITY_OPTIONS },
  ];

  return (
    <RecordManager
      title="Information & Announcements"
      description="Publish and broadcast school-wide or targeted circulars and notices."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(item) => item.title}
    />
  );
}
