
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  GraduationCap,
  ClipboardCheck
} from "lucide-react";

import "./StudentAttendance.css";

const CLASS_OPTIONS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th"
];

const SECTION_OPTIONS = ["A", "B", "C", "D"];

const ATTENDANCE_STATUS_OPTIONS = [
  "Present",
  "Absent",
  "Late",
  "Half Day"
];

const ATTENDANCE_STORAGE_PREFIX = "veda_student_attendance_";

function getLocalDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSavedStudents() {
  try {
    const saved = localStorage.getItem("veda_admin_students");

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load student records", error);
    return [];
  }
}

function getAttendanceForDate(date) {
  try {
    const saved = localStorage.getItem(
      `${ATTENDANCE_STORAGE_PREFIX}${date}`
    );

    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Unable to load attendance", error);
    return {};
  }
}

// Supports both new format and old format such as 10-A.

function getStudentClass(student) {
  const classValue = String(student.classId || "");

  if (CLASS_OPTIONS.includes(classValue)) {
    return classValue;
  }

  const oldFormat = classValue.match(
    /^(1[0-2]|[1-9])-(A|B|C|D)$/i
  );

  if (oldFormat) {
    return `${oldFormat[1]}${getOrdinalSuffix(
      Number(oldFormat[1])
    )}`;
  }

  return classValue;
}

function getOrdinalSuffix(number) {
  if (number === 1) return "st";
  if (number === 2) return "nd";
  if (number === 3) return "rd";
  return "th";
}

function getStudentSection(student) {
  if (student.section) {
    return String(student.section).toUpperCase();
  }

  const oldFormat = String(student.classId || "").match(
    /-(A|B|C|D)$/i
  );

  return oldFormat ? oldFormat[1].toUpperCase() : "";
}

function getStudentClassLabel(student) {
  const className = getStudentClass(student);
  const section = getStudentSection(student);

  return section
    ? `${className} - ${section}`
    : className || "Not Assigned";
}

// Calculate attendance using all saved attendance dates.

function getOverallAttendance(studentId) {
  try {
    const attendanceDates = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (
        key &&
        key.startsWith(ATTENDANCE_STORAGE_PREFIX)
      ) {
        attendanceDates.push(key);
      }
    }

    let totalDays = 0;
    let attendedDays = 0;

    attendanceDates.forEach((key) => {
      try {
        const records = JSON.parse(
          localStorage.getItem(key) || "{}"
        );

        const status = records[studentId];

        if (!status) return;

        totalDays++;

        if (status === "Present" || status === "Late") {
          attendedDays += 1;
        } else if (status === "Half Day") {
          attendedDays += 0.5;
        }
      } catch {
        // Ignore invalid attendance records.
      }
    });

    if (totalDays === 0) {
      return null;
    }

    return Math.round((attendedDays / totalDays) * 100);
  } catch {
    return null;
  }
}

