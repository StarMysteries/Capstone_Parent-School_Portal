export const RecordsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10">
      <a
        href="/record1"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        record 1
      </a>
      <a
        href="/record2"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        record 2
      </a>
      <a
        href="/record3"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        record 3
        </a>
      <a
        href="/record4"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        record 4
      </a>
    </div>
  );
};