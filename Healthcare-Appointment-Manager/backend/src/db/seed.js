const db = require("./init");

const doctors = [
  { id: "D101", name: "Dr. Meera Kapoor", specialization: "Cardiology", experience: 12, workingHours: "9:00–17:00", slotDuration: 30, rating: 4.8, bio: "Focuses on preventive cardiology and long-term rhythm management.", leaves: ["2026-08-30"] },
  { id: "D102", name: "Dr. Arjun Rao", specialization: "Dermatology", experience: 7, workingHours: "10:00–18:00", slotDuration: 20, rating: 4.6, bio: "Treats chronic skin conditions with a conservative, evidence-first approach.", leaves: [] },
  { id: "D103", name: "Dr. Sana Iyer", specialization: "Pediatrics", experience: 15, workingHours: "9:30–16:30", slotDuration: 20, rating: 4.9, bio: "Fifteen years in pediatric primary care, calm with anxious first visits.", leaves: [] },
  { id: "D104", name: "Dr. Faisal Ahmed", specialization: "General Medicine", experience: 9, workingHours: "8:00–15:00", slotDuration: 15, rating: 4.5, bio: "General practice with a focus on chronic disease follow-up.", leaves: [] },
  { id: "D105", name: "Dr. Priya Nair", specialization: "Orthopedics", experience: 11, workingHours: "11:00–19:00", slotDuration: 30, rating: 4.7, bio: "Sports injuries and post-operative recovery planning.", leaves: [] },
];

const appointments = [
  {
    id: "A2001", doctorId: "D101", patientName: "Naman", date: "2026-08-25", time: "10:00",
    status: "Confirmed", symptoms: "Occasional chest tightness during exercise, resolves with rest.",
    previsitUrgency: "Medium",
    previsitChiefComplaint: "Exertional chest tightness",
    previsitQuestions: [
      "How long does the tightness last once exercise stops?",
      "Any family history of coronary artery disease?",
      "Has this changed in frequency over the past month?",
    ],
    postVisitNotes: "", prescription: [],
    postvisitSummary: null, postvisitMedication: null, postvisitFollowUp: null,
  },
  {
    id: "A2002", doctorId: "D103", patientName: "Naman", date: "2026-08-20", time: "11:20",
    status: "Completed", symptoms: "Follow-up for seasonal allergy management.",
    previsitUrgency: "Low",
    previsitChiefComplaint: "Seasonal allergy follow-up",
    previsitQuestions: [
      "Are current antihistamines controlling symptoms?",
      "Any new triggers since the last visit?",
      "Any side effects from the current regimen?",
    ],
    postVisitNotes: "Symptoms well controlled. Continue current regimen through the season.",
    prescription: [{ medicine: "Cetirizine", dosage: "10mg", frequency: "Once daily", duration: "30 days" }],
    postvisitSummary: "Your allergy symptoms are under control. Keep taking your current allergy medicine once a day.",
    postvisitMedication: "Cetirizine 10mg, once daily, for 30 days.",
    postvisitFollowUp: "Check back in if symptoms return before the season ends.",
  },
];

function seed() {
  const insertDoctor = db.prepare(`
    INSERT OR REPLACE INTO doctors (id, name, specialization, experience, workingHours, slotDuration, rating, bio)
    VALUES (@id, @name, @specialization, @experience, @workingHours, @slotDuration, @rating, @bio)
  `);
  const insertLeave = db.prepare(`INSERT OR IGNORE INTO doctor_leaves (doctorId, leaveDate) VALUES (?, ?)`);
  const insertAppt = db.prepare(`
    INSERT OR REPLACE INTO appointments
      (id, doctorId, patientName, date, time, status, symptoms,
       previsitUrgency, previsitChiefComplaint, previsitQuestions,
       postVisitNotes, prescription, postvisitSummary, postvisitMedication, postvisitFollowUp,
       emailSent, calendarAdded)
    VALUES
      (@id, @doctorId, @patientName, @date, @time, @status, @symptoms,
       @previsitUrgency, @previsitChiefComplaint, @previsitQuestions,
       @postVisitNotes, @prescription, @postvisitSummary, @postvisitMedication, @postvisitFollowUp,
       1, 1)
  `);

  const txn = db.transaction(() => {
    for (const d of doctors) {
      insertDoctor.run(d);
      for (const leave of d.leaves) insertLeave.run(d.id, leave);
    }
    for (const a of appointments) {
      insertAppt.run({
        ...a,
        previsitQuestions: JSON.stringify(a.previsitQuestions),
        prescription: JSON.stringify(a.prescription),
      });
    }
  });

  txn();
  console.log(`Seeded ${doctors.length} doctors and ${appointments.length} appointments.`);
}

if (require.main === module) {
  seed();
}

module.exports = seed;
