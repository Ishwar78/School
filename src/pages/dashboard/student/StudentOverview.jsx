import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";

export default function StudentOverview({ view }) {
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
      <>
        <h1>Hello, {student.name}!</h1>
        <p className="role-muted">
          Class {student.classId} · Roll {student.roll} · {today()}
        </p>
        <Stats
          items={[
            [
              "Attendance",
              attendanceRate(s.attendance.items, student.id) + "%",
            ],
            ["Pending homework", a.filter((x) => !submission(x.id)).length],
            ["Published results", results.length],
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
        <Panel title="Upcoming homework">
          <Table
            headers={["Assignment", "Subject", "Due", "Status"]}
            rows={a
              .filter((x) => !submission(x.id))
              .map((x) => [x.title, x.subject, x.due, "Pending"])}
          />
        </Panel>
        <Panel title="Recent notices">
          <NoticeList
            items={relevantNotices(s.notices.items, "Student")
              .slice(-4)
              .reverse()}
          />
        </Panel>
      </>
    </>
  );
}
