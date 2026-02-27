import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { AnnouncementNavbar } from "@/components/staff/AnnouncementNavbar";
import { getAuthUser } from "@/lib/auth";

export const Announcements = () => {
  const authUser = getAuthUser();
  const normalizedRole = authUser?.role?.toLowerCase();
  const isStaffAnnouncementUser =
    normalizedRole === "admin" ||
    normalizedRole === "teacher" ||
    normalizedRole === "librarian" ||
    normalizedRole === "staff" ||
    normalizedRole === "principal";

  return (
    <div className="text-center">
      <RoleAwareNavbar />
      {isStaffAnnouncementUser && <AnnouncementNavbar />}
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">General Announcements</h1>
        <p>This is the General announcement page.</p>
      </div>
    </div>
  );

}