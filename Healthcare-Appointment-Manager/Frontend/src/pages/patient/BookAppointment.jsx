import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { doctors } from "../../data/mockData";

export default function BookAppointment() {
  const [selected, setSelected] = useState("10:30 AM");
  const [booked, setBooked] = useState(false);

  if (booked) return (
    <div className="success-state">
      <CheckCircle2 size={52}/>
      <h1>Appointment confirmed</h1>
      <p>Your appointment with Dr. Ananya Sharma is booked for Aug 28 at {selected}.</p>
      <button className="btn btn-primary" onClick={() => setBooked(false)}>Book another</button>
    </div>
  );

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Patient portal</span><h1>Book appointment</h1><p>Choose a doctor, slot and share your symptoms.</p></div></div>
      <div className="booking-layout">
        <section className="panel">
          <div className="doctor-summary"><div className="doctor-avatar">AS</div><div><h2>Dr. Ananya Sharma</h2><p className="muted">General Physician · ₹600</p></div></div>
          <h3>Select date</h3>
          <div className="date-options">{["Aug 28","Aug 29","Aug 30"].map((d,i)=><button className={`date-option ${i===0?"active":""}`} key={d}><CalendarDays size={16}/><strong>{d}</strong><span>{["Fri","Sat","Sun"][i]}</span></button>)}</div>
          <h3>Select time</h3>
          <div className="slot-grid">{["09:30 AM","10:30 AM","11:30 AM","02:00 PM","03:30 PM","05:00 PM"].map(t=><button key={t} className={`slot ${selected===t?"active":""}`} onClick={()=>setSelected(t)}><Clock3 size={15}/>{t}</button>)}</div>
          <label>Symptoms<textarea placeholder="Describe your symptoms..." rows="5" /></label>
          <div className="notice"><ShieldCheck size={18}/><span>Your information is securely handled. AI summary is optional and does not replace medical advice.</span></div>
        </section>

        <aside className="panel booking-summary">
          <span className="eyebrow">Booking summary</span>
          <h2>Aug 28, 2026</h2>
          <div className="summary-line"><span>Doctor</span><strong>Dr. Ananya Sharma</strong></div>
          <div className="summary-line"><span>Time</span><strong>{selected}</strong></div>
          <div className="summary-line"><span>Consultation</span><strong>₹600</strong></div>
          <button className="btn btn-primary full" onClick={()=>setBooked(true)}>Confirm appointment</button>
          <p className="tiny">A confirmation email and Google Calendar event will be created after booking.</p>
        </aside>
      </div>
    </>
  );
}