# Follow&Up — Backend API

Backend for the Healthcare Appointment & Follow-up Manager frontend. Node.js + Express + SQLite (via `better-sqlite3`), zero external services required to run.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The server starts on `http://localhost:4000` and auto-seeds demo data (matching the frontend's original mock data: 5 doctors, 2 appointments) the first time it runs.

### Enabling real AI summaries

By default, pre-visit and post-visit AI content is generated with the same deterministic mock logic the frontend demo used — no API key needed. To use real Claude-generated summaries, set in `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

The server automatically switches to live generation and falls back to the mock logic if any API call fails.

## Data model

- **doctors** — id, name, specialization, experience, workingHours, slotDuration, rating, bio
- **doctor_leaves** — doctorId, leaveDate (one row per leave day)
- **appointments** — id, doctorId, patientName, date, time, status (`Confirmed` / `Completed` / `Cancelled`), symptoms, AI pre-visit fields, post-visit notes/prescription, AI post-visit fields

IDs follow the same scheme as the frontend mocks (`D101...`, `A2001...`) so existing sample data lines up.

## API reference

All responses are JSON. Base path: `/api`.

### Auth (demo only — no real authentication)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/auth/login` | `{ role }` | role ∈ patient/doctor/admin; returns `{ token, user }` |

### Doctors
| Method | Path | Notes |
|---|---|---|
| GET | `/doctors?q=&specialization=` | search/filter |
| GET | `/doctors/specializations` | distinct list for filter dropdown |
| GET | `/doctors/:id` | single doctor incl. `leaves[]` |
| POST | `/doctors` | admin: create `{ name, specialization, experience, workingHours, slotDuration, bio }` |
| PUT | `/doctors/:id` | admin: edit (partial merge) |
| DELETE | `/doctors/:id` | admin: remove |
| GET | `/doctors/:id/slots?date=YYYY-MM-DD` | `{ onLeave, slots: [{time, available}] }` |
| GET | `/doctors/:id/leaves` | list of leave dates |
| POST | `/doctors/:id/leaves` | `{ date }` — marks leave, **cancels conflicting Confirmed appointments**, returns notice |

### Appointments
| Method | Path | Notes |
|---|---|---|
| GET | `/appointments?patientName=&doctorId=&status=` | list/filter |
| GET | `/appointments/:id` | single appointment |
| POST | `/appointments` | `{ doctorId, patientName, date, time, symptoms }` — books + generates AI pre-visit brief server-side; 409 if slot taken |
| PATCH | `/appointments/:id/cancel` | patient cancels a Confirmed appointment |
| PATCH | `/appointments/:id` | doctor saves in-progress notes/prescription without completing |
| POST | `/appointments/:id/ai-postvisit-preview` | `{ notes, prescription }` — preview AI summary before completing |
| PATCH | `/appointments/:id/complete` | `{ notes, prescription }` — marks Completed + generates final AI post-visit summary |

### Admin
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/stats` | counts for the Overview dashboard cards |

## Wiring into the existing React frontend

Replace the in-memory `useState(initialDoctors)` / `useState(initialAppointments)` and the mock `setTimeout` AI calls in `App` with fetch calls to this API, e.g.:

```js
// load data
useEffect(() => {
  fetch(`${API_BASE}/doctors`).then(r => r.json()).then(setDoctors);
  fetch(`${API_BASE}/appointments?patientName=Naman`).then(r => r.json()).then(setAppointments);
}, []);

// booking (replaces confirmBooking)
const confirmBooking = async (symptoms) => {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doctorId: flow.doctor.id, patientName: "Naman", date: "2026-08-30", time: flow.slot, symptoms }),
  });
  const newAppt = await res.json();
  setFlow({ ...flow, step: "confirmed", confirmedAppt: newAppt });
};

// doctor's "Generate AI summary" button (replaces generateSummary)
const generateSummary = async () => {
  setGenerating(true);
  const res = await fetch(`${API_BASE}/appointments/${appt.id}/ai-postvisit-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes, prescription: rx }),
  });
  setAiPostvisit(await res.json());
  setGenerating(false);
};

// mark visit complete (replaces onSave/complete)
const complete = async () => {
  const res = await fetch(`${API_BASE}/appointments/${appt.id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes, prescription: rx }),
  });
  onSave(await res.json());
};
```

Set `CORS_ORIGIN` in `.env` to your frontend's dev URL (e.g. `http://localhost:3000`) so the browser is allowed to call the API.

## Project structure

```
backend/
  src/
    server.js            entry point
    db/
      init.js             connection + schema
      seed.js              demo data (matches original frontend mocks)
    services/
      aiService.js         pre/post-visit AI generation (live + mock fallback)
      slotService.js        slot generation + availability/conflict checks
    routes/
      auth.js               mock role login
      doctors.js             CRUD, slots, leave management
      appointments.js         booking, cancel, complete, AI preview
      admin.js               overview stats
    middleware/
      errorHandler.js        404 + error JSON responses
```
