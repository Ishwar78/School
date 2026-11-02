import React, { useState } from "react";

import { useAttendance } from "../../../context/AttendanceContext";
import { useStudent } from "../../../context/StudentContext";
import { useTeacher } from "../../../context/TeacherContext";

import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";
import {
  ATTENDANCE_FILTER_OPTIONS,
  ATTENDANCE_STATUS_OPTIONS,
  CLASS_OPTIONS,
  DEPARTMENT_OPTIONS,
  SCHOOL_STATUS_OPTIONS,
  SECTION_OPTIONS,
} from "../shared/schoolOptions";

export default function AttendancePage({ role }) {
  const { data } = useAttendance();
  const { data: students } = useStudent();
  const { data: teachers } = useTeacher();

  const people = role === "student" ? students.items : teachers.items;

  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [search, setSearch] = useState("");
  const [values, setValues] = useState({});
  const [sort, setSort] = useState("az");

  const current = data.items.filter((a) => a.role === role && a.date === date);

  const enriched = people.map((person) => ({
    ...person,
    attendanceStatus:
      current.find((a) => a.personId === person.id)?.status || "Not marked",
    recordedBy: current.find((a) => a.personId === person.id)?.recordedBy || "",
    section: person.classId?.split("-")[1] || "",
    attendanceRate: (() => {
      const records = data.items.filter(
        (a) => a.role === role && a.personId === person.id && a.date <= date,
      );

      return records.length
        ? Math.round(
            (records.filter((a) => a.status === "Present").length /
              records.length) *
              100,
          )
        : 0;
    })(),
  }));

  const filters =
    role === "student"
      ? [
          {
            key: "classId",
            label: "Class",
            options: CLASS_OPTIONS,
            includeDynamic: true,
          },
          { key: "section", label: "Section", options: SECTION_OPTIONS },
          {
            key: "status",
            label: "Student status",
            options: SCHOOL_STATUS_OPTIONS,
          },
          {
            key: "attendanceStatus",
            label: "Attendance status",
            options: ATTENDANCE_FILTER_OPTIONS,
          },
          { key: "recordedBy", label: "Marked by" },
          {
            key: "rateMin",
            label: "Attendance % minimum",
            type: "number",
            compare: "min",
            value: (i) => i.attendanceRate,
          },
          {
            key: "rateMax",
            label: "Attendance % maximum",
            type: "number",
            compare: "max",
            value: (i) => i.attendanceRate,
          },
        ]
      : [
          {
            key: "department",
            label: "Department",
            options: DEPARTMENT_OPTIONS,
            includeDynamic: true,
          },
          {
            key: "status",
            label: "Teacher status",
            options: SCHOOL_STATUS_OPTIONS,
          },
          {
            key: "attendanceStatus",
            label: "Attendance status",
            options: ATTENDANCE_FILTER_OPTIONS,
          },
          {
            key: "rateMin",
            label: "Attendance % minimum",
            type: "number",
            compare: "min",
            value: (i) => i.attendanceRate,
          },
          {
            key: "rateMax",
            label: "Attendance % maximum",
            type: "number",
            compare: "max",
            value: (i) => i.attendanceRate,
          },
        ];

  const shown = applyFilters(enriched, search, filters, values, sort);

  function mark(personId, status) {
    const existing = current.find((a) => a.personId === personId);
    if (existing) data.update(existing.id, { status });
    else data.add({ role, personId, date, status, recordedBy: "Admin" });
  }
  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">DAILY RECORDS</span>
          <h1>{role === "student" ? "Student" : "Teacher"} Attendance</h1>
          <p>
            Review and mark attendance for the selected date. Historical
            attendance contributes to each person's percentage.
          </p>
        </div>
      </div>

      <div className="mini-stats">
        <div className="panel">
          <strong>{shown.length}</strong>
          <span>Matching people</span>
        </div>

        <div className="panel">
          <strong>
            {shown.filter((p) => p.attendanceStatus === "Present").length}
          </strong>
          <span>Present on selected date</span>
        </div>

        <div className="panel">
          <strong>
            {shown.filter((p) => p.attendanceStatus === "Absent").length}
          </strong>
          <span>Absent on selected date</span>
        </div>
      </div>

      <div className="attendance-date panel">
        <label>
          Attendance date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <span>Change the date to review or correct earlier records.</span>
      </div>
      <FilterPanel
        search={search}
        setSearch={setSearch}
        filters={filters}
        values={values}
        setValues={setValues}
        items={enriched}
        count={shown.length}
        total={people.length}
        sort={sort}
        setSort={setSort}
        searchPlaceholder="Search name, ID, class, department..."
      />
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>{role === "student" ? "Class" : "Department"}</th>
              <th>Attendance %</th>
              <th>Status</th>
              <th>Mark attendance</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((person) => (
              <tr key={person.id}>
                <td>
                  <strong>{person.name}</strong>
                </td>
                <td>
                  {role === "student" ? person.classId : person.department}
                </td>
                <td>{person.attendanceRate}%</td>
                <td>
                  <span
                    className={`status ${person.attendanceStatus.toLowerCase().replace(" ", "-")}`}
                  >
                    {person.attendanceStatus}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {ATTENDANCE_STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        className={
                          status === "Present"
                            ? "present-btn"
                            : status === "Absent"
                              ? "absent-btn"
                              : "secondary-btn"
                        }
                        onClick={() => mark(person.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No matching people. Clear filters or add records first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
