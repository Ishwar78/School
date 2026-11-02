const teacherSeed = [
  {
    id: "demo-teacher-ananya",
    employee: "DEMO-TEA-001",
    name: "Ananya Gupta",
    email: "teacher@eduflow.com",
    department: "Science",
    subject: "Science",
    subjects: ["Science"],
    classes: ["10-A", "10-B"],
    role: "Class Teacher",
    classTeacherClasses: ["10-A"],
    status: "Active",
  },
  {
    id: "demo-teacher-rohan",
    employee: "DEMO-TEA-002",
    name: "Rohan Mehta",
    email: "rohan.mehta@eduflow.com",
    department: "Mathematics",
    subject: "Mathematics",
    subjects: ["Mathematics"],
    classes: ["9-A", "9-B"],
    role: "Senior Teacher",
    classTeacherClasses: [],
    status: "Active",
  },
  {
    id: "demo-teacher-meera",
    employee: "DEMO-TEA-003",
    name: "Meera Iyer",
    email: "meera.iyer@eduflow.com",
    department: "Languages",
    subject: "English",
    subjects: ["English"],
    classes: ["8-A", "8-B"],
    role: "Class Coordinator",
    classTeacherClasses: ["8-A"],
    status: "Active",
  },
  {
    id: "demo-teacher-kabir",
    employee: "DEMO-TEA-004",
    name: "Kabir Singh",
    email: "kabir.singh@eduflow.com",
    department: "Social Studies",
    subject: "Social Studies",
    subjects: ["Social Studies"],
    classes: ["7-A", "7-B"],
    role: "Head of Department (HOD)",
    classTeacherClasses: [],
    status: "Active",
  },
  {
    id: "demo-teacher-sana",
    employee: "DEMO-TEA-005",
    name: "Sana Khan",
    email: "sana.khan@eduflow.com",
    department: "Computer Science",
    subject: "Computer Science",
    subjects: ["Computer Science"],
    classes: ["6-A", "6-B"],
    role: "Class Teacher",
    classTeacherClasses: ["6-A"],
    status: "Active",
  },
];

const classSeed = [
  ["10", "A", 0],
  ["10", "B", 0],
  ["9", "A", 1],
  ["9", "B", 1],
  ["8", "A", 2],
  ["8", "B", 2],
  ["7", "A", 3],
  ["7", "B", 3],
  ["6", "A", 4],
  ["6", "B", 4],
].map(([grade, section, teacherIndex]) => ({
  id: `${grade}-${section}`,
  grade,
  section,
  teacherId: teacherSeed[teacherIndex].classTeacherClasses.includes(
    `${grade}-${section}`,
  )
    ? teacherSeed[teacherIndex].id
    : "",
}));

const parentSeed = [
  {
    id: "demo-parent-priya",
    parentNo: "DEMO-PAR-001",
    name: "Priya Sharma",
    email: "parent@eduflow.com",
    phone: "0000000000",
    relationship: "Mother",
    status: "Active",
  },
  ...[
    ["arjun", "Arjun Rao", "arjun.rao@eduflow.com"],
    ["fatima", "Fatima Ali", "fatima.ali@eduflow.com"],
    ["vikram", "Vikram Das", "vikram.das@eduflow.com"],
    ["lata", "Lata Menon", "lata.menon@eduflow.com"],
  ].map(([id, name, email], index) => ({
    id: `demo-parent-${id}`,
    parentNo: `DEMO-PAR-${String(index + 2).padStart(3, "0")}`,
    name,
    email,
    phone: `900000000${index + 1}`,
    relationship: index % 2 ? "Father" : "Guardian",
    status: "Active",
  })),
];

const studentNames = [
  ["Aarav Sharma", "student@eduflow.com"],
  ["Ishita Sharma", "ishita.sharma@eduflow.com"],
  ["Dev Sharma", "dev.sharma@eduflow.com"],
  ["Anaya Sharma", "anaya.sharma@eduflow.com"],
  ["Vivaan Rao", "vivaan.rao@eduflow.com"],
  ["Diya Rao", "diya.rao@eduflow.com"],
  ["Reyansh Rao", "reyansh.rao@eduflow.com"],
  ["Aadhya Rao", "aadhya.rao@eduflow.com"],
  ["Aditya Ali", "aditya.ali@eduflow.com"],
  ["Saanvi Ali", "saanvi.ali@eduflow.com"],
  ["Arnav Ali", "arnav.ali@eduflow.com"],
  ["Myra Ali", "myra.ali@eduflow.com"],
  ["Kabir Das", "kabir.das.student@eduflow.com"],
  ["Ira Das", "ira.das@eduflow.com"],
  ["Atharv Das", "atharv.das@eduflow.com"],
  ["Sara Das", "sara.das@eduflow.com"],
  ["Krish Menon", "krish.menon@eduflow.com"],
  ["Anvi Menon", "anvi.menon@eduflow.com"],
  ["Ayaan Menon", "ayaan.menon@eduflow.com"],
  ["Tara Menon", "tara.menon@eduflow.com"],
];

