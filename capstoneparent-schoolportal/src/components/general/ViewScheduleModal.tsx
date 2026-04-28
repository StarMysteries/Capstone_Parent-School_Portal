import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleUrl?: string;
  className?: string;
}

export const ViewScheduleModal = ({
  isOpen,
  onClose,
  scheduleUrl,
  className = "N/A",
}: ViewScheduleModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl border-none bg-[#FFFACD] p-0 gap-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Class Schedule - {className}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="h-8 w-8 font-bold" strokeWidth={3} />
            </button>
          </div>
          <DialogDescription className="text-gray-600">
            View the official class schedule for this section.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col items-center">
          {scheduleUrl ? (
            <div className="w-full space-y-4">
              <div className="relative group mx-auto w-full flex justify-center bg-white/50 rounded-lg border-2 border-dashed border-gray-300 p-4">
                <img
                  src={scheduleUrl}
                  alt={`Class Schedule - ${className}`}
                  className="max-h-[60vh] w-auto rounded-lg shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.01] object-contain cursor-pointer"
                  onClick={() => window.open(scheduleUrl, "_blank")}
                  title="Click to enlarge"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    Click to enlarge
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => window.open(scheduleUrl, "_blank")}
                  className="bg-(--button-green) hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
              <p className="text-center text-xs text-gray-500 italic">
                The image will open in a new tab for a high-resolution view.
              </p>
            </div>
          ) : (
            <div className="w-full py-16 text-center bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg italic">
                Class schedule picture has not been uploaded yet.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Use the "Upload Class Schedule Picture" button to add one.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
