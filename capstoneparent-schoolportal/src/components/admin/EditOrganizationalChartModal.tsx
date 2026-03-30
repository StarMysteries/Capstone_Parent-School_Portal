import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { OrganizationalChartItem } from "@/lib/organizationalChartContent";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface EditOrganizationalChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  charts: OrganizationalChartItem[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onSave: (updatedChart: OrganizationalChartItem) => void;
}

function getReadableFileName(chart: OrganizationalChartItem): string {
  if (chart.fileName) {
    return chart.fileName;
  }

  if (chart.imageUrl.startsWith("data:")) {
    return `organizational-chart-${chart.year}.png`;
  }

  const filePart = chart.imageUrl.split("/").pop();
  return filePart || `organizational-chart-${chart.year}.png`;
}

export const EditOrganizationalChartModal = ({
  isOpen,
  onClose,
  charts,
  selectedYear,
  onSelectYear,
  onSave,
}: EditOrganizationalChartModalProps) => {
  const selectedChart = useMemo(
    () => charts.find((chart) => chart.year === selectedYear) ?? charts[0],
    [charts, selectedYear],
  );

  const [previewImageUrl, setPreviewImageUrl] = useState(selectedChart?.imageUrl ?? "");
  const [fileName, setFileName] = useState(
    selectedChart ? getReadableFileName(selectedChart) : "",
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedChart) {
      return;
    }

    setPreviewImageUrl(selectedChart.imageUrl);
    setFileName(getReadableFileName(selectedChart));
  }, [selectedChart]);

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
    if (!selectedChart) {
      return;
    }

    onSave({
      ...selectedChart,
      imageUrl: previewImageUrl || selectedChart.imageUrl,
      fileName,
    });
  };

  if (!selectedChart) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Organizational Chart"
      contentClassName="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(event) => onSelectYear(event.target.value)}
            className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            {charts.map((chart) => (
              <option key={chart.year} value={chart.year}>
                {chart.year}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold">Current File</p>
          <p className="text-lg">{fileName}</p>
        </div>

        <div className="mx-auto max-h-[40vh] overflow-hidden rounded-md border-2 border-black/20 bg-white">
          <img
            src={previewImageUrl}
            alt={`Organizational chart ${selectedChart.year}`}
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

        <div className="flex justify-start">
          <Button
            type="button"
            onClick={handleUploadClick}
            className="h-auto rounded-md bg-(--navbar-bg) px-8 py-3 text-lg font-medium text-black hover:bg-yellow-300"
          >
            Picture Upload
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