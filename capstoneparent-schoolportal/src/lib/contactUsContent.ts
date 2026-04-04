export interface ContactUsContent {
  principalOffice: string;
  libraryOffice: string;
  facultyOffice: string;
  facebookPageLabel: string;
  facebookPageUrl: string;
  mapEmbedUrl: string;
}

export const DEFAULT_CONTACT_US_CONTENT: ContactUsContent = {
  principalOffice: "",
  libraryOffice: "",
  facultyOffice: "",
  facebookPageLabel: "",
  facebookPageUrl: "",
  mapEmbedUrl: "",
};