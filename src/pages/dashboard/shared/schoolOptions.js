export const SECTION_OPTIONS = ["A", "B", "C", "D"];

export const CLASS_OPTIONS = Array.from({ length: 7 }, (_, index) =>
  String(index + 6),
).flatMap((grade) => SECTION_OPTIONS.map((section) => `${grade}-${section}`));

export const CLASS_GRADE_OPTIONS = Array.from({ length: 7 }, (_, index) =>
  String(index + 6),
);

export const DEPARTMENT_OPTIONS = [
  "Languages",
  "Mathematics",
  "Science",
  "Social Studies",
  "Commerce",
  "Arts",
  "Physical Education",
];

export const SUBJECT_OPTIONS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Studies",
  "History",
  "Geography",
  "Commerce",
  "Computer Science",
  "Environmental Science",
  "Art",
  "Physical Education",
];

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const SCHOOL_STATUS_OPTIONS = ["Active", "Inactive"];

export const ATTENDANCE_STATUS_OPTIONS = ["Present", "Absent", "Leave"];

export const ATTENDANCE_FILTER_OPTIONS = [
  ...ATTENDANCE_STATUS_OPTIONS,
  "Not marked",
];

export const FEE_TYPE_OPTIONS = [
  "Tuition",
  "Transport",
  "Examination",
  "Other",
];

export const FEE_STATUS_OPTIONS = ["Paid", "Pending", "Partial", "Overdue"];

export const REPORT_ROLE_OPTIONS = ["Student", "Teacher", "Parent", "Admin"];

export const REPORT_CATEGORY_OPTIONS = [
  "Academic",
  "Attendance",
  "Technical",
  "Facilities",
  "General",
  "Other",
];

export const REPORT_STATUS_OPTIONS = ["Pending", "Under Review", "Resolved"];

export const ANNOUNCEMENT_AUDIENCE_OPTIONS = [
  "Everyone",
  "Admin",
  "Students",
  "Teachers",
  "Parents",
];

export const ANNOUNCEMENT_PRIORITY_OPTIONS = ["Normal", "Important", "Urgent"];

export const RELATIONSHIP_OPTIONS = ["Mother", "Father", "Guardian"];

export const ASSIGNMENT_DEADLINE_OPTIONS = ["Active", "Expired"];

export const SUBMISSION_STATUS_OPTIONS = [
  "Pending",
  "Submitted",
  "Checked",
  "Resubmit",
];

export const ACADEMIC_SESSION_OPTIONS = ["2026-27"];

export const DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
