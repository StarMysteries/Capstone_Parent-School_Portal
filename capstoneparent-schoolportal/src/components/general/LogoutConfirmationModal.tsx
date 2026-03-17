import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmLogout,
  isLoading = false,
}: LogoutConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
      <div className="space-y-6">
        <p className="text-base text-gray-900">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-11 rounded-full bg-gray-500 px-6 text-base font-semibold text-white hover:bg-gray-600 disabled:opacity-60"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirmLogout}
            disabled={isLoading}
            className="h-11 rounded-full bg-red-600 px-6 text-base font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading ? "Logging out…" : "Yes, Logout"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
