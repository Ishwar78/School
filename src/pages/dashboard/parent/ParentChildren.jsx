import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";

export default function ParentChildren({ view }) {
  const { s, parent, children, child, attendance, results, a, fees, periods } =
    view;

  return (
    <>
      <Panel title="Linked children">
        <Table
          headers={["Name", "Admission", "Class", "Roll", "Session"]}
          rows={children.map((x) => [
            x.name,
            x.admission,
            x.classId,
            x.roll,
            x.session,
          ])}
        />
      </Panel>
    </>
  );
}
