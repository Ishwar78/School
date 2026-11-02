import TeacherProfile from "./TeacherProfile";
import TeacherAnnouncements from "./TeacherAnnouncements";
import TeacherReports from "./TeacherReports";
import TeacherResults from "./TeacherResults";
import TeacherSubmissions from "./TeacherSubmissions";
import TeacherAssignments from "./TeacherAssignments";
import TeacherAttendance from "./TeacherAttendance";
import TeacherClasses from "./TeacherClasses";
import TeacherOverview from "./TeacherOverview";
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
  Empty,
  NoticeList,
  ReportForm,
} from "../shared/UI";
import {
  schoolClassId,
  getTeacherSubjects,
  teacherHasPermission,
  teacherClasses,
  today,
  relevantNotices,
} from "../shared/school";
import {
  ACADEMIC_SESSION_OPTIONS,
  DAY_OPTIONS,
} from "../shared/schoolOptions";
import "../shared/Role.css";

const menu = [
  "Overview",
  "My Classes",
  "Attendance",
  "Assignments",
  "Submissions",
  "Marks & Results",
  "Reports",
  "Announcements",
  "Profile",
];

export default function TeacherDashboard() {
  const s = useSchool();

  const user = readAuthenticatedUser();
  const { person: teacher } = resolveDashboardPerson(
    s.teachers.items,
    user,
    "teacher",
  );
  const [page, setPage] = useState("Overview"),
    [classId, setClassId] = useState(""),
    [date, setDate] = useState(today()),
    [form, setForm] = useState({
      title: "",
      subject: "",
      description: "",
      due: "",
    }),
    [marks, setMarks] = useState({
      studentId: "",
      subject: "",
      exam: "",
      marks: "",
      total: "",
      session: ACADEMIC_SESSION_OPTIONS[0],
      remarks: "",
    }),
    [period, setPeriod] = useState({
      classId: "",
      day: DAY_OPTIONS[0],
      start: "",
      end: "",
      subject: "",
    });

  const teacherClassIds = new Set(
      teacherClasses(teacher, s.classes.items).map((schoolClass) =>
        String(schoolClassId(schoolClass)),
      ),
    ),
    assigned = s.classes.items.filter((schoolClass) =>
      teacherClassIds.has(String(schoolClassId(schoolClass))),
    ),
    ids = assigned.map(schoolClassId),
    assignedClassIds = new Set(ids.map((id) => String(id))),
    assignedSubjects = getTeacherSubjects(teacher),
    assignedSubjectIds = new Set(assignedSubjects),
    teacherActive = teacher?.status !== "Inactive",
    can = (permission) =>
      teacherActive && teacherHasPermission(teacher, permission),
    students = can("viewAssignedStudents")
      ? s.students.items.filter((x) => assignedClassIds.has(String(x.classId)))
      : [],
    assignments = s.assignments.items.filter(
      (a) =>
        teacher?.id != null &&
        String(a.teacherId) === String(teacher.id) &&
        assignedClassIds.has(String(a.classId)) &&
        assignedSubjectIds.has(String(a.subject)),
    ),
    subs = [
      ...new Map(
        s.submissions.items
          .filter((submission) => {
            const assignment = assignments.find(
              (item) => String(item.id) === String(submission.assignmentId),
            );
            return (
              assignment &&
              s.students.items.some(
                (student) =>
                  String(student.id) === String(submission.studentId) &&
                  String(student.classId) === String(assignment.classId),
              )
            );
          })
          .map((submission) => [
            `${submission.assignmentId}:${submission.studentId}`,
            submission,
          ]),
      ).values(),
    ],
    classStudents = students.filter(
      (x) => String(x.classId) === String(classId || ids[0]),
    );
  const setField = (setter, key, value) =>
    setter((old) => ({ ...old, [key]: value }));

  const name = (id) =>
    s.students.items.find((x) => String(x.id) === String(id))?.name ||
    "Unknown student";

  const ownPeriods = s.timetable.items.filter(
    (t) =>
      teacher?.id != null &&
      String(t.teacherId) === String(teacher.id) &&
      assignedClassIds.has(String(t.classId)) &&
      assignedSubjectIds.has(String(t.subject)),
  );
  const view = {
    s,
    teacher,
    assigned,
    ids,
    students,
    assignments,
    subs,
    classStudents,
    classId,
    setClassId,
    date,
    setDate,
    form,
    setForm,
    marks,
    setMarks,
    period,
    setPeriod,
    setField,
    name,
    ownPeriods,
    permissions: {
      viewAssignedStudents: can("viewAssignedStudents"),
      manageAttendance: can("manageAttendance"),
      createAssignments: can("createAssignments"),
      editOwnAssignments: can("editOwnAssignments"),
      reviewSubmissions: can("reviewSubmissions"),
      enterMarks: can("enterMarks"),
      viewResults: can("viewResults"),
      manageAnnouncements: can("manageAnnouncements"),
      viewReports: can("viewReports"),
      manageTimetable: can("manageTimetable"),
      viewAllocatedClasses: can("viewAllocatedClasses"),
    },
    can,
  };
  const availableMenu = menu.filter((item) => {
    if (item === "My Classes") return can("viewAllocatedClasses");
    if (item === "Attendance") return can("manageAttendance");
    if (item === "Assignments")
      return can("createAssignments") || can("editOwnAssignments");
    if (item === "Submissions") return can("reviewSubmissions");
    if (item === "Marks & Results")
      return can("enterMarks") || can("viewResults");
    if (item === "Reports") return can("viewReports");
    if (item === "Announcements") return can("manageAnnouncements");
    return true;
  });
  const pagePermission = {
    "My Classes": "viewAllocatedClasses",
    Attendance: "manageAttendance",
    Assignments: can("createAssignments") || can("editOwnAssignments"),
    Submissions: "reviewSubmissions",
    "Marks & Results": can("enterMarks") || can("viewResults"),
    Reports: "viewReports",
    Announcements: "manageAnnouncements",
  }[page];
  const pageAllowed =
    teacherActive &&
    (pagePermission === undefined ||
    (typeof pagePermission === "string"
      ? can(pagePermission)
      : pagePermission));

  return (
    <Layout
      role="Teacher"
      name={teacher?.name}
      menu={availableMenu}
      page={page}
      setPage={setPage}
      storageErrors={s.storageErrors}
      accessMessage={
        !teacher
          ? "No teacher record is linked to this account. Ask your administrator to create a teacher record with your login email."
          : !teacherActive
            ? "This teacher account is inactive. Contact an administrator to restore access."
            : ""
      }
    >
      {teacher && (
        <>
          {!pageAllowed && (
            <p className="role-note" role="alert">
              Your account does not have permission to access this area.
            </p>
          )}
          {pageAllowed && page === "Overview" && <TeacherOverview view={view} />}
          {pageAllowed && page === "My Classes" && <TeacherClasses view={view} />}
          {pageAllowed && page === "Attendance" && <TeacherAttendance view={view} />}
          {pageAllowed && page === "Assignments" && <TeacherAssignments view={view} />}
          {pageAllowed && page === "Submissions" && <TeacherSubmissions view={view} />}
          {pageAllowed && page === "Marks & Results" && <TeacherResults view={view} />}
          {pageAllowed && page === "Reports" && <TeacherReports view={view} />}
          {pageAllowed && page === "Announcements" && <TeacherAnnouncements view={view} />}
          {pageAllowed && page === "Profile" && <TeacherProfile view={view} />}
        </>
      )}
    </Layout>
  );
}
