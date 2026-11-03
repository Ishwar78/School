import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
  GraduationCap,
  Download,
  Coffee
} from "lucide-react";
import "./ClassTimetable.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const SCHEDULE_DATA = {
  Monday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "Physics", teacher: "Mrs. Sunita Verma", room: "Physics Lab", code: "PHY-10" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "English Literature", teacher: "Ms. Neha Gupta", room: "Room 102", code: "ENG-10" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Social Science", teacher: "Mr. Amit Yadav", room: "Room 102", code: "SST-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "Hindi", teacher: "Mrs. Meenakshi Singh", room: "Room 102", code: "HIN-10" },
    { period: "Period 6", time: "12:45 PM - 01:30 PM", subject: "Computer Science", teacher: "Mr. Deepak Kumar", room: "Computer Lab 1", code: "CS-10" },
  ],
  Tuesday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Chemistry", teacher: "Mrs. Sunita Verma", room: "Chemistry Lab", code: "CHEM-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "Hindi", teacher: "Mrs. Meenakshi Singh", room: "Room 102", code: "HIN-10" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Biology", teacher: "Dr. Anjali Rao", room: "Biology Lab", code: "BIO-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "English Grammar", teacher: "Ms. Neha Gupta", room: "Room 102", code: "ENG-10" },
    { period: "Period 6", time: "12:45 PM - 01:30 PM", subject: "Physical Education", teacher: "Coach Vikram", room: "Sports Ground", code: "PE-10" },
  ],
  Wednesday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "Social Science", teacher: "Mr. Amit Yadav", room: "Room 102", code: "SST-10" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "Physics", teacher: "Mrs. Sunita Verma", room: "Room 102", code: "PHY-10" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Computer Science", teacher: "Mr. Deepak Kumar", room: "Computer Lab 1", code: "CS-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "English Literature", teacher: "Ms. Neha Gupta", room: "Room 102", code: "ENG-10" },
    { period: "Period 6", time: "12:45 PM - 01:30 PM", subject: "Library & Reading", teacher: "Mrs. Kavita", room: "Central Library", code: "LIB-10" },
  ],
  Thursday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Chemistry", teacher: "Mrs. Sunita Verma", room: "Chemistry Lab", code: "CHEM-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "Social Science", teacher: "Mr. Amit Yadav", room: "Room 102", code: "SST-10" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Hindi", teacher: "Mrs. Meenakshi Singh", room: "Room 102", code: "HIN-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "Biology", teacher: "Dr. Anjali Rao", room: "Biology Lab", code: "BIO-10" },
    { period: "Period 6", time: "12:45 PM - 01:30 PM", subject: "Art & Craft", teacher: "Mr. Rakesh", room: "Art Studio", code: "ART-10" },
  ],
  Friday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "English Literature", teacher: "Ms. Neha Gupta", room: "Room 102", code: "ENG-10" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "Physics", teacher: "Mrs. Sunita Verma", room: "Physics Lab", code: "PHY-10" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Social Science", teacher: "Mr. Amit Yadav", room: "Room 102", code: "SST-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "Computer Science", teacher: "Mr. Deepak Kumar", room: "Computer Lab 1", code: "CS-10" },
    { period: "Period 6", time: "12:45 PM - 01:30 PM", subject: "Moral Science & GK", teacher: "Mrs. Meenakshi Singh", room: "Room 102", code: "GK-10" },
  ],
  Saturday: [
    { period: "Period 1", time: "08:30 AM - 09:15 AM", subject: "Mathematics Revision", teacher: "Mr. Rajesh Sharma", room: "Room 102", code: "MATH-10" },
    { period: "Period 2", time: "09:15 AM - 10:00 AM", subject: "Science Practical", teacher: "Mrs. Sunita Verma", room: "Science Lab", code: "SCI-LAB" },
    { period: "Period 3", time: "10:00 AM - 10:45 AM", subject: "English Debate & Speech", teacher: "Ms. Neha Gupta", room: "Auditorium", code: "ENG-ACT" },
    { isRecess: true, period: "Recess", time: "10:45 AM - 11:15 AM", subject: "Lunch & Refreshment Break", teacher: "", room: "Cafeteria" },
    { period: "Period 4", time: "11:15 AM - 12:00 PM", subject: "Co-Curricular Activities", teacher: "Multiple Mentors", room: "Activity Hall", code: "CCA-10" },
    { period: "Period 5", time: "12:00 PM - 12:45 PM", subject: "Club Meetings & Sports", teacher: "Coach Vikram", room: "Grounds", code: "CLUB-10" },
  ]
};

export default function ClassTimetable({ student = {} }) {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const studentClass = student.classId || student.class || "10th";
  const studentSection = student.section || "A";

  const schedule = SCHEDULE_DATA[selectedDay] || [];

  return (
    <div className="student-timetable-page">
      {/* HEADER */}
      <div className="timetable-header">
        <div className="timetable-header-info">
          <span>ACADEMIC SCHEDULE 2026-2027</span>
          <h2>Class Timetable</h2>
          <p>Daily period breakdown, subjects, faculties and classroom assignments.</p>
        </div>

        <div className="timetable-meta-badges">
          <div className="timetable-badge">
            <GraduationCap size={16} />
            Class {studentClass} - {studentSection}
          </div>
          <div className="timetable-badge">
            <Clock size={16} />
            08:30 AM - 01:30 PM
          </div>
        </div>
      </div>

      {/* DAYS NAVIGATION */}
      <div className="timetable-days-nav">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            className={`timetable-day-btn ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* SCHEDULE CARD */}
      <div className="timetable-schedule-card">
        <div className="timetable-day-title">
          <h3>{selectedDay}'s Schedule</h3>
          <span>{schedule.length} Periods Scheduled</span>
        </div>

        <div className="timetable-periods-list">
          {schedule.map((item, idx) => {
            if (item.isRecess) {
              return (
                <div key={idx} className="timetable-period-row recess">
                  <div className="period-time">
                    <strong>{item.period}</strong>
                    <small>{item.time}</small>
                  </div>
                  <div className="period-subject" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Coffee size={18} color="#b45309" />
                    <h4 style={{ color: "#b45309", margin: 0 }}>{item.subject}</h4>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="timetable-period-row">
                <div className="period-time">
                  <strong>{item.period}</strong>
                  <small>{item.time}</small>
                </div>

                <div className="period-subject">
                  <h4>{item.subject}</h4>
                  <p>{item.code}</p>
                </div>

                <div className="period-teacher">
                  {item.teacher}
                </div>

                <div className="period-room">
                  {item.room}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
