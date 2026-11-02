
import React, { useMemo, useState } from "react";
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

import "./TeacherAttendance.css";

const DEPARTMENT_OPTIONS = [
  "Science",
  "Mathematics",
  "English",
  "Social Studies",
  "Hindi",
  "Arts & Sports",
  "Computer Science",
  "Administration"
];

const TEACHER_ATTENDANCE_STATUS = [
  "Present",
  "Absent",
  "On Leave",
  "Half Day"
];

const STORAGE_PREFIX = "veda_teacher_attendance_";

// LOCAL DATE

function getLocalDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// LOAD TEACHERS FROM TEACHER INFORMATION

function getSavedTeachers() {
  try {
    const saved = localStorage.getItem("veda_admin_teachers");

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load teacher records", error);
    return [];
  }
}

// LOAD DATE-WISE ATTENDANCE

function getAttendanceForDate(date) {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${date}`);

    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Unable to load teacher attendance", error);
    return {};
  }
}

// TEACHER INITIALS

function getInitials(name) {
  return String(name || "Teacher")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// GET TEACHER SUBJECTS

function getSubjects(teacher) {
  if (Array.isArray(teacher.subjects)) {
    return teacher.subjects;
  }

  return teacher.subject ? [teacher.subject] : [];
}

// GET ASSIGNED CLASSES

function getClasses(teacher) {
  if (Array.isArray(teacher.classes)) {
    return teacher.classes;
  }

  return teacher.classes
    ? String(teacher.classes).split(",").map((item) => item.trim())
    : [];
}

// CALCULATE OVERALL ATTENDANCE

function getOverallAttendance(teacherId) {
  try {
    let totalDays = 0;
    let attendedDays = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (!key || !key.startsWith(STORAGE_PREFIX)) {
        continue;
      }

      try {
        const records = JSON.parse(
          localStorage.getItem(key) || "{}"
        );

        const status = records[teacherId];

        if (!status) continue;

        totalDays++;

        if (status === "Present") {
          attendedDays += 1;
        } else if (status === "Half Day") {
          attendedDays += 0.5;
        }
      } catch {
        // Ignore invalid attendance data.
      }
    }

    if (!totalDays) return null;

    return Math.round((attendedDays / totalDays) * 100);
  } catch {
    return null;
  }
}

export default function TeacherAttendance() {
  const [date, setDate] = useState(getLocalDate);

  const [teachers, setTeachers] = useState(getSavedTeachers);

  const [attendanceMap, setAttendanceMap] = useState(
    () => getAttendanceForDate(getLocalDate())
  );

  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // REFRESH TEACHER RECORDS

  const refreshTeachers = () => {
    setTeachers(getSavedTeachers());
  };

  // CHANGE ATTENDANCE DATE

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setAttendanceMap(getAttendanceForDate(newDate));
  };

  // SAVE ATTENDANCE

  const saveAttendance = (updatedMap) => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${date}`,
        JSON.stringify(updatedMap)
      );

      setAttendanceMap(updatedMap);
    } catch (error) {
      console.error("Failed to save teacher attendance", error);
      alert("Unable to save attendance. Please check browser storage.");
    }
  };

  // MARK INDIVIDUAL TEACHER

  const markTeacher = (teacherId, status) => {
    const updatedMap = {
      ...attendanceMap,
      [teacherId]: status
    };

    saveAttendance(updatedMap);
  };

  // ENRICH TEACHER RECORDS

  const enrichedTeachers = useMemo(() => {
    return teachers.map((teacher) => ({
      ...teacher,
      attendanceStatus:
        attendanceMap[teacher.id] || "Not Marked",
      attendanceRate: getOverallAttendance(teacher.id),
      subjectsList: getSubjects(teacher),
      classesList: getClasses(teacher),
      designation: teacher.role || "Subject Teacher"
    }));
  }, [teachers, attendanceMap]);

  // SEARCH AND FILTER

  const shownTeachers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return enrichedTeachers
      .filter((teacher) => {
        const matchesSearch =
          (teacher.name || "").toLowerCase().includes(searchText) ||
          (teacher.employee || "").toLowerCase().includes(searchText) ||
          (teacher.email || "").toLowerCase().includes(searchText) ||
          (teacher.phone || "").includes(searchText) ||
          (teacher.department || "").toLowerCase().includes(searchText) ||
          teacher.subjectsList.join(" ").toLowerCase().includes(searchText) ||
          teacher.classesList.join(" ").toLowerCase().includes(searchText);

        const matchesDepartment =
          !filterDepartment ||
          teacher.department === filterDepartment;

        const matchesStatus =
          !filterStatus ||
          teacher.attendanceStatus === filterStatus;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
  }, [
    enrichedTeachers,
    search,
    filterDepartment,
    filterStatus
  ]);

  // STATISTICS

  const presentCount = shownTeachers.filter(
    (teacher) => teacher.attendanceStatus === "Present"
  ).length;

  const absentCount = shownTeachers.filter(
    (teacher) =>
      teacher.attendanceStatus === "Absent" ||
      teacher.attendanceStatus === "On Leave"
  ).length;

  const halfDayCount = shownTeachers.filter(
    (teacher) => teacher.attendanceStatus === "Half Day"
  ).length;

  const notMarkedCount = shownTeachers.filter(
    (teacher) => teacher.attendanceStatus === "Not Marked"
  ).length;

  const markedCount =
    presentCount + absentCount + halfDayCount;

  const attendancePercentage =
    shownTeachers.length > 0
      ? Math.round(
          (
            (presentCount + halfDayCount * 0.5) /
            shownTeachers.length
          ) * 100
        )
      : 0;

  // MARK ALL DISPLAYED TEACHERS PRESENT

  const markAllPresent = () => {
    if (shownTeachers.length === 0) return;

    const confirmed = window.confirm(
      `Mark all ${shownTeachers.length} displayed teachers as Present?`
    );

    if (!confirmed) return;

    const updatedMap = { ...attendanceMap };

    shownTeachers.forEach((teacher) => {
      updatedMap[teacher.id] = "Present";
    });

    saveAttendance(updatedMap);
  };

  return (
    <section className="teacher-attendance">

      {/* PAGE HEADER */}

      <div className="teacher-attendance-header">

        <div>
          <span className="teacher-attendance-eyebrow">
            VEDA INTERNATIONAL SCHOOL
          </span>

          <h1>Teacher Attendance</h1>

          <p>
            Manage daily faculty attendance, leaves and staff presence.
          </p>
        </div>

        <button
          type="button"
          className="teacher-attendance-refresh"
          onClick={refreshTeachers}
        >
          <RefreshCw size={16} />
          Refresh Teachers
        </button>

      </div>

      {/* DASHBOARD CARDS */}

      <div className="teacher-attendance-stats">

        <div className="teacher-attendance-stat-card">
          <div className="teacher-attendance-stat-icon navy">
            <Users size={23} />
          </div>

          <div>
            <span>Total Faculty</span>
            <h2>{shownTeachers.length}</h2>
          </div>
        </div>

        <div className="teacher-attendance-stat-card">
          <div className="teacher-attendance-stat-icon green">
            <CheckCircle size={23} />
          </div>

          <div>
            <span>Present Today</span>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="teacher-attendance-stat-card">
          <div className="teacher-attendance-stat-icon red">
            <XCircle size={23} />
          </div>

          <div>
            <span>Absent / On Leave</span>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="teacher-attendance-stat-card">
          <div className="teacher-attendance-stat-icon orange">
            <Clock size={23} />
          </div>

          <div>
            <span>Half Day</span>
            <h2>{halfDayCount}</h2>
          </div>
        </div>

      </div>

      {/* DATE AND SUMMARY */}

      <div className="teacher-attendance-control">

        <div className="teacher-attendance-date">

          <div className="teacher-attendance-date-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <label htmlFor="teacher-attendance-date">
              Attendance Date
            </label>

            <input
              id="teacher-attendance-date"
              type="date"
              value={date}
              max={getLocalDate()}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

        </div>

        <div className="teacher-attendance-summary">

          <div>
            <span>Marked</span>
            <strong>
              {markedCount}/{shownTeachers.length}
            </strong>
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
          className="teacher-mark-all-btn"
          onClick={markAllPresent}
          disabled={shownTeachers.length === 0}
        >
          <CheckCircle size={17} />
          Mark All Present
        </button>

      </div>

      {/* TEACHER RECORDS */}

      <div className="teacher-attendance-list">

        <div className="teacher-attendance-list-header">

          <div>
            <span className="teacher-attendance-eyebrow">
              FACULTY & STAFF MANAGEMENT
            </span>

            <h2>Daily Teacher Attendance</h2>

            <p>
              Search teachers and manage daily attendance records.
            </p>
          </div>

          <span className="teacher-attendance-count">
            {shownTeachers.length} Teachers
          </span>

        </div>

        {/* SEARCH AND FILTER */}

        <div className="teacher-attendance-toolbar">

          <div className="teacher-attendance-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search teacher name, ID, email or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>

            {DEPARTMENT_OPTIONS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>

            {TEACHER_ATTENDANCE_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}

            <option value="Not Marked">Not Marked</option>
          </select>

        </div>

        {/* TABLE */}

        <div className="teacher-attendance-table-wrapper">

          <table className="teacher-attendance-table">

            <thead>
              <tr>
                <th>Teacher Details</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Designation</th>
                <th>Assigned Classes</th>
                <th>Attendance Rate</th>
                <th>Daily Status</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>

            <tbody>

              {shownTeachers.length > 0 ? (

                shownTeachers.map((teacher) => (

                  <tr key={teacher.id}>

                    <td>
                      <div className="teacher-attendance-identity">

                        <div className="teacher-attendance-avatar">
                          {getInitials(teacher.name)}
                        </div>

                        <div>
                          <strong>{teacher.name}</strong>
                          <small>
                            {teacher.employee || "No Employee ID"}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      <strong>
                        {teacher.department || "—"}
                      </strong>
                    </td>

                    <td>
                      <div className="teacher-attendance-subjects">
                        {teacher.subjectsList.join(", ") || "—"}
                      </div>
                    </td>

                    <td>
                      <span className="teacher-designation-badge">
                        {teacher.designation}
                      </span>
                    </td>

                    <td>
                      <div className="teacher-attendance-classes">
                        {teacher.classesList.length > 0
                          ? teacher.classesList.join(", ")
                          : "—"}
                      </div>
                    </td>

                    <td>
                      <div className="teacher-attendance-rate">

                        <strong>
                          {teacher.attendanceRate === null
                            ? "—"
                            : `${teacher.attendanceRate}%`}
                        </strong>

                        {teacher.attendanceRate !== null && (
                          <div className="teacher-attendance-progress">
                            <div
                              style={{
                                width: `${teacher.attendanceRate}%`
                              }}
                            />
                          </div>
                        )}

                      </div>
                    </td>

                    <td>
                      <span
                        className={`teacher-daily-status ${teacher.attendanceStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {teacher.attendanceStatus}
                      </span>
                    </td>

                    <td>
                      <div className="teacher-attendance-actions">

                        {TEACHER_ATTENDANCE_STATUS.map((status) => (

                          <button
                            type="button"
                            key={status}
                            className={`teacher-attendance-action-btn ${status
                              .toLowerCase()
                              .replace(" ", "-")} ${
                              teacher.attendanceStatus === status
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => markTeacher(teacher.id, status)}
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
                  <td colSpan="8">

                    <div className="teacher-attendance-empty">

                      <ClipboardCheck size={43} />

                      <h3>
                        {teachers.length === 0
                          ? "No Teachers Available"
                          : "No Teachers Found"}
                      </h3>

                      <p>
                        {teachers.length === 0
                          ? "Please add teachers in Teacher Information and refresh this page."
                          : "Try changing your search or department filters."}
                      </p>

                      {teachers.length === 0 && (
                        <button
                          type="button"
                          className="teacher-attendance-refresh"
                          onClick={refreshTeachers}
                        >
                          <RefreshCw size={16} />
                          Refresh Teacher List
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="teacher-attendance-footer">

          <span>
            Showing {shownTeachers.length} of {teachers.length} teachers
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
