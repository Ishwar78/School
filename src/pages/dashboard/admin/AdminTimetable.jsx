import React, { useState } from "react";
import RecordManager from "./RecordManager";
const CLASS_OPTIONS = [
  "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B",
  "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B",
  "11-A", "11-B", "12-A", "12-B"
];
const SUBJECT_OPTIONS = [
  "Mathematics", "English", "Science", "Physics", "Chemistry", "Biology", "Social Studies", "Hindi", "Computer Science", "Physical Education"
];

const LESSON_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const initialPeriods = [
  { id: "tt-1", day: "Monday", period: 1, start: "08:30", end: "09:15", classId: "10-A", teacherName: "Dr. Rajesh Kumar", subject: "Physics", room: "Lab 2" },
  { id: "tt-2", day: "Monday", period: 2, start: "09:15", end: "10:00", classId: "10-A", teacherName: "Ananya Gupta", subject: "Mathematics", room: "Room 201" },
  { id: "tt-3", day: "Monday", period: 3, start: "10:15", end: "11:00", classId: "10-A", teacherName: "Sunita Mehra", subject: "English", room: "Room 201" },
  { id: "tt-4", day: "Tuesday", period: 1, start: "08:30", end: "09:15", classId: "9-A", teacherName: "Ananya Gupta", subject: "Mathematics", room: "Room 105" },
  { id: "tt-5", day: "Wednesday", period: 2, start: "09:15", end: "10:00", classId: "11-A", teacherName: "Dr. Rajesh Kumar", subject: "Physics", room: "Lab 3" },
];

export default function AdminTimetable() {
  const [periods, setPeriods] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_timetable");
      return saved ? JSON.parse(saved) : initialPeriods;
    } catch {
      return initialPeriods;
    }
  });

  const savePeriods = (updater) => {
    setPeriods((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("veda_admin_timetable", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const fields = [
    { key: "day", label: "Day", type: "select", options: LESSON_DAYS, required: true },
    { key: "period", label: "Period Number", type: "number", min: 1, required: true },
    { key: "start", label: "Start Time", type: "time", required: true },
    { key: "end", label: "End Time", type: "time", required: true },
    { key: "classId", label: "Class", type: "select", options: CLASS_OPTIONS, required: true },
    { key: "teacherName", label: "Teacher Name", required: true },
    { key: "subject", label: "Subject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { key: "room", label: "Room / Lab" },
  ];

  const data = {
    items: periods,
    add: (record) =>
      savePeriods((prev) => [
        { ...record, id: "tt-" + Date.now() },
        ...prev,
      ]),
    update: (id, updateFields) =>
      savePeriods((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updateFields } : p)),
      ),
    remove: (id) =>
      savePeriods((prev) => prev.filter((p) => p.id !== id)),
  };

  const filters = [
    { key: "day", label: "Day", options: LESSON_DAYS },
    { key: "classId", label: "Class", options: CLASS_OPTIONS },
    { key: "subject", label: "Subject", options: SUBJECT_OPTIONS },
  ];

  return (
    <RecordManager
      title="Timetable Management"
      description="Create, edit and manage weekly school teaching periods and classroom assignments."
      data={data}
      fields={fields}
      filters={filters}
      getLabel={(p) => `${p.day} Period ${p.period} - Class ${p.classId} (${p.subject})`}
    />
  );
}
