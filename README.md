# Healthcare Appointment & Follow-up Manager

A healthcare appointment management application with separate portals
for **Patients, Doctors, and Admins**.

The system is designed around doctor discovery, appointment booking,
symptom collection, AI-assisted pre-visit and post-visit summaries,
doctor leave management, notifications, and calendar integration.

> **Repository:**
> https://github.com/Namanshri/healthcare-appointment-manager

------------------------------------------------------------------------

## 1. Technology Stack

  Layer            Technology
  ---------------- -----------------------------------------------------
  Frontend         React.js
  Backend          Node.js + Express.js
  Database         SQLite
  AI               Anthropic Claude (optional)
  Email Service    Resend
  API Style        REST
  Authentication   Demo role-based authentication in the current build
  Calendar         Google Calendar integration architecture

### Current implementation note

The current project is a demo/prototype build. The frontend contains
mock data and mock AI behaviour, while the backend provides the
API/database structure. Resend is the selected email-service provider
for real transactional email integration; the current build tracks
notification status rather than claiming that an email was actually
delivered.

------------------------------------------------------------------------

# 2. Main Features

## Patient Portal

-   Patient login
-   Dashboard
-   Search doctors
-   Filter doctors by specialization
-   View doctor profile
-   View working hours
-   View available appointment slots
-   Select an appointment slot
-   Enter symptoms before confirmation
-   View appointment details
-   Cancel confirmed appointments
-   View AI pre-visit summary
-   View post-visit summary
-   View prescription information

## Doctor Portal

-   Doctor dashboard
-   Today's appointments
-   View patient information
-   View patient symptoms
-   View AI pre-visit summary
-   View urgency level
-   View suggested questions for the consultation
-   Add post-visit notes
-   Add prescription
-   Generate patient-friendly post-visit summary
-   Mark appointment as completed

## Admin Portal

-   Admin dashboard
-   Doctor management
-   View doctors
-   Add/edit doctor information
-   Configure specialization
-   Configure working hours
-   Configure slot duration
-   Manage doctor leave
-   Handle leave-related appointment conflicts

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
                         ┌──────────────────────┐
                         │        USERS         │
                         │ Patient / Doctor     │
                         │ Admin                │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FRONTEND        │
                         │       React          │
                         │                      │
                         │ Patient Portal       │
                         │ Doctor Portal        │
                         │ Admin Portal         │
                         └──────────┬───────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │          BACKEND             │
                    │      Node.js + Express       │
                    │                              │
                    │ Routes                       │
                    │ Controllers                  │
                    │ Services                     │
                    │ Middleware                   │
                    │ Validation                   │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
       │    SQLite    │    │ Anthropic    │    │   External   │
       │   Database   │    │ Claude       │    │   Services   │
       └──────────────┘    └──────────────┘    │ Resend       │
                                                │ Google Cal.  │
                                                └──────────────┘
