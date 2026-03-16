import { AuthenticatedNavbar } from "@/components/general/AuthenticatedNavbar";

export const NavbarAdmin = () => {
  return (
    <AuthenticatedNavbar
      announcementPath="/generalannouncement"
      announcementActivePaths={[
        "/announcements",
        "/generalannouncement",
        "/staffannouncement",
        "/memorandumannouncement",
      ]}
      recordsItems={[
        { label: "Manage Parent Verification", to: "/manageparentverification" },
        { label: "Manage Sections", to: "/managesections" },
        { label: "Manage Staff Accounts", to: "/managestaffaccounts" },
        { label: "Manage Students", to: "/managestudents" },
      ]}
      recordsActivePaths={[
        "/manageparentverification",
        "/managesections",
        "/managestaffaccounts",
        "/managestudents",
      ]}
      logoAlt="Bayog Elementary National School Logo"
    />
  );
};
