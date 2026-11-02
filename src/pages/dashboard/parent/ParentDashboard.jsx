import ParentProfile from "./ParentProfile";
import ParentReports from "./ParentReports";
import ParentAnnouncements from "./ParentAnnouncements";
import ParentFees from "./ParentFees";
import ParentTimetable from "./ParentTimetable";
import ParentAssignments from "./ParentAssignments";
import ParentAcademics from "./ParentAcademics";
import ParentAttendance from "./ParentAttendance";
import ParentChildren from "./ParentChildren";
import ParentOverview from "./ParentOverview";
import React, { useState } from "react";

import useSchool from "../shared/useSchool";
import {
  readAuthenticatedUser,
  resolveDashboardPerson,
} from "../shared/identity";
import {
  Layout,
  Panel,
  Stats,
  Table,
  NoticeList,
  ReportForm,
} from "../shared/UI";
import { attendanceRate, feeStatus, relevantNotices } from "../shared/school";
import "../shared/Role.css";

const menu = [
  "Overview",
  "My Children",
  "Attendance",
  "Academics",
  "Assignments",
  "Timetable",
  "Fees",
  "Announcements",
  "Reports",
  "Profile",
];

export default function ParentDashboard() {
  const s = useSchool();

  const user = readAuthenticatedUser();
  const { person: parent } = resolveDashboardPerson(
    s.parents.items,
    user,
    "parent",
  );
  const [page, setPage] = useState("Overview");
  const [selected, setSelected] = useState("");

  const children = s.students.items.filter(
      (x) => parent?.id != null && String(x.parentId) === String(parent.id),
    ),
    child =
      children.find((x) => String(x.id) === String(selected)) || children[0],
    attendance = child
      ? s.attendance.items.filter(
          (x) =>
            x.role === "student" && String(x.personId) === String(child.id),
        )
      : [],
    results = child
      ? s.results.items.filter((x) => String(x.studentId) === String(child.id))
      : [],
    a = child
      ? s.assignments.items.filter(
          (x) => String(x.classId) === String(child.classId),
        )
      : [],
    fees = child
      ? s.fees.items.filter((x) => String(x.studentId) === String(child.id))
      : [],
    periods = child
      ? s.timetable.items.filter(
          (x) => String(x.classId) === String(child.classId),
        )
      : [];
  const view = {
    s,
    parent,
    children,
    child,
    attendance,
    results,
    a,
    fees,
    periods,
  };

  return (
    <Layout
      role="Parent"
      name={parent?.name}
      menu={menu}
      page={page}
      setPage={setPage}
      storageErrors={s.storageErrors}
      accessMessage={
        !parent &&
        "No parent record is linked to this account. Ask your administrator to create a parent record with your login email."
      }
    >
      {parent && (
        <>
          <h1>Welcome, {parent.name}</h1>
          {children.length > 0 ? (
            <label className="role-selector">
              Viewing child
              <select
                value={child.id}
                onChange={(e) => setSelected(e.target.value)}
              >
                {children.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} · {x.classId}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="role-note">
              No children are linked to this parent yet. Ask Admin to link
              students in Linked Students.
            </p>
          )}
          {page === "Overview" && <ParentOverview view={view} />}
          {page === "My Children" && <ParentChildren view={view} />}
          {page === "Attendance" && (
            <ParentAttendance key={child?.id || "no-child"} view={view} />
          )}
          {page === "Academics" && (
            <ParentAcademics key={child?.id || "no-child"} view={view} />
          )}
          {page === "Assignments" && (
            <ParentAssignments key={child?.id || "no-child"} view={view} />
          )}
          {page === "Timetable" && (
            <ParentTimetable key={child?.id || "no-child"} view={view} />
          )}
          {page === "Fees" && (
            <ParentFees key={child?.id || "no-child"} view={view} />
          )}
          {page === "Announcements" && <ParentAnnouncements view={view} />}
          {page === "Reports" && <ParentReports view={view} />}
          {page === "Profile" && <ParentProfile view={view} />}
        </>
      )}
    </Layout>
  );
}
