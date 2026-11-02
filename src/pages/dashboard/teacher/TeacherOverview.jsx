import React from "react";

import { Panel, Stats, Table, NoticeList } from "../shared/UI";
import { today, relevantNotices } from "../shared/school";

export default function TeacherOverview({ view }) {
  const { s, teacher, ids, students, assignments, subs, ownPeriods } = view;
  const stats = [
    ...(view.can("viewAllocatedClasses")
      ? [["Assigned classes", ids.length]]
      : []),
    ...(view.can("viewAssignedStudents")
      ? [["My students", students.length]]
      : []),
    ...(view.can("createAssignments") || view.can("editOwnAssignments")
      ? [["Active assignments", assignments.length]]
      : []),
    ...(view.can("reviewSubmissions")
      ? [
          [
            "Submissions to review",
            subs.filter((submission) => submission.status === "Submitted")
              .length,
          ],
        ]
      : []),
  ];

  return (
    <>
      <>
        <h1>Welcome back, {teacher.name}!</h1>
        <p className="role-muted">Your teaching workspace · {today()}</p>
        {stats.length > 0 && <Stats items={stats} />}
        {view.can("manageTimetable") && (
          <Panel title="Today's teaching schedule">
            <Table
              headers={["Time", "Class", "Subject"]}
              rows={ownPeriods
                .filter(
                  (period) =>
                    period.day ===
                    new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    }),
                )
                .map((period) => [
                  `${period.start}–${period.end}`,
                  period.classId,
                  period.subject,
                ])}
            />
          </Panel>
        )}
        <Panel title="Recent announcements">
          <NoticeList
            items={relevantNotices(s.notices.items, "Teacher")
              .slice(-4)
              .reverse()}
          />
        </Panel>
      </>
    </>
  );
}
