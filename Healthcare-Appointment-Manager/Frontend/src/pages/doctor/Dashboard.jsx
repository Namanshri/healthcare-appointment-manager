import { CalendarDays, ClipboardList, Clock3, Users } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";

export default function Dashboard() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Doctor portal</span><h1>Good morning, Dr. Sharma</h1><p>Review today's schedule and patient summaries.</p></div><button className="btn btn-secondary">Working hours</button></div>
      <div className="stats-grid">
        <StatCard icon={CalendarDays} label="Today's visits" value="8" helper="2 AI summaries ready" />
        <StatCard icon={Clock3} label="Next patient" value="10:30 AM" helper="In 35 minutes" />
        <StatCard icon={Users} label="This week" value="32" helper="4 rescheduled" />
        <StatCard icon={ClipboardList} label="Follow-ups" value="6" helper="Due this week" />
      </div>
      <section className="panel">
        <div className="panel-heading"><div><h2>Today's appointments</h2><p className="muted">Friday, August 28</p></div></div>
        {["10:30 AM","11:30 AM","02:00 PM","03:30 PM"].map((time,i)=>(
          <div className="appointment-row" key={time}>
            <div className="time-column">{time}</div>
            <div className="appointment-info"><strong>{["Naman Shrivastava","Aarav Patel","Meera Joshi","Kabir Shah"][i]}</strong><span>{["Fever, headache","Routine cardiac review","Skin irritation","Follow-up"][i]}</span></div>
            <Badge tone={i===0?"warning":"success"}>{i===0?"AI summary ready":"Confirmed"}</Badge>
            <button className="btn btn-ghost">Open</button>
          </div>
        ))}
      </section>
    </>
  );
}