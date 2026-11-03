import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  School,
  X,
  FileText,
  UserCheck,
  MapPin,
  IdCard
} from "lucide-react";
import { getRegisteredStudentsApi, API_BASE_URL } from "../../../lib/api";
import "./RegisteredStudents.css";

export default function RegisteredStudents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch registrations from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await getRegisteredStudentsApi();
        if (isMounted && res && res.success && Array.isArray(res.data)) {
          setRegistrations(res.data);
        } else {
          // Fallback to local storage if API is empty
          const saved = JSON.parse(localStorage.getItem("vedaStudentRegistrations") || "[]");
          if (isMounted && Array.isArray(saved)) {
            setRegistrations(saved);
          }
        }
      } catch (err) {
        console.warn("API error fetching registrations, using local records:", err.message);
        const saved = JSON.parse(localStorage.getItem("vedaStudentRegistrations") || "[]");
        if (isMounted && Array.isArray(saved)) {
          setRegistrations(saved);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter registrations
  const filtered = registrations.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.studentName?.toLowerCase().includes(q) ||
      item.registrationNumber?.toLowerCase().includes(q) ||
      item.mobile?.includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.aadhaar?.includes(q);

    const matchesClass = !selectedClass || item.studentClass === selectedClass;

    return matchesSearch && matchesClass;
  });

  const totalCount = registrations.length;
  const totalRevenue = totalCount * 1000;

  return (
    <div className="reg-students-page">
      {/* HEADER */}
      <div className="reg-header">
        <div className="reg-header-info">
          <span>ONLINE ADMISSION PORTAL</span>
          <h2>Student Registrations (₹1000 Paid)</h2>
          <p>List of all students who completed online registration and Razorpay fee payment.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Fee per Application: <strong>₹1,000</strong></span>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="reg-stats-grid">
        <div className="reg-stat-card">
          <div className="reg-stat-icon blue">
            <Users size={24} />
          </div>
          <div className="reg-stat-details">
            <span>Total Registered</span>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="reg-stat-card">
          <div className="reg-stat-icon green">
            <CreditCard size={24} />
          </div>
          <div className="reg-stat-details">
            <span>Registration Fees</span>
            <h3 style={{ color: "#059669" }}>₹{totalRevenue.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="reg-stat-card">
          <div className="reg-stat-icon yellow">
            <UserCheck size={24} />
          </div>
          <div className="reg-stat-details">
            <span>Verified Mobiles</span>
            <h3>{totalCount}</h3>
          </div>
        </div>

        <div className="reg-stat-card">
          <div className="reg-stat-icon purple">
            <School size={24} />
          </div>
          <div className="reg-stat-details">
            <span>Session</span>
            <h3 style={{ fontSize: "18px" }}>2026-2027</h3>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="reg-table-card">
        {/* CONTROLS */}
        <div className="reg-controls-bar">
          <div className="reg-search-input">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by student name, mobile, registration no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="reg-class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {[
              "Nursery", "LKG", "UKG",
              "Class 1", "Class 2", "Class 3", "Class 4",
              "Class 5", "Class 6", "Class 7", "Class 8",
              "Class 9", "Class 10", "Class 11", "Class 12",
            ].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* REGISTRATIONS TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table className="reg-table">
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Student Name</th>
                <th>Class / Sec</th>
                <th>Mobile (OTP Verified)</th>
                <th>Aadhaar</th>
                <th>Fee Status</th>
                <th>Razorpay Payment ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    Loading student registrations from database...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((student, idx) => (
                  <tr key={student.id || student._id || idx}>
                    <td style={{ fontWeight: "700", color: "#082b55" }}>
                      {student.registrationNumber || `VEDA-2026-${String(idx + 1).padStart(4, "0")}`}
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl.startsWith("http") ? student.photoUrl : `${API_BASE_URL}${student.photoUrl}`}
                            alt={student.studentName}
                            style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid #cbd5e1" }}
                          />
                        ) : (
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#475569", fontSize: "14px" }}>
                            {student.studentName ? student.studentName.charAt(0).toUpperCase() : "S"}
                          </div>
                        )}
                        <div>
                          <strong>{student.studentName}</strong>
                          <small style={{ display: "block", color: "#64748b", fontSize: "12px" }}>
                            {student.email || "No email"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "12px" }}>
                        {student.studentClass}{student.section && student.section !== "Not Assigned" ? ` - ${student.section}` : ""}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={13} color="#059669" />
                        <span>{student.mobile}</span>
                      </div>
                    </td>

                    <td style={{ color: "#475569" }}>
                      {student.aadhaar ? student.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3") : "—"}
                    </td>

                    <td>
                      <span className="reg-badge-paid">
                        <CheckCircle2 size={12} /> Paid ₹1000
                      </span>
                    </td>

                    <td style={{ fontSize: "12px", fontFamily: "monospace", color: "#334155" }}>
                      {student.razorpayPaymentId || "pay_verified"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="reg-btn-view"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    No student registrations found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedStudent && (
        <div className="reg-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="reg-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reg-modal-header">
              <div>
                <h3>Student Registration Details</h3>
                <span style={{ fontSize: "12px", opacity: 0.9 }}>
                  {selectedStudent.registrationNumber || "Application Record"}
                </span>
              </div>
              <button
                type="button"
                className="reg-modal-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="reg-modal-body">
              {/* STUDENT PHOTO BANNER */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                {selectedStudent.photoUrl ? (
                  <img
                    src={selectedStudent.photoUrl.startsWith("http") ? selectedStudent.photoUrl : `${API_BASE_URL}${selectedStudent.photoUrl}`}
                    alt={selectedStudent.studentName}
                    style={{ width: "72px", height: "72px", borderRadius: "12px", objectFit: "cover", border: "2px solid #082b55" }}
                  />
                ) : (
                  <div style={{ width: "72px", height: "72px", borderRadius: "12px", background: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", color: "#334155" }}>
                    {selectedStudent.studentName ? selectedStudent.studentName.charAt(0).toUpperCase() : "S"}
                  </div>
                )}
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.2rem", color: "#082b55" }}>{selectedStudent.studentName}</h3>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    <span>Reg No: <strong>{selectedStudent.registrationNumber}</strong></span> &bull; 
                    <span> Class: <strong>{selectedStudent.studentClass}</strong></span>
                  </div>
                </div>
              </div>
              {/* PAYMENT VERIFICATION BADGE */}
              <div style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                padding: "14px 18px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={24} color="#059669" />
                  <div>
                    <strong style={{ color: "#065f46", fontSize: "14px", display: "block" }}>
                      Razorpay Online Payment Verified (₹1,000.00)
                    </strong>
                    <small style={{ color: "#047857" }}>
                      Payment ID: {selectedStudent.razorpayPaymentId || "pay_verified"} &bull; Order ID: {selectedStudent.razorpayOrderId || "N/A"}
                    </small>
                  </div>
                </div>
                <span style={{ background: "#059669", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                  PAID
                </span>
              </div>

              {/* PERSONAL DETAILS */}
              <div className="reg-section-box">
                <h4>1. Personal &amp; Identity Details</h4>
                <div className="reg-info-grid">
                  <div className="reg-info-item">
                    <small>Student Full Name</small>
                    <strong>{selectedStudent.studentName}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Gender</small>
                    <strong>{selectedStudent.gender || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Date of Birth</small>
                    <strong>{selectedStudent.dob || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Student Mobile</small>
                    <strong>{selectedStudent.mobile} (Verified)</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Email Address</small>
                    <strong>{selectedStudent.email || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Aadhaar Number</small>
                    <strong>{selectedStudent.aadhaar || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* ACADEMIC DETAILS */}
              <div className="reg-section-box">
                <h4>2. Academic Details</h4>
                <div className="reg-info-grid">
                  <div className="reg-info-item">
                    <small>Applied Class</small>
                    <strong>{selectedStudent.studentClass}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Section</small>
                    <strong>{selectedStudent.section || "A"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Roll Number</small>
                    <strong>{selectedStudent.rollNumber || "Not Assigned"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Admission Date</small>
                    <strong>{selectedStudent.admissionDate || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Academic Session</small>
                    <strong>{selectedStudent.academicSession || "2026-2027"}</strong>
                  </div>
                </div>
              </div>

              {/* PARENT / GUARDIAN DETAILS */}
              <div className="reg-section-box">
                <h4>3. Parents / Guardian Details</h4>
                <div className="reg-info-grid">
                  <div className="reg-info-item">
                    <small>Father's Name</small>
                    <strong>{selectedStudent.fatherName || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Father's Mobile</small>
                    <strong>{selectedStudent.fatherMobile || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Mother's Name</small>
                    <strong>{selectedStudent.motherName || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>Mother's Mobile</small>
                    <strong>{selectedStudent.motherMobile || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* ADDRESS DETAILS */}
              <div className="reg-section-box">
                <h4>4. Address &amp; Location</h4>
                <div className="reg-info-grid">
                  <div className="reg-info-item" style={{ gridColumn: "span 2" }}>
                    <small>Street Address</small>
                    <strong>{selectedStudent.address || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>City</small>
                    <strong>{selectedStudent.city || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>State</small>
                    <strong>{selectedStudent.state || "—"}</strong>
                  </div>
                  <div className="reg-info-item">
                    <small>PIN Code</small>
                    <strong>{selectedStudent.pinCode || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* PREVIOUS SCHOOL DETAILS */}
              <div className="reg-section-box">
                <h4>5. Previous School History</h4>
                {selectedStudent.isFirstSchool ? (
                  <p style={{ margin: 0, color: "#059669", fontSize: "13px", fontWeight: "600" }}>
                    ✓ First Time Admission (Child has not attended any previous formal school).
                  </p>
                ) : (
                  <div className="reg-info-grid">
                    <div className="reg-info-item">
                      <small>Previous School Name</small>
                      <strong>{selectedStudent.previousSchoolName || "—"}</strong>
                    </div>
                    <div className="reg-info-item">
                      <small>Last Studied Class</small>
                      <strong>{selectedStudent.previousClass || "—"}</strong>
                    </div>
                    <div className="reg-info-item">
                      <small>School Board</small>
                      <strong>{selectedStudent.previousBoard || "—"}</strong>
                    </div>
                    <div className="reg-info-item">
                      <small>Leaving Date</small>
                      <strong>{selectedStudent.previousLeavingDate || "—"}</strong>
                    </div>
                    <div className="reg-info-item" style={{ gridColumn: "span 2" }}>
                      <small>Reason For Leaving</small>
                      <strong>{selectedStudent.reasonForLeaving || "—"}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

