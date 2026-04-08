import { Link } from "react-router-dom";

export const AboutUsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10">
      <Link
        to="/contactus"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Contact Us
      </Link>
      <Link
        to="/history"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        History
      </Link>
      <Link
        to="/orginizationalchart"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Orginizational Chart
      </Link>
      <Link
        to="/schoolcalendar"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        School Calendar
      </Link>
      <Link
        to="/transparency"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Transparency
      </Link>
      <Link
        to="/visionandmission"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Vision & Mission
      </Link>
    </div>
  );
};