```

------------------------------------------------------------------------

# 4. Frontend Architecture

``` text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── Sidebar
│   │   ├── Button
│   │   ├── Input
│   │   ├── Modal
│   │   ├── Loader
│   │   ├── AppointmentCard
│   │   ├── DoctorCard
│   │   └── ProtectedRoute
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login
│   │   │   └── Register
│   │   │
│   │   ├── patient/
│   │   │   ├── Dashboard
│   │   │   ├── Doctors
│   │   │   ├── DoctorProfile
│   │   │   ├── BookAppointment
│   │   │   ├── MyAppointments
│   │   │   └── AppointmentDetails
│   │   │
│   │   ├── doctor/
│   │   │   ├── Dashboard
│   │   │   ├── Appointments
│   │   │   └── AppointmentDetails
│   │   │
│   │   └── admin/
│   │       ├── Dashboard
│   │       ├── Doctors
│   │       ├── AddDoctor
│   │       ├── EditDoctor
│   │       └── LeaveManagement
│   │
│   ├── services/
│   │   ├── authApi
│   │   ├── doctorApi
│   │   ├── appointmentApi
│   │   └── aiApi
│   │
│   ├── context/
│   │   └── AuthContext
│   │
│   ├── utils/
│   │   ├── validation
│   │   └── token
│   │
│   └── App
│
└── package.json
```

------------------------------------------------------------------------

# 5. Backend Architecture

``` text
backend/
│
├── server.js
│
├── config/
│   ├── db.js
│   ├── env.js
│   └── google.js
│
├── routes/
│   ├── auth.routes.js
│   ├── doctor.routes.js
│   ├── appointment.routes.js
│   ├── admin.routes.js
│   └── ai.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── doctor.controller.js
│   ├── appointment.controller.js
│   ├── admin.controller.js
│   └── ai.controller.js
│
├── services/
│   ├── appointment.service.js
│   ├── doctor.service.js
│   ├── ai.service.js
│   ├── email.service.js
│   ├── calendar.service.js
│   └── reminder.service.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
├── models/
│   ├── User.js
│   ├── Doctor.js
│   ├── Appointment.js
│   ├── Prescription.js
│   └── Notification.js
│
├── jobs/
│   ├── medicationReminder.job.js
│   └── emailRetry.job.js
│
├── utils/
│   ├── slotGenerator.js
│   └── response.js
│
├── .env.example
└── package.json
```

> The exact files present in the repository are the source of truth.
> This structure describes the intended separation of responsibilities.

------------------------------------------------------------------------

# 6. Patient Booking Flow

``` text
Patient
   │
   ▼
Login
   │
   ▼
Find Doctor
   │
   ▼
Select Specialization
   │
   ▼
Doctor Profile
   │
   ▼
Available Slots
   │
   ▼
Select Slot
   │
   ▼
Enter Symptoms
   │
   ▼
Confirm Appointment
   │
   ▼
Backend API
   │
   ▼
Validate Slot
   │
   ├── Already booked → Reject
   │
   └── Available
          │
          ▼
    Create Appointment
          │
          ├── AI pre-visit summary
          ├── Email notification through Resend
          └── Calendar event
```

------------------------------------------------------------------------

# 7. Backend Request Flow

Example:

``` http
POST /api/appointments
```

Request:

``` json
{
  "doctorId": "D123",
  "patientName": "Patient",
  "date": "2026-08-30",
  "time": "10:30",
  "symptoms": "Fever and headache"
}
```

Processing:

``` text
Request
  ↓
Express Router
  ↓
Authentication / Role Check
  ↓
Validation
  ↓
Appointment Controller
  ↓
Appointment Service
  ↓
Check Doctor Availability
  ↓
Check Existing Booking
  ↓
SQLite
  ↓
Create Appointment
  ↓
AI / Email / Calendar Processing
  ↓
Response
```

------------------------------------------------------------------------

# 8. Authentication & Roles

The application has three roles:

``` text
patient
doctor
admin
```

The intended authorization flow is:

``` text
Login
  ↓
Identify User
  ↓
Determine Role
  ↓
Role-based Access
  │
  ├── Patient → Patient Portal/APIs
  ├── Doctor  → Doctor Portal/APIs
  └── Admin   → Admin Portal/APIs
```

The current frontend explicitly presents Patient, Doctor, and Admin
login roles and identifies the build as a demo with mock data rather
than real authentication. fileciteturn2file4L267-L301

------------------------------------------------------------------------

# 9. Appointment & Slot Management

Doctor availability is based on:

-   Working hours
-   Slot duration
-   Existing appointments
-   Doctor leave

The frontend generates slots from the doctor's working hours and slot
duration and disables slots that are already booked.
fileciteturn2file6L379-L404

Example:

``` text
Doctor Working Hours
        ↓
Slot Duration
        ↓
Slot Generator
        ↓
Available Slots
        ↓
Patient Selects Slot
        ↓
Booking Validation
        ↓
Appointment Created
```

------------------------------------------------------------------------

# 10. Double-Booking Prevention

The system should not rely only on a frontend availability check.

Two patients could attempt:

``` text
Patient A ──────┐
                ├── 10:30 slot
Patient B ──────┘
```

The backend must validate the appointment again before creation.

Recommended flow:

``` text
Request A
   ↓
Backend Validation
   ↓
Database Check
   ↓
Create Booking
   ↓
Success


Request B
   ↓
Backend Validation
   ↓
