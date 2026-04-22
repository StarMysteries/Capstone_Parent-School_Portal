import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmUploadModal } from './ConfirmUploadModal';

interface ClassScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScheduleUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  classLabel?: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 15;

export const ClassScheduleModal = ({
  isOpen,
  onClose,
  currentScheduleUrl,
  onUpload,
  classLabel,
}: ClassScheduleModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Controls the confirmation dialog visibility
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when it changes
  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  // Reset internal state whenever the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setError(null);
      setIsUploading(false);
      setShowConfirm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setSelectedFile(file);
  };

  // Step 1: Upload button click → open confirmation dialog
  const handleUploadClick = () => {
    if (!selectedFile) return;
    setShowConfirm(true);
  };

  // Step 2: User confirmed → perform actual upload
  const handleConfirmedUpload = async () => {
    if (!selectedFile) return;
    setShowConfirm(false);
    setIsUploading(true);
    setError(null);
    try {
      await onUpload(selectedFile);
      // Clear the file picker — the updated image will arrive via the
      // refreshed `currentScheduleUrl` prop from the parent's state update.
      setSelectedFile(null);
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2 (cancel): close confirm dialog, stay on upload modal
  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Class Schedule</h2>
              {classLabel && (
                <p className="text-sm text-gray-500 mt-0.5">{classLabel}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* ── Current Schedule ── */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Current Schedule
              </h3>
              {currentScheduleUrl ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <img
                    src={currentScheduleUrl}
                    alt="Current class schedule"
                    className="mx-auto block max-h-64 w-auto rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(currentScheduleUrl, '_blank')}
                    title="Click to open full size"
                  />
                  <a
                    href={currentScheduleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-green-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open full size
                  </a>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
                  <Image className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 italic">No schedule uploaded yet</p>
                </div>
              )}
            </div>

            {/* ── Upload / Replace ── */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {currentScheduleUrl ? 'Replace Schedule' : 'Upload Schedule'}
              </h3>

              {/* Drop zone / file picker */}
              <div
                className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {localPreviewUrl ? (
                  <>
                    <img
                      src={localPreviewUrl}
                      alt="New schedule preview"
                      className="mx-auto max-h-48 object-contain rounded-md"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Click to choose a different file
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Click to select an image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {selectedFile && (
                <p className="mt-2 text-xs text-gray-500 truncate">
                  Selected:{' '}
                  <span className="font-medium text-gray-700">{selectedFile.name}</span>
                </p>
              )}
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
            <Button
              className="bg-(--status-denied) text-white"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Close
            </Button>
            {/* Now opens confirmation dialog instead of uploading directly */}
            <Button
              type="button"
              className="bg-(--button-green) hover:bg-green-700 text-white"
              onClick={handleUploadClick}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {currentScheduleUrl ? 'Replace Schedule' : 'Upload Schedule'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog — z-[60] sits above this modal's z-50 */}
      <ConfirmUploadModal
        isOpen={showConfirm}
        title={currentScheduleUrl ? 'Replace Schedule' : 'Upload Schedule'}
        message={
          currentScheduleUrl
            ? `Replace the current schedule with "${selectedFile?.name}"? The existing schedule image will be overwritten.`
            : `Upload "${selectedFile?.name}" as the class schedule?`
        }
        onConfirm={handleConfirmedUpload}
        onCancel={handleCancelConfirm}
      />
    </>
  );
};