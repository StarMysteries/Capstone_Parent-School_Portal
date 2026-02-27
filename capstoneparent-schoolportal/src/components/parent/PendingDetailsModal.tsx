import { X } from "lucide-react";
import type { Child, UploadedDoc } from "./parentModalTypes";

interface PendingDetailsModalProps {
  isOpen: boolean;
  child: Child | null;
  files: UploadedDoc[];
  selectedPreviewName: string;
  selectedPreviewUrl: string;
  onPreview: (doc: UploadedDoc) => void;
  onOpenPdf: (doc: UploadedDoc) => void;
  onClose: () => void;
}

export const PendingDetailsModal = ({
  isOpen,
  child,
  files,
  selectedPreviewName,
  selectedPreviewUrl,
  onPreview,
  onOpenPdf,
  onClose,
}: PendingDetailsModalProps) => {
  if (!isOpen || !child) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Details</h2>
            <p className="mt-1 text-sm text-gray-600">Review submission status and preview uploaded PDFs.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-red-600 transition-colors hover:text-red-700"
            aria-label="Close details modal"
          >
            <X className="h-8 w-8" strokeWidth={3} />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Student Name</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{child.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
            <p className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{child.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Date Submitted</p>
            <p className="mt-1 text-base font-medium text-gray-900">{child.dateSubmitted || "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Remarks</p>
            <p className="mt-1 text-base font-medium text-gray-900">{child.remarks || "No remarks"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Uploaded Files</h3>
            <div className="space-y-3">
              {files.length > 0 ? (
                files.map((doc) => (
                  <div key={doc.name} className="rounded-lg border border-gray-200 bg-white p-3">
                    <p className="truncate text-sm font-medium text-gray-800">{doc.name}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onPreview(doc)}
                        className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-200"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPdf(doc)}
                        className="rounded-md px-3 py-1.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--button-green)" }}
                      >
                        Open PDF
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No uploaded files yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">PDF Preview</h3>
            {selectedPreviewUrl ? (
              <>
                <p className="mb-2 truncate text-sm text-gray-600">{selectedPreviewName}</p>
                <iframe src={selectedPreviewUrl} title="PDF Preview" className="h-105 w-full rounded-lg border border-gray-200" />
              </>
            ) : (
              <div className="flex h-105 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                Select a file and click Preview to view the PDF.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};