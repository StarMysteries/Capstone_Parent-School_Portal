import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useApiFeedbackStore } from "@/lib/store/apiFeedbackStore";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  onChangePassword,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess, clearFeedback } = useApiFeedbackStore();

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    clearFeedback();
  }, [isOpen, clearFeedback]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();
    setIsLoading(true);

    const result = await onChangePassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess(result.message || "Password changed successfully.");
    } else {
      showError(result.message || "Failed to change password.");
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="current-password"
            className="mb-2 block text-base font-semibold text-gray-900"
          >
            Current Password
          </label>
          <Input
            id="current-password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-11 rounded-md border border-gray-300 bg-white"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-base font-semibold text-gray-900"
          >
            New Password
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-11 rounded-md border border-gray-300 bg-white"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-base font-semibold text-gray-900"
          >
            Confirm New Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-11 rounded-md border border-gray-300 bg-white"
            disabled={isLoading}
          />
        </div>



        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-full bg-(--button-green) px-8 text-base font-semibold text-white hover:bg-(--button-hover-green) disabled:opacity-60"
          >
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
