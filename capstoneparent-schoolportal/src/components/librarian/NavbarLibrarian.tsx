import { AuthenticatedNavbar } from "@/components/general/AuthenticatedNavbar";

export const NavbarLibrarian = () => {
  return (
    <AuthenticatedNavbar
      announcementPath="/announcements"
      announcementActivePaths={["/announcements"]}
      recordsItems={[
        { label: "Manage Books", to: "/managebooks" },
        { label: "Manage Learning Resources", to: "/managelearningresources" },
        { label: "Borrowed Resources", to: "/borrowedresources" },
        { label: "Manage Categories", to: "/managecategories" },
      ]}
      recordsActivePaths={[
        "/managebooks",
        "/managelearningresources",
        "/borrowedresources",
        "/managecategories",
      ]}
      logoAlt="Bayog Elementary National School Logo"
    />
  );
};
