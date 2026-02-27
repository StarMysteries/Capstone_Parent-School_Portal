import { NavbarStaff } from "@/components/staff/NavbarStaff"
import { AnnouncementNavbar } from "@/components/staff/AnnouncementNavbar"




export const StaffAnnouncement = () => {
  return (
    <div className="text-center">
      <NavbarStaff />
      <AnnouncementNavbar />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">Staff Announcements</h1>
        <p>This is the Staff-only announcement page.</p>
      </div>
    </div>
  )
}