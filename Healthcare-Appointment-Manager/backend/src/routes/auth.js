const express = require("express");
const router = express.Router();

// This mirrors the frontend demo: no real authentication, just a role selection
// that returns a display name for the session. Replace with real auth (JWT/OAuth/
// session-based) before using this in production.
const ROLE_NAMES = {
  patient: "Naman",
  doctor: "Doctor portal",
  admin: "Admin portal",
};

router.post("/login", (req, res) => {
  const { role } = req.body;
  if (!["patient", "doctor", "admin"].includes(role)) {
    return res.status(400).json({ error: "role must be one of: patient, doctor, admin" });
  }
  res.json({
    token: `demo-token-${role}-${Date.now()}`,
    user: { role, name: ROLE_NAMES[role] },
  });
});

module.exports = router;
