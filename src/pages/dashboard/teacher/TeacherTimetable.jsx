import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  schoolClassId,
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";
import { DAY_OPTIONS, SUBJECT_OPTIONS } from "../shared/schoolOptions";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { SECTION_OPTIONS } from "../shared/schoolOptions";

export default function TeacherTimetable({ view }) {
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

  const subjects = [
    ...new Set([
      ...SUBJECT_OPTIONS,
      ...s.timetable.items.map((timeSlot) => timeSlot.subject).filter(Boolean),
    ]),
  ];
  const timetableFilters = [
    { key: "day", label: "Day", options: DAY_OPTIONS },
    {
      key: "classId",
      label: "Class",
      options: ids,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (period) => String(period.classId || "").split("-")[1],
    },
    { key: "subject", label: "Subject", includeDynamic: true },
  ];
  const timetableState = useDashboardFilters(
    ownPeriods,
    timetableFilters,
    ["day", "start", "end", "classId", "subject"],
  );

  return (
    <>
      <>
        <Panel title="My weekly timetable">
          <DashboardFilters
            state={timetableState}
            filters={timetableFilters}
            items={ownPeriods}
          />
          <Table
            headers={["Day", "Time", "Class", "Subject"]}
            rows={timetableState.filteredItems.map((t) => [
              t.day,
              `${t.start}–${t.end}`,
              t.classId,
              t.subject,
            ])}
          />
        </Panel>
        <Panel title="Add teaching period">
          <form
            className="role-form"
            onSubmit={(e) => {
              e.preventDefault();
              s.timetable.add({
                ...period,
                classId: period.classId || ids[0],
                teacherId: teacher.id,
              });
              setPeriod({
                classId: "",
                day: "Monday",
                start: "",
                end: "",
                subject: "",
              });
            }}
          >
            <label>
              Class
              <select
                value={period.classId || ids[0] || ""}
                onChange={(e) => setField(setPeriod, "classId", e.target.value)}
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
              Day
              <select
                value={period.day}
                onChange={(e) => setField(setPeriod, "day", e.target.value)}
              >
                {DAY_OPTIONS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            {["start", "end"].map((x) => (
              <label key={x}>
                {x} time
                <input
                  required
                  type="time"
                  value={period[x]}
                  onChange={(e) => setField(setPeriod, x, e.target.value)}
                />
              </label>
            ))}
            <label>
              Subject
              <select
                required
                value={period.subject}
                onChange={(e) => setField(setPeriod, "subject", e.target.value)}
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
            <button disabled={!ids.length} className="role-primary">
              Add period
            </button>
          </form>
        </Panel>
      </>
    </>
  );
}
