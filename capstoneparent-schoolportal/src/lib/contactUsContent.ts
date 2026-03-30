export interface ContactUsContent {
  principalOffice: string;
  libraryOffice: string;
  facultyOffice: string;
  facebookPageLabel: string;
  facebookPageUrl: string;
  mapEmbedUrl: string;
}

const STORAGE_KEY = "contact-us-content";

export const DEFAULT_CONTACT_US_CONTENT: ContactUsContent = {
  principalOffice: "0129293512",
  libraryOffice: "012983759",
  facultyOffice: "01293023121",
  facebookPageLabel: "Pagsabungan Elementary School",
  facebookPageUrl:
    "https://www.facebook.com/pages/Pagsabungan-Elementary-School/416573625065073",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6147.85805286023!2d123.93795581216922!3d10.356494766753164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9987ccd09bc87%3A0x2f7440ce2f8c0b6e!2sPagsabungan%20Elementary%20School!5e1!3m2!1sen!2sus!4v1769654678624!5m2!1sen!2sus",
};

function sanitizeContactUsContent(
  raw: Partial<ContactUsContent> | null | undefined,
): ContactUsContent {
  return {
    principalOffice:
      typeof raw?.principalOffice === "string"
        ? raw.principalOffice
        : DEFAULT_CONTACT_US_CONTENT.principalOffice,
    libraryOffice:
      typeof raw?.libraryOffice === "string"
        ? raw.libraryOffice
        : DEFAULT_CONTACT_US_CONTENT.libraryOffice,
    facultyOffice:
      typeof raw?.facultyOffice === "string"
        ? raw.facultyOffice
        : DEFAULT_CONTACT_US_CONTENT.facultyOffice,
    facebookPageLabel:
      typeof raw?.facebookPageLabel === "string"
        ? raw.facebookPageLabel
        : DEFAULT_CONTACT_US_CONTENT.facebookPageLabel,
    facebookPageUrl:
      typeof raw?.facebookPageUrl === "string"
        ? raw.facebookPageUrl
        : DEFAULT_CONTACT_US_CONTENT.facebookPageUrl,
    mapEmbedUrl:
      typeof raw?.mapEmbedUrl === "string"
        ? raw.mapEmbedUrl
        : DEFAULT_CONTACT_US_CONTENT.mapEmbedUrl,
  };
}

export function getContactUsContent(): ContactUsContent {
  if (typeof window === "undefined") {
    return DEFAULT_CONTACT_US_CONTENT;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_CONTACT_US_CONTENT),
      );
      return DEFAULT_CONTACT_US_CONTENT;
    }

    const parsed = JSON.parse(raw) as Partial<ContactUsContent>;
    const sanitized = sanitizeContactUsContent(parsed);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_CONTACT_US_CONTENT),
    );
    return DEFAULT_CONTACT_US_CONTENT;
  }
}

export function setContactUsContent(content: ContactUsContent): void {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = sanitizeContactUsContent(content);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
}