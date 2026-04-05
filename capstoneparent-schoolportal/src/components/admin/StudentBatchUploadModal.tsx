import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface StudentBatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export const StudentBatchUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
}: StudentBatchUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const resetState = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    resetState();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);
      setError("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose a CSV file to upload.");
      return;
    }

    setError("");

    try {
      await onUpload(selectedFile);
      resetState();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload student CSV.",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Batch Add Students">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Upload a student list CSV. The file should include a{" "}
          <strong>Grade Level</strong> column using Kindergarten or Grade 1 to
          Grade 6.
        </p>

        <div className="rounded-md border-2 border-dashed border-black bg-white p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full rounded-md border border-gray-300 bg-gray-100 text-black hover:bg-gray-200"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select CSV File
          </Button>

          <div className="mt-4 flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <FileText className="h-5 w-5 text-(--button-green)" />
            <span className="text-sm text-gray-700">
              {selectedFile ? selectedFile.name : "No file selected"}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="rounded-full bg-(--button-green) px-8 py-3 text-lg text-white hover:bg-(--button-hover-green)"
          >
            {isUploading ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
