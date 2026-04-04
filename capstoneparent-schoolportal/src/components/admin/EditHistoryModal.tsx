import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { HistoryContent } from "@/lib/historyContent";
import { useEffect, useState } from "react";

interface EditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: HistoryContent;
  onSave: (content: HistoryContent) => void;
}

export const EditHistoryModal = ({
  isOpen,
  onClose,
  initialContent,
  onSave,
}: EditHistoryModalProps) => {
  const [title, setTitle] = useState(initialContent.title);
  const [body, setBody] = useState(initialContent.body);

  useEffect(() => {
    setTitle(initialContent.title);
    setBody(initialContent.body);
  }, [initialContent]);

  const handleSave = () => {
    onSave({
      title,
      body,
      imageUrl: initialContent.imageUrl,
      imageFileName: initialContent.imageFileName,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit History"
      contentClassName="max-w-4xl"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="history-title" className="mb-2 block text-lg font-semibold">
            Title
          </label>
          <input
            id="history-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border-2 border-black px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          />
        </div>

        <div>
          <label htmlFor="history-body" className="mb-2 block text-lg font-semibold">
            History Content
          </label>
          <textarea
            id="history-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={10}
            className="w-full rounded-md border-2 border-black px-4 py-3 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          />
          <p className="mt-1 text-xs text-gray-600">
            Use a blank line to create a new paragraph.
          </p>
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