import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";

export default function ParentReports({ view }) {
  const { s, parent, children, child, attendance, results, a, fees, periods } =
    view;

  return (
    <>
      <ReportForm data={s.reports} role="Parent" user={parent} />
    </>
  );
}
