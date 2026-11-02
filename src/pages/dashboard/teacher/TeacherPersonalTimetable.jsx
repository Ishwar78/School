import React, { useMemo, useState } from "react";

import { useTimetable } from "../../../context/TimetableContext";
import { Panel } from "../shared/UI";
import { schoolClassId } from "../shared/school";
import { DAY_OPTIONS } from "../shared/schoolOptions";

const TEACHER_DAYS = [...DAY_OPTIONS, "Sunday"];
const WEEKDAYS = DAY_OPTIONS;

function listValues(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatClass(classId) {
  const [grade, section] = String(classId || "").split("-");
  return { grade: grade || "—", section: section || "—" };
}

export default function TeacherPersonalTimetable({
  teacher,
  periods,
  allPeriods,
  assignedClasses,
  canManage,
  onBack,
}) {
  const { data: timetable } = useTimetable();
  const [day, setDay] = useState(WEEKDAYS[0]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const dayPeriods = useMemo(
    () =>
      periods
        .filter((period) => period.day === day)
        .sort(
          (first, second) =>
            String(first.start).localeCompare(String(second.start)) ||
            Number(first.period || 0) - Number(second.period || 0),
        ),
    [day, periods],
  );

  const authorizedClassIds = new Set(
    [
      ...listValues(teacher?.classes),
      ...assignedClasses.map(schoolClassId),
    ].map(String),
  );
  const teacherSubjectList = [
    ...listValues(teacher?.subjects),
    ...listValues(teacher?.subject),
  ];
  const authorizedSubjects = [
    ...new Set(
      teacherSubjectList.length
        ? teacherSubjectList
        : periods.map((period) => period.subject).filter(Boolean).map(String),
    ),
  ];

  function edit(period) {
    if (!canManage || !teacher?.id) {
      setError("You do not have permission to manage timetable entries.");
      return;
    }
    if (
      String(period.teacherId) !== String(teacher?.id) ||
      !periods.some((ownPeriod) => String(ownPeriod.id) === String(period.id))
    ) {
      setError("You can only edit periods assigned to your account.");
      return;
    }
    setEditingId(String(period.id));
    setForm({
      day: period.day,
      period: String(period.period || ""),
      start: period.start || "",
      end: period.end || "",
      classId: String(period.classId || ""),
      subject: period.subject || "",
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId("");
    setForm(null);
    setError("");
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!canManage || !teacher?.id) {
      setError("You do not have permission to manage timetable entries.");
      return;
    }
    const original = allPeriods.find(
      (period) => String(period.id) === String(editingId),
    );
    if (
      !original ||
      String(original.teacherId) !== String(teacher?.id) ||
      !periods.some((period) => String(period.id) === String(editingId))
    ) {
      setError("This timetable period is not assigned to your account.");
      return;
    }
    if (!WEEKDAYS.includes(form.day)) {
      setError("Lessons can only be scheduled Monday through Saturday.");
      return;
    }
    if (
      !Number.isInteger(Number(form.period)) ||
      Number(form.period) < 1
    ) {
      setError("Enter a valid period number.");
      return;
    }
    if (!form.start || !form.end || form.start >= form.end) {
      setError("The end time must be later than the start time.");
      return;
    }
    if (!authorizedClassIds.has(String(form.classId))) {
      setError("You are not assigned to the selected class.");
      return;
    }
    if (!authorizedSubjects.includes(String(form.subject))) {
      setError("You are not assigned to the selected subject.");
      return;
    }

    const conflict = allPeriods.find(
      (period) =>
        String(period.id) !== String(editingId) &&
        period.day === form.day &&
        form.start < period.end &&
        period.start < form.end &&
        (String(period.teacherId) === String(teacher.id) ||
          String(period.classId) === String(form.classId)),
    );
    if (conflict) {
      setError(
        String(conflict.teacherId) === String(teacher.id)
          ? "You already have a period scheduled during that time."
          : "The selected class already has a period during that time.",
      );
      return;
    }

    try {
      timetable.updateForTeacher(
        original.id,
        {
          ...form,
          period: Number(form.period),
          teacherId: teacher.id,
        },
        teacher,
        [...authorizedClassIds],
        authorizedSubjects,
      );
      cancelEdit();
    } catch (saveError) {
      setError(saveError.message || "Unable to update this timetable period.");
    }
  }

  const rows = dayPeriods.map((period) => {
    const schoolClass = formatClass(period.classId);
    return (
      <tr key={period.id}>
        <td>Period {period.period || "—"}</td>
        <td>{period.start}–{period.end}</td>
        <td>{schoolClass.grade}</td>
        <td>{schoolClass.section}</td>
        <td>{period.subject || "—"}</td>
        {canManage && (
          <td>
            <button
              type="button"
              className="role-secondary"
              onClick={() => edit(period)}
            >
              Edit
            </button>
          </td>
        )}
      </tr>
    );
  });

  for (let index = 1; index < dayPeriods.length; index += 1) {
    const previous = dayPeriods[index - 1];
    const current = dayPeriods[index];

    if (previous.end < current.start) {
      rows.splice(
        index * 2 - 1,
        0,
        <tr key={`free-${previous.id}-${current.id}`}>
          <td>Free period</td>
          <td>{previous.end}–{current.start}</td>
          <td>—</td>
          <td>—</td>
          <td>No class scheduled</td>
          {canManage && <td>—</td>}
        </tr>,
      );
    }
  }

  return (
    <section className="teacher-timetable-panel">
      <div className="teacher-timetable-heading">
        <div>
          <span className="eyebrow">PERSONAL SCHEDULE</span>
          <h2>My Timetable</h2>
          <p>{teacher?.name || "Teacher"} · Monday to Saturday</p>
        </div>
        <button type="button" className="secondary-btn" onClick={onBack}>
          Back to My Classes
        </button>
      </div>
      <div className="timetable-days" aria-label="Choose timetable day">
        {TEACHER_DAYS.map((option) => (
          <button
            key={option}
            type="button"
            className={day === option ? "active" : ""}
            aria-pressed={day === option}
            onClick={() => setDay(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {day === "Sunday" ? (
        <Panel title="Sunday">
          <p className="timetable-holiday">Holiday — no lessons are scheduled.</p>
        </Panel>
      ) : (
        <Panel title={`${day} periods`}>
          {dayPeriods.length ? (
            <div className="role-table-wrap">
              <table className="role-table">
                <thead>
                  <tr>
                    {[
                      "Period",
                      "Time",
                      "Class",
                      "Section",
                      "Subject",
                      ...(canManage ? ["Actions"] : []),
                    ].map(
                      (header) => (
                        <th key={header}>{header}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          ) : (
            <p className="timetable-holiday">
              No lessons are scheduled for this day.
            </p>
          )}
        </Panel>
      )}
      {form && (
        <Panel title="Edit timetable period">
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <form className="role-form" onSubmit={saveEdit}>
            <label>
              Day
              <select
                required
                value={form.day}
                onChange={(event) =>
                  setForm((current) => ({ ...current, day: event.target.value }))
                }
              >
                {WEEKDAYS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Period number
              <input
                required
                min="1"
                step="1"
                type="number"
                value={form.period}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    period: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Start time
              <input
                required
                type="time"
                value={form.start}
                onChange={(event) =>
                  setForm((current) => ({ ...current, start: event.target.value }))
                }
              />
            </label>
            <label>
              End time
              <input
                required
                type="time"
                value={form.end}
                onChange={(event) =>
                  setForm((current) => ({ ...current, end: event.target.value }))
                }
              />
            </label>
            <label>
              Class
              <select
                required
                value={form.classId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    classId: event.target.value,
                  }))
                }
              >
                {[...authorizedClassIds].map((classId) => (
                  <option key={classId} value={classId}>
                    {classId}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Subject
              <select
                required
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    subject: event.target.value,
                  }))
                }
              >
                {authorizedSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
            <div className="timetable-edit-actions">
              <button type="button" className="role-secondary" onClick={cancelEdit}>
                Cancel
              </button>
              <button type="submit" className="role-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Panel>
      )}
    </section>
  );
}
