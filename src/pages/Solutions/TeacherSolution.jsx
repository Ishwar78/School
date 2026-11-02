import React from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  TrendingUp,
  Users
} from "lucide-react";

import SolutionPage from "./SolutionPage";

const solution = {
  role: "teacher",
  roleLabel: "TEACHER DASHBOARD",
  icon: BookOpen,
  eyebrow: "A focused workspace for teaching",
  title: "Your classes,",
  highlight: "in good order.",
  intro:
    "The teacher dashboard brings class routines and academic tools together. Check your teaching day, take attendance, manage classwork and keep track of student learning from one workspace.",
  image: "/feature-attendance.jfif",
  imageAlt: "Teacher and students working together in a classroom",
  previewTitle: "Teacher overview",
  previewSubtitle: "Classes and daily activity",
  previewItems: [
    { icon: Users, value: "My classes", label: "Class lists and students" },
    { icon: CalendarCheck2, value: "Attendance", label: "Class records" },
    { icon: ClipboardList, value: "Classwork", label: "Assignments and results" },
    { icon: Bell, value: "Notices", label: "School announcements" }
  ],
  headingEnd: "teach.",
  detailsIntro:
    "Move between the everyday tasks of managing a class and the academic information that helps you support students.",
  features: [
    {
      icon: CalendarCheck2,
      title: "Take class attendance",
      description:
        "Open attendance records for your class and review who is present, absent or recorded for the day.",
      points: ["Class-based attendance", "Attendance history at a glance"]
    },
    {
      icon: ClipboardList,
      title: "Manage classwork and results",
      description:
        "Create assignments, record assessment results and keep academic work connected to your classes.",
      points: ["Post homework and due dates", "Record exam marks and results"]
    },
    {
      icon: CalendarCheck2,
      title: "Follow your teaching schedule",
      description:
        "See timetable information for the classes and subjects you teach.",
      points: ["Class and subject details", "A clearer weekly routine"]
    },
    {
      icon: TrendingUp,
      title: "Keep student learning in view",
      description:
        "Review the academic records and class information that help you understand how students are progressing.",
      points: ["Student results and records", "A connected view of class activity"]
    },
    {
      icon: Bell,
      title: "Share important notices",
      description:
        "Find school announcements and keep your classroom connected to wider school updates.",
      points: ["Role-relevant announcements", "Key updates in one place"]
    },
    {
      icon: BookOpen,
      title: "Stay focused on teaching",
      description:
        "Bring the tools you use most into a dashboard organized around your classes and responsibilities.",
      points: ["Quick access to teaching tools", "A workspace for daily routines"]
    }
  ],
  ctaTitle: "Spend less time switching between tasks.",
  ctaDescription:
    "See how EduFlow brings class routines and student learning into one teacher-focused view."
};

export default function TeacherSolution() {
  return <SolutionPage solution={solution} />;
}
