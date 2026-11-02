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
import { DAY_OPTIONS } from "../shared/schoolOptions";

export default function StudentTimetable({ view }) {
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
  const timetableFilters = [
    { key: "day", label: "Day", options: DAY_OPTIONS },
    { key: "subject", label: "Subject", includeDynamic: true },
  ];
  const timetableState = useDashboardFilters(
    periods,
    timetableFilters,
    ["day", "start", "end", "subject", { value: (period) => teacher(period.teacherId) }],
  );

  return (
    <>
      <Panel title="Weekly timetable">
        <DashboardFilters
          state={timetableState}
          filters={timetableFilters}
          items={periods}
        />
        <Table
          headers={["Day", "Time", "Subject", "Teacher"]}
          rows={timetableState.filteredItems
            .sort(
              (a, b) =>
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].indexOf(a.day) -
                  [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].indexOf(b.day) || a.start.localeCompare(b.start),
            )
            .map((x) => [
              x.day,
              `${x.start}–${x.end}`,
              x.subject,
              teacher(x.teacherId),
            ])}
        />
      </Panel>
    </>
  );
}
