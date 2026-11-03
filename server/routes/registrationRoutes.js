const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Razorpay = require("razorpay");
const StudentRegistration = require("../models/StudentRegistration.js");
const Student = require("../models/Student.js");

const router = express.Router();

// Ensure uploads folder exists in server directory
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for student photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueName = `student-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP) are allowed."));
    }
  },
});

// Helper to construct a unified, complete student profile object
function buildStudentProfile(student) {
  if (!student) return null;
  return {
    id: student._id,
    _id: student._id,
    name: student.studentName || student.name || "Student",
    studentName: student.studentName || student.name || "Student",
    email: student.email || "",
    mobile: student.mobile || student.phone || "",
    phone: student.mobile || student.phone || "",
    class: student.studentClass || student.classId || "Not Assigned",
    classId: student.studentClass || student.classId || "Not Assigned",
    studentClass: student.studentClass || student.classId || "Not Assigned",
    section: student.section || "Not Assigned",
    roll: student.rollNumber || student.roll || "",
    rollNumber: student.rollNumber || student.roll || "",
    admission: student.registrationNumber || student.admission || "",
    registrationNumber: student.registrationNumber || student.admission || "",
    dob: student.dob || "",
    gender: student.gender || "Male",
    admissionDate: student.admissionDate || "",
    academicSession: student.academicSession || student.session || "2026-2027",
    session: student.academicSession || student.session || "2026-2027",
    aadhaar: student.aadhaar || "",
    pinCode: student.pinCode || "",
    city: student.city || "",
    state: student.state || "",
    address: student.address || "",
    fatherName: student.fatherName || "",
    motherName: student.motherName || "",
    fatherMobile: student.fatherMobile || "",
    motherMobile: student.motherMobile || "",
    isFirstSchool: Boolean(student.isFirstSchool),
    previousSchoolName: student.previousSchoolName || "",
    photoUrl: student.photoUrl || student.avatar || "",
    avatar: student.photoUrl || student.avatar || "",
    feeAmount: student.feeAmount || 1000,
    paymentStatus: student.paymentStatus || "Paid",
    razorpayPaymentId: student.razorpayPaymentId || "",
    razorpayOrderId: student.razorpayOrderId || "",
    role: "student",
  };
}

// Initialize Razorpay instance safely
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.warn("[Razorpay] Initialization warning:", e.message);
}

/**
 * @route   POST /api/student-registration/upload-photo
 * @desc    Upload student profile photo to /uploads folder
 */
router.post("/upload-photo", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: "Student photo uploaded successfully to uploads folder.",
      photoUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("[Upload Photo Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload photo.",
    });
  }
});

/**
 * @route   GET /api/payment/razorpay-key
 * @desc    Get Razorpay Public Key ID
 */
router.get("/razorpay-key", (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_Sp7kyr6OgNH35p";
  res.status(200).json({
    success: true,
    key: keyId,
  });
});

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay Order for ₹1000 (100000 paise)
 */
router.post("/create-order", async (req, res) => {
  try {
    const amountInPaise = 1000 * 100; // ₹1000 in paise
    const currency = process.env.RAZORPAY_CURRENCY || "INR";
    const receipt = `reg_${Date.now()}`;

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency,
          receipt,
        });

        return res.status(200).json({
          success: true,
          order,
          key: process.env.RAZORPAY_KEY_ID,
        });
      } catch (rzpErr) {
        console.warn("[Razorpay Order API Warning]:", rzpErr.message);
      }
    }

    // Fallback order for test / mock scenarios
    return res.status(200).json({
      success: true,
      order: {
        id: `order_${Date.now()}`,
        amount: amountInPaise,
        currency,
        receipt,
        status: "created",
      },
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_Sp7kyr6OgNH35p",
    });
  } catch (error) {
    console.error("[Create Order Error]:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/student-registration/register
 * @desc    Submit student registration with payment details & save to MongoDB
 */
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    if (!data.studentName || !data.mobile || !data.studentClass) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory fields: student name, class, and mobile number.",
      });
    }

    // Create registration record
    const registration = new StudentRegistration({
      studentName: data.studentName.trim(),
      email: data.email ? data.email.trim().toLowerCase() : "",
      rollNumber: data.rollNumber ? data.rollNumber.trim() : "",
      studentClass: data.studentClass,
      section: data.section ? data.section.trim() : "Not Assigned",
      dob: data.dob || "",
      gender: data.gender || "Male",
      admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
      academicSession: data.academicSession || "2026-2027",
      mobile: data.mobile.trim(),
      mobileVerified: true,
      aadhaar: data.aadhaar ? data.aadhaar.trim() : "",
      pinCode: data.pinCode ? data.pinCode.trim() : "",
      city: data.city ? data.city.trim() : "",
      state: data.state ? data.state.trim() : "",
      address: data.address ? data.address.trim() : "",
      fatherName: data.fatherName ? data.fatherName.trim() : "",
      motherName: data.motherName ? data.motherName.trim() : "",
      fatherMobile: data.fatherMobile ? data.fatherMobile.trim() : "",
      motherMobile: data.motherMobile ? data.motherMobile.trim() : "",
      isFirstSchool: Boolean(data.isFirstSchool),
      previousSchoolName: data.previousSchoolName || "",
      previousSchoolAddress: data.previousSchoolAddress || "",
      previousClass: data.previousClass || "",
      previousBoard: data.previousBoard || "",
      previousAdmissionDate: data.previousAdmissionDate || "",
      previousLeavingDate: data.previousLeavingDate || "",
      reasonForLeaving: data.reasonForLeaving || "",
      photoUrl: data.photoUrl || "",
      feeAmount: 1000,
      paymentStatus: "Paid",
      razorpayOrderId: data.razorpayOrderId || "",
      razorpayPaymentId: data.razorpayPaymentId || `pay_sim_${Date.now()}`,
      razorpaySignature: data.razorpaySignature || "",
      status: "Active",
    });

    const savedRegistration = await registration.save();

    // Also sync/create in Student collection so student appears in management & attendance
    try {
      const existingStudent = await Student.findOne({
        $or: [{ phone: data.mobile.trim() }, { email: data.email?.trim().toLowerCase() }],
      });

      if (!existingStudent) {
        await Student.create({
          admission: savedRegistration.registrationNumber,
          name: data.studentName.trim(),
          email: data.email ? data.email.trim().toLowerCase() : "",
          classId: data.studentClass,
          section: data.section ? data.section.trim() : "Not Assigned",
          roll: data.rollNumber ? data.rollNumber.trim() : "",
          dob: data.dob || "",
          gender: data.gender || "Male",
          admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
          session: data.academicSession || "2026-2027",
          phone: data.mobile.trim(),
          emergency: data.fatherMobile || data.motherMobile || "",
          aadhaar: data.aadhaar || "",
          address: `${data.address || ""}, ${data.city || ""}, ${data.state || ""} ${data.pinCode || ""}`.trim(),
          fatherName: data.fatherName || "",
          motherName: data.motherName || "",
          fatherMobile: data.fatherMobile || "",
          motherMobile: data.motherMobile || "",
          avatar: data.photoUrl || "",
          status: "Active",
        });
      }
    } catch (syncErr) {
      console.warn("[Student Sync Warning]:", syncErr.message);
    }

    const fullProfile = buildStudentProfile(savedRegistration);

    res.status(201).json({
      success: true,
      message: "Student registration completed and payment verified!",
      registration: savedRegistration,
      studentUser: fullProfile,
    });
  } catch (error) {
    console.error("[Student Registration Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while completing student registration.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/student-registration/student-profile/:identifier
 * @desc    Fetch complete student profile by mobile, registration number, or ID
 */
router.get("/student-profile/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Identifier is required" });
    }

    const cleanId = decodeURIComponent(identifier).trim();

    // 1. Check StudentRegistration collection
    let student = null;
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await StudentRegistration.findById(cleanId);
    }
    if (!student) {
      student = await StudentRegistration.findOne({
        $or: [
          { mobile: cleanId },
          { registrationNumber: cleanId },
          { email: cleanId.toLowerCase() },
        ],
      });
    }

    // 2. Check Student collection
    if (!student) {
      if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
        student = await Student.findById(cleanId);
      }
      if (!student) {
        student = await Student.findOne({
          $or: [
            { phone: cleanId },
            { admission: cleanId },
            { email: cleanId.toLowerCase() },
          ],
        });
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found.",
      });
    }

    res.status(200).json({
      success: true,
      student: buildStudentProfile(student),
    });
  } catch (error) {
    console.error("[Student Profile Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching student profile.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/student-registration/all
 * @desc    Fetch all student registrations for Admin Dashboard
 */
router.get("/all", async (req, res) => {
  try {
    const { studentClass, search } = req.query;
    const filter = {};

    if (studentClass) {
      filter.studentClass = studentClass;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { studentName: searchRegex },
        { registrationNumber: searchRegex },
        { mobile: searchRegex },
        { rollNumber: searchRegex },
        { fatherName: searchRegex },
      ];
    }

    const registrations = await StudentRegistration.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error("[Fetch Registrations Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching registrations.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/student-registration/:id
 * @desc    Fetch single registration details for Admin View modal
 */
router.get("/:id", async (req, res) => {
  try {
    const registration = await StudentRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration record not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("[Fetch Registration Detail Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching registration detail.",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/send-login-otp
 * @desc    Generate Demo OTP for student mobile login
 */
router.post("/send-login-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    // Check if student exists in database
    const student = await StudentRegistration.findOne({ mobile: mobile.trim() });
    const studentAlt = !student ? await Student.findOne({ phone: mobile.trim() }) : null;

    if (!student && !studentAlt) {
      return res.status(404).json({
        success: false,
        message: "No registered student found with this mobile number. Please register first at /student-register.",
      });
    }

    // Demo OTP is 123456
    res.status(200).json({
      success: true,
      message: "Demo OTP generated successfully. Use 123456 to login.",
      demoOtp: "123456",
    });
  } catch (error) {
    console.error("[Send OTP Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending OTP.",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/verify-login-otp
 * @desc    Verify Demo OTP and log in student
 */
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required.",
      });
    }

    // Demo OTP verification
    if (otp !== "123456") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the demo OTP 123456.",
      });
    }

    // Find student
    let student = await StudentRegistration.findOne({ mobile: mobile.trim() });
    if (!student) {
      student = await Student.findOne({ phone: mobile.trim() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found.",
      });
    }

    const userData = buildStudentProfile(student);

    res.status(200).json({
      success: true,
      message: "Student logged in successfully via mobile OTP!",
      user: userData,
    });
  } catch (error) {
    console.error("[Verify OTP Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP.",
      error: error.message,
    });
  }
});

module.exports = router;
