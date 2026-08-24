import { CalendarDays, Clock3, Pill, UserRound } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import { appointments } from "../../data/mockData";

export default function Dashboard() {
  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">Patient portal</span><h1>Good morning, Naman</h1><p>Here’s what’s happening with your care.</p></div>
        <button className="btn btn-primary">+ Book appointment</button>
      </div>

      <div className="stats-grid">
        <StatCard icon={CalendarDays} label="Upcoming" value="2" helper="Next on Aug 28" />
        <StatCard icon={Clock3} label="Next appointment" value="10:30 AM" helper="Dr. Ananya Sharma" />
        <StatCard icon={Pill} label="Medication reminders" value="3" helper="Today" />
        <StatCard icon={UserRound} label="Saved doctors" value="4" helper="Across 3 specialties" />
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Upcoming appointments</h2><p className="muted">Your next consultations</p></div><a href="/patient/appointments">View all</a></div>
          {appointments.filter(a => a.type === "Upcoming").map(a => (
            <div className="appointment-row" key={a.id}>
              <div className="date-box"><strong>{a.date.split(" ")[1].replace(",", "")}</strong><span>{a.date.split(" ")[0]}</span></div>
              <div className="appointment-info"><strong>{a.doctor}</strong><span>{a.specialty} · {a.time}</span></div>
              <Badge tone="success">{a.status}</Badge>
            </div>
          ))}
        </section>

        <section className="panel ai-panel">
          <div className="ai-icon">✦</div>
          <span className="eyebrow">AI pre-visit summary</span>
          <h2>Ready for your next visit?</h2>
          <p>Share symptoms before your appointment so your doctor can review a concise, urgency-based summary.</p>
          <button className="btn btn-secondary">Add symptoms</button>
        </section>
      </div>
    </>
  );
}