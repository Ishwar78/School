import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Tag,
  AlertCircle,
  FileText,
  UserCheck
} from "lucide-react";
import "./SchoolNotices.css";

const NOTICES_DATA = [
  {
    id: 1,
    title: "Annual Sports Day 2026 Registration Open",
    category: "Sports & Events",
    date: "03 Nov 2026",
    priority: "Event",
    description: "The Annual Athletics Meet & Sports Day will be held on 22nd December 2026. Interested students can register for track events, relay races, and long jump with their respective house captains by 15th November.",
    signedBy: "Director of Physical Education"
  },
  {
    id: 2,
    title: "Half-Yearly Examination Schedule & Admit Card Release",
    category: "Examinations",
    date: "01 Nov 2026",
    priority: "Urgent",
    description: "Half-Yearly Examinations for Classes 6th to 12th will commence from 18th November 2026. Admit Cards will be distributed by class teachers starting Monday. Clear all outstanding dues before collection.",
    signedBy: "Controller of Examinations"
  },
  {
    id: 3,
    title: "Science & Innovation Exhibition 2026",
    category: "Academics",
    date: "28 Oct 2026",
    priority: "Normal",
    description: "VEDA STEM & Science Innovation Fair is scheduled for 10th December. Students are invited to submit working models and research posters to their science department heads.",
    signedBy: "Principal's Office"
  },
  {
    id: 4,
    title: "Winter Uniform Guidelines & Mandatory Adoption Date",
    category: "General",
    date: "25 Oct 2026",
    priority: "Normal",
    description: "All students are requested to switch to the official VEDA Winter Uniform (Blazer, Grey Woolen Trousers/Skirt, and Navy Sweater) starting from 15th November 2026.",
    signedBy: "Student Affairs Administration"
  }
];

export default function SchoolNotices({ student = {} }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotices = NOTICES_DATA.filter((notice) => {
    if (selectedCategory === "All") return true;
    return notice.category === selectedCategory;
  });

  return (
    <div className="student-notices-page">
      {/* HEADER */}
      <div className="notices-header">
        <div className="notices-header-info">
          <span>CAMPUS ANNOUNCEMENTS</span>
          <h2>School Notices & Circulars</h2>
          <p>Official notices, circulars, event guidelines and academic alerts from school administration.</p>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontWeight: "600",
            color: "#082b55",
            fontSize: "14px",
            background: "#ffffff"
          }}
        >
          <option value="All">All Categories</option>
          <option value="Examinations">Examinations</option>
          <option value="Sports & Events">Sports & Events</option>
          <option value="Academics">Academics</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* NOTICES LIST */}
      <div className="notices-list">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`notice-card ${notice.priority.toLowerCase()}`}
          >
            <div className="notice-top-row">
              <span className="notice-category-badge">{notice.category}</span>
              <span className="notice-date">
                <Calendar size={14} /> {notice.date}
              </span>
            </div>

            <h3>{notice.title}</h3>
            <p>{notice.description}</p>

            <div className="notice-footer">
              <span>Authority: <strong>{notice.signedBy}</strong></span>
              <span style={{ color: "#082b55", fontWeight: "600" }}>VEDA International School</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
