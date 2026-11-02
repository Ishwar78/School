import React from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck2,
  TrendingUp
} from "lucide-react";

import RoleFeaturePage from "./RoleFeaturePage";

const content = {
  eyebrow: "A calmer classroom starts here",
  title: "More time for the moments that matter.",
  highlight: "Made for teachers.",
  intro:
    "Bring the rhythm of your teaching day into one clear space. From class lists to student progress, find the details you need without losing focus on the people in front of you.",
  image: "/feature-attendance.jfif",
  imageAlt: "Teacher supporting students during a classroom lesson",
  imageLabel: "A clearer view of every class",
  imageNote: "Your teaching day, thoughtfully organized",
  badge: "TEACHER WORKSPACE",
  stat: "One view",
  statLabel: "for your school day",
  accent: "teacher",
  icon: BookOpen,
  features: [
    {
      icon: CalendarCheck2,
      title: "Attendance, without the busywork",
      description:
        "Review class attendance in a structured view and keep daily records easy to follow.",
      image: "/feature-attendance.jfif",
      imageAlt: "Teacher taking attendance in class",
      tag: "DAILY ROUTINES",
      points: ["Class-wise student lists", "Quick present and absent overview"]
    },
    {
      icon: BookOpen,
      title: "Keep lessons on track",
      description:
        "See your timetable alongside the subjects and classes that shape your teaching week.",
      image: "/feature-timetable.jfif",
      imageAlt: "Books and learning materials ready for class",
      tag: "PLAN YOUR WEEK",
      points: ["A readable weekly schedule", "Subject and period details"]
    },
    {
      icon: TrendingUp,
      title: "Notice progress sooner",
      description:
        "Bring assessment and academic information together to build a clearer picture of student learning.",
      image: "/feature-academics.jfif",
      imageAlt: "Books and study materials for academic learning",
      tag: "STUDENT GROWTH",
      points: ["Organized assessment details", "A helpful progress overview"]
    },
    {
      icon: Bell,
      title: "Keep everyone in the loop",
      description:
        "Share important classroom and school updates in a familiar, central place.",
      image: "/feature-announcements.jfif",
      imageAlt: "Bright school environment for sharing updates",
      tag: "CLEAR COMMUNICATION",
      points: ["School announcements", "Important class reminders"]
    }
  ],
  summary: [
    ["01", "See the day", "Start with classes, schedules and attendance."],
    ["02", "Support learning", "Keep academic details close at hand."],
    ["03", "Share updates", "Make school communication easier to follow."]
  ]
};

export default function TeacherFeatures() {
  return <RoleFeaturePage content={content} />;
}
