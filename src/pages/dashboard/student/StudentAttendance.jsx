import AttendanceCalendar from "../shared/AttendanceCalendar";

import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import {
  ATTENDANCE_STATUS_OPTIONS,
  MONTH_OPTIONS,
} from "../shared/schoolOptions";

export default function StudentAttendance({ view }) {
  const {
    s,
    student,
    teacher,
    a,
    attendance,
    results,
    fees,
    periods,
    submission,
    answers,
    setAnswers,
  } = view;
  const attendanceFilters = [
    {
      key: "month",
      label: "Month",
      options: MONTH_OPTIONS,
      value: (record) => record.date?.slice(5, 7),
    },
    {
      key: "year",
      label: "Year",
      includeDynamic: true,
      value: (record) => record.date?.slice(0, 4),
    },
    {
      key: "status",
      label: "Status",
      options: ATTENDANCE_STATUS_OPTIONS,
    },
  ];
  const attendanceState = useDashboardFilters(
    attendance,
    attendanceFilters,
    ["date", "status", "recordedBy"],
  );

  return (
    <>
      <>
        <AttendanceCalendar records={attendance} />
        <Stats
          items={[
            [
              "Attendance rate",
              attendanceRate(s.attendance.items, student.id) + "%",
            ],
            [
              "Present",
              attendance.filter((x) => x.status === "Present").length,
            ],
            ["Absent", attendance.filter((x) => x.status === "Absent").length],
            ["Leave", attendance.filter((x) => x.status === "Leave").length],
          ]}
        />
        <Panel title="My attendance history">
          <DashboardFilters
            state={attendanceState}
            filters={attendanceFilters}
            items={attendance}
          />
          <Table
            headers={["Date", "Status", "Marked by"]}
            rows={attendanceState.filteredItems.map((x) => [
              x.date,
              x.status,
              x.recordedBy,
            ])}
          />
        </Panel>
      </>
    </>
  );
}
