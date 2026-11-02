import React, { useState } from "react";

import { Panel } from "./UI";
import "./Role.css";

export default function AttendanceCalendar({ records = [] }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [year, m] = month.split("-").map(Number);

  const count = new Date(year, m, 0).getDate();

  const offset = new Date(year, m - 1, 1).getDay();

  const byDay = new Map(records.map((r) => [r.date, r.status]));

  return (
    <Panel
      title="Monthly attendance calendar"
      subtitle="Present, absent and leave days"
    >
      <label className="role-month-label">
        Choose month{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>
      <div className="role-calendar">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <b key={d}>{d}</b>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={"pad" + i} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const status = byDay.get(date);

          return (
            <div
              key={date}
              title={`${date}: ${status || "Not marked"}`}
              className={`role-calendar-day ${status ? "is-" + status.toLowerCase() : ""}`}
            >
              <strong>{i + 1}</strong>
              <small>{status || "—"}</small>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
