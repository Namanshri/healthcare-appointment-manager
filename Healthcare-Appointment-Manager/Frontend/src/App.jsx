import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import PatientDashboard from "./pages/patient/Dashboard";
import Doctors from "./pages/patient/Doctors";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import AdminDashboard from "./pages/admin/Dashboard";
import DoctorManagement from "./pages/admin/Doctors";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/patient" element={<AppLayout role="patient" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
      </Route>

      <Route path="/doctor" element={<AppLayout role="doctor" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
      </Route>

      <Route path="/admin" element={<AppLayout role="admin" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<DoctorManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
    </Routes>
  );
}