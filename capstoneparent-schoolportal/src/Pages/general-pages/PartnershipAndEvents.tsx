import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";

export const PartnershipAndEvents = () => {
  return (
    <div className="text-center">
      <RoleAwareNavbar />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">Partnership and Events Page</h1>
        <p>This is the partnership and events page content.</p>
      </div>
    </div>
  );
};