const studentSeed = studentNames.map(([name, email], index) => {
  const parent = parentSeed[Math.floor(index / 4)];
  const classRecord = classSeed[index % classSeed.length];

  return {
    id: index === 0 ? "demo-student-aarav" : `demo-student-${index + 1}`,
    admission: `DEMO-STU-${String(index + 1).padStart(3, "0")}`,
    name,
    email,
    classId: classRecord.id,
    roll: String((Math.floor(index / 10) % 2) + 1),
    parentId: parent.id,
    session: "2026-27",
    status: "Active",
  };
});

const weekdayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const periodTimes = {
  1: ["08:00", "08:45"],
  3: ["09:30", "10:15"],
};

const timetableSeed = weekdayNames.flatMap((day) =>
  teacherSeed.flatMap((teacher, teacherIndex) =>
    teacher.classes.map((classId, classIndex) => {
      const periodNumber = classIndex === 0 ? 1 : 3;
      const [start, end] = periodTimes[periodNumber];

      return {
        id: `demo-period-${day.toLowerCase()}-${teacherIndex + 1}-${classIndex + 1}`,
        day,
        period: periodNumber,
        start,
        end,
        classId,
        teacherId: teacher.id,
        subject: teacher.subject,
      };
    }),
  ),
);

const assignmentSeed = classSeed.map((classRecord, index) => {
  const teacher = teacherSeed[Math.floor(index / 2)];
  const dueDay = 24 + (index % 6);

  return {
    id: `demo-assignment-${classRecord.id.toLowerCase()}`,
    title: [
      "Ecosystems and Biodiversity",
      "Applied Mathematics Practice",
      "Reading and Writing Portfolio",
      "Communities and Local History",
      "Digital Skills Project",
      "Scientific Investigation",
      "Geometry in Everyday Life",
      "Stories and Summaries",
      "Maps and Our Environment",
      "Introduction to Algorithms",
    ][index],
    subject: teacher.subject,
    description: [
      "Describe how changes in an ecosystem affect biodiversity. Support your answer with one local example.",
      "Solve the practice problems and show the steps used for each answer.",
      "Read the assigned passage and write a short response using complete sentences.",
      "Explain one way local history has shaped the community where you live.",
      "Create a short, clear explanation of how to keep a digital account safe.",
    ][index % 5],
    submissionInstructions: "Submit a written answer or a supported file attachment.",
    classId: classRecord.id,
    section: classRecord.section,
    teacherId: teacher.id,
    created: "2026-10-19",
    due: `2026-10-${dueDay}`,
    maxMarks: 100,
    attachments: [],
  };
});

const submissionStatuses = [
  "Checked",
  "Submitted",
  "Resubmit",
  "Checked",
  "Submitted",
  "Submitted",
  "Checked",
  "Resubmit",
  "Submitted",
  "Checked",
];

const submissionSeed = assignmentSeed.map((assignment, index) => {
  const student = studentSeed[index * 2];
  const status = submissionStatuses[index];
  const content = [
    "Changes to habitat, food and climate can affect how many species survive. Protecting local habitats helps maintain biodiversity.",
    "I calculated the answer by writing each step and checking the result using the inverse operation.",
    "The passage shows that careful choices and cooperation help the characters solve their problem.",
    "The old railway helped local families travel and allowed nearby markets to grow.",
    "Use a unique password, enable two-step verification and never share a private code.",
  ][index % 5];
  const feedback =
    status === "Resubmit"
      ? "Please add one supporting example and explain your reasoning more clearly."
      : status === "Checked"
        ? "Good effort. Your answer is clear and supported with relevant details."
        : "";
  const marks = status === "Checked" ? 78 + (index % 5) * 4 : "";
  const date = `2026-10-${20 + (index % 3)}`;
  const attempt = {
    content,
    attachments: [],
    date,
    feedback,
    marks,
    status,
  };

  return {
    id: `demo-submission-${assignment.id}`,
    assignmentId: assignment.id,
    studentId: student.id,
    content,
    attachments: [],
    date,
    status,
    feedback,
    marks,
    attempts: [attempt],
    latestAttempt: 1,
    reviewedAt: status === "Checked" || status === "Resubmit" ? `${date}T11:00:00.000Z` : "",
    reviewedBy: status === "Checked" || status === "Resubmit" ? assignment.teacherId : "",
  };
});

