export const RecordsDropdown = () => {
  return (
    <div className="absolute mt-2 w-48 bg-(--navbar-bg) border border-gray-200 rounded-md shadow-lg z-10">
      <a
        href="/managestaffaccounts"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Staff Accounts
      </a>
      <a
        href="/managestudents"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Students
      </a>
      <a
        href="/manageparentverification"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Parent Verification
      </a>
      <a
        href="/managesections"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Manage Sections
      </a>
    </div>
  );
};