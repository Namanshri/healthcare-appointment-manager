import Badge from "../../components/common/Badge";
import { appointments } from "../../data/mockData";

export default function MyAppointments() {
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Patient portal</span><h1>My appointments</h1><p>Track upcoming and completed consultations.</p></div><button className="btn btn-primary">+ Book appointment</button></div>
      <div className="tabs"><button className="active">Upcoming (2)</button><button>Completed (1)</button><button>Cancelled</button></div>
      <section className="panel">
        {appointments.map(a => (
          <div className="appointment-large" key={a.id}>
            <div className="doctor-avatar">{a.doctor.split(" ").slice(1).map(x=>x[0]).join("").slice(0,2)}</div>
            <div className="appointment-info"><strong>{a.doctor}</strong><span>{a.specialty}</span><span>{a.date} · {a.time}</span></div>
            <Badge tone={a.status==="Completed"?"default":"success"}>{a.status}</Badge>
            <button className="btn btn-ghost">Details</button>
          </div>
        ))}
      </section>
    </>
  );
}