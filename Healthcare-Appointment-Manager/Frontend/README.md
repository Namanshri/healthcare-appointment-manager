# CareFlow — Healthcare Appointment & Follow-up Manager

Modular React frontend matching the requested patient, doctor and admin portal architecture.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/components` — reusable UI components and layout
- `src/pages/auth` — authentication
- `src/pages/patient` — patient portal
- `src/pages/doctor` — doctor portal
- `src/pages/admin` — admin portal
- `src/data` — mock data
- `src/styles` — global responsive styling

## Backend integration points

Replace the mock data/actions with REST calls through a service layer, e.g.:

- `POST /api/auth/login`
- `GET /api/doctors`
- `GET /api/appointments`
- `POST /api/appointments`
- `POST /api/ai/previsit-summary`
- `POST /api/ai/postvisit-summary`

The UI is frontend-only; authentication, database persistence, LLM, email, Google Calendar and background jobs should be connected to the Express backend described in the architecture.
