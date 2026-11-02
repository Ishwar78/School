import React from "react";

import { Panel, Stats, Table, NoticeList, ReportForm } from "../shared/UI";
import {
  today,
  attendanceRate,
  feeStatus,
  relevantNotices,
} from "../shared/school";
import DashboardFilters, {
  useDashboardFilters,
} from "../shared/DashboardFilters";
import { ANNOUNCEMENT_PRIORITY_OPTIONS } from "../shared/schoolOptions";

export default function StudentAnnouncements({ view }) {
  const {
    s,
    student,
    teacher,
    a,
    attendance,
    results,
    fees,
    periods,
    submission,
    answers,
    setAnswers,
  } = view;
  const notices = relevantNotices(s.notices.items, "Student");
  const noticeFilters = [
    { key: "priority", label: "Priority", options: ANNOUNCEMENT_PRIORITY_OPTIONS },
    { key: "audience", label: "Audience", includeDynamic: true },
    {
      key: "year",
      label: "Year",
      includeDynamic: true,
      value: (notice) => notice.date?.slice(0, 4),
    },
  ];
  const noticeState = useDashboardFilters(
    notices,
    noticeFilters,
    ["title", "description", "date", "priority", "audience"],
  );

  return (
    <>
      <Panel title="Announcements">
        <DashboardFilters
          state={noticeState}
          filters={noticeFilters}
          items={notices}
          showNoMatches={false}
        />
        <NoticeList
          items={noticeState.filteredItems}
          emptyMessage={
            notices.length
              ? "No announcements match these filters."
              : "No announcements have been posted yet."
          }
        />
      </Panel>
    </>
  );
}
