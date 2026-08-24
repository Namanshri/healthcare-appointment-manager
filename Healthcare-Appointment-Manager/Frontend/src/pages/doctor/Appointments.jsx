import { Sparkles } from "lucide-react";
import Badge from "../../components/common/Badge";

export default function Appointments() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Doctor portal</span><h1>Appointment details</h1><p>Review patient context before the consultation.</p></div></div>
      <div className="detail-layout">
        <section className="panel">
          <div className="detail-header"><div className="doctor-avatar">NS</div><div><h2>Naman Shrivastava</h2><p className="muted">Aug 28, 2026 · 10:30 AM</p></div><Badge tone="success">Confirmed</Badge></div>
          <hr/>
          <h3>Patient symptoms</h3>
          <p className="symptom-box">Fever for two days with headache and mild fatigue. No breathing difficulty reported.</p>
          <h3>Post-visit notes</h3>
          <textarea rows="7" placeholder="Add clinical notes..." />
          <button className="btn btn-primary">Save notes</button>
        </section>
        <aside className="panel ai-card">
          <div className="ai-icon"><Sparkles size={20}/></div><span className="eyebrow">AI pre-visit summary</span>
          <h2>Medium urgency</h2>
          <p className="muted">Likely acute febrile illness. Review duration, temperature and associated symptoms.</p>
          <h3>Questions to consider</h3>
          <ol><li>What was the highest recorded temperature?</li><li>Any recent travel or sick contacts?</li><li>Any nausea, cough or body aches?</li></ol>
        </aside>
      </div>
    </>
  );
}