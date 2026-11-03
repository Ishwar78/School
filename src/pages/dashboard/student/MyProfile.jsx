
import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  GraduationCap,
  IdCard,
  Users,
  User,
  School,
  Hash,
} from "lucide-react";

import "./MyProfile.css";

const MyProfile = ({ student = {} }) => {
  const studentName =
    student.name ||
    student.fullName ||
    student.studentName ||
    "Student";

  const getValue = (...values) =>
    values.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    ) || "Not Available";

  const personalDetails = [
    {
      label: "Student Name",
      value: studentName,
      icon: UserRound,
    },
    {
      label: "Admission Number",
      value: getValue(
        student.admission,
        student.admissionNo,
        student.admissionNumber
      ),
      icon: IdCard,
    },
    {
      label: "Roll Number",
      value: getValue(student.roll, student.rollNumber),
      icon: Hash,
    },
    {
      label: "Date of Birth",
      value: getValue(student.dob, student.dateOfBirth),
      icon: CalendarDays,
    },
    {
      label: "Gender",
      value: getValue(student.gender),
      icon: User,
    },
    {
      label: "Email Address",
      value: getValue(student.email),
      icon: Mail,
    },
    {
      label: "Mobile Number",
      value: getValue(student.mobile, student.phone),
      icon: Phone,
    },
    {
      label: "Address",
      value: getValue(student.address),
      icon: MapPin,
    },
  ];

  const academicDetails = [
    {
      label: "Class",
      value: getValue(student.class, student.classId),
      icon: GraduationCap,
    },
    {
      label: "Section",
      value: getValue(student.section),
      icon: School,
    },
    {
      label: "Academic Session",
      value: getValue(student.session, student.academicSession),
      icon: CalendarDays,
    },
  ];

  const familyDetails = [
    {
      label: "Father's Name",
      value: getValue(student.fatherName, student.father),
    },
    {
      label: "Father's Mobile",
      value: getValue(student.fatherMobile, student.fatherPhone),
    },
    {
      label: "Mother's Name",
      value: getValue(student.motherName, student.mother),
    },
    {
      label: "Mother's Mobile",
      value: getValue(student.motherMobile, student.motherPhone),
    },
  ];

  const initials = studentName.charAt(0).toUpperCase();

  return (
    <div className="student-profile-page">

      {/* PROFILE HEADER */}

      <div className="profile-page-heading">
        <div>
          <span>STUDENT INFORMATION</span>
          <h2>My Profile</h2>
          <p>
            View your personal, academic and family information.
          </p>
        </div>

        <div className="profile-heading-icon">
          <UserRound size={28} />
        </div>
      </div>

      {/* STUDENT PROFILE BANNER */}

      <div className="profile-main-card">

        <div className="profile-avatar-large" style={{ overflow: "hidden" }}>
          {student.avatar || student.photoUrl ? (
            <img
              src={(student.avatar || student.photoUrl).startsWith("http") ? (student.avatar || student.photoUrl) : `http://localhost:5075${student.avatar || student.photoUrl}`}
              alt={studentName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initials
          )}
        </div>

        <div className="profile-main-info">
          <span>VEDA STUDENT PORTAL</span>

          <h3>{studentName}</h3>

          <p>
            Admission No:{" "}
            {getValue(
              student.admission,
              student.admissionNo,
              student.admissionNumber
            )}
          </p>

          <div className="profile-class-badges">
            <span>
              Class: {getValue(student.class, student.classId)}
            </span>

            <span>
              Section: {getValue(student.section)}
            </span>
          </div>
        </div>

        <div className="profile-school-icon">
          <GraduationCap size={65} />
        </div>

      </div>

      {/* PERSONAL DETAILS */}

      <section className="profile-information-card">

        <div className="profile-section-heading">
          <div className="profile-section-icon">
            <UserRound size={20} />
          </div>

          <div>
            <h3>Personal Information</h3>
            <p>Your basic personal details</p>
          </div>
        </div>

        <div className="profile-details-grid">

          {personalDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="profile-detail-box" key={index}>

                <div className="profile-detail-icon">
                  <Icon size={19} />
                </div>

                <div className="profile-detail-text">
                  <span>{item.label}</span>
                  <h4>{item.value}</h4>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* ACADEMIC DETAILS */}

      <section className="profile-information-card">

        <div className="profile-section-heading">

          <div className="profile-section-icon">
            <GraduationCap size={20} />
          </div>

          <div>
            <h3>Academic Information</h3>
            <p>Your current academic details</p>
          </div>

        </div>

        <div className="profile-details-grid">

          {academicDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="profile-detail-box" key={index}>

                <div className="profile-detail-icon">
                  <Icon size={19} />
                </div>

                <div className="profile-detail-text">
                  <span>{item.label}</span>
                  <h4>{item.value}</h4>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* FAMILY DETAILS */}

      <section className="profile-information-card">

        <div className="profile-section-heading">

          <div className="profile-section-icon">
            <Users size={20} />
          </div>

          <div>
            <h3>Parent / Guardian Information</h3>
            <p>Parent and guardian contact details</p>
          </div>

        </div>

        <div className="profile-details-grid">

          {familyDetails.map((item, index) => (
            <div className="profile-detail-box" key={index}>

              <div className="profile-detail-icon">
                {index % 2 === 0 ? (
                  <UserRound size={19} />
                ) : (
                  <Phone size={19} />
                )}
              </div>

              <div className="profile-detail-text">
                <span>{item.label}</span>
                <h4>{item.value}</h4>
              </div>

            </div>
          ))}

        </div>

      </section>

      <div className="profile-footer-note">
        <School size={18} />
        <p>
          For any correction in your personal information,
          please contact the school administration.
        </p>
      </div>

    </div>
  );
};

export default MyProfile;
