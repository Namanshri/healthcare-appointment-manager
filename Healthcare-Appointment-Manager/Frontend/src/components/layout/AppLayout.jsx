import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity, CalendarDays, ClipboardList, LayoutDashboard, LogOut,
  Settings, Stethoscope, Users, UserRound
} from "lucide-react";

const nav = {
  patient: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["doctors", "Find a doctor", Stethoscope],
    ["appointments", "My appointments", CalendarDays]
  ],
  doctor: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["appointments", "Appointments", ClipboardList]
  ],
  admin: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["doctors", "Doctors", Users]
  ]
};

const labels = { patient: "Patient Portal", doctor: "Doctor Portal", admin: "Admin Portal" };

export default function AppLayout({ role }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={21} /></div>
          <div><strong>CareFlow</strong><small>Healthcare manager</small></div>
        </div>

        <div className="portal-label">{labels[role]}</div>

        <nav className="nav">
          {nav[role].map(([path, label, Icon]) => (
            <NavLink key={path} to={`/${role}/${path}`} className="nav-link">
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink className="nav-link" to={`/${role}/settings`}>
            <Settings size={18} /> Settings
          </NavLink>
          <button className="nav-link logout" onClick={() => navigate("/login")}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Healthcare Appointment Manager</span>
          </div>
          <div className="profile-chip">
            <div className="mini-avatar">NS</div>
            <div><strong>Naman</strong><span>{role}</span></div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}