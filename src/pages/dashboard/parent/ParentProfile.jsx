import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";

export default function ParentProfile({ view }) {
  const { s, parent, children, child, attendance, results, a, fees, periods } =
    view;

  return (
    <>
      <Panel title="Parent profile">
        <Table
          headers={["Field", "Details"]}
          rows={[
            ["Name", parent.name],
            ["Parent ID", parent.parentNo],
            ["Email", parent.email],
            ["Phone", parent.phone],
            ["Relationship", parent.relationship],
            [
              "Linked children",
              children.map((x) => x.name).join(", ") || "None",
            ],
          ]}
        />
      </Panel>
    </>
  );
}
