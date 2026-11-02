import StudentProfile from "./StudentProfile";
import StudentReports from "./StudentReports";
import StudentAnnouncements from "./StudentAnnouncements";
import StudentFees from "./StudentFees";
import StudentAssignments from "./StudentAssignments";
import StudentTimetable from "./StudentTimetable";
import StudentAttendance from "./StudentAttendance";
import StudentAcademics from "./StudentAcademics";
import StudentOverview from "./StudentOverview";
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
import {
  attendanceRate,
  feeStatus,
  relevantNotices,
  today,
} from "../shared/school";
import "../shared/Role.css";

const menu = [
  "Overview",
  "My Academics",
  "Attendance",
  "Timetable",
  "Assignments",
  "Fees",
  "Announcements",
  "Reports",
  "Profile",
];

export default function StudentDashboard() {
  const s = useSchool();

  const user = readAuthenticatedUser();
  const { person: student } = resolveDashboardPerson(
    s.students.items,
    user,
    "student",
  );
  const [page, setPage] = useState("Overview");
  const [answers, setAnswers] = useState({});

  const teacher = (id) =>
    s.teachers.items.find((t) => t.id === id)?.name || "Teacher";

  const hasStudent = student?.id != null;

  const a =
      hasStudent && student.classId != null
        ? s.assignments.items.filter(
            (x) => String(x.classId) === String(student.classId),
          )
        : [],
    attendance = hasStudent
      ? s.attendance.items.filter(
          (x) =>
            x.role === "student" && String(x.personId) === String(student.id),
        )
      : [],
    results = hasStudent
      ? s.results.items.filter(
          (x) => String(x.studentId) === String(student.id),
        )
      : [],
    fees = hasStudent
      ? s.fees.items.filter((x) => String(x.studentId) === String(student.id))
      : [],
    periods =
      hasStudent && student.classId != null
        ? s.timetable.items.filter(
            (x) => String(x.classId) === String(student.classId),
          )
        : [],
    submission = (id) =>
      s.submissions.items.filter(
        (x) =>
          hasStudent &&
          String(x.studentId) === String(student.id) &&
          String(x.assignmentId) === String(id),
      ).at(-1);
  const view = {
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
  };

  return (
    <Layout
      role="Student"
      name={student?.name}
      menu={menu}
      page={page}
      setPage={setPage}
      storageErrors={s.storageErrors}
      accessMessage={
        !student &&
        "No student record is linked to this account. Ask your administrator to create a student record with your login email."
      }
    >
      {student && (
        <>
          {page === "Overview" && <StudentOverview view={view} />}
          {page === "My Academics" && <StudentAcademics view={view} />}
          {page === "Attendance" && <StudentAttendance view={view} />}
          {page === "Timetable" && <StudentTimetable view={view} />}
          {page === "Assignments" && <StudentAssignments view={view} />}
          {page === "Fees" && <StudentFees view={view} />}
          {page === "Announcements" && <StudentAnnouncements view={view} />}
          {page === "Reports" && <StudentReports view={view} />}
          {page === "Profile" && <StudentProfile view={view} />}
        </>
      )}
    </Layout>
  );
}
