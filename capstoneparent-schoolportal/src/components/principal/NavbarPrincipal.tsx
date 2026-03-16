import { AuthenticatedNavbar } from "@/components/general/AuthenticatedNavbar";

export const NavbarPrincipal = () => {
  return (
    <AuthenticatedNavbar
      announcementPath="/announcements"
      announcementActivePaths={[
        "/announcements",
        "/generalannouncement",
        "/staffannouncement",
        "/memorandumannouncement",
      ]}
      recordsItems={[
        { label: "Manage Class Lists", to: "/manageclasslists" },
        { label: "Manage Sections", to: "/managesections" },
      ]}
      recordsActivePaths={["/manageclasslists", "/managesections"]}
      sticky
    />
  );
};
