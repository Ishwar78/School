
import React, { useEffect, useMemo, useState } from "react";
import "./StudentInfo.css";

const CLASS_OPTIONS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th"
];

const SECTION_OPTIONS = ["A", "B", "C", "D"];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const SESSION_OPTIONS = [
  "2026-2027",
  "2025-2026",
  "2024-2025"
];

const emptyForm = {
  admission: "",
  name: "",
  email: "",
  classId: "",
  section: "",
  roll: "",
  dob: "",
  gender: "",
  admissionDate: "",
  session: "2026-2027",
  phone: "",
  emergency: "",
  aadhaar: "",
  address: "",
  fatherName: "",
  motherName: "",
  fatherMobile: "",
  motherMobile: "",
  password: "",
  confirmPassword: "",
  status: "Active"
};

const initialStudents = [];

export default function StudentInfo() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_students");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "veda_admin_students",
      JSON.stringify(items)
    );
  }, [items]);

  const filteredStudents = useMemo(() => {
    return items.filter((student) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        student.name?.toLowerCase().includes(searchValue) ||
        student.admission?.toLowerCase().includes(searchValue) ||
        student.roll?.toLowerCase().includes(searchValue) ||
        student.phone?.includes(searchValue);

      const matchesClass =
        !filterClass || student.classId === filterClass;

      const matchesStatus =
        !filterStatus || student.status === filterStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [items, search, filterClass, filterStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
    setSelectedStudent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.classId) {
      setError("Please select student class.");
      return;
    }

    if (!form.section) {
      setError("Please select student section.");
      return;
    }

    if (!form.aadhaar || !/^\d{12}$/.test(form.aadhaar)) {
      setError("Please enter a valid 12 digit Aadhaar number.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10 digit student mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(form.fatherMobile)) {
      setError("Please enter a valid 10 digit father mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(form.motherMobile)) {
      setError("Please enter a valid 10 digit mother mobile number.");
      return;
    }

    if (!editingId && !form.password) {
      setError("Please enter student password.");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    if (!editingId && !form.confirmPassword) {
      setError("Please confirm student password.");
      return;
    }

    const studentData = {
      ...form,
      id: editingId || "std-" + Date.now(),
      createdAt: editingId
        ? items.find((s) => s.id === editingId)?.createdAt
        : new Date().toISOString()
    };

    // Password is not saved in localStorage.
    // Send it securely to your backend API for account creation.
    delete studentData.password;
    delete studentData.confirmPassword;

    if (editingId) {
      setItems((prev) =>
        prev.map((student) =>
          student.id === editingId
            ? studentData
            : student
        )
      );
    } else {
      setItems((prev) => [studentData, ...prev]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (student) => {
    setForm({
      ...emptyForm,
      ...student,
      password: "",
      confirmPassword: ""
    });

    setEditingId(student.id);
    setShowForm(true);
    setSelectedStudent(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    setItems((prev) =>
      prev.filter((student) => student.id !== id)
    );

    setSelectedStudent(null);
  };

  const totalStudents = items.length;

  const activeStudents = items.filter(
    (s) => s.status === "Active"
  ).length;

  const inactiveStudents = items.filter(
    (s) => s.status === "Inactive"
  ).length;

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const renderInput = (
    label,
    name,
    type = "text",
    required = false,
    placeholder = ""
  ) => (
    <div className="student-field" key={name}>
      <label>
        {label}
        {required && <span className="required-star">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        placeholder={placeholder || `Enter ${label}`}
        required={required}
        maxLength={
          name === "aadhaar" ||
          name === "phone" ||
          name === "fatherMobile" ||
          name === "motherMobile"
            ? 12
            : undefined
        }
      />
    </div>
  );

  const renderSelect = (
    label,
    name,
    options,
    required = false
  ) => (
    <div className="student-field" key={name}>
      <label>
        {label}
        {required && <span className="required-star">*</span>}
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
    <div className="student-management">

      {/* PAGE HEADER */}

      <div className="student-page-header">
        <div>
          <span className="student-eyebrow">
            VEDA INTERNATIONAL SCHOOL
          </span>

          <h1>Student Information</h1>

          <p>
            Register, manage and maintain complete student records.
          </p>
        </div>

        {!showForm && (
          <button
            className="student-primary-btn"
            onClick={openAddForm}
          >
            <span>+</span> Add New Student
          </button>
        )}
      </div>

      {/* DASHBOARD CARDS */}

      <div className="student-stats">

        <div className="student-stat-card">
          <div className="student-stat-icon navy">♟</div>
          <div>
            <span>Total Students</span>
            <h2>{totalStudents}</h2>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon green">✓</div>
          <div>
            <span>Active Students</span>
            <h2>{activeStudents}</h2>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="student-stat-icon orange">◷</div>
          <div>
            <span>Inactive Students</span>
            <h2>{inactiveStudents}</h2>
          </div>
        </div>

      </div>

      {/* ADD / EDIT STUDENT FORM */}

      {showForm && (
        <div className="student-form-card">

          <div className="student-form-header">
            <div>
              <span className="student-eyebrow">
                STUDENT REGISTRATION
              </span>

              <h2>
                {editingId ? "Update Student Details" : "Add New Student"}
              </h2>

              <p>
                Enter student and parent information below.
              </p>
            </div>

            <button
              className="student-close-btn"
              onClick={closeForm}
              type="button"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="student-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* STUDENT DETAILS */}

            <div className="student-form-section">

              <div className="student-section-heading">
                <div className="student-section-icon">♟</div>

                <div>
                  <h3>Student Details</h3>
                  <p>Personal and academic information</p>
                </div>
              </div>

              <div className="student-form-grid">

                {renderInput(
                  "Admission Number",
                  "admission",
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
                  "Login Email",
                  "email",
                  "email"
                )}

                {renderInput(
                  "Roll Number",
                  "roll",
                  "text",
                  true
                )}

                {renderSelect(
                  "Class",
                  "classId",
                  CLASS_OPTIONS,
                  true
                )}

                {renderSelect(
                  "Section",
                  "section",
                  SECTION_OPTIONS,
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
                  GENDER_OPTIONS
                )}

                {renderInput(
                  "Admission Date",
                  "admissionDate",
                  "date"
                )}

                {renderSelect(
                  "Academic Session",
                  "session",
                  SESSION_OPTIONS
                )}

                {renderInput(
                  "Student Mobile Number",
                  "phone",
                  "tel",
                  true
                )}

                {renderInput(
                  "Emergency Contact",
                  "emergency",
                  "tel"
                )}

                {renderInput(
                  "Aadhaar Card Number",
                  "aadhaar",
                  "text",
                  true,
                  "Enter 12 digit Aadhaar number"
                )}

                {renderSelect(
                  "Student Status",
                  "status",
                  ["Active", "Inactive", "Pending"]
                )}

                <div className="student-field full-width">
                  <label>Student Address</label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete student address"
                    rows="3"
                  />
                </div>

              </div>
            </div>

            {/* PARENT DETAILS */}

            <div className="student-form-section">

              <div className="student-section-heading">
                <div className="student-section-icon parent-icon">
                  ♧
                </div>

                <div>
                  <h3>Parent Details</h3>
                  <p>Father and mother contact information</p>
                </div>
              </div>

              <div className="student-form-grid">

                {renderInput(
                  "Father Name",
                  "fatherName",
                  "text",
                  true
                )}

                {renderInput(
                  "Mother Name",
                  "motherName",
                  "text",
                  true
                )}

                {renderInput(
                  "Father Mobile Number",
                  "fatherMobile",
                  "tel",
                  true
                )}

                {renderInput(
                  "Mother Mobile Number",
                  "motherMobile",
                  "tel",
                  true
                )}

              </div>
            </div>

            {/* LOGIN DETAILS */}

            <div className="student-form-section">

              <div className="student-section-heading">
                <div className="student-section-icon security-icon">
                  🔒
                </div>

                <div>
                  <h3>Student Login Details</h3>
                  <p>
                    Set password for student portal access
                  </p>
                </div>
              </div>

              {editingId && (
                <p className="student-password-note">
                  Leave password fields blank if you don't want
                  to change the existing password.
                </p>
              )}

              <div className="student-form-grid">

                {renderInput(
                  "Password",
                  "password",
                  "password",
                  !editingId,
                  "Enter student password"
                )}

                {renderInput(
                  "Confirm Password",
                  "confirmPassword",
                  "password",
                  !editingId,
                  "Re-enter student password"
                )}

              </div>
            </div>

            {/* FORM ACTIONS */}

            <div className="student-form-actions">

              <button
                type="button"
                className="student-cancel-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="student-primary-btn"
              >
                {editingId ? "Update Student" : "Save Student"}
                <span> →</span>
              </button>

            </div>

          </form>
        </div>
      )}

      {/* STUDENT LIST */}

      <div className="student-list-card">

        <div className="student-list-header">
          <div>
            <span className="student-eyebrow">
              RECORD MANAGEMENT
            </span>

            <h2>All Students</h2>

            <p>
              View and manage registered student records.
            </p>
          </div>

          <span className="student-total-badge">
            {filteredStudents.length} Students
          </span>
        </div>

        {/* SEARCH AND FILTER */}

        <div className="student-toolbar">

          <div className="student-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, admission no. or roll no."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

        </div>

        {/* TABLE */}

        <div className="student-table-wrapper">

          <table className="student-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Class / Section</th>
                <th>Roll No.</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {student.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <small>{student.email || "No email"}</small>
                        </div>
                      </div>
                    </td>

                    <td>{student.admission}</td>

                    <td>
                      <span className="student-class-badge">
                        {student.classId} - {student.section}
                      </span>
                    </td>

                    <td>{student.roll}</td>

                    <td>{student.phone}</td>

                    <td>
                      <span
                        className={`student-status ${student.status?.toLowerCase()}`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="student-actions">

                        <button
                          title="View Details"
                          className="view-action"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View
                        </button>

                        <button
                          title="Edit Student"
                          className="edit-action"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          title="Delete Student"
                          className="delete-action"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td colSpan="7">
                    <div className="student-empty">
                      <div>♟</div>
                      <h3>No Students Found</h3>
                      <p>
                        Add a new student or change your search filters.
                      </p>

                      {!showForm && (
                        <button
                          onClick={openAddForm}
                          className="student-primary-btn"
                        >
                          + Add Student
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* STUDENT DETAILS MODAL */}

      {selectedStudent && (
        <div
          className="student-modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >

          <div
            className="student-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="student-modal-header">

              <div>
                <span className="student-eyebrow">
                  STUDENT PROFILE
                </span>

                <h2>Complete Student Details</h2>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="student-close-btn"
              >
                ✕
              </button>

            </div>

            <div className="student-profile-top">

              <div className="student-profile-avatar">
                {selectedStudent.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h3>{selectedStudent.name}</h3>

                <p>
                  Admission No: {selectedStudent.admission}
                </p>

                <span className="student-class-badge">
                  {selectedStudent.classId} - {selectedStudent.section}
                </span>
              </div>

            </div>

            <div className="student-detail-section">

              <h3>Student Information</h3>

              <div className="student-detail-grid">

                <Detail label="Full Name" value={selectedStudent.name} />
                <Detail label="Admission Number" value={selectedStudent.admission} />
                <Detail label="Roll Number" value={selectedStudent.roll} />
                <Detail label="Class" value={selectedStudent.classId} />
                <Detail label="Section" value={selectedStudent.section} />
                <Detail label="Email" value={selectedStudent.email} />
                <Detail label="Date of Birth" value={selectedStudent.dob} />
                <Detail label="Gender" value={selectedStudent.gender} />
                <Detail label="Admission Date" value={selectedStudent.admissionDate} />
                <Detail label="Academic Session" value={selectedStudent.session} />
                <Detail label="Student Mobile" value={selectedStudent.phone} />
                <Detail label="Emergency Contact" value={selectedStudent.emergency} />
                <Detail label="Aadhaar Number" value={selectedStudent.aadhaar} />
                <Detail label="Status" value={selectedStudent.status} />

              </div>

              <Detail
                label="Student Address"
                value={selectedStudent.address}
                full
              />

            </div>

            <div className="student-detail-section">

              <h3>Parent Information</h3>

              <div className="student-detail-grid">

                <Detail
                  label="Father Name"
                  value={selectedStudent.fatherName}
                />

                <Detail
                  label="Mother Name"
                  value={selectedStudent.motherName}
                />

                <Detail
                  label="Father Mobile"
                  value={selectedStudent.fatherMobile}
                />

                <Detail
                  label="Mother Mobile"
                  value={selectedStudent.motherMobile}
                />

              </div>

            </div>

            <div className="student-modal-footer">

              <button
                className="student-cancel-btn"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>

              <button
                className="student-primary-btn"
                onClick={() => handleEdit(selectedStudent)}
              >
                Edit Student →
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// Reusable Student Detail Component

function Detail({ label, value, full = false }) {
  return (
    <div
      className={`student-detail-item ${full ? "full-width" : ""}`}
    >
      <span>{label}</span>
      <strong>{value || "Not Provided"}</strong>
    </div>
  );
}
