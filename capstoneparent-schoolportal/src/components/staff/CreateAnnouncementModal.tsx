import { useEffect, useState } from "react";
import { FileText, Trash2, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AnnouncementCategory = "general" | "staffs" | "memorandum";

interface UploadedFile {
  id: string;
  name: string;
  file: File;
}

interface AnnouncementData {
  title: string;
  content: string;
  category: AnnouncementCategory;
  files: UploadedFile[];
}

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: AnnouncementData) => void;
  defaultCategory?: AnnouncementCategory;
}

export const CreateAnnouncementModal = ({
  isOpen,
  onClose,
  onCreate,
  defaultCategory = "general",
}: CreateAnnouncementModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("general");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setCategory(defaultCategory);
    setError(null);
    setSubmitting(false);
    setTitle("");
    setContent("");
    setFiles([]);
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    Array.from(uploadedFiles).forEach((file) => {
      setFiles((prev) => [
        ...prev,
        { id: Math.random().toString(), name: file.name, file },
      ]);
    });
    // allow re-upload of same file names
    e.target.value = "";
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;
    Array.from(droppedFiles).forEach((file) => {
      setFiles((prev) => [
        ...prev,
        { id: Math.random().toString(), name: file.name, file },
      ]);
    });
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePost = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setSubmitting(true);
    try {
      const data: AnnouncementData = {
        title: title.trim(),
        content: content.trim(),
        category,
        files,
      };

      await Promise.resolve();
      onCreate(data);
      onClose();
    } catch {
      setError("Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-[#fff7b0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 sticky top-0 border-b border-yellow-200 bg-[#fff7b0]">
          <h2 className="text-3xl font-bold text-black">Create Announcement</h2>
          <button
            onClick={onClose}
            aria-label="Close create announcement modal"
            className="text-red-600 hover:text-red-800 transition-colors text-4xl font-bold"
          >
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Enter announcement title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 bg-[#fff7b0] text-lg placeholder:text-gray-600 focus:outline-none focus:border-yellow-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the announcement details..."
            className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 bg-[#fff7b0] min-h-[220px] resize-none text-base placeholder:text-gray-600 focus:outline-none focus:border-yellow-500"
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            className="border-2 border-dashed border-yellow-400 rounded-lg p-5 bg-[#fff7b0] text-left"
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">File Upload</p>
                <p className="text-xs text-gray-500">Multiple files can be uploaded here</p>
              </div>
              <label
                htmlFor="create-announcement-file-input"
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-yellow-500 bg-yellow-300 cursor-pointer font-semibold text-sm text-black hover:bg-yellow-400"
              >
                <Upload size={16} />
                Choose
              </label>
              <input
                id="create-announcement-file-input"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* File preview list should only show after upload */}
          {files.length > 0 && (
            <div className="bg-white rounded-lg p-4 space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-4 border border-gray-200 rounded p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="text-red-500 shrink-0" />
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
              <SelectTrigger className="w-52 bg-yellow-400 text-black font-semibold border-0">
                <SelectValue placeholder="Announcement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="staffs">Staff</SelectItem>
                <SelectItem value="memorandum">Memorandum</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={handlePost}
              type="button"
              disabled={submitting}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-full font-semibold text-lg transition-colors disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
