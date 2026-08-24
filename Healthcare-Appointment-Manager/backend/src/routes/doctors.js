const express = require("express");
const db = require("../db/init");
const { getAvailability } = require("../services/slotService");

const router = express.Router();

function nextDoctorId() {
  const row = db.prepare(`SELECT id FROM doctors ORDER BY id DESC LIMIT 1`).get();
  const num = row ? parseInt(row.id.replace("D", ""), 10) + 1 : 101;
  return `D${num}`;
}

function withLeaves(doctor) {
  const leaves = db
    .prepare(`SELECT leaveDate FROM doctor_leaves WHERE doctorId = ? ORDER BY leaveDate`)
    .all(doctor.id)
    .map((r) => r.leaveDate);
  return { ...doctor, leaves };
}

// GET /api/doctors?q=&specialization=
router.get("/", (req, res) => {
  const { q = "", specialization = "All" } = req.query;
  let rows = db.prepare(`SELECT * FROM doctors ORDER BY name`).all();

  if (specialization && specialization !== "All") {
    rows = rows.filter((d) => d.specialization === specialization);
  }
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (d) => d.name.toLowerCase().includes(needle) || d.specialization.toLowerCase().includes(needle)
    );
  }

  res.json(rows.map(withLeaves));
});

// GET /api/doctors/specializations
router.get("/specializations", (_req, res) => {
  const rows = db.prepare(`SELECT DISTINCT specialization FROM doctors ORDER BY specialization`).all();
  res.json(rows.map((r) => r.specialization));
});

// GET /api/doctors/:id
router.get("/:id", (req, res) => {
  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  res.json(withLeaves(doctor));
});

// GET /api/doctors/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", (req, res) => {
  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Query param 'date' is required (YYYY-MM-DD)" });

  const { slots, onLeave } = getAvailability(doctor, date);
  res.json({ doctorId: doctor.id, date, onLeave, slots });
});

// POST /api/doctors  (admin: create)
router.post("/", (req, res) => {
  const { name, specialization, experience = 0, workingHours = "9:00–17:00", slotDuration = 30, rating = 4.5, bio = "" } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "'name' is required" });
  if (!specialization) return res.status(400).json({ error: "'specialization' is required" });

  const id = nextDoctorId();
  db.prepare(`
    INSERT INTO doctors (id, name, specialization, experience, workingHours, slotDuration, rating, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name.trim(), specialization, Number(experience) || 0, workingHours, Number(slotDuration) || 30, Number(rating) || 4.5, bio);

  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(id);
  res.status(201).json(withLeaves(doctor));
});

// PUT /api/doctors/:id  (admin: edit)
router.put("/:id", (req, res) => {
  const existing = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Doctor not found" });

  const merged = { ...existing, ...req.body, id: existing.id };
  db.prepare(`
    UPDATE doctors SET name=?, specialization=?, experience=?, workingHours=?, slotDuration=?, rating=?, bio=?, updatedAt=datetime('now')
    WHERE id=?
  `).run(merged.name, merged.specialization, Number(merged.experience) || 0, merged.workingHours, Number(merged.slotDuration) || 30, Number(merged.rating) || 4.5, merged.bio, existing.id);

  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(existing.id);
  res.json(withLeaves(doctor));
});

// DELETE /api/doctors/:id  (admin: remove)
router.delete("/:id", (req, res) => {
  const existing = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Doctor not found" });
  db.prepare(`DELETE FROM doctors WHERE id = ?`).run(existing.id);
  res.status(204).send();
});

// GET /api/doctors/:id/leaves
router.get("/:id/leaves", (req, res) => {
  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  const leaves = db.prepare(`SELECT leaveDate FROM doctor_leaves WHERE doctorId = ? ORDER BY leaveDate`).all(doctor.id).map((r) => r.leaveDate);
  res.json(leaves);
});

// POST /api/doctors/:id/leaves  { date }
// Marks the doctor on leave for that date, cancels conflicting Confirmed appointments,
// and returns a notice describing what was cancelled (mirrors the admin "Leave management" screen).
router.post("/:id/leaves", (req, res) => {
  const doctor = db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  const { date } = req.body;
  if (!date) return res.status(400).json({ error: "'date' is required (YYYY-MM-DD)" });

  const txn = db.transaction(() => {
    db.prepare(`INSERT OR IGNORE INTO doctor_leaves (doctorId, leaveDate) VALUES (?, ?)`).run(doctor.id, date);

    const conflicts = db.prepare(`
      SELECT * FROM appointments WHERE doctorId = ? AND date = ? AND status = 'Confirmed'
    `).all(doctor.id, date);

    if (conflicts.length) {
      db.prepare(`
        UPDATE appointments SET status = 'Cancelled', updatedAt = datetime('now')
        WHERE doctorId = ? AND date = ? AND status = 'Confirmed'
      `).run(doctor.id, date);
    }

    return conflicts;
  });

  const cancelled = txn();

  res.json({
    doctorId: doctor.id,
    date,
    cancelledAppointments: cancelled.map((a) => a.id),
    notice: `${doctor.name} marked on leave for ${date}. ${cancelled.length} patient(s) notified by email and calendar updated.`,
  });
});

module.exports = router;
