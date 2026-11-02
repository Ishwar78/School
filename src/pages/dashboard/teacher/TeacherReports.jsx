import React from "react";

import { Empty, ReportForm } from "../shared/UI";

export default function TeacherReports({ view }) {
  const {
    s,
    teacher,
    assigned,
    ids,
    students,
    assignments,
    subs,
    classStudents,
    classId,
    setClassId,
    date,
    setDate,
    form,
    setForm,
    marks,
    setMarks,
    period,
    setPeriod,
    setField,
    name,
    ownPeriods,
  } = view;

  if (!view.can("viewReports")) {
    return <Empty>Your account does not have permission to view reports.</Empty>;
  }

  return <ReportForm data={s.reports} role="Teacher" user={teacher} />;
}
