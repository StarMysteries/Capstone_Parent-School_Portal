export const AboutUsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-[#d4d433] border border-gray-200 rounded-md shadow-lg z-10">
      <a
        href="/about/history"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Our History
      </a>
      <a
        href="/about/mission-vision"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Mission & Vision
      </a>
      <a
        href="/about/team"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Our Team
      </a>
    </div>
  );
};
