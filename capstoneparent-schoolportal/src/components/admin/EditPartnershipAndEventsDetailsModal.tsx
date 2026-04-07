import {
  EditPartnershipAndEventsModal,
  type PartnershipEventFormData,
} from "@/components/admin/EditPartnershipAndEventsModal";
import type { PartnershipEventItem } from "@/lib/partnershipEvents";

interface EditPartnershipAndEventsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: PartnershipEventItem;
  onSave: (event: PartnershipEventItem) => void | Promise<void>;
  isLoading?: boolean;
}

export const EditPartnershipAndEventsDetailsModal = ({
  isOpen,
  onClose,
  event,
  onSave,
  isLoading = false,
}: EditPartnershipAndEventsDetailsModalProps) => {
  const initialData: PartnershipEventFormData = {
    ...event,
    imageFileName: event.imageFileName,
    imageFile: event.imageFile,
  };

  return (
    <EditPartnershipAndEventsModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={initialData}
      onSave={onSave}
      isLoading={isLoading}
    />
  );
};
