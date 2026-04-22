import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmUploadModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmUploadModal = ({
  isOpen,
  title = 'Confirm Upload',
  message = 'Proceed with this action?',
  onConfirm,
  onCancel,
}: ConfirmUploadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-sm bg-white border-none shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle>
          {/* Added for accessibility - hidden description */}
          <DialogDescription className="sr-only">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 sm:justify-end">
          <Button
            className="bg-(--status-denied) text-white hover:bg-red-700"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-(--button-green) hover:bg-green-700 text-white"
            onClick={onConfirm}
          >
            Yes, Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};