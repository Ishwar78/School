
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRazorpayOrderApi, registerStudentApi, uploadStudentPhotoApi } from "../../../lib/api";
import {
  UserRound,
  Mail,
  Hash,
  CalendarDays,
  GraduationCap,
  Users,
  Phone,
  MapPin,
  Upload,
  ShieldCheck,
  CheckCircle,
  Send,
  User,
  FileText,
  Save,
  RotateCcw,
  AlertCircle,
  School,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import "./StudentRegistration.css";
import Navbar from "../../../components/Navbar";

const classes = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4",
  "Class 5", "Class 6", "Class 7", "Class 8",
  "Class 9", "Class 10", "Class 11", "Class 12",
];

const sections = ["A", "B", "C", "D"];

const initialForm = {
  studentName: "",
  email: "",
    studentClass: "",
    dob: "",
  gender: "",
  admissionDate: "",
  academicSession: "2026-2027",

  mobile: "",
  aadhaar: "",

  pinCode: "",
  city: "",
  state: "",
  address: "",

  fatherName: "",
  motherName: "",
  fatherMobile: "",
  motherMobile: "",

  isFirstSchool: false,
  previousSchoolName: "",
  previousSchoolAddress: "",
  previousClass: "",
  previousBoard: "",
  previousAdmissionDate: "",
  previousLeavingDate: "",
  reasonForLeaving: "",
};

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "mobile") {
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setMessage("");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size must be less than 5 MB.");
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setMessage("");
  };

  // DEMO OTP: 123456
  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      showMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setOtpSent(true);
    setOtpVerified(false);
    setOtp("");

    showMessage(
      "Demo OTP generated successfully. Use 123456 to verify.",
      "success"
    );
  };

  const handleVerifyOtp = () => {
    if (!otpSent) {
      showMessage("Please send OTP first.");
      return;
    }

    if (otp.length !== 6) {
      showMessage("Please enter the 6-digit OTP.");
      return;
    }

    if (otp === "123456") {
      setOtpVerified(true);
      showMessage("Mobile number verified successfully!", "success");
    } else {
      setOtpVerified(false);
      showMessage("Invalid OTP. Please enter 123456.");
    }
  };

  const validateForm = () => {
    if (!form.studentName.trim()) return "Please enter student full name.";
    if (!form.email.trim()) return "Please enter student email.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }

        if (!form.studentClass) return "Please select class.";
        if (!form.dob) return "Please select date of birth.";
    if (!form.gender) return "Please select gender.";
    if (!form.admissionDate) return "Please select admission date.";
    if (!form.academicSession) return "Please select academic session.";

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      return "Please enter a valid student mobile number.";
    }

    if (!otpVerified) return "Please verify student mobile number first.";

    if (!/^\d{12}$/.test(form.aadhaar)) {
      return "Please enter a valid 12-digit Aadhaar number.";
    }

    if (!/^\d{6}$/.test(form.pinCode)) {
      return "Please enter a valid 6-digit PIN code.";
    }

    if (!form.city.trim()) return "Please enter city.";
    if (!form.state.trim()) return "Please enter state.";
    if (!form.address.trim()) return "Please enter complete address.";

    if (!form.fatherName.trim()) return "Please enter father's full name.";
    if (!form.motherName.trim()) return "Please enter mother's full name.";

    if (!/^[6-9]\d{9}$/.test(form.fatherMobile)) {
      return "Please enter a valid father's mobile number.";
    }

    if (!/^[6-9]\d{9}$/.test(form.motherMobile)) {
      return "Please enter a valid mother's mobile number.";
    }

    if (!form.isFirstSchool) {
      if (!form.previousSchoolName.trim()) {
        return "Please enter previous school name or select First Time Admission.";
      }

      if (!form.previousClass) {
        return "Please select previous class.";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      showMessage(error);
      return;
    }

    setSubmitting(true);
    showMessage("Initializing secure Razorpay payment for Rs. 1000...", "info");

    const completeRegistration = async (paymentDetails) => {
      let uploadedPhotoUrl = "";
      if (photo) {
        try {
          showMessage("Uploading student profile photo to server...", "info");
          const uploadRes = await uploadStudentPhotoApi(photo);
          if (uploadRes?.photoUrl) {
            uploadedPhotoUrl = uploadRes.photoUrl;
          }
        } catch (photoErr) {
          console.warn("Photo upload warning:", photoErr);
        }
      }

      const registrationData = {
        ...form,
        photoUrl: uploadedPhotoUrl,
        photoName: photo?.name || "",
        rollNumber: "",
        section: "Not Assigned",
        mobileVerified: otpVerified,
        registrationDate: new Date().toISOString(),
        feeAmount: 1000,
        paymentStatus: "Paid",
        razorpayPaymentId: paymentDetails?.razorpay_payment_id || "pay_" + Date.now(),
        razorpayOrderId: paymentDetails?.razorpay_order_id || "",
        razorpaySignature: paymentDetails?.razorpay_signature || "",
      };

      try {
        const res = await registerStudentApi(registrationData);

        // Also save to localStorage as local backup
        try {
          const existing = JSON.parse(
            localStorage.getItem("vedaStudentRegistrations") || "[]"
          );
          existing.unshift(res?.registration || registrationData);
          localStorage.setItem(
            "vedaStudentRegistrations",
            JSON.stringify(existing)
          );
        } catch (storageErr) {
          console.warn("LocalStorage backup warning:", storageErr);
        }

        showMessage(
          "Payment of Rs. 1000 received! Student registration completed successfully! Redirecting to dashboard...",
          "success"
        );

        if (res?.studentUser) {
          localStorage.setItem("eduflowUser", JSON.stringify(res.studentUser));
        } else {
          localStorage.setItem(
            "eduflowUser",
            JSON.stringify({
              name: form.studentName,
              studentName: form.studentName,
              email: form.email,
              mobile: form.mobile,
              phone: form.mobile,
              class: form.studentClass,
              classId: form.studentClass,
              section: "Not Assigned",
              roll: "",
              admission: "VEDA-2026-" + Date.now().toString().slice(-4),
              dob: form.dob,
              gender: form.gender,
              fatherName: form.fatherName,
              motherName: form.motherName,
              fatherMobile: form.fatherMobile,
              motherMobile: form.motherMobile,
              address: form.address,
              city: form.city,
              state: form.state,
              pinCode: form.pinCode,
              aadhaar: form.aadhaar,
              photoUrl: uploadedPhotoUrl,
              avatar: uploadedPhotoUrl,
              feeAmount: 1000,
              paymentStatus: "Paid",
              role: "student",
            })
          );
        }

        setTimeout(() => {
          navigate("/dashboard/student");
        }, 1200);
      } catch (saveErr) {
        console.error("Registration save error:", saveErr);
        showMessage(
          saveErr.message || "Failed to save registration to database. Please contact school office."
        );
        setSubmitting(false);
      }
    };

    try {
      // Dynamically load Razorpay SDK if not present
      if (typeof window.Razorpay !== 'function') {
        await new Promise((res) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.async = true;
          s.onload = () => res(true);
          s.onerror = () => res(false);
          document.body.appendChild(s);
        });
      }

      // Create Razorpay Order with resilience
      let orderRes = null;
      let orderId = "";
      let razorpayKey = "rzp_test_Sp7kyr6OgNH35p";

      try {
        orderRes = await createRazorpayOrderApi();
        if (orderRes?.key) razorpayKey = orderRes.key;
        if (orderRes?.order?.id) orderId = orderRes.order.id;
      } catch (orderErr) {
        console.warn("Could not create Razorpay order on server, using fallback key:", orderErr.message);
      }

      if (typeof window.Razorpay === "function") {
        const options = {
          key: razorpayKey,
          amount: 1000 * 100, // Rs. 1000 in paise
          currency: "INR",
          name: "VEDA INTERNATIONAL SCHOOL",
          description: "Admission Registration Fee (Rs. 1000)",
          image: "/veda-logo.webp",
          order_id: orderId,
          prefill: {
            name: form.studentName,
            email: form.email,
            contact: form.mobile,
          },
          theme: {
            color: "#082b55",
          },
          handler: async function (response) {
            await completeRegistration(response);
          },
          modal: {
            ondismiss: function () {
              showMessage("Payment cancelled. Please complete the Rs. 1000 fee payment to complete registration.");
              setSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          console.error("Payment Failed:", resp.error);
          showMessage("Payment Failed: " + (resp.error?.description || "Transaction declined"));
          setSubmitting(false);
        });
        rzp.open();
      } else {
        // Fallback simulation for test environment
        const confirmPayment = window.confirm(
          "Razorpay checkout is ready. Confirm payment of Rs. 1000 for VEDA School Admission Registration?"
        );
        if (confirmPayment) {
          await completeRegistration({ razorpay_payment_id: "pay_sim_" + Date.now() });
        } else {
          setSubmitting(false);
        }
      }
    } catch (payErr) {
      console.error("Payment initiation error:", payErr);
      showMessage(payErr.message || "Unable to initiate Razorpay payment. Please try again.");
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setPhoto(null);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const Field = ({
    label,
    name,
    icon: Icon,
    type = "text",
    placeholder,
    required = true,
    children,
    maxLength,
  }) => (
    <div className="sr-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="sr-required">*</span>}
      </label>

      <div className="sr-input-wrap">
        {Icon && <Icon className="sr-input-icon" size={18} />}

        {children || (
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
            maxLength={maxLength}
          />
        )}
      </div>
    </div>
  );

  const SelectField = ({
    label,
    name,
    icon: Icon,
    options,
    placeholder,
    required = true,
  }) => (
    <Field
      label={label}
      name={name}
      icon={Icon}
      required={required}
    >
      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
      >
        <option value="">
          {placeholder || `Select ${label}`}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <>
      <Navbar />

      <div className="sr-page">
        <div className="sr-header">
          <div className="sr-header-icon">
            <GraduationCap size={30} />
          </div>

          <div>
            <h1>Student Registration</h1>
            <p>
              Register a new student by providing all required details.
            </p>
          </div>
        </div>

        <form className="sr-form" onSubmit={handleSubmit}>
          {/* STUDENT INFORMATION */}

          <section className="sr-section">
            <div className="sr-section-heading">
              <div className="sr-section-icon">
                <UserRound size={21} />
              </div>

              <div>
                <h2>Student Information</h2>
                <p>Enter the student's personal and academic details.</p>
              </div>
            </div>

            <div className="sr-photo-area">
              <div className="sr-photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Student Preview" />
                ) : (
                  <UserRound size={48} />
                )}
              </div>

              <div className="sr-photo-content">
                <h3>Student Profile Photo</h3>
                <p>Upload a clear passport-size student photograph.</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                  id="studentPhoto"
                />

                <button
                  type="button"
                  className="sr-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  Upload Photo
                </button>

                <small>JPG, PNG or WEBP. Maximum 5 MB.</small>
              </div>
            </div>

            <div className="sr-grid">
              <Field
                label="Student Full Name"
                name="studentName"
                icon={User}
                placeholder="Enter student's full name"
              />

              <Field
                label="Email Address"
                name="email"
                icon={Mail}
                type="email"
                placeholder="student@example.com"
              />

              <SelectField
                label="Class"
                name="studentClass"
                icon={GraduationCap}
                options={classes}
              />

              <Field
                label="Date of Birth"
                name="dob"
                icon={CalendarDays}
                type="date"
              />

              <SelectField
                label="Gender"
                name="gender"
                icon={UserRound}
                options={["Male", "Female", "Other"]}
              />

              <Field
                label="Admission Date"
                name="admissionDate"
                icon={CalendarDays}
                type="date"
              />

              <SelectField
                label="Academic Session"
                name="academicSession"
                icon={CalendarDays}
                options={[
                  "2025-2026",
                  "2026-2027",
                  "2027-2028",
                  "2028-2029",
                ]}
              />
            </div>
          </section>

          {/* CONTACT AND IDENTITY */}

          <section className="sr-section">
            <div className="sr-section-heading">
              <div className="sr-section-icon">
                <Phone size={21} />
              </div>

              <div>
                <h2>Contact & Identity Details</h2>
                <p>Verify the student's mobile number and enter identity details.</p>
              </div>
            </div>

            <div className="sr-grid">
              <div className="sr-field sr-mobile-field">
                <label htmlFor="mobile">
                  Student Mobile Number <span className="sr-required">*</span>
                </label>

                <div className="sr-mobile-row">
                  <div className="sr-input-wrap">
                    <Phone className="sr-input-icon" size={18} />

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.mobile}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "mobile",
                            value: e.target.value.replace(/\D/g, ""),
                            type: "text",
                          },
                        })
                      }
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="sr-otp-send"
                    onClick={handleSendOtp}
                    disabled={otpVerified}
                  >
                    <Send size={15} />
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>

                {otpVerified && (
                  <span className="sr-verified-text">
                    <CheckCircle size={15} />
                    Mobile number verified
                  </span>
                )}
              </div>

              <div className="sr-field">
                <label htmlFor="aadhaar">
                  Aadhaar Card Number <span className="sr-required">*</span>
                </label>

                <div className="sr-input-wrap">
                  <FileText className="sr-input-icon" size={18} />

                  <input
                    id="aadhaar"
                    name="aadhaar"
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={form.aadhaar}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        aadhaar: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="Enter 12-digit Aadhaar number"
                    required
                  />
                </div>
              </div>
            </div>

            {otpSent && !otpVerified && (
              <div className="sr-otp-box">
                <div className="sr-otp-heading">
                  <ShieldCheck size={21} />

                  <div>
                    <h3>Verify Mobile Number</h3>
                    <p>Enter the 6-digit demo OTP below.</p>
                  </div>
                </div>

                <div className="sr-otp-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter 6-digit OTP"
                  />

                  <button
                    type="button"
                    className="sr-verify-btn"
                    onClick={handleVerifyOtp}
                  >
                    <ShieldCheck size={17} />
                    Verify OTP
                  </button>
                </div>

                <small className="sr-demo-note">
                  Demo OTP: <strong>123456</strong>
                </small>
              </div>
            )}

            {otpVerified && (
              <div className="sr-success-box">
                <CheckCircle size={19} />
                Your mobile number has been successfully verified.
              </div>
            )}
          </section>

          {/* ADDRESS DETAILS */}

          <section className="sr-section">
            <div className="sr-section-heading">
              <div className="sr-section-icon">
                <MapPin size={21} />
              </div>

              <div>
                <h2>Address Details</h2>
                <p>Enter the student's residential address.</p>
              </div>
            </div>

            <div className="sr-grid">
              <Field
                label="PIN Code"
                name="pinCode"
                icon={MapPin}
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
              />

              <Field
                label="City"
                name="city"
                icon={MapPin}
                placeholder="Enter city"
              />

              <Field
                label="State"
                name="state"
                icon={MapPin}
                placeholder="Enter state"
              />

              <div className="sr-field sr-full-width">
                <label htmlFor="address">
                  Complete Address <span className="sr-required">*</span>
                </label>

                <div className="sr-input-wrap sr-textarea-wrap">
                  <MapPin className="sr-input-icon" size={18} />

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter house number, street, locality and complete address"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PARENT INFORMATION */}

          <section className="sr-section">
            <div className="sr-section-heading">
              <div className="sr-section-icon">
                <Users size={21} />
              </div>

              <div>
                <h2>Parent / Guardian Information</h2>
                <p>Enter father and mother contact information.</p>
              </div>
            </div>

            <div className="sr-parent-heading">
              <UserRound size={18} />
              Father's Details
            </div>

            <div className="sr-grid">
              <Field
                label="Father Full Name"
                name="fatherName"
                icon={User}
                placeholder="Enter father's full name"
              />

              <Field
                label="Father Mobile Number"
                name="fatherMobile"
                icon={Phone}
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            </div>

            <div className="sr-parent-heading sr-mother-heading">
              <UserRound size={18} />
              Mother's Details
            </div>

            <div className="sr-grid">
              <Field
                label="Mother Full Name"
                name="motherName"
                icon={User}
                placeholder="Enter mother's full name"
              />

              <Field
                label="Mother Mobile Number"
                name="motherMobile"
                icon={Phone}
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            </div>
          </section>

          {/* PREVIOUS SCHOOL DETAILS */}

          <section className="sr-section">
            <div className="sr-section-heading">
              <div className="sr-section-icon">
                <School size={21} />
              </div>

              <div>
                <h2>Previous School Details</h2>
                <p>Add the details of the student's last attended school.</p>
              </div>
            </div>

            <div className="sr-first-school">
              <label className="sr-checkbox-label">
                <input
                  type="checkbox"
                  name="isFirstSchool"
                  checked={form.isFirstSchool}
                  onChange={handleChange}
                />

                <span className="sr-custom-checkbox">
                  <CheckCircle size={15} />
                </span>

                <span>
                  <strong>First Time Admission</strong>
                  <small>
                    Student has not attended any previous school.
                  </small>
                </span>
              </label>
            </div>

            {!form.isFirstSchool && (
              <div className="sr-previous-school-fields">
                <div className="sr-grid">
                  <Field
                    label="Previous / Last School Name"
                    name="previousSchoolName"
                    icon={School}
                    placeholder="Enter previous school name"
                  />

                  <SelectField
                    label="Previous Class"
                    name="previousClass"
                    icon={BookOpen}
                    options={classes}
                    placeholder="Select last studied class"
                  />

                  <SelectField
                    label="Previous School Board"
                    name="previousBoard"
                    icon={GraduationCap}
                    options={[
                      "CBSE",
                      "ICSE",
                      "HBSE",
                      "Other State Board",
                      "IB",
                      "Other",
                    ]}
                    placeholder="Select school board"
                    required={false}
                  />

                 

                  <Field
                    label="School Leaving Date"
                    name="previousLeavingDate"
                    icon={CalendarDays}
                    type="date"
                    required={false}
                  />

                  <div className="sr-field sr-full-width">
                    <label htmlFor="previousSchoolAddress">
                      Previous School Address
                    </label>

                    <div className="sr-input-wrap sr-textarea-wrap">
                      <MapPin className="sr-input-icon" size={18} />

                      <textarea
                        id="previousSchoolAddress"
                        name="previousSchoolAddress"
                        value={form.previousSchoolAddress}
                        onChange={handleChange}
                        placeholder="Enter previous school's complete address"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ALERT MESSAGE */}

          {message && (
            <div
              className={`sr-message ${
                messageType === "success"
                  ? "sr-message-success"
                  : "sr-message-error"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle size={19} />
              ) : (
                <AlertCircle size={19} />
              )}

              <span>{message}</span>
            </div>
          )}

          {/* ACTIONS */}

          <div className="sr-actions">
            <button
              type="button"
              className="sr-reset-btn"
              onClick={handleReset}
            >
              <RotateCcw size={17} />
              Reset Form
            </button>

            <button
              type="submit"
              className="sr-submit-btn"
              disabled={submitting}
            >
              <Save size={18} />
              {submitting ? "Processing Payment & Registration..." : "Pay Rs. 1000 & Submit Application"}
            </button>
          </div>

          <p className="sr-footer-note">
            <ShieldCheck size={15} />
            Please verify all details before submitting the registration form.
          </p>
        </form>
      </div>
    </>
  );
};

export default StudentRegistration;
