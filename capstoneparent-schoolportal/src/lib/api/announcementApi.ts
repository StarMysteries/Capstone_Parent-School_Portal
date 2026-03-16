/**
 * announcementsApi.ts
 * All requests to /api/announcements/*
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnnouncementType = "General" | "Staff_only" | "Memorandum";

export interface AnnouncementFile {
  file_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

export interface AnnouncementFileJoin {
  file: AnnouncementFile;
}

export interface Announcement {
  announcement_id: number;
  announcement_title: string;
  announcement_desc: string;
  announcement_type: AnnouncementType;
  announced_by: number;
  created_at: string;
  user: {
    user_id: number;
    fname: string;
    lname: string;
  };
  files: AnnouncementFileJoin[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnnouncementsListResponse {
  data: Announcement[];
  pagination: Pagination;
}

export interface AnnouncementResponse {
  data: Announcement;
}

export interface CreateAnnouncementPayload {
  announcement_title: string;
  announcement_desc: string;
  announcement_type: AnnouncementType;
  /** IDs of pre-uploaded File records to attach */
  file_ids?: number[];
}

export interface UpdateAnnouncementPayload {
  announcement_title?: string;
  announcement_desc?: string;
  announcement_type?: AnnouncementType;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const announcementsApi = {
  /**
   * Fetch a paginated list of announcements.
   * Non-staff users automatically receive only "General" announcements.
   */
  getAll(params?: {
    page?: number;
    limit?: number;
    type?: AnnouncementType;
  }): Promise<AnnouncementsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.type) query.set("type", params.type);
    const qs = query.toString();
    return apiFetch(`/announcements${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single announcement by ID.
   */
  getById(id: number): Promise<AnnouncementResponse> {
    return apiFetch(`/announcements/${id}`);
  },

  /**
   * Create a new announcement.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  create(
    payload: CreateAnnouncementPayload,
  ): Promise<{ message: string; data: Announcement }> {
    return apiFetch("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing announcement.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  update(
    id: number,
    payload: UpdateAnnouncementPayload,
  ): Promise<{ message: string; data: Announcement }> {
    return apiFetch(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete an announcement.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  delete(id: number): Promise<{ message: string }> {
    return apiFetch(`/announcements/${id}`, { method: "DELETE" });
  },
};
