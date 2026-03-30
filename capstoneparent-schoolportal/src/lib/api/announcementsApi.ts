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
  file_ids?: number[];
  attachments?: File[];
}

export const createAnnouncement = (payload: CreateAnnouncementPayload) => {
  const formData = new FormData();
  formData.append("announcement_title", payload.announcement_title);
  formData.append("announcement_desc", payload.announcement_desc);
  formData.append("announcement_type", payload.announcement_type);
  if (payload.file_ids?.length) {
    payload.file_ids.forEach((id) => formData.append("file_ids", id.toString()));
  }
  if (payload.attachments?.length) {
    payload.attachments.forEach((file) => formData.append("attachments", file));
  }

  return apiFetch<AnnouncementPostItem>("/announcements", {
    method: "POST",
    headers: {
      ...bearerHeaders(),
    },
    body: formData,
  });
};
