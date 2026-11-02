import React from "react";

import { StudentProvider } from "./StudentContext";
import { TeacherProvider } from "./TeacherContext";
import { ParentProvider } from "./ParentContext";
import { ClassProvider } from "./ClassContext";
import { AttendanceProvider } from "./AttendanceContext";
import { AssignmentProvider } from "./AssignmentContext";
import { FeeProvider } from "./FeeContext";
import { ReportProvider } from "./ReportContext";
import { AnnouncementProvider } from "./AnnouncementContext";
import { SubmissionProvider } from "./SubmissionContext";
import { ResultProvider } from "./ResultContext";
import { TimetableProvider } from "./TimetableContext";

export default function SchoolProvider({ children }) {
  return (
    <SubmissionProvider>
      <ResultProvider>
        <TimetableProvider>
          <StudentProvider>
            <TeacherProvider>
              <ParentProvider>
                <ClassProvider>
                  <AttendanceProvider>
                    <AssignmentProvider>
                      <FeeProvider>
                        <ReportProvider>
                          <AnnouncementProvider>
                            {children}
                          </AnnouncementProvider>
                        </ReportProvider>
                      </FeeProvider>
                    </AssignmentProvider>
                  </AttendanceProvider>
                </ClassProvider>
              </ParentProvider>
            </TeacherProvider>
          </StudentProvider>
        </TimetableProvider>
      </ResultProvider>
    </SubmissionProvider>
  );
}
