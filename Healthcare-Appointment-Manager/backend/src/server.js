require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("./db/init"); // ensures schema exists before routes load
const seed = require("./db/seed");
const db = require("./db/init");

const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const adminRoutes = require("./routes/admin");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "followup-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

// Auto-seed on first run if the doctors table is empty, so the API is usable immediately.
const doctorCount = db.prepare(`SELECT COUNT(*) AS c FROM doctors`).get().c;
if (doctorCount === 0) {
  console.log("No doctors found — seeding initial demo data...");
  seed();
}

app.listen(PORT, () => {
  console.log(`Follow&Up backend listening on http://localhost:${PORT}`);
  console.log(`AI mode: ${process.env.ANTHROPIC_API_KEY ? "live (Anthropic API)" : "mock (deterministic fallback)"}`);
});
