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
import { FEE_STATUS_OPTIONS } from "../shared/schoolOptions";

export default function StudentFees({ view }) {
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
  const feeFilters = [
    { key: "status", label: "Status", options: FEE_STATUS_OPTIONS, value: feeStatus },
    { key: "session", label: "Academic year", includeDynamic: true },
  ];
  const feeState = useDashboardFilters(
    fees,
    feeFilters,
    ["type", "session", "due", { value: feeStatus }],
  );

  return (
    <>
      <>
        <Stats
          items={[
            ["Total fees", "₹" + fees.reduce((n, f) => n + Number(f.total), 0)],
            ["Paid", "₹" + fees.reduce((n, f) => n + Number(f.paid), 0)],
            [
              "Outstanding",
              "₹" +
                fees.reduce(
                  (n, f) => n + Math.max(0, Number(f.total) - Number(f.paid)),
                  0,
                ),
            ],
          ]}
        />
        <Panel title="Fee records">
          <DashboardFilters
            state={feeState}
            filters={feeFilters}
            items={fees}
          />
          <Table
            headers={["Type", "Session", "Total", "Paid", "Due", "Status"]}
            rows={feeState.filteredItems.map((x) => [
              x.type,
              x.session,
              `₹${x.total}`,
              `₹${x.paid}`,
              x.due,
              feeStatus(x),
            ])}
          />
        </Panel>
      </>
    </>
  );
}
