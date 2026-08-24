/**
 * AI generation for pre-visit briefs and post-visit patient summaries.
 *
 * If ANTHROPIC_API_KEY is set, real calls are made to the Anthropic Messages API
 * and the model is asked to return strict JSON. Otherwise this falls back to the
 * same deterministic mock logic the original frontend demo used, so the app is
 * fully functional out of the box with zero configuration.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 700,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text content returned from Anthropic API");

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

function ruleBasedUrgency(symptoms) {
  const s = symptoms.toLowerCase();
  const highSignals = ["chest pain", "severe", "can't breathe", "cannot breathe", "shortness of breath", "unconscious", "bleeding heavily", "stroke", "seizure"];
  const mediumSignals = ["fever", "persistent", "worsening", "chest tightness", "dizziness", "vomiting", "infection"];
  if (highSignals.some((k) => s.includes(k))) return "High";
  if (mediumSignals.some((k) => s.includes(k))) return "Medium";
  return "Low";
}

function mockPrevisit(symptoms) {
  const chiefComplaint = symptoms.split(".")[0].trim().slice(0, 60) || "General consultation";
  return {
    urgency: ruleBasedUrgency(symptoms),
    chiefComplaint,
    questions: [
      "When did the symptoms first begin?",
      "Have you tried anything that helped so far?",
      "Any relevant medical history the doctor should know?",
    ],
  };
}

function mockPostvisit({ chiefComplaint, notes, prescription }) {
  const rxList = (prescription || []).map((r) => `${r.medicine} ${r.dosage}, ${r.frequency}`).join("; ");
  return {
    summary: `Based on today's visit for "${(chiefComplaint || "your visit").toLowerCase()}", your doctor's notes have been translated into plain language: ${notes || "the visit went as expected and no urgent concerns were found."}`,
    medication: rxList || "No new medication prescribed.",
    followUp: "Return if symptoms worsen or don't improve within two weeks.",
  };
}

async function generatePrevisit(symptoms) {
  if (!ANTHROPIC_API_KEY) return mockPrevisit(symptoms);

  try {
    const system = `You are a clinical intake assistant. Given a patient's self-reported symptoms, return STRICT JSON only (no markdown, no preamble) with this exact shape:
{"urgency": "Low" | "Medium" | "High", "chiefComplaint": "short phrase, max 60 chars", "questions": ["3 short follow-up questions a doctor should ask"]}`;
    const user = `Patient reported symptoms: """${symptoms}"""`;
    const result = await callClaude(system, user);
    if (!["Low", "Medium", "High"].includes(result.urgency)) throw new Error("invalid urgency");
    return result;
  } catch (err) {
    console.error("[aiService] generatePrevisit fell back to mock:", err.message);
    return mockPrevisit(symptoms);
  }
}

async function generatePostvisit({ chiefComplaint, symptoms, notes, prescription }) {
  if (!ANTHROPIC_API_KEY) return mockPostvisit({ chiefComplaint, notes, prescription });

  try {
    const system = `You are a patient communications assistant. Translate a doctor's clinical notes into a warm, plain-language summary for the patient. Return STRICT JSON only (no markdown, no preamble) with this exact shape:
{"summary": "2-3 plain-language sentences", "medication": "1 sentence describing medication and dosage, or 'No new medication prescribed.'", "followUp": "1 short sentence on when to seek further care"}`;
    const user = `Chief complaint: ${chiefComplaint || "N/A"}
Patient-reported symptoms: ${symptoms || "N/A"}
Doctor's clinical notes: ${notes || "N/A"}
Prescription: ${JSON.stringify(prescription || [])}`;
    return await callClaude(system, user);
  } catch (err) {
    console.error("[aiService] generatePostvisit fell back to mock:", err.message);
    return mockPostvisit({ chiefComplaint, notes, prescription });
  }
}

module.exports = { generatePrevisit, generatePostvisit };
