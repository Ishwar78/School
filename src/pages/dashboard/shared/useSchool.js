import { useStudent } from "../../../context/StudentContext";
import { useTeacher } from "../../../context/TeacherContext";
import { useParent } from "../../../context/ParentContext";
import { useClass } from "../../../context/ClassContext";
import { useAttendance } from "../../../context/AttendanceContext";
import { useAssignment } from "../../../context/AssignmentContext";
import { useSubmission } from "../../../context/SubmissionContext";
import { useResult } from "../../../context/ResultContext";
import { useTimetable } from "../../../context/TimetableContext";
import { useFee } from "../../../context/FeeContext";
import { useReport } from "../../../context/ReportContext";
import { useAnnouncement } from "../../../context/AnnouncementContext";

export default function useSchool() {
  const school = {
    students: useStudent().data,
    teachers: useTeacher().data,
    parents: useParent().data,
    classes: useClass().data,
    attendance: useAttendance().data,
    assignments: useAssignment().data,
    submissions: useSubmission().data,
    results: useResult().data,
    timetable: useTimetable().data,
    fees: useFee().data,
    reports: useReport().data,
    notices: useAnnouncement().data,
  };

  return {
    ...school,
    storageErrors: Object.values(school)
      .map((data) => data.error)
      .filter(Boolean),
  };
}
