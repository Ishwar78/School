import AttendanceCalendar from "../shared/AttendanceCalendar";

import React from "react";

import { Empty, Panel, Stats, Table } from "../shared/UI";
import { attendanceRate } from "../shared/school";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import {
  ATTENDANCE_STATUS_OPTIONS,
  MONTH_OPTIONS,
} from "../shared/schoolOptions";

export default function ParentAttendance({ view }) {
  const { s, child, attendance } = view;
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
    { key: "status", label: "Status", options: ATTENDANCE_STATUS_OPTIONS },
  ];
  const attendanceState = useDashboardFilters(
    attendance,
    attendanceFilters,
    ["date", "status", "recordedBy"],
  );

  if (!child) {
    return <Empty>No child is linked to this parent yet.</Empty>;
  }

  return (
    <>
      <AttendanceCalendar records={attendance} />
      <Stats
        items={[
          ["Attendance", attendanceRate(s.attendance.items, child.id) + "%"],
          ["Present", attendance.filter((x) => x.status === "Present").length],
          ["Absent", attendance.filter((x) => x.status === "Absent").length],
          ["Leave", attendance.filter((x) => x.status === "Leave").length],
        ]}
      />
      <Panel title={`${child.name}'s attendance`}>
        <DashboardFilters
          state={attendanceState}
          filters={attendanceFilters}
          items={attendance}
        />
        <Table
          headers={["Date", "Status"]}
          rows={attendanceState.filteredItems.map((x) => [x.date, x.status])}
        />
      </Panel>
    </>
  );
}
