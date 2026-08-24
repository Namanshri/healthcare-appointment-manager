const db = require("../db/init");

/** Parse "9:00–17:00" (en dash) or "9:00-17:00" (hyphen) into [startHour, endHour]. */
function parseWorkingHours(workingHours) {
  const parts = workingHours.split(/[–-]/).map((p) => p.trim());
  const startH = Number(parts[0].split(":")[0]);
  const endH = Number(parts[1].split(":")[0]);
  return [startH, endH];
}

function generateAllSlots(doctor) {
  const [startH, endH] = parseWorkingHours(doctor.workingHours);
  const slots = [];
  for (let h = startH; h < endH; h++) {
    for (let m = 0; m < 60; m += doctor.slotDuration) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

/**
 * Returns { slots: [{time, available}], onLeave: boolean }
 * A slot is unavailable if it's already booked (Confirmed/Completed) or the doctor is on leave that day.
 */
function getAvailability(doctor, date) {
  const onLeave = db
    .prepare(`SELECT 1 FROM doctor_leaves WHERE doctorId = ? AND leaveDate = ?`)
    .get(doctor.id, date);

  const booked = db
    .prepare(
      `SELECT time FROM appointments WHERE doctorId = ? AND date = ? AND status IN ('Confirmed','Completed')`
    )
    .all(doctor.id, date)
    .map((r) => r.time);

  const bookedSet = new Set(booked);
  const slots = generateAllSlots(doctor).map((time) => ({
    time,
    available: !onLeave && !bookedSet.has(time),
  }));

  return { slots, onLeave: !!onLeave };
}

function isSlotAvailable(doctor, date, time) {
  const { slots } = getAvailability(doctor, date);
  const match = slots.find((s) => s.time === time);
  return !!match && match.available;
}

module.exports = { generateAllSlots, getAvailability, isSlotAvailable, parseWorkingHours };