export default function StudentAttendance() {
  const [date, setDate] = useState(getLocalDate);

  const [students, setStudents] = useState(getSavedStudents);

  const [attendanceMap, setAttendanceMap] = useState(
    () => getAttendanceForDate(getLocalDate())
  );

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Refresh students from Student Information.

  const refreshStudents = () => {
    setStudents(getSavedStudents());
  };

  // Reload attendance whenever selected date changes.

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setAttendanceMap(getAttendanceForDate(newDate));
  };

  // Save attendance for selected date.

  const saveAttendance = (updatedMap) => {
    setAttendanceMap(updatedMap);

    try {
      localStorage.setItem(
        `${ATTENDANCE_STORAGE_PREFIX}${date}`,
        JSON.stringify(updatedMap)
      );
    } catch (error) {
      console.error("Failed to save attendance", error);
      alert("Unable to save attendance. Please check browser storage.");
    }
  };

  // Mark individual student.

  const markStudent = (studentId, status) => {
    const updatedMap = {
      ...attendanceMap,
      [studentId]: status
    };

    saveAttendance(updatedMap);
  };

  // Mark all currently filtered students present.

  const markAllPresent = () => {
    if (shownStudents.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Mark all ${shownStudents.length} displayed students as Present?`
    );

    if (!confirmed) return;

    const updatedMap = { ...attendanceMap };

    shownStudents.forEach((student) => {
      updatedMap[student.id] = "Present";
    });

    saveAttendance(updatedMap);
  };

  // Prepare student records with attendance details.

  const enrichedStudents = useMemo(() => {
    return students.map((student) => ({
      ...student,
      attendanceStatus:
        attendanceMap[student.id] || "Not Marked",
      className: getStudentClass(student),
      sectionName: getStudentSection(student),
      classLabel: getStudentClassLabel(student),
      attendanceRate: getOverallAttendance(student.id)
    }));
  }, [students, attendanceMap]);

  // Search and filters.

  const shownStudents = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return enrichedStudents
      .filter((student) => {
        const matchesSearch =
          (student.name || "").toLowerCase().includes(searchText) ||
          (student.admission || "").toLowerCase().includes(searchText) ||
          (student.roll || "").toLowerCase().includes(searchText) ||
          (student.phone || "").includes(searchText);

        const matchesClass =
          !filterClass ||
          student.className === filterClass;

        const matchesSection =
          !filterSection ||
          student.sectionName === filterSection;

        const matchesStatus =
          !filterStatus ||
          student.attendanceStatus === filterStatus;

        return (
          matchesSearch &&
          matchesClass &&
          matchesSection &&
          matchesStatus
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [
    enrichedStudents,
    search,
    filterClass,
    filterSection,
    filterStatus
  ]);

  // Attendance summary for currently displayed students.

  const presentCount = shownStudents.filter(
    (student) => student.attendanceStatus === "Present"
  ).length;

  const absentCount = shownStudents.filter(
    (student) => student.attendanceStatus === "Absent"
  ).length;

  const lateCount = shownStudents.filter(
    (student) => student.attendanceStatus === "Late"
  ).length;

  const halfDayCount = shownStudents.filter(
    (student) => student.attendanceStatus === "Half Day"
  ).length;

  const notMarkedCount = shownStudents.filter(
    (student) => student.attendanceStatus === "Not Marked"
  ).length;

  const markedCount =
    presentCount + absentCount + lateCount + halfDayCount;

  const attendancePercentage =
    shownStudents.length > 0
      ? Math.round(
          (
            (presentCount + lateCount + halfDayCount * 0.5) /
            shownStudents.length
          ) * 100
        )
      : 0;

  return (
    <section className="student-attendance">

      {/* PAGE HEADER */}

      <div className="attendance-page-header">

        <div>
          <span className="attendance-eyebrow">
            VEDA INTERNATIONAL SCHOOL
          </span>

          <h1>Student Attendance</h1>

          <p>
            Manage daily student attendance and monitor attendance records.
          </p>
        </div>

        <button
          type="button"
          className="attendance-refresh-btn"
          onClick={refreshStudents}
        >
          <RefreshCw size={16} />
          Refresh Students
        </button>

      </div>

      {/* STAT CARDS */}

      <div className="attendance-stats">

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon navy">
            <Users size={23} />
          </div>

          <div>
            <span>Enrolled Students</span>
            <h2>{shownStudents.length}</h2>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon green">
            <CheckCircle size={23} />
          </div>

          <div>
            <span>Present Today</span>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon red">
            <XCircle size={23} />
          </div>

          <div>
            <span>Absent Today</span>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon orange">
            <Clock size={23} />
          </div>

          <div>
            <span>Late / Half Day</span>
            <h2>{lateCount + halfDayCount}</h2>
          </div>
        </div>

      </div>

      {/* DATE AND ATTENDANCE SUMMARY */}

      <div className="attendance-control-card">

        <div className="attendance-date-control">

          <div className="attendance-control-icon">
            <CalendarDays size={21} />
          </div>

          <div className="attendance-date-content">
            <label htmlFor="attendance-date">
              Attendance Date
            </label>

            <input
              id="attendance-date"
              type="date"
              value={date}
              max={getLocalDate()}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

        </div>

        <div className="attendance-summary">

          <div>
            <span>Marked</span>
            <strong>{markedCount}/{shownStudents.length}</strong>
          </div>

          <div>
            <span>Not Marked</span>
            <strong>{notMarkedCount}</strong>
          </div>

          <div>
            <span>Attendance</span>
            <strong>{attendancePercentage}%</strong>
          </div>

        </div>

        <button
          type="button"
          className="attendance-mark-all-btn"
          onClick={markAllPresent}
          disabled={shownStudents.length === 0}
        >
          <CheckCircle size={17} />
          Mark All Present
        </button>

      </div>

      {/* FILTERS */}

      <div className="attendance-filter-card">

        <div className="attendance-filter-heading">
          <div>
            <span className="attendance-eyebrow">
              ATTENDANCE RECORDS
            </span>

            <h2>Daily Student List</h2>

            <p>
              Search students and mark their attendance.
            </p>
          </div>

          <span className="attendance-count-badge">
            {shownStudents.length} Students
          </span>
        </div>

        <div className="attendance-toolbar">

          <div className="attendance-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search name, admission no. or roll no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>

            {CLASS_OPTIONS.map((cls) => (
              <option key={cls} value={cls}>
                {cls} Class
              </option>
            ))}
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="">All Sections</option>

            {SECTION_OPTIONS.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>

            {ATTENDANCE_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}

            <option value="Not Marked">Not Marked</option>
          </select>

        </div>

        {/* ATTENDANCE TABLE */}

        <div className="attendance-table-wrapper">

          <table className="attendance-table">

            <thead>
              <tr>
                <th>Student Details</th>
                <th>Class / Section</th>
                <th>Roll No.</th>
                <th>Overall Rate</th>
                <th>Daily Status</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>

            <tbody>

              {shownStudents.length > 0 ? (

                shownStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      <div className="attendance-student-identity">

                        <div className="attendance-student-avatar">
                          {(student.name || "S").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{student.name || "Unnamed Student"}</strong>
                          <small>
                            {student.admission || "No Admission Number"}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="attendance-class-badge">
                        {student.classLabel}
                      </span>
                    </td>

                    <td>
                      {student.roll || "—"}
                    </td>

                    <td>
                      <div className="attendance-rate-cell">

                        <strong>
                          {student.attendanceRate === null
                            ? "—"
                            : `${student.attendanceRate}%`}
                        </strong>

                        {student.attendanceRate !== null && (
                          <div className="attendance-rate-track">
                            <div
                              className="attendance-rate-fill"
                              style={{
                                width: `${student.attendanceRate}%`
                              }}
                            />
                          </div>
                        )}

                      </div>
                    </td>

                    <td>
                      <span
                        className={`attendance-status-badge ${student.attendanceStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {student.attendanceStatus}
                      </span>
                    </td>

                    <td>
                      <div className="attendance-action-buttons">

                        {ATTENDANCE_STATUS_OPTIONS.map((status) => (

                          <button
                            key={status}
                            type="button"
                            className={`attendance-action-btn ${status
                              .toLowerCase()
                              .replace(" ", "-")} ${
                              student.attendanceStatus === status
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => markStudent(student.id, status)}
                          >
                            {status}
                          </button>

                        ))}

                      </div>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">

                    <div className="attendance-empty">

                      <ClipboardCheck size={43} />

                      <h3>
                        {students.length === 0
                          ? "No Students Available"
                          : "No Students Found"}
                      </h3>

                      <p>
                        {students.length === 0
                          ? "Please add students from Student Information first, then refresh this page."
                          : "Try changing your search or filters."}
                      </p>

                      {students.length === 0 && (
                        <button
                          type="button"
                          className="attendance-refresh-btn"
                          onClick={refreshStudents}
                        >
                          <RefreshCw size={16} />
                          Refresh Student List
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* TABLE FOOTER */}

        <div className="attendance-table-footer">
          <span>
            Showing {shownStudents.length} of {students.length} students
          </span>

          <span>
            <GraduationCap size={15} />
            VEDA International School
          </span>
        </div>

      </div>

    </section>
  );
}
