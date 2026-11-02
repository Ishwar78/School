import React from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Wallet
} from "lucide-react";

import SolutionPage from "./SolutionPage";

const solution = {
  role: "student",
  roleLabel: "STUDENT DASHBOARD",
  icon: GraduationCap,
  eyebrow: "A clearer view of your school day",
  title: "Your learning,",
  highlight: "all in one place.",
  intro:
    "The student dashboard helps you find the practical details of school life. Check your timetable, follow assignments and results, and stay up to date with school announcements.",
  image: "/features-students.jpeg",
  imageAlt: "Students learning together in a bright classroom",
  previewTitle: "Student overview",
  previewSubtitle: "Your learning at a glance",
  previewItems: [
    { icon: CalendarDays, value: "Timetable", label: "Classes and subjects" },
    { icon: ClipboardCheck, value: "Assignments", label: "Classwork and due dates" },
    { icon: GraduationCap, value: "Exam results", label: "Academic records" },
    { icon: Bell, value: "Announcements", label: "School notices" }
  ],
  headingEnd: "learn.",
  detailsIntro:
    "Know what is happening today and find your school information in a dashboard centered on your learning.",
  features: [
    {
      icon: CalendarDays,
      title: "Check your timetable",
      description:
        "See your class schedule and the subjects that make up your school day.",
      points: ["Class and period information", "A readable weekly schedule"]
    },
    {
      icon: ClipboardCheck,
      title: "Keep track of assignments",
      description:
        "Review homework shared by your teachers and keep due dates and classwork visible.",
      points: ["Assignment descriptions", "Due dates and subject details"]
    },
    {
      icon: GraduationCap,
      title: "Follow exam results",
      description:
        "Find your recorded assessment results and academic information in one place.",
      points: ["Exam and subject results", "An overview of academic records"]
    },
    {
      icon: CalendarDays,
      title: "Review attendance",
      description:
        "See your attendance records and understand your school-day history.",
      points: ["Personal attendance records", "A clear view of recorded days"]
    },
    {
      icon: Bell,
      title: "Stay up to date",
      description:
        "Read school announcements and important notices without searching across different channels.",
      points: ["School notices in one place", "Updates relevant to students"]
    },
    {
      icon: Wallet,
      title: "Find fee information",
      description:
        "View fee details associated with your student account and keep practical school information close.",
      points: ["Your fee records", "Payment information at a glance"]
    }
  ],
  ctaTitle: "Know what’s next, and stay focused on learning.",
  ctaDescription:
    "EduFlow gives students an organized way to check their schedule, schoolwork and academic information."
};

export default function StudentSolution() {
  return <SolutionPage solution={solution} />;
}
