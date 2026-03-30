import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { TransparencyContent } from "@/lib/transparencyContent";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EditTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: TransparencyContent;
  onSave: (content: TransparencyContent) => void;
}

function getReadableFileName(content: TransparencyContent): string {
  if (content.fileName) {
    return content.fileName;
  }

  if (content.imageUrl.startsWith("data:")) {
    return "transparency-image.png";
  }

  const filePart = content.imageUrl.split("/").pop();
  return filePart || "transparency-image.png";
}

export const EditTransparencyModal = ({
  isOpen,
  onClose,
  initialContent,
  onSave,
}: EditTransparencyModalProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState(initialContent.imageUrl);
  const [fileName, setFileName] = useState(getReadableFileName(initialContent));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreviewImageUrl(initialContent.imageUrl);
    setFileName(getReadableFileName(initialContent));
  }, [initialContent]);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPreviewImageUrl(result);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      imageUrl: previewImageUrl || initialContent.imageUrl,
      fileName,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Transparency"
      contentClassName="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-semibold">Old Transparency Picture</h3>
          <p className="text-lg">{fileName}</p>
        </div>

        <div className="mx-auto max-h-[40vh] overflow-hidden rounded-md border-2 border-black/20 bg-white">
          <img
            src={previewImageUrl}
            alt="Transparency file preview"
            className="max-h-[40vh] w-full object-contain"
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleUploadClick}
            className="h-auto rounded-md bg-(--navbar-bg) px-8 py-3 text-lg font-medium text-black hover:bg-yellow-300"
          >
            Upload New Transparency Picture
            <Plus className="ml-2 h-6 w-6 text-black" strokeWidth={3} />
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};