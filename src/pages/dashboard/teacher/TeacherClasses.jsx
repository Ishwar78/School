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
import { schoolClassId } from "../shared/school";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { SECTION_OPTIONS } from "../shared/schoolOptions";
import TeacherPersonalTimetable from "./TeacherPersonalTimetable";

export default function TeacherClasses({ view }) {
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
  const [showTimetable, setShowTimetable] = useState(false);
  const classFilters = [
    {
      key: "classId",
      label: "Class",
      options: ids,
      value: schoolClassId,
    },
    {
      key: "section",
      label: "Section",
      options: SECTION_OPTIONS,
      value: (schoolClass) =>
        String(schoolClassId(schoolClass)).split("-")[1] || "",
    },
  ];
  const classFilterState = useDashboardFilters(
    assigned,
    classFilters,
    [
      "id",
      "grade",
      "section",
      "classId",
      {
        value: (schoolClass) =>
          students
            .filter(
              (student) =>
                String(student.classId) === String(schoolClassId(schoolClass)),
            )
            .map((student) => student.name)
            .join(" "),
      },
    ],
  );

  return (
    <>
      <div className="teacher-classes-heading">
        <div>
          <span className="eyebrow">TEACHING WORKSPACE</span>
          <h1>My Classes</h1>
        </div>
        <button
          type="button"
          className="role-primary"
          onClick={() => setShowTimetable(true)}
        >
          My Timetable
        </button>
      </div>
      <Panel title="My assigned classes">
        <DashboardFilters
          state={classFilterState}
          filters={classFilters}
          items={assigned}
        />
        {assigned.length ? (
          <Table
            headers={["Class", "Students", "Class teacher", "Student names"]}
            rows={classFilterState.filteredItems.map((c) => [
              schoolClassId(c),
              students.filter((x) => x.classId === schoolClassId(c)).length,
              String(c.teacherId) === String(teacher.id) ? "Yes" : "Assigned",
              students
                .filter((x) => x.classId === schoolClassId(c))
                .map((x) => x.name)
                .join(", ") || "No students yet",
            ])}
          />
        ) : (
          <Empty>
            {assigned.length
              ? "No assigned classes match these filters."
              : "No classes have been assigned yet."}
          </Empty>
        )}
      </Panel>
      {showTimetable && (
        <TeacherPersonalTimetable
          teacher={teacher}
          periods={ownPeriods}
          allPeriods={s.timetable.items}
          assignedClasses={assigned}
          canManage={view.permissions.manageTimetable}
          onBack={() => setShowTimetable(false)}
        />
      )}
    </>
  );
}
