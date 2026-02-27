import { X } from "lucide-react";
import type { Child, PendingUploads } from "./parentModalTypes";

interface ApplyRegistrationModalProps {
  isOpen: boolean;
  child: Child | null;
  pendingUploadTarget: keyof PendingUploads;
  pendingUploads: PendingUploads;
  isFormValid: boolean;
  onSetUploadTarget: (target: keyof PendingUploads) => void;
  onPendingFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePendingFile: (key: keyof PendingUploads) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ApplyRegistrationModal = ({
  isOpen,
  child,
  pendingUploadTarget,
  pendingUploads,
  isFormValid,
  onSetUploadTarget,
  onPendingFileChange,
  onRemovePendingFile,
  onClose,
  onSubmit,
}: ApplyRegistrationModalProps) => {
  if (!isOpen || !child) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Apply for Registration</h2>
            <p className="mt-1 text-sm text-gray-600">Upload all required files before submitting.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-red-600 transition-colors hover:text-red-700"
            aria-label="Close registration modal"
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
            <p className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              Pending Verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.35fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Parent Birth Certificate <span className="text-gray-500">(required unless Government ID is uploaded)</span>
              </li>
              <li>
                • Government-issued ID <span className="text-gray-500">(optional substitute)</span>
              </li>
              <li>
                • Child Birth Certificate <span className="text-red-600">(required)</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">File Uploads</h3>
              <label
                htmlFor="required-files-upload"
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--button-green)" }}
              >
                Upload File
              </label>
            </div>
            <input
              id="required-files-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={onPendingFileChange}
            />
            <p className="mb-3 text-xs text-gray-500">Choose a target document first, then click Upload File.</p>

            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onSetUploadTarget("parentBirthCertificate")}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  pendingUploadTarget === "parentBirthCertificate"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Parent Birth Certificate
              </button>
              <button
                type="button"
                onClick={() => onSetUploadTarget("governmentId")}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  pendingUploadTarget === "governmentId"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Government-issued ID
              </button>
              <button
                type="button"
                onClick={() => onSetUploadTarget("childBirthCertificate")}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  pendingUploadTarget === "childBirthCertificate"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Child Birth Certificate
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-800">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">Parent Birth Certificate</p>
                  <span className="text-xs font-semibold text-red-600">Required*</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                  <span className="truncate pr-2 text-xs">{pendingUploads.parentBirthCertificate?.name || "No file selected"}</span>
                  {pendingUploads.parentBirthCertificate && (
                    <button
                      type="button"
                      onClick={() => onRemovePendingFile("parentBirthCertificate")}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">Government-issued ID</p>
                  <span className="text-xs font-semibold text-gray-500">Optional</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                  <span className="truncate pr-2 text-xs">{pendingUploads.governmentId?.name || "No file selected"}</span>
                  {pendingUploads.governmentId && (
                    <button
                      type="button"
                      onClick={() => onRemovePendingFile("governmentId")}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">Child Birth Certificate</p>
                  <span className="text-xs font-semibold text-red-600">Required*</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                  <span className="truncate pr-2 text-xs">{pendingUploads.childBirthCertificate?.name || "No file selected"}</span>
                  {pendingUploads.childBirthCertificate && (
                    <button
                      type="button"
                      onClick={() => onRemovePendingFile("childBirthCertificate")}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Required to submit: Child Birth Certificate and either Parent Birth Certificate or Government-issued ID.
          </p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isFormValid}
            className="rounded-xl px-8 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "var(--button-green)" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};