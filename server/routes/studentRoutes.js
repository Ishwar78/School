const express = require("express");
const Student = require("../models/Student.js");

const router = express.Router();

/**
 * @route   GET /api/students
 * @desc    Get all students with optional search and filters
 * @access  Public / Admin
 */
router.get("/", async (req, res) => {
  try {
    const { classId, status, search } = req.query;
    const filter = {};

    if (classId) {
      filter.classId = classId;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { admission: searchRegex },
        { roll: searchRegex },
        { phone: searchRegex },
        { fatherName: searchRegex },
      ];
    }

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("[Get Students Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching students.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get single student by ID
 * @access  Public / Admin
 */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("[Get Student Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student.",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/students
 * @desc    Add a new student
 * @access  Public / Admin
 */
router.post("/", async (req, res) => {
  try {
    const {
      admission,
      name,
      email,
      classId,
      section,
      roll,
      dob,
      gender,
      admissionDate,
      session,
      phone,
      emergency,
      aadhaar,
      address,
      fatherName,
      motherName,
      fatherMobile,
      motherMobile,
      password,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name is required.",
      });
    }

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Please select student class.",
      });
    }

    if (!section) {
      return res.status(400).json({
        success: false,
        message: "Please select student section.",
      });
    }

    const student = new Student({
      admission: admission?.trim() || "",
      name: name.trim(),
      email: email?.trim().toLowerCase() || "",
      classId: classId.trim(),
      section: section.trim(),
      roll: roll?.trim() || "",
      dob: dob || "",
      gender: gender || "Male",
      admissionDate: admissionDate || "",
      session: session || "2026-2027",
      phone: phone?.trim() || "",
      emergency: emergency?.trim() || "",
      aadhaar: aadhaar?.trim() || "",
      address: address?.trim() || "",
      fatherName: fatherName?.trim() || "",
      motherName: motherName?.trim() || "",
      fatherMobile: fatherMobile?.trim() || "",
      motherMobile: motherMobile?.trim() || "",
      password: password || "",
      status: status || "Active",
    });

    const savedStudent = await student.save();
    const result = savedStudent.toJSON();
    delete result.password;

    res.status(201).json({
      success: true,
      message: "Student record added successfully to database.",
      data: result,
    });
  } catch (error) {
    console.error("[Add Student Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving student to database.",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/students/:id
 * @desc    Update student details
 * @access  Public / Admin
 */
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const fields = [
      "admission",
      "name",
      "email",
      "classId",
      "section",
      "roll",
      "dob",
      "gender",
      "admissionDate",
      "session",
      "phone",
      "emergency",
      "aadhaar",
      "address",
      "fatherName",
      "motherName",
      "fatherMobile",
      "motherMobile",
      "status",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    // If new password provided, update it
    if (req.body.password) {
      student.password = req.body.password;
    }

    const updatedStudent = await student.save();
    const result = updatedStudent.toJSON();
    delete result.password;

    res.status(200).json({
      success: true,
      message: "Student record updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("[Update Student Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating student.",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student record
 * @access  Public / Admin
 */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student record deleted successfully from database.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("[Delete Student Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student.",
      error: error.message,
    });
  }
});

module.exports = router;