const attendanceSeed = studentSeed.flatMap((student, studentIndex) =>
  ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16"].map(
    (date, dateIndex) => ({
      id: `demo-attendance-${student.id}-${date}`,
      role: "student",
      personId: student.id,
      classId: student.classId,
      date,
      status:
        (studentIndex + dateIndex) % 13 === 0
          ? "Absent"
          : (studentIndex + dateIndex) % 17 === 0
            ? "Leave"
            : "Present",
      recordedBy: "demo-admin",
    }),
  ),
);

const resultSeed = studentSeed.map((student, index) => {
  const classIndex = classSeed.findIndex(
    (classRecord) => classRecord.id === student.classId,
  );
  const teacher = teacherSeed[Math.floor(classIndex / 2)];

  return {
    id: `demo-result-${student.id}-term-1`,
    studentId: student.id,
    teacherId: teacher.id,
    exam: "Term 1 Assessment",
    subject: teacher.subject,
    marks: 72 + ((index * 7) % 26),
    total: 100,
    remarks: "Good progress. Continue practising the weekly learning goals.",
    session: "2026-27",
  };
});

const feeSeed = studentSeed.map((student, index) => {
  const amounts = [
    [18000, 18000, "2026-10-30"],
    [16000, 0, "2026-10-30"],
    [12000, 6000, "2026-10-30"],
    [14000, 4000, "2026-10-10"],
    [10000, 10000, "2026-10-30"],
  ];
  const [total, paid, due] = amounts[index % amounts.length];

  return {
    id: `demo-fee-${student.id}-tuition`,
    studentId: student.id,
    type: "Tuition",
    session: "2026-27",
    total,
    paid,
    due,
  };
});

const announcementSeed = [
  ["notice-everyone", "Welcome to the new term", "Everyone", "Normal", "The 2026-27 term is underway. Please check your dashboard for current school updates."],
  ["notice-students", "Science fair registration", "Students", "Important", "Students can register with their class teacher for the upcoming science fair."],
  ["notice-teachers", "Staff planning meeting", "Teachers", "Normal", "The weekly planning meeting is scheduled for Friday after classes."],
  ["notice-parents", "Parent-teacher meetings", "Parents", "Important", "Please review your child's progress and book a meeting with the class teacher if needed."],
  ["notice-admin", "School records review", "Admin", "Urgent", "Please review class rosters and update any outstanding school records."],
].map(([id, title, audience, priority, description], index) => ({
  id,
  title,
  audience,
  priority,
  description,
  date: `2026-10-${18 + index}`,
  author: "School Admin",
  authorId: "demo-admin",
  role: "Admin",
}));

const reportSeed = [
  {
    id: "demo-report-student-library",
    title: "Request for additional library reading time",
    author: "Aarav Sharma",
    submitterId: 1,
    role: "Student",
    category: "Facilities",
    description: "Could the library reading period be extended for students preparing book reports?",
    date: "2026-10-15",
    status: "Under Review",
    response: "",
  },
  {
    id: "demo-report-student-science",
    title: "Science fair materials",
    author: "Ishita Sharma",
    submitterId: "demo-login-student-demo-student-2",
    role: "Student",
    category: "Academic",
    description: "Our group would like guidance on borrowing safe science fair materials.",
    date: "2026-10-16",
    status: "Pending",
    response: "",
  },
  {
    id: "demo-report-teacher-lab",
    title: "Laboratory equipment check",
    author: "Ananya Gupta",
    submitterId: 3,
    role: "Teacher",
    category: "Facilities",
    description: "Please schedule a routine check of the classroom science equipment.",
    date: "2026-10-17",
    status: "Resolved",
    response: "The equipment check has been added to the maintenance schedule.",
  },
  {
    id: "demo-report-parent-transport",
    title: "Transport route update",
    author: "Priya Sharma",
    submitterId: 2,
    role: "Parent",
    category: "General",
    description: "Please share the latest pickup timing for the 10-A route.",
    date: "2026-10-18",
    status: "Under Review",
    response: "",
  },
  {
    id: "demo-report-teacher-timetable",
    title: "Classroom timetable notice",
    author: "Rohan Mehta",
    submitterId: "demo-login-teacher-demo-teacher-rohan",
    role: "Teacher",
    category: "Academic",
    description: "Please confirm that the revised classroom timetable is visible to families.",
    date: "2026-10-19",
    status: "Pending",
    response: "",
  },
];

export const demoSchoolRecords = {
  students: studentSeed,
  teachers: teacherSeed,
  parents: parentSeed,
  classes: classSeed,
  timetable: timetableSeed,
  attendance: attendanceSeed,
  assignments: assignmentSeed,
  submissions: submissionSeed,
  results: resultSeed,
  fees: feeSeed,
  announcements: announcementSeed,
  reports: reportSeed,
};

export const demoClassSubjects = teacherSeed.map((teacher) => ({
  teacherId: teacher.id,
  classIds: [...teacher.classes],
  subjects: [...teacher.subjects],
}));
