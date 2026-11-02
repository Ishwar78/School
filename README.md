# EduFlow

EduFlow is a React + Vite school website with student, teacher, parent, and admin dashboards.

## Run

1. Install Node.js.
2. Run `npm install` in this folder.
3. Run `npm run dev`.

Use the existing Login page to sign in with a demo account listed in `src/data/demoUsers.js`. Dashboard routes check the signed-in role and redirect users who request another role's dashboard to their own. Admin can add school records and create separate demo login accounts in the Login Accounts section; each account is linked to a selected record ID.

### Built-in demo accounts

The original accounts remain available:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@eduflow.com` | `student123` |
| Parent | `parent@eduflow.com` | `parent123` |
| Teacher | `teacher@eduflow.com` | `teacher123` |
| Admin | `admin@eduflow.com` | `admin123` |

The other seeded teachers, students, and parents also have linked demo logins. Their emails are on their matching records in `src/data/demoSchoolRecords.js`; use the same role-specific demo password shown above. Seeded schedules, classes, assignments, submissions, attendance, results, fees, announcements, and reports use stable IDs to connect records across dashboards. Seed data is merged into existing browser records without replacing saved records with matching IDs.

The seeded timetable has Monday-to-Saturday lessons. Sunday is presented as a holiday. Admins can create, edit, and delete shared timetable periods; overlapping periods for the same teacher or class are rejected. A teacher's personal timetable is available from My Classes and only shows periods assigned to that teacher.

Dashboard data and additional demo credentials are stored in this browser's localStorage. The built-in student, teacher and parent demo records are added only when a matching record ID or email is missing; existing records are preserved. This is a frontend demo, not server-backed authentication or authorization. Do not use it with real school data. The contact form does not send information to a server.

Homework assignment and submission metadata stays in the existing shared dashboard contexts and localStorage keys. Attachment bytes are stored separately in this browser's IndexedDB database (`eduflow-local-files`), not in localStorage. The frontend accepts up to five files per assignment or submission, with a 10 MB limit per file (PDF, DOC/DOCX, PPT/PPTX, JPG/JPEG, PNG, and TXT). Files are available only in the same browser profile and origin; they are not uploaded or synchronised across users, browsers, or devices. Clearing this site's browser data removes the local files, and the dashboard reports when a referenced file is unavailable. A production deployment needs authenticated backend upload/download endpoints and server-side assignment and student access checks before files can be shared securely.

The dashboard source snapshot remains in `src/pages/dashboard-source/`; the integrated application runs from the main `src/` tree.
