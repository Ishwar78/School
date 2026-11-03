import React, { useState } from "react";
import {
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";
import "./HomeworkAssignments.css";

const ASSIGNMENTS_DATA = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Quadratic Equations — Practice Set 4.2",
    description: "Complete all questions from NCERT Textbook Exercise 4.2 and submit in class notebook.",
    assignedDate: "02 Nov 2026",
    dueDate: "06 Nov 2026",
    status: "Pending",
    teacher: "Mr. Rajesh Sharma",
    marks: "10 Marks"
  },
  {
    id: 2,
    subject: "Science",
    title: "Ray Diagrams for Concave & Convex Mirrors",
    description: "Draw neat and labeled ray diagrams for all 6 object positions of concave mirror with pencil on practical sheet.",
    assignedDate: "01 Nov 2026",
    dueDate: "05 Nov 2026",
    status: "Pending",
    teacher: "Mrs. Sunita Verma",
    marks: "15 Marks"
  },
  {
    id: 3,
    subject: "English",
    title: "Formal Letter Writing — Letter to the Editor",
    description: "Write a letter to the editor regarding irregular water supply in your locality (100-120 words).",
    assignedDate: "28 Oct 2026",
    dueDate: "02 Nov 2026",
    status: "Submitted",
    teacher: "Ms. Neha Gupta",
    marks: "5 Marks"
  },
  {
    id: 4,
    subject: "Social Science",
    title: "Map Work — Major National Parks & Dams in India",
    description: "Locate and label all major multipurpose river valley projects on an outline political map of India.",
    assignedDate: "25 Oct 2026",
    dueDate: "30 Oct 2026",
    status: "Graded",
    teacher: "Mr. Amit Yadav",
    marks: "9 / 10 Marks"
  },
  {
    id: 5,
    subject: "Computer Science",
    title: "HTML Project — Student Portfolio Webpage",
    description: "Create a simple multi-page HTML and CSS website introducing your school achievements and hobbies.",
    assignedDate: "20 Oct 2026",
    dueDate: "28 Oct 2026",
    status: "Graded",
    teacher: "Mr. Deepak Kumar",
    marks: "19 / 20 Marks"
  }
];

export default function HomeworkAssignments({ student = {} }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAssignments = ASSIGNMENTS_DATA.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="student-assignments-page">
      {/* HEADER */}
      <div className="assignments-header">
        <div className="assignments-header-info">
          <span>ACADEMIC TASKS</span>
          <h2>Homework & Assignments</h2>
          <p>Track your daily homework, submission deadlines and teacher assessments.</p>
        </div>

        <div className="assignment-filter-tabs">
          {["All", "Pending", "Submitted", "Graded"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`filter-tab-btn ${activeFilter === tab ? "active" : ""}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ASSIGNMENTS GRID */}
      <div className="assignments-grid">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div>
              <div className="assignment-card-top">
                <span className="subject-tag">{assignment.subject}</span>
                <span className={`assignment-status-tag ${assignment.status.toLowerCase()}`}>
                  {assignment.status}
                </span>
              </div>

              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
            </div>

            <div>
              <div className="assignment-meta-row">
                <span>Teacher: <strong>{assignment.teacher}</strong></span>
                <span>Weightage: <strong>{assignment.marks}</strong></span>
              </div>

              <div className="assignment-meta-row" style={{ borderTop: "none", paddingTop: "6px" }}>
                <span>Assigned: {assignment.assignedDate}</span>
                <span style={{ color: assignment.status === "Pending" ? "#dc2626" : "#64748b", fontWeight: "600" }}>
                  Due: {assignment.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
