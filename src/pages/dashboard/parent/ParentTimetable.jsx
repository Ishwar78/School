import React from "react";

import { Empty, Panel, Table } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { DAY_OPTIONS } from "../shared/schoolOptions";

export default function ParentTimetable({ view }) {
  const { child, periods } = view;
  const timetableFilters = [
    { key: "day", label: "Day", options: DAY_OPTIONS },
    { key: "subject", label: "Subject", includeDynamic: true },
  ];
  const timetableState = useDashboardFilters(
    periods,
    timetableFilters,
    ["day", "start", "end", "subject"],
  );

  if (!child) {
    return <Empty>No child is linked to this parent yet.</Empty>;
  }

  return (
    <Panel title="Child's timetable">
      <DashboardFilters
        state={timetableState}
        filters={timetableFilters}
        items={periods}
      />
      <Table
        headers={["Day", "Time", "Subject"]}
        rows={timetableState.filteredItems.map((x) => [
          x.day,
          `${x.start}–${x.end}`,
          x.subject,
        ])}
      />
    </Panel>
  );
}
