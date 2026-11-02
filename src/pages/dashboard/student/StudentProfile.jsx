import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";

export default function StudentProfile({ view }) {
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

  return (
    <>
      <Panel title="Student profile">
        <Table
          headers={["Field", "Details"]}
          rows={[
            ["Name", student.name],
            ["Admission", student.admission],
            ["Class", student.classId],
            ["Roll", student.roll],
            ["Session", student.session],
            ["Phone", student.phone],
            [
              "Linked parent",
              s.parents.items.find((x) => x.id === student.parentId)?.name ||
                "Not linked",
            ],
          ]}
        />
      </Panel>
    </>
  );
}
