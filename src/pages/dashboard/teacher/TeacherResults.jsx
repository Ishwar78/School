import React, { useState } from "react";

import {
  Empty,
  Panel,
  Stats,
  Table,
  NoticeList,
  ReportForm,
} from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";
import {
  ACADEMIC_SESSION_OPTIONS,
} from "../shared/schoolOptions";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { SECTION_OPTIONS } from "../shared/schoolOptions";

export default function TeacherResults({ view }) {
  const [saveError, setSaveError] = useState("");
  const {
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
  } = view;

  const teacherResults = s.results.items.filter(
    (result) =>
      teacher.id != null &&
      String(result.teacherId) === String(teacher.id) &&
      students.some((student) => String(student.id) === String(result.studentId)) &&
      view.assignedSubjects.includes(String(result.subject)),
  );
  const subjects = view.assignedSubjects;

  const sessions = [
    ...new Set([
      ...ACADEMIC_SESSION_OPTIONS,
      ...teacherResults.map((result) => result.session).filter(Boolean),
    ]),
  ];
  const resultFilters = [
    {
      key: "classId",
      label: "Class",
      options: [...new Set(students.map((student) => student.classId))],
      value: (result) =>
        students.find(
          (student) => String(student.id) === String(result.studentId),
        )?.classId,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (result) =>
        String(
          students.find(
            (student) => String(student.id) === String(result.studentId),
          )?.classId || "",
        ).split("-")[1],
    },
    {
      key: "studentId",
      label: "Student",
      includeDynamic: true,
      value: (result) => name(result.studentId),
    },
    {
      key: "subject",
      label: "Subject",
      includeDynamic: true,
    },
    {
      key: "exam",
      label: "Exam",
      includeDynamic: true,
    },
    {
      key: "session",
      label: "Academic year",
      options: sessions,
    },
  ];
  const resultState = useDashboardFilters(
    teacherResults,
    resultFilters,
    [
      "subject",
      "exam",
      "session",
      "remarks",
      {
        value: (result) =>
          students.find(
            (student) => String(student.id) === String(result.studentId),
          )?.classId,
      },
      { value: (result) => name(result.studentId) },
    ],
  );
  const canEnterMarks = view.can("enterMarks");
  const canViewResults = view.can("viewResults");

  if (!canEnterMarks && !canViewResults) {
    return <Empty>Your account does not have permission to view or enter results.</Empty>;
  }

  return (
    <>
      <>
        {canEnterMarks && <Panel title="Publish examination result">
          {students.length === 0 && (
            <Empty>No students are assigned to your classes yet.</Empty>
          )}
          <form
            className="role-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (
                !view.can("enterMarks") ||
                teacher.id == null ||
                students.length === 0 ||
                !students.some((student) => String(student.id) === String(marks.studentId)) ||
                !view.assignedSubjects.includes(String(marks.subject))
              ) {
                setSaveError("Choose a student and subject within your authorised classes.");
                return;
              }
              if (!marks.exam.trim()) {
                setSaveError("Enter the examination name.");
                return;
              }
              const maximum = Number(marks.total);
              const achieved = Number(marks.marks);
              if (
                !Number.isFinite(maximum) ||
                maximum <= 0 ||
                !Number.isFinite(achieved) ||
                achieved < 0 ||
                achieved > maximum
              ) {
                setSaveError("Marks must be between zero and the maximum marks.");
                return;
              }

              try {
                s.results.saveForTeacher(
                  {
                    ...marks,
                    exam: marks.exam.trim(),
                    studentId: String(marks.studentId),
                    marks: achieved,
                    total: maximum,
                  },
                  teacher,
                  students,
                  view.assignedSubjects,
                );
                setMarks({ ...marks, marks: "", remarks: "" });
                setSaveError("");
              } catch (error) {
                setSaveError(error.message || "Unable to save the result.");
              }
            }}
          >
            <label>
              Student
              <select
                required
                value={marks.studentId}
                onChange={(e) =>
                  setField(setMarks, "studentId", e.target.value)
                }
              >
                <option value="">Select student</option>
                {students.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} · {x.classId}
                  </option>
                ))}
              </select>
            </label>
            {[
              ["exam", "Examination"],
              ["marks", "Marks obtained"],
              ["total", "Maximum marks"],
              ["remarks", "Remarks"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  required={key !== "remarks"}
                  type={["marks", "total"].includes(key) ? "number" : "text"}
                  min="0"
                  value={marks[key]}
                  onChange={(e) => setField(setMarks, key, e.target.value)}
                />
              </label>
            ))}
            {saveError && <p className="wide attachment-error" role="alert">{saveError}</p>}
            <label>
              Subject
              <select
                required
                value={marks.subject}
                onChange={(e) => setField(setMarks, "subject", e.target.value)}
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Session
              <select
                value={marks.session}
                onChange={(e) => setField(setMarks, "session", e.target.value)}
              >
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="role-primary"
              disabled={teacher.id == null || students.length === 0}
            >
              Save result
            </button>
          </form>
        </Panel>}
        {canViewResults && <Panel title="Published results">
          <DashboardFilters
            state={resultState}
            filters={resultFilters}
            items={teacherResults}
          />
          <Table
            headers={["Student", "Subject", "Exam", "Score"]}
            rows={resultState.filteredItems.map((r) => [
                name(r.studentId),
                r.subject,
                r.exam,
                `${r.marks}/${r.total}`,
              ])}
          />
        </Panel>}
      </>
    </>
  );
}
