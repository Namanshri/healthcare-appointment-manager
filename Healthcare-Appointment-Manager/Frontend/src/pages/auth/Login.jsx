import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const loginAs = (role) => navigate(`/${role}/dashboard`);

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div className="brand large">
          <div className="brand-mark"><Activity size={24} /></div>
          <div><strong>CareFlow</strong><small>Healthcare manager</small></div>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">One connected healthcare workspace</span>
          <h1>Appointments that feel simple.</h1>
          <p>Manage consultations, follow-ups, AI summaries and reminders from one place.</p>
        </div>
        <div className="security-note"><ShieldCheck size={18} /> Role-based access & secure workflows</div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to CareFlow</h2>
          <p className="muted">Choose a portal to preview the frontend.</p>

          <label>Email<input defaultValue="naman@example.com" /></label>
          <label>Password<input type="password" defaultValue="password" /></label>
          <button className="btn btn-primary full" onClick={() => loginAs("patient")}>
            Sign in <ArrowRight size={17} />
          </button>

          <div className="divider"><span>Preview portals</span></div>
          <div className="portal-buttons">
            <button onClick={() => loginAs("patient")}>Patient</button>
            <button onClick={() => loginAs("doctor")}>Doctor</button>
            <button onClick={() => loginAs("admin")}>Admin</button>
          </div>
        </div>
      </section>
    </div>
  );
}