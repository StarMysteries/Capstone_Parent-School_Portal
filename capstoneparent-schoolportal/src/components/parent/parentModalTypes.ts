export interface Child {
  id: string;
  name: string;
  status: "VERIFIED" | "PENDING" | "DENIED";
  lrn?: string;
  gradeLevel?: string;
  section?: string;
  schoolYear?: string;
  classAdviser?: string;
  dateSubmitted?: string;
  remarks?: string;
  uploadedFiles?: Array<{ name: string; url?: string }>;
}

export interface PendingUploads {
  parentBirthCertificate: File | null;
  governmentId: File | null;
  childBirthCertificate: File | null;
}

export interface DeniedUploads {
  parentBirthCertificate: string | null;
  governmentId: string | null;
  childBirthCertificate: string | null;
}

export interface UploadedDoc {
  name: string;
  file?: File;
  url?: string;
}