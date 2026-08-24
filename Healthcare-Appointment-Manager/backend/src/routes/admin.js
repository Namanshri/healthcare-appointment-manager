const express = require("express");
const db = require("../db/init");

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", (_req, res) => {
  const doctorCount = db.prepare(`SELECT COUNT(*) AS c FROM doctors`).get().c;
  const confirmedCount = db.prepare(`SELECT COUNT(*) AS c FROM appointments WHERE status = 'Confirmed'`).get().c;
  const completedCount = db.prepare(`SELECT COUNT(*) AS c FROM appointments WHERE status = 'Completed'`).get().c;
  const cancelledCount = db.prepare(`SELECT COUNT(*) AS c FROM appointments WHERE status = 'Cancelled'`).get().c;
  const specializationCount = db.prepare(`SELECT COUNT(DISTINCT specialization) AS c FROM doctors`).get().c;

  res.json({
    activeDoctors: doctorCount,
    confirmedAppointments: confirmedCount,
    completedAppointments: completedCount,
    cancelledAppointments: cancelledCount,
    specializations: specializationCount,
  });
});

module.exports = router;
