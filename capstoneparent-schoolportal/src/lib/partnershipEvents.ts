import { resolveMediaUrl } from "@/lib/api/base";

export interface PartnershipEventItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  imageUrl: string;
  imageFile?: File;
  dateLabel: string;
  eventDate: string;
  location: string;
  organizer: string;
  audience: string;
  highlights: string[];
  details: string[];
  hashtags: string[];
}

export interface BackendEvent {
  event_id: number;
  event_title: string;
  event_desc?: string | null;
  event_date: string;
  photo_path: string;
  created_at?: string;
  created_by?: number;
  user?: {
    user_id: number;
    fname: string;
    lname: string;
  };
}

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop";

const DEFAULT_LOCATION = "School Grounds";
const DEFAULT_AUDIENCE = "School Community";

export const slugifyPartnershipEventTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-");

const splitDetails = (description: string) => {
  const paragraphs = description
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  return description
    .split(/(?<=[.!?])\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 3);
};

export const formatPartnershipEventDate = (eventDate: string) => {
  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) {
    return eventDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

export const mapBackendEventToPartnershipEvent = (
  event: BackendEvent,
): PartnershipEventItem => {
  const normalizedDescription = event.event_desc?.trim() || "Partnership and event details coming soon.";
  const yearSource = event.created_at ?? event.event_date;
  const yearDate = new Date(yearSource);
  const organizerName = event.user
    ? `${event.user.fname} ${event.user.lname}`.trim()
    : "School Administration";

  return {
    id: event.event_id,
    slug: slugifyPartnershipEventTitle(event.event_title),
    title: event.event_title,
    subtitle: event.user ? `Posted by ${organizerName}` : "School Partnership Event",
    description: normalizedDescription,
    year: Number.isNaN(yearDate.getTime()) ? new Date().getFullYear() : yearDate.getFullYear(),
    imageUrl: event.photo_path ? resolveMediaUrl(event.photo_path) : DEFAULT_EVENT_IMAGE,
    dateLabel: formatPartnershipEventDate(event.event_date),
    eventDate: event.event_date,
    location: DEFAULT_LOCATION,
    organizer: organizerName || "School Administration",
    audience: DEFAULT_AUDIENCE,
    highlights: splitDetails(normalizedDescription).slice(0, 3),
    details: splitDetails(normalizedDescription),
    hashtags: [],
  };
};
