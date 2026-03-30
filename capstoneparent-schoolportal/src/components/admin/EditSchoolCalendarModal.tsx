import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { SchoolCalendarItem } from "@/lib/schoolCalendarContent";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface EditSchoolCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendars: SchoolCalendarItem[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onSave: (updatedCalendar: SchoolCalendarItem) => void;
}

function getReadableFileName(calendar: SchoolCalendarItem): string {
  if (calendar.fileName) {
    return calendar.fileName;
  }

  if (calendar.imageUrl.startsWith("data:")) {
    return `SchoolCalendar-${calendar.year}.png`;
  }

  const filePart = calendar.imageUrl.split("/").pop();
  return filePart || `SchoolCalendar-${calendar.year}.png`;
}

export const EditSchoolCalendarModal = ({
  isOpen,
  onClose,
  calendars,
  selectedYear,
  onSelectYear,
  onSave,
}: EditSchoolCalendarModalProps) => {
  const selectedCalendar = useMemo(
    () => calendars.find((calendar) => calendar.year === selectedYear) ?? calendars[0],
    [calendars, selectedYear],
  );

  const [previewImageUrl, setPreviewImageUrl] = useState(selectedCalendar?.imageUrl ?? "");
  const [fileName, setFileName] = useState(
    selectedCalendar ? getReadableFileName(selectedCalendar) : "",
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedCalendar) {
      return;
    }

    setPreviewImageUrl(selectedCalendar.imageUrl);
    setFileName(getReadableFileName(selectedCalendar));
  }, [selectedCalendar]);

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
    if (!selectedCalendar) {
      return;
    }

    onSave({
      ...selectedCalendar,
      imageUrl: previewImageUrl || selectedCalendar.imageUrl,
      fileName,
    });
  };

  if (!selectedCalendar) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Calendar"
      contentClassName="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg font-semibold">School Year</p>
          <select
            value={selectedYear}
            onChange={(event) => onSelectYear(event.target.value)}
            className="rounded-md border-2 border-black bg-white px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            {calendars.map((calendar) => (
              <option key={calendar.year} value={calendar.year}>
                {calendar.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-semibold">Old Calendar</h3>
          <p className="text-lg">{fileName}</p>
        </div>

        <div className="mx-auto max-h-[40vh] overflow-hidden rounded-md border-2 border-black/20 bg-white">
          <img
            src={previewImageUrl}
            alt={`School calendar ${selectedCalendar.label}`}
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
            Upload New Calendar
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