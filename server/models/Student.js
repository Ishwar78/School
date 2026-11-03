const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    admission: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    classId: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    section: {
      type: String,
      default: "Not Assigned",
      trim: true,
    },
    roll: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "Male",
    },
    admissionDate: {
      type: String,
      default: "",
    },
    session: {
      type: String,
      default: "2026-2027",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    emergency: {
      type: String,
      trim: true,
      default: "",
    },
    aadhaar: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    fatherName: {
      type: String,
      trim: true,
      default: "",
    },
    motherName: {
      type: String,
      trim: true,
      default: "",
    },
    fatherMobile: {
      type: String,
      trim: true,
      default: "",
    },
    motherMobile: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
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
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash student password if provided
studentSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

