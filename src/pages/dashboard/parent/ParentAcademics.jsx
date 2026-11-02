import React from "react";

import { Empty, Panel, Table } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { ACADEMIC_SESSION_OPTIONS } from "../shared/schoolOptions";

export default function ParentAcademics({ view }) {
  const { child, results } = view;
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

  if (!child) {
    return <Empty>No child is linked to this parent yet.</Empty>;
  }

  return (
    <Panel title={`${child.name}'s results`}>
      <DashboardFilters
        state={resultState}
        filters={resultFilters}
        items={results}
      />
      <Table
        headers={["Exam", "Subject", "Score", "Percentage", "Remarks"]}
        rows={resultState.filteredItems.map((x) => [
          x.exam,
          x.subject,
          `${x.marks}/${x.total}`,
          Number(x.total) ? Math.round((x.marks / x.total) * 100) + "%" : "—",
          x.remarks,
        ])}
      />
    </Panel>
  );
}