Database Check / Concurrency Protection
   ↓
Slot occupied
   ↓
Reject
```

For a production relational implementation, a unique constraint over:

``` text
doctor_id + appointment_date + start_time
```

can provide an additional database-level guarantee.

------------------------------------------------------------------------

# 11. Slot Hold Mechanism

A stronger implementation can temporarily reserve a slot:

``` text
AVAILABLE
    ↓
HELD
    ↓
BOOKED
```

Example:

``` text
Patient selects 10:30
        ↓
Create temporary hold
        ↓
Hold expires after configured time
        ↓
Patient confirms
        ↓
BOOKED
```

If the patient does not confirm:

``` text
HELD
  ↓
Expiration
  ↓
AVAILABLE
```

A background job can release expired holds.

------------------------------------------------------------------------

# 12. Doctor Leave Management

When an admin marks a doctor as on leave:

``` text
Admin Marks Leave
       ↓
Find Appointments on Leave Date
       ↓
Identify Conflicting Appointments
       ↓
Cancel / Reschedule
       ↓
Notify Affected Patients
       ↓
Update Appointment Status
       ↓
Update Calendar
```

This addresses the assignment requirement that affected patients be
notified when doctor leave conflicts with existing bookings.
fileciteturn2file1L92-L105

------------------------------------------------------------------------

# 13. AI Architecture

The assignment requires two AI flows: a pre-visit summary and a
post-visit summary. fileciteturn2file1L98-L101

## Pre-Visit Summary

``` text
Patient Symptoms
       ↓
AI Service
       ↓
Anthropic Claude
       ↓
Urgency
Chief Complaint
3 Suggested Questions
       ↓
Doctor Portal
```

Required prompt:

``` text
Analyse these symptoms and return:
urgency level (Low / Medium / High),
chief complaint, and three suggested questions for the doctor.

Symptoms: <symptoms>
```

The assignment specifies this prompt structure and expected output.
fileciteturn2file1L113-L117

## Post-Visit Summary

``` text
Doctor Notes
     +
Prescription
       ↓
AI Service
       ↓
Anthropic Claude
       ↓
Patient-Friendly Summary
Medication Schedule
Follow-Up Steps
       ↓
Patient Portal
```

Prompt:

``` text
Convert these clinical notes into a patient-friendly
summary with medication schedule and follow-up steps:

<notes>
```

------------------------------------------------------------------------

# 14. AI Failure Handling

AI should not be allowed to break appointment booking.

Recommended flow:

``` text
Create Appointment
       ↓
Save Appointment
       ↓
AI Request
    ┌──┴────┐
 Success  Failure
    │         │
    ▼         ▼
Save AI    Keep Appointment
Summary    + record failure
              │
              ▼
          Retry / Fallback
```

The assignment explicitly requires graceful LLM failure handling.
fileciteturn2file1L106-L112

------------------------------------------------------------------------

# 15. Email Service --- Resend

**Email Service:** Resend

Resend is the selected transactional email provider for the
Node.js/Express backend.

Intended notification flow:

``` text
Appointment Created
       ↓
Notification Service
       ↓
Resend API
       ↓
Patient / Doctor Email
```

Notifications can include:

-   Appointment confirmation
-   Appointment reminder
-   Cancellation
-   Rescheduling
-   Doctor leave notification

The assignment specifically requires an email service and lists services
such as SendGrid, Mailgun, Nodemailer, or similar. Resend is used here
as the selected provider. fileciteturn2file1L102-L112

### Environment Variable

``` env
RESEND_API_KEY=your_resend_api_key
```

### Important Current-Build Note

The current demo build displays an **"Email sent"** status on the
appointment confirmation screen, but this should be treated as UI/status
behaviour unless the Resend API integration has been enabled with a
valid API key and email-sending code.

------------------------------------------------------------------------

# 16. Google Calendar Architecture

The intended calendar flow is:

``` text
Appointment Created
       ↓
Google OAuth 2.0
       ↓
Google Calendar API
       ↓
Create Event
```

For rescheduling:

``` text
Appointment Updated
       ↓
Update Google Calendar Event
```

For cancellation:

``` text
Appointment Cancelled
       ↓
