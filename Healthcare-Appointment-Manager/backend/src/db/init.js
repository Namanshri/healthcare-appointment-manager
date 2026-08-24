const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || "./data/followup.db";
const resolvedPath = path.resolve(process.cwd(), DB_PATH);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS doctors (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  specialization  TEXT NOT NULL,
  experience      INTEGER NOT NULL DEFAULT 0,
  workingHours    TEXT NOT NULL DEFAULT '9:00–17:00',
  slotDuration    INTEGER NOT NULL DEFAULT 30,
  rating          REAL NOT NULL DEFAULT 4.5,
  bio             TEXT NOT NULL DEFAULT '',
  createdAt       TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS doctor_leaves (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  doctorId    TEXT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  leaveDate   TEXT NOT NULL,
  UNIQUE(doctorId, leaveDate)
);

CREATE TABLE IF NOT EXISTS appointments (
  id                      TEXT PRIMARY KEY,
  doctorId                TEXT NOT NULL REFERENCES doctors(id),
  patientName             TEXT NOT NULL,
  date                    TEXT NOT NULL,
  time                    TEXT NOT NULL,
  status                  TEXT NOT NULL DEFAULT 'Confirmed', -- Confirmed | Completed | Cancelled
  symptoms                TEXT NOT NULL DEFAULT '',

  previsitUrgency         TEXT,
  previsitChiefComplaint  TEXT,
  previsitQuestions       TEXT, -- JSON array

  postVisitNotes          TEXT DEFAULT '',
  prescription            TEXT DEFAULT '[]', -- JSON array

  postvisitSummary        TEXT,
  postvisitMedication     TEXT,
  postvisitFollowUp       TEXT,

  emailSent               INTEGER NOT NULL DEFAULT 0,
  calendarAdded           INTEGER NOT NULL DEFAULT 0,

  createdAt               TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt               TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appt_doctor_date ON appointments(doctorId, date);
CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments(patientName);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments(status);
`);

module.exports = db;
