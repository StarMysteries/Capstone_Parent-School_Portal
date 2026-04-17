interface AboutUsDropdownProps {
  isMobile?: boolean;
}

export const AboutUsDropdown = ({ isMobile = false }: AboutUsDropdownProps) => {
  return (
    <div
      className={isMobile ? "mt-2 w-full pl-4" : "absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10"}
    >
      <a
        href="/contactus"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        Contact Us
      </a>
      <a
        href="/history"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        History
      </a>
      <a
        href="/organizationalchart"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        Organizational Chart
      </a>
      <a
        href="/schoolcalendar"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        School Calendar
      </a>
      <a
        href="/transparency"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        Transparency
      </a>
      <a
        href="/visionandmission"
        className={isMobile ? "block py-2 text-lg font-normal text-gray-900 hover:text-gray-700" : "block px-4 py-2 text-gray-800 hover:bg-gray-100"}
      >
        Vision & Mission
      </a>
    </div>
  );
};
