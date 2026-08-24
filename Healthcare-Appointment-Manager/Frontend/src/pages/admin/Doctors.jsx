import Badge from "../../components/common/Badge";
import { doctors } from "../../data/mockData";

export default function Doctors() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Admin portal</span><h1>Doctor management</h1><p>Manage profiles, schedules, slots and leave.</p></div><button className="btn btn-primary">+ Add doctor</button></div>
      <section className="panel">
        <div className="table-head"><span>Doctor</span><span>Specialty</span><span>Slot duration</span><span>Status</span><span></span></div>
        {doctors.map(d=><div className="table-row" key={d.id}><div className="doctor-table"><div className="mini-avatar">{d.initials}</div><strong>{d.name}</strong></div><span>{d.specialty}</span><span>30 min</span><Badge tone="success">Active</Badge><button className="btn btn-ghost">Edit</button></div>)}
      </section>
    </>
  );
}