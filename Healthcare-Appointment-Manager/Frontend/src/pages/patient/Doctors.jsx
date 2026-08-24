import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../../components/common/DoctorCard";
import { doctors } from "../../data/mockData";

export default function Doctors() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Patient portal</span><h1>Find a doctor</h1><p>Browse specialists and choose a convenient slot.</p></div></div>
      <div className="searchbar"><Search size={18}/><input placeholder="Search doctor or specialty..." /><select><option>All specialties</option><option>General Physician</option><option>Cardiologist</option><option>Dermatologist</option></select></div>
      <div className="doctor-grid">
        {doctors.map(d => <DoctorCard key={d.id} doctor={d} onBook={() => navigate(`/patient/book?doctor=${d.id}`)} />)}
      </div>
    </>
  );
}