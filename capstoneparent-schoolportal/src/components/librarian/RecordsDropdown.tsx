export const RecordsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10">
      <a
        href="/managebooks"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Books
      </a>
      <a
        href="/managelearningresources"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Learning Resources
      </a>
      <a
        href="/borrowedresources"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Borrowed Resources
        </a>
      <a
        href="/managecategories"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Categories
      </a>
    </div>
  );
};