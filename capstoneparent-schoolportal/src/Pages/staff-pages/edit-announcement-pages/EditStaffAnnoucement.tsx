import { useState } from "react";
import { CreateAnnouncementModal } from "@/components/staff/CreateAnnouncementModal";
import { NavbarStaff } from "@/components/staff/NavbarStaff";
import { AnnouncementNavbar } from "@/components/staff/AnnouncementNavbar";
import { Button } from "@/components/ui/button";

export const EditStaffAnnouncement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = (data: { title: string; content: string; category: string }) => {
        console.log("New announcement created:", data);
        // TODO: Implement API call or state update to save the announcement
    };

    return (
        <div>
            <NavbarStaff />
            <AnnouncementNavbar />
            <div className="p-6">
                <Button onClick={() => setIsModalOpen(true)}>Add</Button>
            </div>
            <CreateAnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
};