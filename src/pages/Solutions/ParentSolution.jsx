import React from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck2,
  GraduationCap,
  Heart,
  MessageCircle,
  Wallet
} from "lucide-react";

import SolutionPage from "./SolutionPage";

const solution = {
  role: "parent",
  roleLabel: "PARENT DASHBOARD",
  icon: Heart,
  eyebrow: "A more connected school-family experience",
  title: "Stay close to",
  highlight: "your child’s progress.",
  intro:
    "The parent dashboard gives families a clear view of a linked student’s school information. Check attendance, assignments and results, review fee details and keep up with school announcements.",
  image: "/home-community.jfif",
  imageAlt: "School community working together to support students",
  previewTitle: "Parent overview",
  previewSubtitle: "Your child’s school activity",
  previewItems: [
    { icon: CalendarCheck2, value: "Attendance", label: "School-day records" },
    { icon: GraduationCap, value: "Results", label: "Academic progress" },
    { icon: Wallet, value: "Fees", label: "Payment details" },
    { icon: Bell, value: "Notices", label: "School announcements" }
  ],
  headingEnd: "stay connected.",
  detailsIntro:
    "See the school details that matter to your family through a dashboard linked to your child’s records.",
  features: [
    {
      icon: CalendarCheck2,
      title: "Review attendance",
      description:
        "Check your child’s attendance records and follow their school-day activity.",
      points: ["Attendance history", "Clear present and absent records"]
    },
    {
      icon: GraduationCap,
      title: "Follow academic results",
      description:
        "Find recorded exam results and subject information to stay informed about learning.",
      points: ["Exam and subject results", "Academic information in one view"]
    },
    {
      icon: BookOpen,
      title: "See assignments and schedule",
      description:
        "Review the classwork and timetable details associated with your child’s class.",
      points: ["Homework and due dates", "Class timetable information"]
    },
    {
      icon: Wallet,
      title: "Check fee details",
      description:
        "View fee records and payment information associated with your linked student.",
      points: ["Fee records", "Paid and outstanding amounts"]
    },
    {
      icon: Bell,
      title: "Read school announcements",
      description:
        "Keep school notices and updates easy to find in your parent workspace.",
      points: ["School-wide announcements", "Updates relevant to your family"]
    },
    {
      icon: MessageCircle,
      title: "Keep school information together",
      description:
        "Move between attendance, learning and practical school details without losing the overall picture.",
      points: ["A linked student overview", "Key school details in one dashboard"]
    }
  ],
  ctaTitle: "Feel informed about the school journey.",
  ctaDescription:
    "EduFlow brings your child’s school records and important updates together in one family-focused view."
};

export default function ParentSolution() {
  return <SolutionPage solution={solution} />;
}
