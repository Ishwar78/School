import React from "react";
import {
  CalendarCheck2,
  Heart,
  MessageCircle,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

import RoleFeaturePage from "./RoleFeaturePage";

const content = {
  eyebrow: "Closer connection, more confidence",
  title: "Feel part of every step forward.",
  highlight: "Made for parents.",
  intro:
    "Stay connected to the school moments that matter. Find attendance, academic updates and school communication in a straightforward space designed for families.",
  image: "/home-community.jfif",
  imageAlt: "School community coming together to support students",
  imageLabel: "A closer connection to school",
  imageNote: "Useful updates for the people who care most",
  badge: "FAMILY CONNECTION",
  stat: "One place",
  statLabel: "to stay connected",
  accent: "parent",
  icon: Heart,
  features: [
    {
      icon: CalendarCheck2,
      title: "Keep an eye on attendance",
      description:
        "View attendance information and get a clearer sense of your child’s school routine.",
      image: "/feature-attendance.jfif",
      imageAlt: "Teacher and students in a welcoming classroom",
      tag: "EVERYDAY CONFIDENCE",
      points: ["Attendance information at a glance", "A clear view of daily records"]
    },
    {
      icon: TrendingUp,
      title: "Follow academic progress",
      description:
        "Find assessment and academic updates together to better understand learning over time.",
      image: "/feature-academics.jfif",
      imageAlt: "Learning materials representing academic progress",
      tag: "LEARNING JOURNEY",
      points: ["Academic and exam information", "Progress that is easier to follow"]
    },
    {
      icon: MessageCircle,
      title: "Stay close to the conversation",
      description:
        "Keep school announcements and teacher communication easier to find and revisit.",
      image: "/feature-announcements.jfif",
      imageAlt: "Bright classroom representing school communication",
      tag: "SCHOOL & FAMILY",
      points: ["Important school announcements", "A more connected experience"]
    },
    {
      icon: ShieldCheck,
      title: "Find the practical details",
      description:
        "Access useful school information, including schedules and fee updates, in a more organized view.",
      image: "/feature-fees.jfif",
      imageAlt: "School administration documents and a laptop",
      tag: "CLEAR INFORMATION",
      points: ["Timetable and school details", "Organized fee information"]
    }
  ],
  summary: [
    ["01", "Stay informed", "Find school updates without the extra searching."],
    ["02", "See the whole picture", "Follow attendance and academic information."],
    ["03", "Feel connected", "Keep family and school closer together."]
  ]
};

export default function ParentFeatures() {
  return <RoleFeaturePage content={content} />;
}
