import {
  ACADEMIC_SESSION_OPTIONS,
  CLASS_OPTIONS,
  DEPARTMENT_OPTIONS,
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SCHOOL_STATUS_OPTIONS,
  SUBJECT_OPTIONS,
} from "../shared/schoolOptions";

export const statusOptions = SCHOOL_STATUS_OPTIONS;

export const classOptions = CLASS_OPTIONS;

export const studentFields = [
  { key: "admission", label: "Admission No.", required: true },
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Login Email", type: "email" },
  {
    key: "classId",
    label: "Class",
    type: "select",
    options: classOptions,
    required: true,
  },
  { key: "roll", label: "Roll Number", required: true },
  { key: "dob", label: "Date of Birth", type: "date", table: false },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: GENDER_OPTIONS,
    table: false,
  },
  { key: "admissionDate", label: "Admission Date", type: "date", table: false },
  {
    key: "session",
    label: "Academic Session",
    type: "select",
    options: ACADEMIC_SESSION_OPTIONS,
    includeDynamic: true,
    default: ACADEMIC_SESSION_OPTIONS[0],
    table: false,
  },
  {
    key: "parentId",
    label: "Linked Parent",
    type: "select",
    options: [],
    table: false,
  },
  { key: "phone", label: "Contact", type: "tel" },
  { key: "emergency", label: "Emergency Contact", type: "tel", table: false },
  { key: "address", label: "Address", type: "textarea", table: false },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    default: "Active",
  },
];

export const teacherFields = [
  { key: "employee", label: "Teacher ID", required: true },
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  {
    key: "department",
    label: "Department",
    type: "select",
    options: DEPARTMENT_OPTIONS,
    includeDynamic: true,
  },
  {
    key: "subject",
    label: "Subjects",
    type: "select",
    options: SUBJECT_OPTIONS,
    includeDynamic: true,
    optionValues: (teacher) =>
      String(teacher.subject || "")
        .split(",")
        .map((subject) => subject.trim())
        .filter(Boolean),
  },
  {
    key: "classes",
    label: "Assigned Classes",
    type: "multiselect",
    options: CLASS_OPTIONS,
    default: [],
    includeDynamic: true,
    optionValues: (teacher) =>
      Array.isArray(teacher.classes)
        ? teacher.classes
        : String(teacher.classes || "")
            .split(",")
            .map((classId) => classId.trim())
            .filter(Boolean),
    table: false,
    display: (classes) =>
      Array.isArray(classes)
        ? classes.join(", ")
        : String(classes || "").trim() || "—",
  },
  { key: "qualification", label: "Qualification", table: false },
  { key: "joining", label: "Joining Date", type: "date", table: false },
  { key: "dob", label: "Date of Birth", type: "date", table: false },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: GENDER_OPTIONS,
    table: false,
  },
  { key: "address", label: "Address", type: "textarea", table: false },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    default: "Active",
  },
];

export const parentFields = [
  { key: "parentNo", label: "Parent ID", required: true },
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "alternate", label: "Alternate Phone", type: "tel", table: false },
  {
    key: "relationship",
    label: "Relationship",
    type: "select",
    options: RELATIONSHIP_OPTIONS,
  },
  { key: "occupation", label: "Occupation", table: false },
  { key: "address", label: "Address", type: "textarea", table: false },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    default: "Active",
  },
];
