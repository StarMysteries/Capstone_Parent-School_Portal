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
    successMessage: "Announcement posted successfully.",
    headers: {
      ...bearerHeaders(),
    },
    body: formData,
  });
};

export interface UpdateAnnouncementPayload {
  announcement_title?: string;
  announcement_desc?: string;
  announcement_type?: "General" | "Staff_only" | "Memorandum";
  replace_attachments?: boolean;
  remove_file_ids?: number[];
  attachments?: File[];
}

export const updateAnnouncement = (
  announcementId: number,
  payload: UpdateAnnouncementPayload,
) => {
  const useFormData = Boolean(
    payload.attachments?.length ||
      payload.replace_attachments ||
      payload.remove_file_ids?.length,
  );

  if (useFormData) {
    const formData = new FormData();
    if (payload.announcement_title !== undefined) {
      formData.append("announcement_title", payload.announcement_title);
    }
    if (payload.announcement_desc !== undefined) {
      formData.append("announcement_desc", payload.announcement_desc);
    }
    if (payload.announcement_type !== undefined) {
      formData.append("announcement_type", payload.announcement_type);
    }
    if (payload.replace_attachments !== undefined) {
      formData.append(
        "replace_attachments",
        payload.replace_attachments ? "true" : "false",
      );
    }
    if (payload.remove_file_ids?.length) {
      payload.remove_file_ids.forEach((id) =>
        formData.append("remove_file_ids", id.toString()),
      );
    }
    if (payload.attachments?.length) {
      payload.attachments.forEach((file) => formData.append("attachments", file));
    }

    return apiFetch<AnnouncementPostItem>(`/announcements/${announcementId}`, {
      method: "PUT",
      successMessage: "Announcement updated successfully.",
      headers: {
        ...bearerHeaders(),
      },
      body: formData,
    });
  }

  return apiFetch<AnnouncementPostItem>(`/announcements/${announcementId}`, {
    method: "PUT",
    successMessage: "Announcement updated successfully.",
    headers: {
      ...bearerHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
