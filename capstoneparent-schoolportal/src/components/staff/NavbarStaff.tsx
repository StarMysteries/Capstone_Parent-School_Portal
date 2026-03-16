import { AuthenticatedNavbar } from "@/components/general/AuthenticatedNavbar";

export const NavbarStaff = () => {
  return (
    <AuthenticatedNavbar
      announcementPath="/generalannouncement"
      announcementActivePaths={[
        "/generalannouncement",
        "/staffannouncement",
        "/memorandumannouncement",
      ]}
      recordsItems={[
        { label: "General Announcements", to: "/generalannouncement" },
        { label: "Staff Announcements", to: "/staffannouncement" },
        { label: "Memorandums", to: "/memorandumannouncement" },
        { label: "Staff Dashboard", to: "/staffview" },
      ]}
      recordsActivePaths={[
        "/staffview",
        "/generalannouncement",
        "/staffannouncement",
        "/memorandumannouncement",
      ]}
      logoAlt="Bayog Elementary National School Logo"
    />
  );
};