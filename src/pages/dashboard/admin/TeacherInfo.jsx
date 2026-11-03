
import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  X,
  Plus,
  Search,
  Users,
  CheckCircle,
  Clock,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  UserRound,
  ChevronDown
} from "lucide-react";

import "./TeacherInfo.css";

const CLASS_OPTIONS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th"
];

const SECTION_OPTIONS = ["A", "B", "C", "D"];

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

const SUBJECT_OPTIONS = [
  "Mathematics",
  "English",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Studies",
  "Hindi",
  "Computer Science",
  "Physical Education",
  "Arts",
  "Sanskrit"
];

const ROLE_OPTIONS = [
  "Class Teacher",
  "Senior PGT",
  "TGT",
  "PRT",
  "Head of Department",
  "Lab Assistant",
  "Subject Teacher"
];

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

const emptyTeacher = {
  employee: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  subjects: [],
  classes: [],
  role: "Subject Teacher",
  qualification: "",
  experience: "",
  joiningDate: "",
  dob: "",
  gender: "",
  address: "",
  aadhaar: "",
  emergencyContact: "",
  password: "",
  confirmPassword: "",
  status: "Active"
};

const initialTeachers = [];

function getInitials(name) {
  return String(name || "Teacher")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTeacherClasses(teacher) {
  if (Array.isArray(teacher.classes)) {
    return teacher.classes;
  }

  return teacher.classes
    ? String(teacher.classes).split(",").map((v) => v.trim()).filter(Boolean)
    : [];
}

function getTeacherSubjects(teacher) {
  if (Array.isArray(teacher.subjects)) {
    return teacher.subjects;
  }

  return teacher.subject ? [teacher.subject] : [];
}

function formatClasses(classes) {
  return getTeacherClasses({ classes }).join(", ");
}

export default function TeacherInfo() {
  const [teachers, setTeachers] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_teachers");
      if (!saved) return initialTeachers;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
      return initialTeachers;
    } catch {
      return initialTeachers;
    }
  });

  const [form, setForm] = useState(emptyTeacher);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [detailsTeacher, setDetailsTeacher] = useState(null);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        "veda_admin_teachers",
        JSON.stringify(teachers)
      );
    } catch (err) {
      console.error("Unable to save teacher records", err);
    }
  }, [teachers]);

  // DASHBOARD COUNTS

  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const totalTeachers = safeTeachers.length;

  const activeTeachers = safeTeachers.filter(
    (teacher) => teacher && (teacher.status || "Active") === "Active"
  ).length;

  const inactiveTeachers = safeTeachers.filter(
    (teacher) => teacher && teacher.status === "Inactive"
  ).length;

  // SEARCH AND FILTER

  const filteredTeachers = useMemo(() => {
    if (!Array.isArray(teachers)) return [];
    return teachers.filter((teacher) => {
      if (!teacher) return false;
      const searchText = (search || "").toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        (teacher.name || "").toLowerCase().includes(searchText) ||
        (teacher.email || "").toLowerCase().includes(searchText) ||
        (teacher.employee || "").toLowerCase().includes(searchText) ||
        String(teacher.phone || "").includes(searchText) ||
        (Array.isArray(getTeacherSubjects(teacher)) ? getTeacherSubjects(teacher) : []).join(" ").toLowerCase().includes(searchText) ||
        (Array.isArray(getTeacherClasses(teacher)) ? getTeacherClasses(teacher) : []).join(" ").toLowerCase().includes(searchText);

      const matchesClass =
        !filterClass ||
        (Array.isArray(getTeacherClasses(teacher)) ? getTeacherClasses(teacher) : []).includes(filterClass);

      const matchesDepartment =
        !filterDepartment ||
        teacher.department === filterDepartment;

      const matchesStatus =
        !filterStatus ||
        (teacher.status || "Active") === filterStatus;

      return (
        matchesSearch &&
        matchesClass &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    teachers,
    search,
    filterClass,
    filterDepartment,
    filterStatus
  ]);

  // FORM CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  const editField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  // ADD ASSIGNED CLASS + SECTION

  const addClassAssignment = () => {
    if (!selectedClass || !selectedSection) {
      setError("Please select both Class and Section.");
      return;
    }

    const classValue = `${selectedClass}-${selectedSection}`;

    if (form.classes.includes(classValue)) {
      setError("This class and section is already assigned.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      classes: [...prev.classes, classValue]
    }));

    setSelectedClass("");
    setSelectedSection("");
    setError("");
  };

  const removeClassAssignment = (classValue) => {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.filter(
        (item) => item !== classValue
      )
    }));
  };

  // SUBJECT SELECTION

  const toggleSubject = (subject) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((item) => item !== subject)
        : [...prev.subjects, subject]
    }));

    setError("");
  };

  // OPEN ADD FORM

  const openAddForm = () => {
    setForm(emptyTeacher);
    setEditingId(null);
    setSelectedClass("");
    setSelectedSection("");
    setError("");
    setShowPassword(false);
    setShowForm(true);
    setDetailsTeacher(null);
  };

  // EDIT TEACHER

  const startEdit = (teacher) => {
    setForm({
      ...emptyTeacher,
      ...teacher,
      classes: getTeacherClasses(teacher),
      subjects: getTeacherSubjects(teacher),
      password: "",
      confirmPassword: ""
    });

    setEditingId(teacher.id);
    setSelectedClass("");
    setSelectedSection("");
    setError("");
    setShowPassword(false);
    setShowForm(true);
    setDetailsTeacher(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SAVE TEACHER

  const saveTeacher = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.employee.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setError("Please fill all required teacher details.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) {
      setError("Please enter a valid 12 digit Aadhaar number.");
      return;
    }

    if (!form.department) {
      setError("Please select a department.");
      return;
    }

    if (form.classes.length === 0) {
      setError("Please assign at least one class and section.");
      return;
    }

    if (form.subjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    if (!editingId && !form.password) {
      setError("Please enter teacher password.");
      return;
    }

    if (!editingId && !form.confirmPassword) {
      setError("Please confirm teacher password.");
      return;
    }

    if (
      form.password &&
      form.password !== form.confirmPassword
    ) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    const duplicateEmployee = teachers.some(
      (teacher) =>
        teacher.id !== editingId &&
        teacher.employee.toLowerCase() === form.employee.trim().toLowerCase()
    );

    if (duplicateEmployee) {
      setError("This Teacher ID is already registered.");
      return;
    }

    const duplicateEmail = teachers.some(
      (teacher) =>
        teacher.id !== editingId &&
        teacher.email.toLowerCase() === form.email.trim().toLowerCase()
    );

    if (duplicateEmail) {
      setError("This email is already registered with another teacher.");
      return;
    }

    const teacherData = {
      ...form,
      id: editingId || "tch-" + Date.now(),
      employee: form.employee.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subjects: [...form.subjects],
      classes: [...form.classes],
      createdAt: editingId
        ? teachers.find((t) => t.id === editingId)?.createdAt
        : new Date().toISOString()
    };

    // Never store passwords in localStorage.
    // Send passwords securely to backend and hash using BCrypt.
    delete teacherData.password;
    delete teacherData.confirmPassword;

    if (editingId) {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingId ? teacherData : teacher
        )
      );
    } else {
      setTeachers((prev) => [teacherData, ...prev]);
    }

    setForm(emptyTeacher);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // DELETE TEACHER

  const deleteTeacher = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    setTeachers((prev) =>
      prev.filter((teacher) => teacher.id !== id)
    );

    setDetailsTeacher(null);
  };

  // CHANGE STATUS

  const toggleStatus = (teacher) => {
    setTeachers((prev) =>
      prev.map((item) =>
        item.id === teacher.id
          ? {
              ...item,
              status:
                (item.status || "Active") === "Active"
                  ? "Inactive"
                  : "Active"
            }
          : item
      )
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyTeacher);
    setError("");
  };

  const renderInput = (
    label,
    name,
    type = "text",
    required = false,
    placeholder = ""
  ) => (
    <div className="teacher-field" key={name}>
      <label>
        {label}
        {required && <span className="teacher-required">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        required={required}
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
  );

  const renderSelect = (
    label,
    name,
    options,
    required = false
  ) => (
    <div className="teacher-field" key={name}>
      <label>
        {label}
        {required && <span className="teacher-required">*</span>}
      </label>

      <select
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        required={required}
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="teacher-management">

      {/* PAGE HEADER */}

      <div className="teacher-page-header">
        <div>
          <span className="teacher-eyebrow">
            VEDA INTERNATIONAL SCHOOL
          </span>

          <h1>Teacher Information</h1>

          <p>
            Register, manage and maintain complete teacher records.
          </p>
        </div>

        {!showForm && (
          <button
            className="teacher-primary-btn"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add New Teacher
          </button>
        )}
      </div>

      {/* DASHBOARD CARDS */}

      <div className="teacher-stats">

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon navy">
            <Users size={23} />
          </div>
          <div>
            <span>Total Teachers</span>
            <h2>{totalTeachers}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon green">
            <CheckCircle size={23} />
          </div>
          <div>
            <span>Active Teachers</span>
            <h2>{activeTeachers}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon orange">
            <Clock size={23} />
          </div>
          <div>
            <span>Inactive Teachers</span>
            <h2>{inactiveTeachers}</h2>
          </div>
        </div>

      </div>

      {/* ADD / EDIT TEACHER FORM */}

      {showForm && (
        <div className="teacher-form-card">

          <div className="teacher-form-header">
            <div>
              <span className="teacher-eyebrow">
                TEACHER REGISTRATION
              </span>

              <h2>
                {editingId ? "Update Teacher Details" : "Add New Teacher"}
              </h2>

              <p>
                Enter teacher personal, academic and professional information.
              </p>
            </div>

            <button
              type="button"
              className="teacher-close-btn"
              onClick={closeForm}
            >
              <X size={19} />
            </button>
          </div>

          {error && (
            <div className="teacher-error">
              {error}
            </div>
          )}

          <form onSubmit={saveTeacher}>

            {/* PERSONAL DETAILS */}

            <div className="teacher-form-section">

              <div className="teacher-section-heading">
                <div className="teacher-section-icon">
                  <UserRound size={21} />
                </div>

                <div>
                  <h3>Personal Information</h3>
                  <p>Basic teacher details and contact information</p>
                </div>
              </div>

              <div className="teacher-form-grid">

                {renderInput(
                  "Teacher ID",
                  "employee",
                  "text",
                  true
                )}

                {renderInput(
                  "Full Name",
                  "name",
                  "text",
                  true
                )}

                {renderInput(
                  "Email Address",
                  "email",
                  "email",
                  true
                )}

                {renderInput(
                  "Mobile Number",
                  "phone",
                  "tel",
                  true
                )}

                {renderInput(
                  "Date of Birth",
                  "dob",
                  "date"
                )}

                {renderSelect(
                  "Gender",
                  "gender",
                  ["Male", "Female", "Other"]
                )}

                {renderInput(
                  "Aadhaar Card Number",
                  "aadhaar",
                  "text",
                  false,
                  "Enter 12 digit Aadhaar number"
                )}

                {renderInput(
                  "Emergency Contact",
                  "emergencyContact",
                  "tel"
                )}

                <div className="teacher-field full-width">
                  <label>Residential Address</label>

                  <textarea
                    name="address"
                    rows="3"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                  />
                </div>

              </div>
            </div>

            {/* PROFESSIONAL DETAILS */}

            <div className="teacher-form-section">

              <div className="teacher-section-heading">
                <div className="teacher-section-icon">
                  <GraduationCap size={22} />
                </div>

                <div>
                  <h3>Professional Information</h3>
                  <p>Department, qualification and experience</p>
                </div>
              </div>

              <div className="teacher-form-grid">

                {renderSelect(
                  "Department",
                  "department",
                  DEPARTMENT_OPTIONS,
                  true
                )}

                {renderSelect(
                  "Teacher Role",
                  "role",
                  ROLE_OPTIONS,
                  true
                )}

                {renderInput(
                  "Qualification",
                  "qualification",
                  "text"
                )}

                {renderInput(
                  "Experience (Years)",
                  "experience",
                  "number"
                )}

                {renderInput(
                  "Joining Date",
                  "joiningDate",
                  "date"
                )}

                {renderSelect(
                  "Teacher Status",
                  "status",
                  STATUS_OPTIONS
                )}

              </div>
            </div>

            {/* SUBJECT SELECTION */}

            <div className="teacher-form-section">

              <div className="teacher-section-heading">
                <div className="teacher-section-icon">
                  <BookOpen size={21} />
                </div>

                <div>
                  <h3>Teaching Subjects</h3>
                  <p>Select one or multiple teaching subjects</p>
                </div>
              </div>

              <div className="teacher-checkbox-grid">

                {SUBJECT_OPTIONS.map((subject) => (
                  <label
                    key={subject}
                    className={`teacher-checkbox-item ${
                      form.subjects.includes(subject) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.subjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                    />

                    <span>{subject}</span>
                  </label>
                ))}

              </div>
            </div>

            {/* CLASS AND SECTION ASSIGNMENT */}

            <div className="teacher-form-section">

              <div className="teacher-section-heading">
                <div className="teacher-section-icon">
                  <GraduationCap size={21} />
                </div>

                <div>
                  <h3>Class & Section Assignment</h3>
                  <p>
                    Assign one or multiple classes and their sections
                  </p>
                </div>
              </div>

              <div className="teacher-class-assignment">

                <div className="teacher-field">
                  <label>Select Class <span className="teacher-required">*</span></label>

                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>

                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls} Class
                      </option>
                    ))}
                  </select>
                </div>

                <div className="teacher-field">
                  <label>Select Section <span className="teacher-required">*</span></label>

                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <option value="">Select Section</option>

                    {SECTION_OPTIONS.map((section) => (
                      <option key={section} value={section}>
                        Section {section}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="teacher-add-class-btn"
                  onClick={addClassAssignment}
                >
                  <Plus size={17} />
                  Add Class
                </button>

              </div>

              <div className="teacher-assigned-classes">

                <div className="teacher-assigned-heading">
                  <strong>Assigned Classes</strong>

                  <span>{form.classes.length} Selected</span>
                </div>

                {form.classes.length > 0 ? (
                  <div className="teacher-class-tags">

                    {form.classes.map((classValue) => (
                      <div
                        className="teacher-class-tag"
                        key={classValue}
                      >
                        <span>{classValue}</span>

                        <button
                          type="button"
                          onClick={() => removeClassAssignment(classValue)}
                          aria-label={`Remove ${classValue}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="teacher-no-class">
                    No class assigned yet. Select class and section above.
                  </p>
                )}

              </div>

            </div>

            {/* LOGIN DETAILS */}

            <div className="teacher-form-section">

              <div className="teacher-section-heading">
                <div className="teacher-section-icon security">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3>Teacher Login Details</h3>
                  <p>Set password for teacher portal access</p>
                </div>
              </div>

              {editingId && (
                <p className="teacher-password-note">
                  Leave both password fields blank if you do not want
                  to change the existing password.
                </p>
              )}

              <div className="teacher-form-grid">

                {renderInput(
                  "Password",
                  "password",
                  "password",
                  !editingId,
                  "Enter teacher password"
                )}

                {renderInput(
                  "Confirm Password",
                  "confirmPassword",
                  "password",
                  !editingId,
                  "Re-enter teacher password"
                )}

              </div>
            </div>

            {/* FORM BUTTONS */}

            <div className="teacher-form-actions">

              <button
                type="button"
                className="teacher-cancel-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="teacher-primary-btn"
              >
                {editingId ? "Update Teacher" : "Save Teacher"}
                <span>→</span>
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TEACHER DIRECTORY */}

      <div className="teacher-list-card">

        <div className="teacher-list-header">

          <div>
            <span className="teacher-eyebrow">
              RECORD MANAGEMENT
            </span>

            <h2>All Teachers</h2>

            <p>
              View, search and manage registered teachers.
            </p>
          </div>

          <span className="teacher-count-badge">
            {filteredTeachers.length} Teachers
          </span>

        </div>

        {/* SEARCH AND FILTERS */}

        <div className="teacher-toolbar">

          <div className="teacher-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search teacher, email, ID, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>

            {CLASS_OPTIONS.flatMap((cls) =>
              SECTION_OPTIONS.map((section) => (
                <option key={`${cls}-${section}`} value={`${cls}-${section}`}>
                  {cls} - {section}
                </option>
              ))
            )}
          </select>

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

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

        </div>

        {/* TEACHER TABLE */}

        <div className="teacher-table-wrapper">

          <table className="teacher-table">

            <thead>
              <tr>
                <th>Teacher</th>
                <th>Teacher ID</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Assigned Classes</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTeachers.length > 0 ? (

                filteredTeachers.map((teacher) => (

                  <tr key={teacher.id}>

                    <td>
                      <div className="teacher-identity">

                        <div className="teacher-avatar">
                          {getInitials(teacher.name)}
                        </div>

                        <div>
                          <strong>{teacher.name}</strong>
                          <small>{teacher.email}</small>
                        </div>

                      </div>
                    </td>

                    <td>{teacher.employee}</td>

                    <td>{teacher.department || "—"}</td>

                    <td>
                      <div className="teacher-table-subjects">
                        {getTeacherSubjects(teacher).join(", ") || "—"}
                      </div>
                    </td>

                    <td>
                      <div className="teacher-table-classes">
                        {getTeacherClasses(teacher).map((cls) => (
                          <span key={cls}>{cls}</span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className="teacher-role-badge">
                        {teacher.role || "Subject Teacher"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`teacher-status-badge ${(teacher.status || "Active").toLowerCase()}`}
                      >
                        {teacher.status || "Active"}
                      </span>
                    </td>

                    <td>
                      <div className="teacher-row-actions">

                        <button
                          title="View Details"
                          className="teacher-view-btn"
                          onClick={() => setDetailsTeacher(teacher)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          title="Edit Teacher"
                          className="teacher-edit-btn"
                          onClick={() => startEdit(teacher)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          title="Delete Teacher"
                          className="teacher-delete-btn"
                          onClick={() => deleteTeacher(teacher.id)}
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          title="Activate / Deactivate"
                          className="teacher-status-btn"
                          onClick={() => toggleStatus(teacher)}
                        >
                          <ShieldCheck size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="8">

                    <div className="teacher-empty">

                      <Users size={43} />

                      <h3>No Teachers Found</h3>

                      <p>
                        No teacher records match your current search or filters.
                      </p>

                      {!showForm && (
                        <button
                          className="teacher-primary-btn"
                          onClick={openAddForm}
                        >
                          <Plus size={17} />
                          Add Teacher
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="teacher-record-footer">
          Showing {filteredTeachers.length} of {teachers.length} teachers
        </div>

      </div>

      {/* TEACHER DETAILS MODAL */}

      {detailsTeacher && (
        <div
          className="teacher-modal-overlay"
          onClick={() => setDetailsTeacher(null)}
        >

          <div
            className="teacher-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="teacher-modal-header">

              <div>
                <span className="teacher-eyebrow">
                  VEDA INTERNATIONAL SCHOOL
                </span>

                <h2>Teacher Profile</h2>
              </div>

              <button
                className="teacher-close-btn"
                onClick={() => setDetailsTeacher(null)}
              >
                <X size={19} />
              </button>

            </div>

            <div className="teacher-profile-top">

              <div className="teacher-profile-avatar">
                {getInitials(detailsTeacher.name)}
              </div>

              <div>
                <h3>{detailsTeacher.name}</h3>

                <p>
                  Teacher ID: {detailsTeacher.employee}
                </p>

                <span className="teacher-role-badge">
                  {detailsTeacher.role}
                </span>
              </div>

            </div>

            <div className="teacher-detail-section">

              <h3>Personal Information</h3>

              <div className="teacher-detail-grid">

                <TeacherDetail label="Full Name" value={detailsTeacher.name} />
                <TeacherDetail label="Teacher ID" value={detailsTeacher.employee} />
                <TeacherDetail label="Email" value={detailsTeacher.email} />
                <TeacherDetail label="Mobile Number" value={detailsTeacher.phone} />
                <TeacherDetail label="Date of Birth" value={detailsTeacher.dob} />
                <TeacherDetail label="Gender" value={detailsTeacher.gender} />
                <TeacherDetail label="Aadhaar Number" value={detailsTeacher.aadhaar} />
                <TeacherDetail label="Emergency Contact" value={detailsTeacher.emergencyContact} />

              </div>

              <TeacherDetail
                label="Residential Address"
                value={detailsTeacher.address}
                full
              />

            </div>

            <div className="teacher-detail-section">

              <h3>Professional Information</h3>

              <div className="teacher-detail-grid">

                <TeacherDetail label="Department" value={detailsTeacher.department} />
                <TeacherDetail label="Role" value={detailsTeacher.role} />
                <TeacherDetail label="Qualification" value={detailsTeacher.qualification} />
                <TeacherDetail label="Experience" value={detailsTeacher.experience ? `${detailsTeacher.experience} Years` : ""} />
                <TeacherDetail label="Joining Date" value={detailsTeacher.joiningDate} />
                <TeacherDetail label="Status" value={detailsTeacher.status} />
                <TeacherDetail label="Subjects" value={getTeacherSubjects(detailsTeacher).join(", ")} />
                <TeacherDetail label="Assigned Classes" value={formatClasses(detailsTeacher.classes)} />

              </div>

            </div>

            <div className="teacher-modal-footer">

              <button
                className="teacher-cancel-btn"
                onClick={() => setDetailsTeacher(null)}
              >
                Close
              </button>

              <button
                className="teacher-primary-btn"
                onClick={() => startEdit(detailsTeacher)}
              >
                <Pencil size={15} />
                Edit Teacher
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// REUSABLE DETAIL COMPONENT

function TeacherDetail({ label, value, full = false }) {
  return (
    <div
      className={`teacher-detail-item ${full ? "full-width" : ""}`}
    >
      <span>{label}</span>
      <strong>{value || "Not Provided"}</strong>
    </div>
  );
}
