import { CalendarDays, Stethoscope, UserCheck, Users } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";

export default function Dashboard() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Admin portal</span><h1>System overview</h1><p>Manage doctors, availability and operational changes.</p></div><button className="btn btn-primary">+ Add doctor</button></div>
      <div className="stats-grid">
        <StatCard icon={Users} label="Total patients" value="1,284" helper="+8% this month" />
        <StatCard icon={Stethoscope} label="Active doctors" value="48" helper="6 specialties" />
        <StatCard icon={CalendarDays} label="Appointments" value="326" helper="This month" />
        <StatCard icon={UserCheck} label="Completion rate" value="94%" helper="Last 30 days" />
      </div>
      <div className="content-grid">
        <section className="panel"><div className="panel-heading"><div><h2>Recent changes</h2><p className="muted">System activity</p></div></div>
          {["Dr. Rahul Mehta updated working hours","Dr. Priya Kapoor added leave for Sep 4","3 appointments rescheduled"].map((x,i)=><div className="activity-row" key={x}><span className="activity-dot"></span><div><strong>{x}</strong><span>{i+1} hour{i?"s":""} ago</span></div></div>)}
        </section>
        <section className="panel"><div className="panel-heading"><div><h2>Operational alerts</h2><p className="muted">Needs attention</p></div></div>
          <div className="alert-row"><Badge tone="warning">2</Badge><div><strong>Leave conflicts</strong><span>Appointments need rescheduling</span></div></div>
          <div className="alert-row"><Badge tone="danger">1</Badge><div><strong>Email retry</strong><span>Notification delivery failed</span></div></div>
        </section>
      </div>
    </>
  );
}