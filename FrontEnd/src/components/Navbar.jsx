// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar({ role }) {
  // Default to patient if no role provided
  const userRole = role || 'patient';

  let homeLink = `/${userRole}/home`;
  let appointmentsLink = `/${userRole}/appointments`;
  let profileLink = `/${userRole}/profile`;

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link to={homeLink}>Home</Link>
      </div>
      <div className="space-x-4">
        <Link to={appointmentsLink} className="text-gray-700 hover:text-blue-600">
          Appointments
        </Link>
        <Link to={profileLink} className="text-gray-700 hover:text-blue-600">
          Profile
        </Link>
      </div>
    </nav>
  );
}
