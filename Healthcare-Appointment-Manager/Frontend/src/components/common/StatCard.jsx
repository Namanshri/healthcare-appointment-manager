export default function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={20} /></div>
      <div>
        <p className="muted">{label}</p>
        <h3>{value}</h3>
        {helper && <p className="stat-helper">{helper}</p>}
      </div>
    </div>
  );
}