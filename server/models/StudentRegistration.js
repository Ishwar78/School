const mongoose = require("mongoose");

const studentRegistrationSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      default: "",
    },
    studentClass: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    section: {
      type: String,
      default: "Not Assigned",
      trim: true,
    },
    dob: {
      type: String,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    admissionDate: {
      type: String,
      required: [true, "Admission date is required"],
    },
    academicSession: {
      type: String,
      default: "2026-2027",
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    mobileVerified: {
      type: Boolean,
      default: true,
    },
    aadhaar: {
      type: String,
      required: [true, "Aadhaar number is required"],
      trim: true,
    },
    pinCode: {
      type: String,
      required: [true, "PIN Code is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father name is required"],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Mother name is required"],
      trim: true,
    },
    fatherMobile: {
      type: String,
      required: [true, "Father mobile is required"],
      trim: true,
    },
    motherMobile: {
      type: String,
      required: [true, "Mother mobile is required"],
      trim: true,
    },
    // Previous school details
    isFirstSchool: {
      type: Boolean,
      default: false,
    },
    previousSchoolName: {
      type: String,
      default: "",
      trim: true,
    },
    previousSchoolAddress: {
      type: String,
      default: "",
      trim: true,
    },
    previousClass: {
      type: String,
      default: "",
      trim: true,
    },
    previousBoard: {
      type: String,
      default: "",
      trim: true,
    },
    previousAdmissionDate: {
      type: String,
      default: "",
    },
    previousLeavingDate: {
      type: String,
      default: "",
    },
    reasonForLeaving: {
      type: String,
      default: "",
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    // Razorpay payment details
    feeAmount: {
      type: Number,
      default: 1000,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Paid",
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Verified", "Pending"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to generate registration number if not present
studentRegistrationSchema.pre("save", function () {
  if (!this.registrationNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    this.registrationNumber = `VEDA-${this.academicSession ? this.academicSession.split("-")[0] : "2026"}-${timestamp}${random}`;
  }
});

const StudentRegistration = mongoose.model("StudentRegistration", studentRegistrationSchema);

module.exports = StudentRegistration;

