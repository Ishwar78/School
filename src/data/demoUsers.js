import { demoSchoolRecords } from "./demoSchoolRecords";

const additionalStudentUsers = demoSchoolRecords.students
  .filter((student) => student.id !== "demo-student-aarav")
  .map((student) => ({
    id: `demo-login-student-${student.id}`,
    name: student.name,
    email: student.email,
    password: "student123",
    role: "student",
    recordId: student.id,
    classId: student.classId,
  }));

const additionalParentUsers = demoSchoolRecords.parents
  .filter((parent) => parent.id !== "demo-parent-priya")
  .map((parent) => ({
    id: `demo-login-parent-${parent.id}`,
    name: parent.name,
    email: parent.email,
    password: "parent123",
    role: "parent",
    recordId: parent.id,
  }));

const additionalTeacherUsers = demoSchoolRecords.teachers
  .filter((teacher) => teacher.id !== "demo-teacher-ananya")
  .map((teacher) => ({
    id: `demo-login-teacher-${teacher.id}`,
    name: teacher.name,
    email: teacher.email,
    password: "teacher123",
    role: "teacher",
    recordId: teacher.id,
  }));

export const demoUsers = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "student@eduflow.com",
    password: "student123",
    role: "student",
    recordId: "demo-student-aarav",
    classId: "10-A",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "parent@eduflow.com",
    password: "parent123",
    role: "parent",
    recordId: "demo-parent-priya",
    childId: 1,
  },
  {
    id: 3,
    name: "Ananya Gupta",
    email: "teacher@eduflow.com",
    password: "teacher123",
    role: "teacher",
    recordId: "demo-teacher-ananya",
    classId: "10-A",
  },
  {
    id: 4,
    name: "School Admin",
    email: "admin@eduflow.com",
    password: "admin123",
    role: "admin",
  },
  ...additionalStudentUsers,
  ...additionalParentUsers,
  ...additionalTeacherUsers,
];
