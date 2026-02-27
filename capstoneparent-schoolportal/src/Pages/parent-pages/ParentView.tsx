import { NavbarParent } from "@/components/parent/NavbarParent";
import { ApplyRegistrationModal } from "@/components/parent/RegistrationModal";
import { PendingDetailsModal } from "@/components/parent/PendingDetailsModal";
import { DeniedDetailsModal } from "@/components/parent/DeniedDetailsModal";
import type { Child, DeniedUploads, PendingUploads, UploadedDoc } from "@/components/parent/parentModalTypes";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ParentView = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);

  const [pendingUploadTarget, setPendingUploadTarget] = useState<keyof PendingUploads>("parentBirthCertificate");
  const [pendingUploads, setPendingUploads] = useState<PendingUploads>({
    parentBirthCertificate: null,
    governmentId: null,
    childBirthCertificate: null,
  });

  const [deniedUploadTarget, setDeniedUploadTarget] = useState<keyof PendingUploads>("parentBirthCertificate");
  const [deniedUploads, setDeniedUploads] = useState<DeniedUploads>({
    parentBirthCertificate: null,
    governmentId: null,
    childBirthCertificate: null,
  });

  const [selectedPreviewName, setSelectedPreviewName] = useState("");
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");

  // Sample data - replace with actual data from API
  const children: Child[] = [
    {
      id: "1",
      name: "Angela Reyes",
      status: "VERIFIED",
      lrn: "501142400721",
      gradeLevel: "Grade 1",
      section: "Section A",
      schoolYear: "2024 - 2025",
      classAdviser: "Lourdes Santos",
    },
    {
      id: "2",
      name: "Miguel Fernandez",
      status: "PENDING",
      dateSubmitted: "03/12/2025",
      remarks: "Under review by registrar.",
      uploadedFiles: [
        { name: "Parent Birth Certificate.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        { name: "Child Birth Certificate.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      ],
    },
    {
      id: "3",
      name: "Jasmine Tolentino",
      status: "DENIED",
      dateSubmitted: "03/12/2025",
      remarks: "Please provide a valid Parent Birth Certificate.",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "text-white font-bold";
      case "PENDING":
        return "text-gray-900 font-bold";
      case "DENIED":
        return "text-white font-bold";
      default:
        return "text-white font-bold";
    }
  };


  const isPendingFormValid = Boolean(
    pendingUploads.childBirthCertificate &&
      (pendingUploads.parentBirthCertificate || pendingUploads.governmentId)
  );

  const isDeniedFormValid = Boolean(
    deniedUploads.childBirthCertificate &&
      (deniedUploads.parentBirthCertificate || deniedUploads.governmentId)
  );

  const resetPreview = () => {
    setSelectedPreviewName("");
    setSelectedPreviewUrl("");
  };

  const openApplyModal = () => {
    const child = children.find((item) => item.id === selectedChild) ?? children[0] ?? null;
    setActiveChild(child);
    setIsApplyModalOpen(true);
  };

  const handlePendingFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setPendingUploads((prev) => ({ ...prev, [pendingUploadTarget]: file }));
  };

  const handleDeniedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setDeniedUploads((prev) => ({ ...prev, [deniedUploadTarget]: file.name }));
  };

  const handlePendingPreview = (doc: UploadedDoc) => {
    const previewUrl = doc.url || (doc.file ? URL.createObjectURL(doc.file) : "");
    setSelectedPreviewName(doc.name);
    setSelectedPreviewUrl(previewUrl);
  };

  const handleOpenPdf = (doc: UploadedDoc) => {
    const pdfUrl = doc.url || (doc.file ? URL.createObjectURL(doc.file) : "");
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmitRegistration = () => {
    if (!isPendingFormValid) return;
    setIsApplyModalOpen(false);
  };

  const handleResubmitDenied = () => {
    if (!isDeniedFormValid) return;
    setIsDeniedModalOpen(false);
  };

  const handleChildCardClick = (child: Child) => {
    setSelectedChild(child.id);
    setActiveChild(child);

    if (child.status === "VERIFIED") {
      navigate("/classschedule");
      return;
    }

    if (child.status === "PENDING") {
      resetPreview();
      setIsPendingModalOpen(true);
      return;
    }

    if (child.status === "DENIED") {
      setIsDeniedModalOpen(true);
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return { backgroundColor: "var(--status-verified)" } as React.CSSProperties;
      case "PENDING":
        return { backgroundColor: "var(--status-pending)" } as React.CSSProperties;
      case "DENIED":
        return { backgroundColor: "var(--status-denied)" } as React.CSSProperties;
      default:
        return {};
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return { borderColor: "var(--status-verified)", backgroundColor: "#f0fdf4" } as React.CSSProperties;
      case "PENDING":
        return { borderColor: "var(--status-pending)", backgroundColor: "#fffbeb" } as React.CSSProperties;
      case "DENIED":
        return { borderColor: "var(--status-denied)", backgroundColor: "#fef2f2" } as React.CSSProperties;
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
      <NavbarParent />

      {/* Main Content */}
      <main className="px-6 py-12">
        {/* Apply for Registration Button */}
        <div className="flex justify-center mb-12">
          <Button
            className="text-white px-8 py-6 rounded-lg text-lg font-bold uppercase"
            style={{ backgroundColor: "var(--button-green)" }}
            onClick={openApplyModal}
          >
            Apply for Registration
          </Button>
        </div>

        {/* Select a Child Section */}
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8" style={{ color: "var(--text-gray)" }}>Select a Child</h1>

          {/* Notes */}
          <div className="mb-8">
            <p className="font-semibold mb-3">Notes:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Parents need to register their child first and wait for verification before they can access the child's academic records.</li>
              <li>You can also select a child with a Pending registration status to view further details of your application.</li>
              <li>If your registration is denied, please select that child to view further details.</li>
            </ul>
          </div>

          {/* Child Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-6 rounded-lg shadow-md cursor-pointer transition-transform hover:shadow-lg border-2"
                style={getCardBorderColor(child.status)}
                onClick={() => handleChildCardClick(child)}
              >
                {/* Child Name and Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-gray)" }}>{child.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusBadgeColor(
                      child.status
                    )}`}
                    style={getStatusBgColor(child.status)}
                  >
                    {child.status}
                  </span>
                </div>

                {/* Child Details - Verified Status */}
                {child.status === "VERIFIED" && (
                  <div className="text-sm space-y-2" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">LRN:</span> {child.lrn}
                    </p>
                    <p>
                      <span className="font-semibold">Grade Level & Section:</span>{" "}
                      {child.gradeLevel} - {child.section}
                    </p>
                    <p>
                      <span className="font-semibold">School Year:</span>{" "}
                      {child.schoolYear}
                    </p>
                    <p>
                      <span className="font-semibold">Class Adviser:</span>{" "}
                      {child.classAdviser}
                    </p>
                  </div>
                )}

                {/* Child Details - Pending Status */}
                {child.status === "PENDING" && (
                  <div className="text-sm space-y-2" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">Date Submitted:</span>{" "}
                      {child.dateSubmitted}
                    </p>
                    {child.remarks && (
                      <p>
                        <span className="font-semibold">Remarks:</span>{" "}
                        {child.remarks}
                      </p>
                    )}
                  </div>
                )}

                {/* Child Details - Denied Status */}
                {child.status === "DENIED" && (
                  <div className="text-sm space-y-2" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">Date Submitted:</span>{" "}
                      {child.dateSubmitted}
                    </p>
                    {child.remarks && (
                      <p>
                        <span className="font-semibold">Remarks:</span>{" "}
                        {child.remarks}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <ApplyRegistrationModal
        isOpen={isApplyModalOpen}
        child={activeChild}
        pendingUploadTarget={pendingUploadTarget}
        pendingUploads={pendingUploads}
        isFormValid={isPendingFormValid}
        onSetUploadTarget={setPendingUploadTarget}
        onPendingFileChange={handlePendingFileChange}
        onRemovePendingFile={(key) => setPendingUploads((prev) => ({ ...prev, [key]: null }))}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleSubmitRegistration}
      />

      <PendingDetailsModal
        isOpen={isPendingModalOpen}
        child={activeChild?.status === "PENDING" ? activeChild : null}
        files={(activeChild?.uploadedFiles ?? []).map((doc) => ({ name: doc.name, url: doc.url }))}
        selectedPreviewName={selectedPreviewName}
        selectedPreviewUrl={selectedPreviewUrl}
        onPreview={handlePendingPreview}
        onOpenPdf={handleOpenPdf}
        onClose={() => {
          setIsPendingModalOpen(false);
          resetPreview();
        }}
      />

      <DeniedDetailsModal
        isOpen={isDeniedModalOpen}
        child={activeChild?.status === "DENIED" ? activeChild : null}
        deniedUploadTarget={deniedUploadTarget}
        deniedUploads={deniedUploads}
        isFormValid={isDeniedFormValid}
        onSetUploadTarget={setDeniedUploadTarget}
        onDeniedFileChange={handleDeniedFileChange}
        onRemoveDeniedFile={(key) => setDeniedUploads((prev) => ({ ...prev, [key]: null }))}
        onResubmit={handleResubmitDenied}
        onClose={() => setIsDeniedModalOpen(false)}
      />
    </div>
  );
}