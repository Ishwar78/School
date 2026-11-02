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
import { ACADEMIC_SESSION_OPTIONS } from "../shared/schoolOptions";

export default function StudentAcademics({ view }) {
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
  const resultFilters = [
    { key: "subject", label: "Subject", includeDynamic: true },
    { key: "exam", label: "Exam", includeDynamic: true },
    {
      key: "session",
      label: "Academic year",
      options: [
        ...new Set([
          ...ACADEMIC_SESSION_OPTIONS,
          ...results.map((result) => result.session).filter(Boolean),
        ]),
      ],
    },
  ];
  const resultState = useDashboardFilters(
    results,
    resultFilters,
    ["exam", "subject", "remarks"],
  );

  return (
    <>
      <>
        <Panel title="My subjects">
          <p>
            {[
              ...new Set([
                ...a.map((x) => x.subject),
                ...results.map((x) => x.subject),
                ...periods.map((x) => x.subject),
              ]),
            ]
              .filter(Boolean)
              .join(" · ") ||
              "Subjects will appear when your teacher publishes them."}
          </p>
        </Panel>
        <Panel title="Examination results">
          <DashboardFilters
            state={resultState}
            filters={resultFilters}
            items={results}
          />
          <Table
            headers={["Exam", "Subject", "Marks", "Percentage", "Remarks"]}
            rows={resultState.filteredItems.map((x) => [
              x.exam,
              x.subject,
              `${x.marks}/${x.total}`,
              Number(x.total)
                ? Math.round((x.marks / x.total) * 100) + "%"
                : "—",
              x.remarks,
            ])}
          />
        </Panel>
      </>
    </>
  );
}
