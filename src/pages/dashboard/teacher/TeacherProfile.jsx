import React from "react";

import { Panel, Table } from "../shared/UI";

export default function TeacherProfile({ view }) {
  const { teacher, ids } = view;
  const rows = [
    ["Name", teacher.name],
    ["Teacher ID", teacher.employee],
    ["Email", teacher.email],
    ["Department", teacher.department],
    ["Subject", teacher.subject],
    ...(view.can("viewAllocatedClasses")
      ? [["Assigned classes", ids.join(", ")]]
      : []),
    ["Status", teacher.status],
  ];

  return (
    <>
      <Panel title="My profile">
        <Table
          headers={["Field", "Details"]}
          rows={rows}
        />
      </Panel>
    </>
  );
}
