import React from "react";

import { Empty, Panel, Stats, Table, NoticeList } from "../shared/UI";
import { attendanceRate, relevantNotices } from "../shared/school";

export default function ParentOverview({ view }) {
  const { s, parent, children, child, attendance, results, a, fees, periods } =
    view;

  return child ? (
    <>
      <Stats
        items={[
          ["Child", child.name],
          ["Attendance", attendanceRate(s.attendance.items, child.id) + "%"],
          [
            "Pending homework",
            a.filter(
              (x) =>
                !s.submissions.items.some(
                  (sub) =>
                    sub.assignmentId === x.id && sub.studentId === child.id,
                ),
            ).length,
          ],
          [
            "Fee balance",
            "₹" +
              fees.reduce(
                (n, f) => n + Math.max(0, Number(f.total) - Number(f.paid)),
                0,
              ),
          ],
        ]}
      />
      <Panel title="Latest results">
        <Table
          headers={["Exam", "Subject", "Score"]}
          rows={results
            .slice(-5)
            .map((x) => [x.exam, x.subject, `${x.marks}/${x.total}`])}
        />
      </Panel>
      <Panel title="Recent announcements">
        <NoticeList
          items={relevantNotices(s.notices.items, "Parent").slice(-4).reverse()}
        />
      </Panel>
    </>
  ) : (
    <Panel title="Child overview">
      <Empty>No linked child data is available yet.</Empty>
    </Panel>
  );
}
