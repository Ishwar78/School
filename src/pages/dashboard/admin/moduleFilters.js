import {
  ACADEMIC_SESSION_OPTIONS,
  ANNOUNCEMENT_AUDIENCE_OPTIONS,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  ASSIGNMENT_DEADLINE_OPTIONS,
  ATTENDANCE_FILTER_OPTIONS,
  CLASS_GRADE_OPTIONS,
  CLASS_OPTIONS,
  DEPARTMENT_OPTIONS,
  FEE_STATUS_OPTIONS,
  FEE_TYPE_OPTIONS,
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  REPORT_CATEGORY_OPTIONS,
  REPORT_ROLE_OPTIONS,
  REPORT_STATUS_OPTIONS,
  SCHOOL_STATUS_OPTIONS,
  SECTION_OPTIONS,
  SUBJECT_OPTIONS,
} from "../shared/schoolOptions";

const select = (key, label, extra = {}) => ({ key, label, ...extra });
const dateRange = (key, label) => [
  select(`${key}From`, `${label} from`, {
    type: "date",
    compare: "min",
    value: (i) => i[key],
  }),
  select(`${key}To`, `${label} to`, {
    type: "date",
    compare: "max",
    value: (i) => i[key],
  }),
];
const numberRange = (key, label, value) => [
  select(`${key}Min`, `${label} minimum`, {
    type: "number",
    compare: "min",
    value,
  }),
  select(`${key}Max`, `${label} maximum`, {
    type: "number",
    compare: "max",
    value,
  }),
];

export const studentFilters = [
  select("classId", "Class", {
    options: CLASS_OPTIONS,
    includeDynamic: true,
  }),
  select("roll", "Roll number"),
  select("gender", "Gender", { options: GENDER_OPTIONS }),
  select("session", "Academic session", {
    options: ACADEMIC_SESSION_OPTIONS,
    includeDynamic: true,
  }),
  select("status", "Status", { options: SCHOOL_STATUS_OPTIONS }),
  select("parentId", "Parent link", {
    options: [
      { value: "linked", label: "Linked" },
      { value: "unlinked", label: "Unlinked" },
    ],
    value: (i) => (i.parentId ? "linked" : "unlinked"),
  }),
  ...dateRange("admissionDate", "Admission date"),
  ...dateRange("dob", "Date of birth"),
];

export const teacherFilters = [
  select("department", "Department", {
    options: DEPARTMENT_OPTIONS,
    includeDynamic: true,
  }),
  select("subject", "Subject", {
    options: SUBJECT_OPTIONS,
    match: "contains",
    value: (item) => item.subjects || item.subject,
    includeDynamic: true,
    optionValues: (item) =>
      Array.isArray(item.subjects)
        ? item.subjects
        : String(item.subject || "")
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean),
  }),
  select("classes", "Assigned class", {
    match: "contains",
    options: CLASS_OPTIONS,
    optionValues: (item) =>
      Array.isArray(item.classes)
        ? item.classes
        : String(item.classes || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
    includeDynamic: true,
  }),
  select("qualification", "Qualification", { includeDynamic: true }),
  select("gender", "Gender", { options: GENDER_OPTIONS }),
  select("status", "Status", {
    options: SCHOOL_STATUS_OPTIONS,
    value: (item) => item.status || "Active",
  }),
  ...dateRange("joining", "Joining date"),
];

export const parentFilters = [
  select("relationship", "Relationship", { options: RELATIONSHIP_OPTIONS }),
  select("occupation", "Occupation", { includeDynamic: true }),
  select("status", "Status", { options: SCHOOL_STATUS_OPTIONS }),
  select("linked", "Children linked", {
    value: (i) => (i.linkedCount > 0 ? "Yes" : "No"),
    options: ["Yes", "No"],
  }),
  ...numberRange(
    "linkedCount",
    "Number of children",
    (i) => i.linkedCount || 0,
  ),
];

export const classFilters = [
  select("grade", "Class", { options: CLASS_GRADE_OPTIONS }),
  select("section", "Section", { options: SECTION_OPTIONS }),
  select("teacherId", "Class teacher"),
  select("assigned", "Teacher assigned", {
    options: ["Yes", "No"],
    value: (i) => (i.teacherId ? "Yes" : "No"),
  }),
  ...numberRange("students", "Student count", (i) => i.studentCount || 0),
  ...numberRange("absent", "Absent count", (i) => i.absentCount || 0),
];

export const assignmentFilters = [
  select("classId", "Class", {
    options: CLASS_OPTIONS,
    includeDynamic: true,
  }),
  select("subject", "Subject", {
    options: SUBJECT_OPTIONS,
    includeDynamic: true,
  }),
  select("teacherId", "Teacher"),
  select("state", "Deadline status", {
    options: ASSIGNMENT_DEADLINE_OPTIONS,
    value: (i) =>
      i.due && i.due < new Date().toLocaleDateString("en-CA")
        ? "Expired"
        : "Active",
  }),
  ...dateRange("due", "Due date"),
];

export const feeFilters = [
  select("type", "Fee type", { options: FEE_TYPE_OPTIONS }),
  select("session", "Session", {
    options: ACADEMIC_SESSION_OPTIONS,
    includeDynamic: true,
  }),
  select("classId", "Class", {
    value: (i) => i.studentClass,
    options: CLASS_OPTIONS,
    includeDynamic: true,
  }),
  select("status", "Payment status", {
    options: FEE_STATUS_OPTIONS,
    value: (i) => i.paymentStatus,
  }),
  ...dateRange("due", "Due date"),
  ...numberRange("balance", "Balance (₹)", (i) =>
    Math.max(0, Number(i.total) - Number(i.paid)),
  ),
];

export const reportFilters = [
  select("role", "Submitted by role", { options: REPORT_ROLE_OPTIONS }),
  select("category", "Category", {
    options: REPORT_CATEGORY_OPTIONS,
    includeDynamic: true,
  }),
  select("status", "Status", { options: REPORT_STATUS_OPTIONS }),
  ...dateRange("date", "Submission date"),
];

export const announcementFilters = [
  select("audience", "Audience", {
    options: ANNOUNCEMENT_AUDIENCE_OPTIONS,
    includeDynamic: true,
  }),
  select("priority", "Priority", {
    options: ANNOUNCEMENT_PRIORITY_OPTIONS,
    includeDynamic: true,
  }),
  ...dateRange("date", "Publication date"),
];
