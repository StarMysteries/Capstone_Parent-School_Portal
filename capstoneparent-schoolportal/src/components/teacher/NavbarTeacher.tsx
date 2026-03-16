import { AuthenticatedNavbar } from "@/components/general/AuthenticatedNavbar";

export const NavbarTeacher = () => {
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
        { label: "Class Lists", to: "/classlist" },
        { label: "Manage Parent Verification", to: "/manageparentverification" },
        { label: "Manage Students", to: "/managestudents" },
      ]}
      recordsActivePaths={[
        "/classlist",
        "/manageparentverification",
        "/managestudents",
      ]}
      sticky
    />
  );
};
