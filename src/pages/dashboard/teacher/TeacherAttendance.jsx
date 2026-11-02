import React, { useState } from "react";

import { Empty, Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  schoolClassId,
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";
import { ATTENDANCE_STATUS_OPTIONS } from "../shared/schoolOptions";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import {
  SECTION_OPTIONS,
} from "../shared/schoolOptions";

export default function TeacherAttendance({ view }) {
  const {
    s,
    teacher,
    assigned,
    ids,
    students,
    assignments,
    subs,
    classStudents,
    classId,
    setClassId,
    date,
    setDate,
    form,
    setForm,
    marks,
    setMarks,
    period,
    setPeriod,
    setField,
    name,
    ownPeriods,
  } = view;
  const [saveError, setSaveError] = useState("");
  if (!view.can("manageAttendance")) {
    return <Empty>Your account does not have permission to manage attendance.</Empty>;
  }

  function saveAttendance(student, status) {
    if (!view.can("manageAttendance")) return;
    try {
      s.attendance.saveForTeacher(
        { student, date, status },
        teacher,
        students,
      );
      setSaveError("");
    } catch (error) {
      setSaveError(error.message || "Unable to update attendance.");
    }
  }

  const history = s.attendance.items.filter(
    (record) =>
      record.role === "student" &&
      students.some((student) => String(student.id) === String(record.personId)),
  );
  const historyFilters = [
    {
      key: "classId",
      label: "Class",
      options: [...new Set(students.map((student) => student.classId))],
      value: (record) =>
        students.find((student) => String(student.id) === String(record.personId))
          ?.classId,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (record) =>
        String(
          students.find((student) => String(student.id) === String(record.personId))
            ?.classId || "",
        ).split("-")[1],
    },
    {
      key: "studentId",
      label: "Student",
      includeDynamic: true,
      value: (record) => name(record.personId),
    },
    {
      key: "status",
      label: "Status",
      options: ATTENDANCE_STATUS_OPTIONS,
    },
    {
      key: "date",
      label: "Date",
      type: "date",
    },
    {
      key: "year",
      label: "Year",
      includeDynamic: true,
      value: (record) => record.date?.slice(0, 4),
    },
  ];
  const historyState = useDashboardFilters(
    history,
    historyFilters,
    ["date", "status", "recordedBy", { value: (record) => name(record.personId) }],
  );

  return (
    <>
      <>
        <Panel
          title="Take class attendance"
          subtitle="Select one of your assigned classes and a date."
        >
          <div className="role-form">
            <label>
              Class
              <select
                value={classId || ids[0] || ""}
                onChange={(e) => setClassId(e.target.value)}
              >
                {assigned.map((schoolClass) => (
                  <option
                    key={schoolClass.id}
                    value={schoolClassId(schoolClass)}
                  >
                    {schoolClassId(schoolClass)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          <div className="role-actions" style={{ marginTop: 16 }}>
            <button
              className="role-secondary"
              onClick={() => classStudents.forEach((student) => saveAttendance(student, "Present"))}
            >
              Mark all present
            </button>
          </div>
          {saveError && <p className="attachment-error" role="alert">{saveError}</p>}
          <Table
            headers={["Student", "Roll", "Current", "Mark"]}
            rows={classStudents.map((x) => {
              const old = s.attendance.items.find(
                (a) =>
                  a.role === "student" &&
                  a.personId === x.id &&
                  a.date === date,
              );

              return [
                x.name,
                x.roll,
                old?.status || "Not marked",
                <div className="role-actions">
                  {ATTENDANCE_STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      className="role-secondary"
                      onClick={() => saveAttendance(x, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>,
              ];
            })}
          />
        </Panel>
        <Panel title="Attendance history">
          <DashboardFilters
            state={historyState}
            filters={historyFilters}
            items={history}
          />
          <Table
            headers={["Date", "Student", "Status"]}
            rows={historyState.filteredItems.map((a) => [
              a.date,
              name(a.personId),
              a.status,
            ])}
          />
        </Panel>
      </>
    </>
  );
}
