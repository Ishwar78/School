import React, { useState } from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import { today, relevantNotices } from "../shared/school";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { ANNOUNCEMENT_PRIORITY_OPTIONS } from "../shared/schoolOptions";

export default function TeacherAnnouncements({ view }) {
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
    marks,
    setMarks,
    period,
    setPeriod,
    setField,
    name,
    ownPeriods,
  } = view;
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const notices = relevantNotices(s.notices.items, "Teacher");
  const ownNotices = notices.filter(
    (notice) =>
      String(notice.createdBy || notice.teacherId || "") === String(teacher.id),
  );
  const noticeFilters = [
    { key: "priority", label: "Priority", options: ANNOUNCEMENT_PRIORITY_OPTIONS },
    { key: "audience", label: "Audience", includeDynamic: true },
    {
      key: "year",
      label: "Year",
      includeDynamic: true,
      value: (notice) => notice.date?.slice(0, 4),
    },
  ];
  const noticeState = useDashboardFilters(
    notices,
    noticeFilters,
    ["title", "description", "date", "priority", "audience"],
  );

  function saveAnnouncement(event) {
    event.preventDefault();
    if (!view.can("manageAnnouncements") || teacher?.id == null) {
      setError("You do not have permission to manage announcements.");
      return;
    }
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title || !description) {
      setError("Enter an announcement title and message.");
      return;
    }
    const changes = {
      ...form,
      title,
      description,
      audience: "Teachers",
      author: teacher.name,
      createdBy: teacher.id,
      date: form.date || today(),
      priority: form.priority || "Normal",
    };
    try {
      if (editingId) {
        const existing = ownNotices.find(
          (notice) => String(notice.id) === String(editingId),
        );
        if (!existing) {
          setError("This announcement is outside your authorised records.");
          return;
        }
        s.notices.updateForTeacher(existing.id, changes, teacher);
      } else {
        s.notices.addForTeacher(changes, teacher);
      }
    } catch (saveError) {
      setError(saveError.message || "Unable to save this announcement.");
      return;
    }
    setForm(null);
    setEditingId("");
    setError("");
  }

  function editAnnouncement(notice) {
    if (
      !view.can("manageAnnouncements") ||
      !ownNotices.some((item) => String(item.id) === String(notice.id))
    ) {
      setError("You can only edit announcements you created.");
      return;
    }
    setEditingId(notice.id);
    setForm({
      title: notice.title || "",
      description: notice.description || "",
      date: notice.date || today(),
      priority: notice.priority || "Normal",
    });
    setError("");
  }

  function deleteAnnouncement(notice) {
    if (
      !view.can("manageAnnouncements") ||
      !ownNotices.some((item) => String(item.id) === String(notice.id))
    ) {
      setError("You can only delete announcements you created.");
      return;
    }
    if (window.confirm(`Delete "${notice.title}"?`)) {
      try {
        s.notices.removeForTeacher(notice.id, teacher);
        setError("");
      } catch (deleteError) {
        setError(deleteError.message || "Unable to delete this announcement.");
      }
    }
  }

  return (
    <>
      <Panel title="School announcements">
        {view.can("manageAnnouncements") && (
          <button
            type="button"
            className="role-primary"
            onClick={() => {
              setEditingId("");
              setForm({ title: "", description: "", date: today(), priority: "Normal" });
              setError("");
            }}
          >
            Create announcement
          </button>
        )}
        {form && (
          <form className="role-form teacher-announcement-form" onSubmit={saveAnnouncement}>
            <label>Title<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></label>
            <label>Date<input required type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} /></label>
            <label>Priority<select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>{ANNOUNCEMENT_PRIORITY_OPTIONS.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
            <label className="wide">Message<textarea required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label>
            {error && <p className="wide attachment-error" role="alert">{error}</p>}
            <div className="wide role-actions">
              <button type="button" className="role-secondary" onClick={() => { setForm(null); setEditingId(""); setError(""); }}>Cancel</button>
              <button type="submit" className="role-primary">{editingId ? "Save Changes" : "Publish Announcement"}</button>
            </div>
          </form>
        )}
        {ownNotices.length > 0 && (
          <div className="role-announcement-management">
            <h3>Announcements you manage</h3>
            {ownNotices.map((notice) => (
              <div className="role-actions" key={notice.id}>
                <strong>{notice.title}</strong>
                <button type="button" className="role-secondary" onClick={() => editAnnouncement(notice)}>Edit</button>
                <button type="button" className="role-secondary" onClick={() => deleteAnnouncement(notice)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        {error && !form && <p className="attachment-error" role="alert">{error}</p>}
        <DashboardFilters
          state={noticeState}
          filters={noticeFilters}
          items={notices}
          showNoMatches={false}
        />
        <NoticeList
          items={noticeState.filteredItems}
          emptyMessage={
            notices.length
              ? "No announcements match these filters."
              : "No announcements have been posted yet."
          }
        />
      </Panel>
    </>
  );
}
