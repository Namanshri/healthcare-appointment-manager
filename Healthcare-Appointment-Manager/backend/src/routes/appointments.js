const express = require("express");
const db = require("../db/init");
const { isSlotAvailable } = require("../services/slotService");
const aiService = require("../services/aiService");

const router = express.Router();

function nextApptId() {
  const row = db.prepare(`SELECT id FROM appointments ORDER BY id DESC LIMIT 1`).get();
  const num = row ? parseInt(row.id.replace("A", ""), 10) + 1 : 2001;
  return `A${num}`;
}

function serialize(row) {
  if (!row) return null;
  return {
    id: row.id,
    doctorId: row.doctorId,
    patientName: row.patientName,
    date: row.date,
    time: row.time,
    status: row.status,
    symptoms: row.symptoms,
    aiPrevisit: row.previsitUrgency
      ? {
          urgency: row.previsitUrgency,
          chiefComplaint: row.previsitChiefComplaint,
          questions: JSON.parse(row.previsitQuestions || "[]"),
        }
      : null,
    postVisitNotes: row.postVisitNotes || "",
    prescription: JSON.parse(row.prescription || "[]"),
    aiPostvisit: row.postvisitSummary
      ? {
          summary: row.postvisitSummary,
          medication: row.postvisitMedication,
          followUp: row.postvisitFollowUp,
        }
      : null,
    emailSent: !!row.emailSent,
    calendarAdded: !!row.calendarAdded,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// GET /api/appointments?patientName=&doctorId=&status=
router.get("/", (req, res) => {
  const { patientName, doctorId, status } = req.query;
  let rows = db.prepare(`SELECT * FROM appointments ORDER BY date DESC, time DESC`).all();

  if (patientName) rows = rows.filter((a) => a.patientName === patientName);
  if (doctorId) rows = rows.filter((a) => a.doctorId === doctorId);
  if (status) rows = rows.filter((a) => a.status === status);

  res.json(rows.map(serialize));
});

// GET /api/appointments/:id
router.get("/:id", (req, res) => {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Appointment not found" });
  res.json(serialize(row));
});

// POST /api/appointments  { doctorId, patientName, date, time, symptoms }
// Books the appointment and generates the AI pre-visit brief server-side.
router.post("/", async (req, res) => {
  const { doctorId, patientName, date, time, symptoms } = req.body;

  if (!doctorId || !patientName || !date || !time || !symptoms || !symptoms.trim()) {
    return res.status(400).json({ error: "doctorId, patientName, date, time, and symptoms are all required" });
  }

  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(doctorId);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  if (!isSlotAvailable(doctor, date, time)) {
    return res.status(409).json({ error: "That slot is no longer available. Please pick another time." });
  }

  let previsit;
  try {
    previsit = await aiService.generatePrevisit(symptoms);
  } catch (err) {
    return res.status(502).json({ error: "Failed to generate AI pre-visit brief", detail: err.message });
  }

  const id = nextApptId();
  db.prepare(`
    INSERT INTO appointments
      (id, doctorId, patientName, date, time, status, symptoms,
       previsitUrgency, previsitChiefComplaint, previsitQuestions,
       emailSent, calendarAdded)
    VALUES (?, ?, ?, ?, ?, 'Confirmed', ?, ?, ?, ?, 1, 1)
  `).run(id, doctorId, patientName, date, time, symptoms, previsit.urgency, previsit.chiefComplaint, JSON.stringify(previsit.questions));

  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(id);
  res.status(201).json(serialize(row));
});

// PATCH /api/appointments/:id/cancel
router.patch("/:id/cancel", (req, res) => {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Appointment not found" });
  if (row.status !== "Confirmed") return res.status(400).json({ error: `Cannot cancel an appointment with status '${row.status}'` });

  db.prepare(`UPDATE appointments SET status = 'Cancelled', updatedAt = datetime('now') WHERE id = ?`).run(row.id);
  res.json(serialize(db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(row.id)));
});

// PATCH /api/appointments/:id  — doctor updates notes/prescription while visit is in progress (does not complete it)
router.patch("/:id", (req, res) => {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Appointment not found" });

  const postVisitNotes = req.body.postVisitNotes !== undefined ? req.body.postVisitNotes : row.postVisitNotes;
  const prescription = req.body.prescription !== undefined ? JSON.stringify(req.body.prescription) : row.prescription;

  db.prepare(`UPDATE appointments SET postVisitNotes = ?, prescription = ?, updatedAt = datetime('now') WHERE id = ?`)
    .run(postVisitNotes, prescription, row.id);

  res.json(serialize(db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(row.id)));
});

// POST /api/appointments/:id/ai-postvisit-preview
// Lets the doctor preview an AI-generated patient summary before completing the visit.
router.post("/:id/ai-postvisit-preview", async (req, res) => {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Appointment not found" });

  const notes = req.body.notes !== undefined ? req.body.notes : row.postVisitNotes;
  const prescription = req.body.prescription !== undefined ? req.body.prescription : JSON.parse(row.prescription || "[]");

  try {
    const postvisit = await aiService.generatePostvisit({
      chiefComplaint: row.previsitChiefComplaint,
      symptoms: row.symptoms,
      notes,
      prescription,
    });
    res.json(postvisit);
  } catch (err) {
    res.status(502).json({ error: "Failed to generate AI post-visit summary", detail: err.message });
  }
});

// PATCH /api/appointments/:id/complete  { notes, prescription }
// Marks the visit complete, saves clinical notes/prescription, and generates the AI patient summary.
router.patch("/:id/complete", async (req, res) => {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Appointment not found" });
  if (row.status === "Completed") return res.status(400).json({ error: "Appointment is already completed" });

  const notes = req.body.notes || "";
  const prescription = req.body.prescription || [];

  let postvisit;
  try {
    postvisit = await aiService.generatePostvisit({
      chiefComplaint: row.previsitChiefComplaint,
      symptoms: row.symptoms,
      notes,
      prescription,
    });
  } catch (err) {
    return res.status(502).json({ error: "Failed to generate AI post-visit summary", detail: err.message });
  }

  db.prepare(`
    UPDATE appointments
    SET status = 'Completed', postVisitNotes = ?, prescription = ?,
        postvisitSummary = ?, postvisitMedication = ?, postvisitFollowUp = ?,
        updatedAt = datetime('now')
    WHERE id = ?
  `).run(notes, JSON.stringify(prescription), postvisit.summary, postvisit.medication, postvisit.followUp, row.id);

  res.json(serialize(db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(row.id)));
});

module.exports = router;