Delete / Cancel Calendar Event
```

The assignment requires Google Calendar API with OAuth 2.0 and event
creation, updating, and deletion. fileciteturn2file1L103-L111

------------------------------------------------------------------------

# 17. Background Jobs

Background jobs can be used for:

### Medication Reminders

``` text
Prescription
    ↓
Frequency
    ↓
Reminder Scheduler
    ↓
Notification
```

### Email Retries

``` text
Email Failure
    ↓
Retry Job
    ↓
Resend
    ↓
Success / Final Failure
```

The assignment specifically calls for background jobs for medication
reminders and email retries. fileciteturn2file1L106-L112

------------------------------------------------------------------------

# 18. Database --- SQLite

The current backend uses **SQLite**.

Logical data structure:

## Users

``` text
users
-----
id
name
email
password
role
created_at
```

## Doctors

``` text
doctors
-------
id
user_id
name
specialisation
working_hours
slot_duration
```

## Doctor Leaves

``` text
doctor_leaves
-------------
id
doctor_id
leave_date
```

## Appointments

``` text
appointments
------------
id
patient_id
doctor_id
appointment_date
start_time
end_time
status
symptoms
ai_previsit_summary
ai_urgency
post_visit_notes
post_visit_summary
email_sent
calendar_added
created_at
```

## Prescriptions

``` text
prescriptions
-------------
id
appointment_id
medicine
dosage
frequency
duration
```

## Notifications

``` text
notifications
-------------
id
appointment_id
recipient_id
type
status
retry_count
sent_at
```

> The actual database schema in the backend is the final source of truth
> for exact table and column names.

------------------------------------------------------------------------

# 19. API Documentation

The backend is organized around REST API endpoints for authentication,
doctors, appointments, admin operations, and AI functionality.

Typical endpoint groups:

## Authentication

``` http
POST /api/auth/register
POST /api/auth/login
```

## Doctors

``` http
GET /api/doctors
GET /api/doctors/:id
```

## Appointments

``` http
GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
```

## Admin

``` http
GET /api/admin/stats
POST /api/admin/doctors
PUT /api/admin/doctors/:id
POST /api/admin/doctors/:id/leave
```

> Verify the exact route names against the backend route files before
> treating these as the final API contract.

------------------------------------------------------------------------

# 20. Environment Variables

Create a `.env` file in the backend directory.

Example:

``` env
PORT=5000

# SQLite
DATABASE_PATH=./data/database.sqlite

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

Use the exact variable names expected by the backend's `.env.example`.

### Never commit:

``` text
.env
```

Commit:

``` text
.env.example
```

------------------------------------------------------------------------

# 21. Local Setup

## Prerequisites

-   Node.js
-   npm
-   Git

## Clone

``` bash
git clone https://github.com/Namanshri/healthcare-appointment-manager.git
cd healthcare-appointment-manager
```

## Backend

``` bash
cd backend
npm install
```

Create environment file:

``` bash
cp .env.example .env
```

Windows PowerShell:

``` powershell
Copy-Item .env.example .env
```

Start:

``` bash
npm start
```

or:

``` bash
npm run dev
```

## Frontend

Open another terminal:

``` bash
cd frontend
npm install
```

Start:

``` bash
npm start
```

or:

``` bash
npm run dev
```

------------------------------------------------------------------------

# 22. GitHub Repository

``` text
https://github.com/Namanshri/healthcare-appointment-manager
```

Git commands:

``` bash
git init
git add .
git commit -m "Initial project submission"
git branch -M main
git remote add origin https://github.com/Namanshri/healthcare-appointment-manager.git
git push -u origin main
```

For future changes:

``` bash
git add .
git commit -m "Update project"
git push
```

------------------------------------------------------------------------

# 23. .gitignore

Recommended:

``` text
node_modules/
.env
.env.local
dist/
build/
*.db
*.sqlite
*.sqlite3
```

Never commit API keys or other secrets.

------------------------------------------------------------------------

# 24. Deployment

## Frontend

Deploy the React application on a suitable hosting provider such as
Vercel.

## Backend

Deploy the Node.js/Express backend on a suitable hosting provider such
as Render or Railway.

