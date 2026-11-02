import React from "react";
import {
  Bell,
  CalendarCheck2,
  ClipboardCheck,
  GraduationCap,
  TrendingUp
} from "lucide-react";

import RoleFeaturePage from "./RoleFeaturePage";

const content = {
  eyebrow: "Your school day, in sync",
  title: "A little more clarity for every school day.",
  highlight: "Made for students.",
  intro:
    "Keep your timetable, school updates and academic information in one easy-to-navigate place, so you can spend less time searching and more time learning.",
  image: "/features-students.jpeg",
  imageAlt: "Students learning together in a bright classroom",
  imageLabel: "Everything you need for what’s next",
  imageNote: "Schedules, learning and updates together",
  badge: "STUDENT SPACE",
  stat: "Your day",
  statLabel: "at a glance",
  accent: "student",
  icon: GraduationCap,
  features: [
    {
      icon: CalendarCheck2,
      title: "Know what’s next",
      description:
        "Check your weekly class timetable and get a clearer view of the lessons ahead.",
      image: "/feature-timetable.jfif",
      imageAlt: "Study materials arranged for a school timetable",
      tag: "YOUR SCHEDULE",
      points: ["Class and subject details", "A clear weekly overview"]
    },
    {
      icon: ClipboardCheck,
      title: "Stay on top of assignments",
      description:
        "Keep track of classroom tasks and academic information in a more organized space.",
      image: "/feature-academics.jfif",
      imageAlt: "Books and materials for school assignments",
      tag: "LEARNING TOOLS",
      points: ["Academic details in one place", "A helpful view of upcoming work"]
    },
    {
      icon: TrendingUp,
      title: "See your learning journey",
      description:
        "Follow assessment information and results with an interface designed to make progress easier to understand.",
      image: "/feature-academics.jfif",
      imageAlt: "Books representing a student's academic journey",
      tag: "YOUR PROGRESS",
      points: ["Assessment and exam details", "An at-a-glance academic overview"]
    },
    {
      icon: Bell,
      title: "Never miss an important update",
      description:
        "Find school notices, events and reminders in one familiar place.",
      image: "/feature-announcements.jfif",
      imageAlt: "A welcoming classroom for school announcements",
      tag: "SCHOOL UPDATES",
      points: ["Important school notices", "Updates you can return to"]
    }
  ],
  summary: [
    ["01", "Plan ahead", "Know your classes and what is coming up."],
    ["02", "Stay organized", "Find academic information when you need it."],
    ["03", "Keep learning", "Follow your progress and school updates."]
  ]
};

export default function StudentFeatures() {
  return <RoleFeaturePage content={content} />;
}
