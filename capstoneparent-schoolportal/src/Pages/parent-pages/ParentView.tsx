import { ApplyRegistrationModal } from "@/components/parent/ApplyRegistrationModal";
import { DeniedDetailsModal } from "@/components/parent/DeniedDetailsModal";
import { NavbarParent } from "@/components/parent/NavbarParent";
import { PendingDetailsModal } from "@/components/parent/PendingDetailsModal";
import type { Child, DeniedUploads, PendingUploads, UploadedDoc } from "@/components/parent/parentModalTypes";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ParentView = () => {
  const navigate = useNavigate();
  const [pendingModalChild, setPendingModalChild] = useState<Child | null>(null);
  const [pendingDetailsChild, setPendingDetailsChild] = useState<Child | null>(null);
  const [deniedDetailsChild, setDeniedDetailsChild] = useState<Child | null>(null);
  const [deniedUploadTarget, setDeniedUploadTarget] = useState<keyof PendingUploads>("parentBirthCertificate");
  const [deniedUploads, setDeniedUploads] = useState<DeniedUploads>({
    parentBirthCertificate: null,
    governmentId: null,
    childBirthCertificate: null,
  });
  const [submittedFilesByChild, setSubmittedFilesByChild] = useState<Record<string, File[]>>({});
  const [selectedPreviewName, setSelectedPreviewName] = useState<string>("");
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string>("");
  const [activeObjectUrl, setActiveObjectUrl] = useState<string | null>(null);
  const [pendingUploadTarget, setPendingUploadTarget] = useState<keyof PendingUploads>("parentBirthCertificate");
  const [pendingUploads, setPendingUploads] = useState<PendingUploads>({
    parentBirthCertificate: null,
    governmentId: null,
    childBirthCertificate: null,
  });

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
      remarks: "",
      uploadedFiles: [
        {
          name: "Parent Birth Certificate.pdf",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
        {
          name: "Child Birth Certificate.pdf",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
    },
    {
      id: "3",
      name: "Jasmine Tolentino",
      status: "DENIED",
      dateSubmitted: "03/12/2025",
      remarks: "Please provide a valid Parent Birth Certificate.",
      uploadedFiles: [
        {
          name: "Camera2025-03-12 152225.png",
        },
        {
          name: "Child Birth Certificate.pdf",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
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

  const handleCardClick = (child: Child) => {
    if (child.status === "VERIFIED") {
      navigate("/classschedule");
      return;
    }

    if (child.status === "PENDING") {
      setPendingDetailsChild(child);
      return;
    }

    if (child.status === "DENIED") {
      const initialDeniedUploads: DeniedUploads = {
        parentBirthCertificate: null,
        governmentId: null,
        childBirthCertificate: null,
      };

      (child.uploadedFiles ?? []).forEach((file) => {
        const normalized = file.name.toLowerCase();

        if (normalized.includes("child")) {
          initialDeniedUploads.childBirthCertificate = file.name;
          return;
        }

        if (normalized.includes("government") || normalized.includes("id")) {
          initialDeniedUploads.governmentId = file.name;
          return;
        }

        if (!initialDeniedUploads.parentBirthCertificate) {
          initialDeniedUploads.parentBirthCertificate = file.name;
        }
      });

      setDeniedUploads(initialDeniedUploads);
      setDeniedUploadTarget("parentBirthCertificate");
      setDeniedDetailsChild(child);
    }
  };

  const openRegistrationModal = () => {
    const pendingChild = children.find((child) => child.status === "PENDING");
    setPendingModalChild(pendingChild ?? children[0]);
  };

  const handlePendingFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;

    setPendingUploads((previous) => ({
      ...previous,
      [pendingUploadTarget]: selectedFile,
    }));

    event.target.value = "";
  };

  const handleRemovePendingFile = (key: keyof PendingUploads) => {
    setPendingUploads((previous) => ({ ...previous, [key]: null }));
  };

  const handleDeniedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;

    setDeniedUploads((previous) => ({
      ...previous,
      [deniedUploadTarget]: selectedFile.name,
    }));

    event.target.value = "";
  };

  const handleRemoveDeniedFile = (key: keyof DeniedUploads) => {
    setDeniedUploads((previous) => ({ ...previous, [key]: null }));
  };

  const closePendingModal = () => {
    setPendingModalChild(null);
    setPendingUploadTarget("parentBirthCertificate");
    setPendingUploads({
      parentBirthCertificate: null,
      governmentId: null,
      childBirthCertificate: null,
    });
  };

  const closePendingDetailsModal = () => {
    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
      setActiveObjectUrl(null);
    }

    setSelectedPreviewName("");
    setSelectedPreviewUrl("");
    setPendingDetailsChild(null);
  };

  const closeDeniedDetailsModal = () => {
    setDeniedDetailsChild(null);
    setDeniedUploadTarget("parentBirthCertificate");
    setDeniedUploads({
      parentBirthCertificate: null,
      governmentId: null,
      childBirthCertificate: null,
    });
  };

  const getPendingDetailsFiles = (child: Child): UploadedDoc[] => {
    const submittedFiles = submittedFilesByChild[child.id] ?? [];
    if (submittedFiles.length > 0) {
      return submittedFiles.map((file) => ({ name: file.name, file }));
    }

    return (child.uploadedFiles ?? []).map((file) => ({ name: file.name, url: file.url }));
  };

  const handleOpenPreview = (doc: UploadedDoc) => {
    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
      setActiveObjectUrl(null);
    }

    if (doc.file) {
      const objectUrl = URL.createObjectURL(doc.file);
      setActiveObjectUrl(objectUrl);
      setSelectedPreviewUrl(objectUrl);
      setSelectedPreviewName(doc.name);
      return;
    }

    if (doc.url) {
      setSelectedPreviewUrl(doc.url);
      setSelectedPreviewName(doc.name);
    }
  };

  const handleOpenPendingPdf = (doc: UploadedDoc) => {
    handleOpenPreview(doc);

    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return;
    }

    if (doc.url) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmitRegistration = () => {
    if (!pendingModalChild || !isPendingFormValid) return;

    const uploadedFiles = [
      pendingUploads.parentBirthCertificate,
      pendingUploads.governmentId,
      pendingUploads.childBirthCertificate,
    ].filter((file): file is File => Boolean(file));

    setSubmittedFilesByChild((previous) => ({
      ...previous,
      [pendingModalChild.id]: uploadedFiles,
    }));

    closePendingModal();
  };

  const handleResubmitDenied = () => {
    if (!deniedDetailsChild || !isDeniedFormValid) return;

    closeDeniedDetailsModal();
  };

  const isPendingFormValid = Boolean(
    (pendingUploads.parentBirthCertificate || pendingUploads.governmentId) &&
      pendingUploads.childBirthCertificate
  );

  const isDeniedFormValid = Boolean(
    (deniedUploads.parentBirthCertificate || deniedUploads.governmentId) &&
      deniedUploads.childBirthCertificate
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
      <NavbarParent />

      <ApplyRegistrationModal
        isOpen={Boolean(pendingModalChild)}
        child={pendingModalChild}
        pendingUploadTarget={pendingUploadTarget}
        pendingUploads={pendingUploads}
        isFormValid={isPendingFormValid}
        onSetUploadTarget={setPendingUploadTarget}
        onPendingFileChange={handlePendingFileChange}
        onRemovePendingFile={handleRemovePendingFile}
        onClose={closePendingModal}
        onSubmit={handleSubmitRegistration}
      />

      <PendingDetailsModal
        isOpen={Boolean(pendingDetailsChild)}
        child={pendingDetailsChild}
        files={pendingDetailsChild ? getPendingDetailsFiles(pendingDetailsChild) : []}
        selectedPreviewName={selectedPreviewName}
        selectedPreviewUrl={selectedPreviewUrl}
        onPreview={handleOpenPreview}
        onOpenPdf={handleOpenPendingPdf}
        onClose={closePendingDetailsModal}
      />

      <DeniedDetailsModal
        isOpen={Boolean(deniedDetailsChild)}
        child={deniedDetailsChild}
        deniedUploadTarget={deniedUploadTarget}
        deniedUploads={deniedUploads}
        isFormValid={isDeniedFormValid}
        onSetUploadTarget={setDeniedUploadTarget}
        onDeniedFileChange={handleDeniedFileChange}
        onRemoveDeniedFile={handleRemoveDeniedFile}
        onResubmit={handleResubmitDenied}
        onClose={closeDeniedDetailsModal}
      />

      <main className="px-6 py-12">
        <div className="mb-12 flex justify-center">
          <Button
            onClick={openRegistrationModal}
            className="rounded-lg px-8 py-6 text-lg font-bold uppercase text-white"
            style={{ backgroundColor: "var(--button-green)", ...{ ":hover": { backgroundColor: "var(--button-hover-green)" } } }}
          >
            Apply for Registration
          </Button>
        </div>

        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-4xl font-bold" style={{ color: "var(--text-gray)" }}>
            Select a Child
          </h1>

          <div className="mb-8">
            <p className="mb-3 font-semibold">Notes:</p>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>Parents need to register their child first and wait for verification before they can access the child's academic records.</li>
              <li>You can also select a child with a Pending registration status to view further details of your application.</li>
              <li>If your registration is denied, please select that child to view further details.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="cursor-pointer rounded-lg border-2 p-6 shadow-md transition-transform hover:shadow-lg"
                style={getCardBorderColor(child.status)}
                onClick={() => handleCardClick(child)}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-gray)" }}>
                    {child.name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold uppercase ${getStatusBadgeColor(child.status)}`}
                    style={getStatusBgColor(child.status)}
                  >
                    {child.status}
                  </span>
                </div>

                {child.status === "VERIFIED" && (
                  <div className="space-y-2 text-sm" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">LRN:</span> {child.lrn}
                    </p>
                    <p>
                      <span className="font-semibold">Grade Level & Section:</span> {child.gradeLevel} - {child.section}
                    </p>
                    <p>
                      <span className="font-semibold">School Year:</span> {child.schoolYear}
                    </p>
                    <p>
                      <span className="font-semibold">Class Adviser:</span> {child.classAdviser}
                    </p>
                  </div>
                )}

                {child.status === "PENDING" && (
                  <div className="space-y-2 text-sm" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">Date Submitted:</span> {child.dateSubmitted}
                    </p>
                    {child.remarks && (
                      <p>
                        <span className="font-semibold">Remarks:</span> {child.remarks}
                      </p>
                    )}
                  </div>
                )}

                {child.status === "DENIED" && (
                  <div className="space-y-2 text-sm" style={{ color: "var(--text-gray)" }}>
                    <p>
                      <span className="font-semibold">Date Submitted:</span> {child.dateSubmitted}
                    </p>
                    {child.remarks && (
                      <p>
                        <span className="font-semibold">Remarks:</span> {child.remarks}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
