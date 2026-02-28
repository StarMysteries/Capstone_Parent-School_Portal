import { useState } from "react";
import { X, Trash2, Upload } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
}

export const EditAnnouncementModal = ({
  isOpen,
  onClose,
}: EditAnnouncementModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [announcementType, setAnnouncementType] = useState("general");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file) => {
        setFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            name: file.name,
          },
        ]);
      });
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      Array.from(droppedFiles).forEach((file) => {
        setFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            name: file.name,
          },
        ]);
      });
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePost = () => {
    // TODO: handle post announcement
    console.log({
      title,
      content,
      files,
      announcementType,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-yellow-100 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 sticky top-0 bg-yellow-100 border-b border-yellow-200">
          <h2 className="text-3xl font-bold text-black">Edit Announcement</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 transition-colors text-4xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter announcement title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
          />

          {/* Toolbar */}
          <div className="flex gap-1 bg-white border border-gray-300 rounded-lg p-2">
            <button className="px-3 py-1 font-bold hover:bg-gray-100 rounded">
              B
            </button>
            <button className="px-3 py-1 italic hover:bg-gray-100 rounded">
              I
            </button>
            <button className="px-3 py-1 underline hover:bg-gray-100 rounded">
              U
            </button>
            <button className="px-3 py-1 line-through hover:bg-gray-100 rounded">
              S
            </button>
            <div className="border-l border-gray-300" />
            <button className="px-3 py-1 hover:bg-gray-100 rounded">≡</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">≡</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">⋯</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">≣</button>
            <div className="border-l border-gray-300" />
            <button className="px-3 py-1 hover:bg-gray-100 rounded">🔗</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">↶</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">↷</button>
          </div>

          {/* Content Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 min-h-[150px] resize-none text-base"
            placeholder="Enter announcement content..."
          />

          {/* File Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center"
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="text-blue-600 hover:underline">Browse files</span>
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 bg-white rounded-lg p-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded"
                >
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-4">
            <Select value={announcementType} onValueChange={setAnnouncementType}>
              <SelectTrigger className="w-48 bg-yellow-400 text-black font-semibold border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="memorandum">Memorandum</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={handlePost}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
