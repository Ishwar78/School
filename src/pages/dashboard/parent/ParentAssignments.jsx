import React from "react";

import { Empty, Panel, Table } from "../shared/UI";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import AttachmentFiles from "../shared/AttachmentFiles";
import { SUBMISSION_STATUS_OPTIONS } from "../shared/schoolOptions";

export default function ParentAssignments({ view }) {
  const { s, child, a } = view;
  const assignmentStatus = (assignment) =>
    s.submissions.items.filter(
      (submission) =>
        String(submission.assignmentId) === String(assignment.id) &&
        String(submission.studentId) === String(child?.id),
    ).at(-1)?.status || "Pending";
  const assignmentFilters = [
    { key: "subject", label: "Subject", includeDynamic: true },
    {
      key: "status",
      label: "Status",
      options: SUBMISSION_STATUS_OPTIONS,
      value: assignmentStatus,
    },
    { key: "due", label: "Due date", type: "date" },
  ];
  const assignmentState = useDashboardFilters(
    a,
    assignmentFilters,
    ["title", "subject", "due", { value: assignmentStatus }],
  );

  if (!child) {
    return <Empty>No child is linked to this parent yet.</Empty>;
  }

  return (
    <Panel
      title="Homework monitoring"
      subtitle="Assignment files are available in this browser; files are not synchronised across devices until backend storage is connected."
    >
      <DashboardFilters
        state={assignmentState}
        filters={assignmentFilters}
        items={a}
      />
      <Table
        headers={["Assignment", "Subject", "Due", "Status", "Marks", "Feedback", "Materials"]}
        rows={assignmentState.filteredItems.map((x) => {
          const sub = s.submissions.items.filter(
            (y) =>
              String(y.assignmentId) === String(x.id) &&
              String(y.studentId) === String(child.id),
          ).at(-1);

          return [
            x.title,
            x.subject,
            x.due,
            sub?.status || "Pending",
            sub?.marks === "" || sub?.marks == null
              ? "—"
              : `${sub.marks} / ${x.maxMarks ?? "—"}`,
            sub?.feedback || "—",
            <AttachmentFiles files={x.attachments} title="Assignment files" />,
          ];
        })}
      />
    </Panel>
  );
}
