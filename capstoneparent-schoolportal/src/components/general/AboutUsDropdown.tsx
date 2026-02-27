export const AboutUsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10">
      <a
        href="/contactus"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Contact Us
      </a>
      <a
        href="/history"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        History
      </a>
      <a
        href="/orginizationalchart"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Orginizational Chart
      </a>
      <a
        href="/schoolcalendar"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        School Calendar
      </a>
      <a
        href="/transparency"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Transparency
      </a>
      <a
        href="/visionandmission"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Vision & Mission
      </a>
    </div>
  );
};
