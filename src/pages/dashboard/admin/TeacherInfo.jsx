import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  Eye,
  Pencil,
  Shield,
  UserRound,
  X,
} from "lucide-react";

import { useTeacher } from "../../../context/TeacherContext";
import { useClass } from "../../../context/ClassContext";
import FilterPanel from "./FilterPanel";
import { applyFilters } from "./filterUtils";
import { teacherFilters } from "./moduleFilters";
import {
  getTeacherRole,
  getTeacherSubjects,
  TEACHER_ROLE_OPTIONS,
} from "../shared/school";
import {
  DEPARTMENT_OPTIONS,
  SUBJECT_OPTIONS,
} from "../shared/schoolOptions";

const emptyTeacher = {
  employee: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  subjects: [],
  classes: [],
  classTeacherClasses: [],
  status: "Active",
};

function values(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function initials(name) {
  return String(name || "Teacher")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function teacherDraft(teacher) {
  return { role: getTeacherRole(teacher) };
}

export default function TeacherInfo() {
  const { data: teacherData } = useTeacher();
  const { data: classData } = useClass();
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [sort, setSort] = useState("newest");
  const [menuId, setMenuId] = useState("");
  const [drawerTeacher, setDrawerTeacher] = useState(null);
  const [draft, setDraft] = useState(null);
  const [formError, setFormError] = useState("");
  const [detailsTeacher, setDetailsTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editForm, setEditForm] = useState(emptyTeacher);

  const subjects = useMemo(
    () =>
      [...new Set([
        ...SUBJECT_OPTIONS,
        ...teacherData.items.flatMap((teacher) =>
          values(teacher.subjects || teacher.subject),
        ),
      ])],
    [teacherData.items],
  );
  const classes = useMemo(
    () =>
      classData.items
        .map((schoolClass) => ({
          id: String(schoolClass.classId || schoolClass.id ||
            `${schoolClass.grade}-${schoolClass.section}`),
          label: String(schoolClass.classId || schoolClass.id ||
            `${schoolClass.grade}-${schoolClass.section}`),
        }))
        .filter((schoolClass) => schoolClass.id && schoolClass.id !== "undefined"),
    [classData.items],
  );
  const filteredTeachers = applyFilters(
    teacherData.items,
    search,
    teacherFilters,
    filterValues,
    sort,
    [
      "name",
      "email",
      "employee",
      { key: "subjects", value: getTeacherSubjects },
      "classes",
      { key: "role", value: getTeacherRole },
    ],
  );

  function openRoles(teacher) {
    setDrawerTeacher(teacher);
    setDraft(teacherDraft(teacher));
    setMenuId("");
  }

  function closeRoles() {
    setDrawerTeacher(null);
    setDraft(null);
  }

  function saveRoles(event) {
    event.preventDefault();
    if (!drawerTeacher || !draft) return;
    teacherData.update(drawerTeacher.id, {
      role: draft.role,
      roles: undefined,
    });
    closeRoles();
  }

  function startEdit(teacher) {
    setEditingTeacher(teacher);
    setShowTeacherForm(true);
    setEditForm({
      ...emptyTeacher,
      ...teacher,
      subjects: getTeacherSubjects(teacher),
      classes: values(teacher.classes),
      classTeacherClasses: Array.isArray(teacher.classTeacherClasses)
        ? values(teacher.classTeacherClasses)
        : getTeacherRole(teacher) === "Class Teacher"
          ? classData.items
            .filter(
              (schoolClass) =>
                String(schoolClass.teacherId) === String(teacher?.id),
            )
            .map((schoolClass) =>
              String(
                schoolClass.classId ||
                  schoolClass.id ||
                  `${schoolClass.grade}-${schoolClass.section}`,
              ),
            )
          : [],
    });
    setFormError("");
    setMenuId("");
  }

  function saveTeacher(event) {
    event.preventDefault();
    const name = editForm.name.trim();
    const email = editForm.email.trim();
    if (!name || !email) {
      setFormError("Enter the teacher's name and email.");
      return;
    }
    if (
      !Array.isArray(editForm.classes) ||
      !Array.isArray(editForm.subjects) ||
      !Array.isArray(editForm.classTeacherClasses) ||
      editForm.classes.some(
        (classId) => !classes.some((schoolClass) => schoolClass.id === classId),
      ) ||
      editForm.subjects.some((subject) => !subjects.includes(subject)) ||
      editForm.classTeacherClasses.some(
        (classId) => !editForm.classes.includes(classId),
      )
    ) {
      setFormError("Check that assigned classes and subjects are valid.");
      return;
    }
    const duplicateEmail = teacherData.items.some(
      (teacher) =>
        String(teacher.id) !== String(editingTeacher?.id) &&
        String(teacher.email || "").toLowerCase() === email.toLowerCase(),
    );
    if (duplicateEmail) {
      setFormError("That email address is already assigned to another teacher.");
      return;
    }
    const classTeacherClasses = values(editForm.classTeacherClasses).filter(
      (classId) => editForm.classes.includes(classId),
    );
    const changes = {
      ...editForm,
      role: editingTeacher ? getTeacherRole(editingTeacher) : "Subject Teacher",
      roles: undefined,
      name,
      email,
      subjects: [...editForm.subjects],
      subject: editForm.subjects.join(", "),
      classes: [...editForm.classes],
      classTeacherClasses,
    };
    if (editingTeacher) {
      teacherData.update(editingTeacher.id, changes);
      classData.items.forEach((schoolClass) => {
        const classId = String(
          schoolClass.classId ||
            schoolClass.id ||
            `${schoolClass.grade}-${schoolClass.section}`,
        );
        if (
          String(schoolClass.teacherId || "") === String(editingTeacher.id) &&
          !classTeacherClasses.includes(classId)
        ) {
          classData.update(schoolClass.id, { teacherId: "" });
        }
      });
    }
    else
      teacherData.add(changes);
    setEditingTeacher(null);
    setShowTeacherForm(false);
    setFormError("");
  }

  function toggleStatus(teacher) {
    teacherData.update(teacher.id, {
      status: (teacher.status || "Active") === "Active" ? "Inactive" : "Active",
    });
    setMenuId("");
  }

  function editField(key, value) {
    setEditForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="teacher-management">
      <header className="teacher-management-heading">
        <div>
          <span className="eyebrow">PEOPLE & ACCESS</span>
          <h1>Teachers</h1>
          <p>Manage teacher profiles, teaching assignments and roles.</p>
        </div>
        <button
          type="button"
          className="primary-btn"
          onClick={() => startEdit(null)}
        >
          + Add Teacher
        </button>
      </header>

      <section className="teacher-directory-card">
        <FilterPanel
          search={search}
          setSearch={setSearch}
          filters={teacherFilters}
          values={filterValues}
          setValues={setFilterValues}
          items={teacherData.items}
          count={filteredTeachers.length}
          total={teacherData.items.length}
          sort={sort}
          setSort={setSort}
          searchPlaceholder="Search name, email, subject or class"
        />
        <div className="teacher-management-table-wrap">
          <table className="teacher-management-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Subjects</th>
                <th>Assigned classes</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className="teacher-identity-cell">
                      <span className="teacher-avatar">{initials(teacher.name)}</span>
                      <span>
                        <strong>{teacher.name}</strong>
                        <small>{teacher.email || "No email"}</small>
                      </span>
                    </div>
                  </td>
                  <td>{getTeacherSubjects(teacher).join(", ") || "—"}</td>
                  <td>{values(teacher.classes).join(", ") || "—"}</td>
                  <td>
                    <div className="teacher-role-badges">
                      <span className="teacher-role-badge">
                        {getTeacherRole(teacher)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`teacher-status-badge ${(teacher.status || "Active").toLowerCase()}`}>
                      {teacher.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="teacher-action-menu">
                      <button
                        type="button"
                        className="teacher-action-trigger"
                        aria-expanded={menuId === String(teacher.id)}
                        onClick={() =>
                          setMenuId((current) =>
                            current === String(teacher.id) ? "" : String(teacher.id),
                          )
                        }
                      >
                        Actions <ChevronDown size={15} />
                      </button>
                      {menuId === String(teacher.id) && (
                        <div className="teacher-action-options">
                          <button type="button" onClick={() => {
                            setDetailsTeacher(teacher);
                            setMenuId("");
                          }}>
                            <Eye size={15} /> View Details
                          </button>
                          <button type="button" onClick={() => openRoles(teacher)}>
                            <Shield size={15} /> Manage Role
                          </button>
                          <button type="button" onClick={() => startEdit(teacher)}>
                            <Pencil size={15} /> Edit Teacher
                          </button>
                          <button type="button" onClick={() => toggleStatus(teacher)}>
                            <UserRound size={15} />
                            {(teacher.status || "Active") === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredTeachers.length && (
                <tr>
                  <td colSpan="6" className="teacher-empty-row">
                    No teachers match the current search and status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="teacher-record-count">
          Showing {filteredTeachers.length} of {teacherData.items.length} teachers
        </p>
      </section>

      {drawerTeacher && draft && (
        <div className="teacher-drawer-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeRoles();
        }}>
          <aside className="teacher-roles-drawer" aria-label={`Manage role for ${drawerTeacher.name}`}>
            <header className="teacher-drawer-header">
              <h2>Manage Role</h2>
              <button type="button" aria-label="Close" onClick={closeRoles}><X /></button>
            </header>
            <form className="teacher-drawer-form" onSubmit={saveRoles}>
              <div className="teacher-drawer-scroll">
                <section className="teacher-drawer-person">
                  <span className="teacher-avatar large">{initials(drawerTeacher.name)}</span>
                  <div>
                    <h3>{drawerTeacher.name}</h3>
                    <p>{drawerTeacher.email}</p>
                  </div>
                </section>

                <section className="teacher-drawer-section">
                  <h3>Select Teacher Role</h3>
                  <div className="teacher-role-choice-list">
                    {TEACHER_ROLE_OPTIONS.map((role) => (
                      <label
                        className={`teacher-role-choice ${draft.role === role.key ? "selected" : ""}`}
                        key={role.key}
                      >
                        <input
                          type="radio"
                          name={`teacher-role-${drawerTeacher.id}`}
                          value={role.key}
                          required
                          checked={draft.role === role.key}
                          onChange={() =>
                            setDraft((current) => ({
                              ...current,
                              role: role.key,
                            }))
                          }
                        />
                        <span><strong>{role.key}</strong><small>{role.description}</small></span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
              <footer className="teacher-drawer-footer">
                <button type="button" className="secondary-btn" onClick={closeRoles}>Cancel</button>
                <button type="submit" className="primary-btn">Save Changes</button>
              </footer>
            </form>
          </aside>
        </div>
      )}

      {detailsTeacher && (
        <div className="teacher-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailsTeacher(null);
        }}>
          <section className="teacher-details-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-details-title">
            <header><h2 id="teacher-details-title">Teacher Details</h2><button type="button" aria-label="Close details" onClick={() => setDetailsTeacher(null)}><X /></button></header>
            <div className="teacher-detail-grid">
              <span>Full name</span><strong>{detailsTeacher.name}</strong>
              <span>Email</span><strong>{detailsTeacher.email || "—"}</strong>
              <span>Department</span><strong>{detailsTeacher.department || "—"}</strong>
              <span>Subjects</span><strong>{getTeacherSubjects(detailsTeacher).join(", ") || "—"}</strong>
              <span>Classes</span><strong>{values(detailsTeacher.classes).join(", ") || "—"}</strong>
              <span>Role</span><strong>{getTeacherRole(detailsTeacher)}</strong>
              <span>Status</span><strong>{detailsTeacher.status || "Active"}</strong>
            </div>
            <button type="button" className="primary-btn" onClick={() => setDetailsTeacher(null)}>Done</button>
          </section>
        </div>
      )}

      {showTeacherForm && (
        <div className="teacher-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setEditingTeacher(null);
            setShowTeacherForm(false);
            setEditForm(emptyTeacher);
            setFormError("");
          }
        }}>
          <section className="teacher-details-modal teacher-edit-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-edit-title">
            <header><h2 id="teacher-edit-title">{editingTeacher ? "Edit Teacher" : "Add Teacher"}</h2><button type="button" aria-label="Close teacher form" onClick={() => {
              setEditingTeacher(null);
              setShowTeacherForm(false);
              setEditForm(emptyTeacher);
              setFormError("");
            }}><X /></button></header>
            <form className="teacher-edit-form" onSubmit={saveTeacher}>
              {formError && <p className="teacher-form-error" role="alert">{formError}</p>}
              <label>Teacher ID<input required value={editForm.employee || ""} onChange={(event) => editField("employee", event.target.value)} /></label>
              <label>Full name<input required value={editForm.name || ""} onChange={(event) => editField("name", event.target.value)} /></label>
              <label>Email<input required type="email" value={editForm.email || ""} onChange={(event) => editField("email", event.target.value)} /></label>
              <label>Phone<input type="tel" value={editForm.phone || ""} onChange={(event) => editField("phone", event.target.value)} /></label>
              <label>Department<select value={editForm.department || ""} onChange={(event) => editField("department", event.target.value)}><option value="">Select department</option>{DEPARTMENT_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>Status<select value={editForm.status || "Active"} onChange={(event) => editField("status", event.target.value)}>{SCHOOL_STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
              <fieldset><legend>Subjects</legend><div className="teacher-assignment-choices">{subjects.map((subject) => <label key={subject}><input type="checkbox" checked={editForm.subjects.includes(subject)} onChange={() => editField("subjects", editForm.subjects.includes(subject) ? editForm.subjects.filter((item) => item !== subject) : [...editForm.subjects, subject])} />{subject}</label>)}</div></fieldset>
              <fieldset><legend>Assigned classes</legend><div className="teacher-assignment-choices">{classes.map((schoolClass) => <label key={schoolClass.id}><input type="checkbox" checked={editForm.classes.includes(schoolClass.id)} onChange={() => editField("classes", editForm.classes.includes(schoolClass.id) ? editForm.classes.filter((item) => item !== schoolClass.id) : [...editForm.classes, schoolClass.id])} />{schoolClass.label}</label>)}</div></fieldset>
              <footer className="teacher-edit-actions"><button type="button" className="secondary-btn" onClick={() => { setEditingTeacher(null); setShowTeacherForm(false); setEditForm(emptyTeacher); setFormError(""); }}>Cancel</button><button type="submit" className="primary-btn">Save Teacher</button></footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
