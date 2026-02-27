import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";

export const Announcements = () => {
  return (
    <div className="text-center">
      <RoleAwareNavbar />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">Announcements Page</h1>
        <p>This is the Announcements page content.</p>
      </div>
    </div>
  );

}