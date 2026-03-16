/**
 * eventsApi.ts
 * All requests to /api/events/*
 *
 * GET /events and GET /events/:id are public (no auth required).
 * POST / PUT / DELETE require Admin, Principal, or Vice_Principal role.
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventCreator {
  user_id: number;
  fname: string;
  lname: string;
}

export interface SchoolEvent {
  event_id: number;
  event_title: string;
  event_desc: string | null;
  event_date: string;
  photo_path: string;
  created_by: number;
  user: EventCreator;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventsListResponse {
  data: SchoolEvent[];
  pagination: Pagination;
}

export interface EventResponse {
  data: SchoolEvent;
}

export interface CreateEventPayload {
  event_title: string;
  event_desc?: string;
  /** ISO 8601 date string */
  event_date: string;
  photo_path: string;
}

export interface UpdateEventPayload {
  event_title?: string;
  event_desc?: string;
  /** ISO 8601 date string */
  event_date?: string;
  photo_path?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const eventsApi = {
  /**
   * Fetch a paginated list of events, ordered by event_date descending.
   * Public — no authentication required.
   */
  getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<EventsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiFetch(`/events${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single event by ID.
   * Public — no authentication required.
   */
  getById(id: number): Promise<EventResponse> {
    return apiFetch(`/events/${id}`);
  },

  /**
   * Create a new event.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  create(
    payload: CreateEventPayload,
  ): Promise<{ message: string; data: SchoolEvent }> {
    return apiFetch("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing event.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  update(
    id: number,
    payload: UpdateEventPayload,
  ): Promise<{ message: string; data: SchoolEvent }> {
    return apiFetch(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete an event.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  delete(id: number): Promise<{ message: string }> {
    return apiFetch(`/events/${id}`, { method: "DELETE" });
  },
};
