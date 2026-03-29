import { apiFetch, bearerHeaders } from "./base";
import type { AnnouncementPostItem } from "@/components/staff/AnnouncementPostFeed";

export interface GetAnnouncementsParams {
  page?: number;
  limit?: number;
  type?: "General" | "Staff_only" | "Memorandum";
}

export interface AnnouncementsResponse {
  data: AnnouncementPostItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAnnouncements = (params?: GetAnnouncementsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.type) searchParams.append("type", params.type);

  const query = searchParams.toString();
  const endpoint = query ? `/announcements?${query}` : `/announcements`;

  return apiFetch<AnnouncementsResponse>(endpoint, {
    method: "GET",
    headers: bearerHeaders(),
  });
};

export interface CreateAnnouncementPayload {
  announcement_title: string;
  announcement_desc: string;
  announcement_type: "General" | "Staff_only" | "Memorandum";
  announced_by: number;
  file_ids?: number[];
}

export const createAnnouncement = (payload: CreateAnnouncementPayload) => {
  return apiFetch<AnnouncementPostItem>("/announcements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...bearerHeaders(),
    },
    body: JSON.stringify(payload),
  });
};