## Production Configuration

Configure:

-   Backend URL
-   Frontend API URL
-   SQLite persistence if supported by the chosen hosting environment
-   Anthropic API key
-   Resend API key
-   Google OAuth credentials
-   CORS settings

> For production deployment, SQLite persistence must be considered
> carefully because some free hosting environments use ephemeral
> filesystems.

------------------------------------------------------------------------

# 25. Live URLs

### Frontend

``` text
YOUR_FRONTEND_URL
```

### Backend

``` text
YOUR_BACKEND_URL
```

Replace these with the actual deployed URLs before submission.

------------------------------------------------------------------------

# 26. System Design Summary

The application follows a layered architecture with a React frontend and
Node.js/Express backend. The frontend provides separate Patient, Doctor,
and Admin portals. The backend exposes REST APIs and separates routing,
controllers, services, middleware, and database operations.

SQLite stores application data such as users, doctors, appointments,
prescriptions, and notification status.

Appointment booking first validates doctor availability and then
performs backend-side booking validation. A production implementation
should additionally enforce a database-level uniqueness rule for
doctor/date/time to safely handle simultaneous booking attempts.

Doctor leave management checks appointments that conflict with the leave
date and provides a flow for cancellation or rescheduling and patient
notification.

The AI layer uses Anthropic Claude when configured and is responsible
for generating the pre-visit symptom summary and post-visit
patient-friendly summary. AI errors should be isolated from the critical
appointment transaction so that an LLM failure does not cause a valid
booking to fail.

Resend is the selected email provider for transactional notifications
such as booking confirmations, reminders, cancellations, and
rescheduling messages. Email delivery should be handled independently
from the appointment transaction, with retry handling for failures.

Google Calendar is designed around OAuth 2.0 and the Google Calendar API
so appointment events can be created, updated, or removed when
appointments change.

Background jobs are intended for medication reminders, expired slot
holds, and email retries.

------------------------------------------------------------------------

# 27. Assignment Requirements Checklist

The assignment requires a backend API, frontend, database, role-based
patient/doctor/admin access, LLM integration, background jobs, email
service, Google Calendar OAuth 2.0, and graceful LLM failure handling.
fileciteturn2file1L106-L117

Before submission:

-   [ ] Patient portal
-   [ ] Doctor portal
-   [ ] Admin portal
-   [ ] Doctor search
-   [ ] Appointment booking
-   [ ] Symptom form
-   [ ] Double-booking prevention
-   [ ] Doctor leave management
-   [ ] AI pre-visit summary
-   [ ] AI post-visit summary
-   [ ] Medication reminders
-   [ ] Email service / Resend
-   [ ] Email retry handling
-   [ ] Google Calendar OAuth 2.0
-   [ ] Calendar create/update/delete
-   [ ] `.env.example`
-   [ ] API documentation
-   [ ] Database schema
-   [ ] LLM prompts
-   [ ] Google Calendar setup steps
-   [ ] System design write-up
-   [ ] Hosted application URL
-   [ ] Public GitHub repository

The assignment also explicitly asks for a README containing setup
instructions, `.env.example`, API documentation, DB schema, LLM prompts,
and Google Calendar setup steps. fileciteturn2file1L118-L123

------------------------------------------------------------------------

# 28. Project Status

### Core Demo

-   React-based Patient, Doctor, and Admin portals
-   Doctor search and profiles
-   Slot selection
-   Symptom collection
-   Appointment views
-   Pre-visit AI UI
-   Post-visit AI UI
-   Prescription UI
-   Doctor leave management UI

The frontend source includes the three role portals and the
corresponding patient, doctor, and admin navigation.
fileciteturn2file8L531-L552

### Backend / Integration Notes

-   Backend: Node.js + Express
-   Database: SQLite
-   AI: Anthropic Claude can be configured
-   Email provider: Resend is the selected provider for email
    integration
-   Google Calendar: integration architecture documented
-   Current frontend demo contains mock data and mock interactions
-   Real external integrations should only be described as active when
    their API credentials and implementation are enabled

------------------------------------------------------------------------

## License

This project was developed as an academic assignment submission.
