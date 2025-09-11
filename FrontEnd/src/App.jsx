// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';

// Auth Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';

// Patient Pages
import PatientHome from './pages/patient/Home';
import PatientProfile from './pages/patient/Profile';
import PatientAppointments from './pages/patient/Appointments';

// Doctor Pages
import DoctorHome from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorAppointments from './pages/doctor/Appointments';

// Staff Pages
import StaffHome from './pages/staff/Home';
import StaffProfile from './pages/staff/Profile';
import StaffAppointments from './pages/staff/Appointments';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Patient Routes */}
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorHome />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />

        {/* Staff Routes */}
        <Route path="/staff/home" element={<StaffHome />} />
        <Route path="/staff/profile" element={<StaffProfile />} />
        <Route path="/staff/appointments" element={<StaffAppointments />} />

        {/* 404 Not Found - Optional */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}