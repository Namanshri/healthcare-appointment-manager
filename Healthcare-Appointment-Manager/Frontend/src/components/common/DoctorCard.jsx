import { CalendarDays, Clock, Star } from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  return (
    <article className="doctor-card">
      <div className="doctor-avatar">{doctor.initials}</div>
      <div className="doctor-main">
        <div className="row-between">
          <div>
            <h3>{doctor.name}</h3>
            <p className="muted">{doctor.specialty}</p>
          </div>
          <span className="rating"><Star size={14} fill="currentColor" /> 4.9</span>
        </div>
        <div className="doctor-meta">
          <span><Clock size={15} /> {doctor.experience}</span>
          <span><CalendarDays size={15} /> Next: Tomorrow</span>
          <strong>{doctor.fee}</strong>
        </div>
        <button className="btn btn-primary" onClick={() => onBook?.(doctor)}>
          Book appointment
        </button>
      </div>
    </article>
  );
}