import { apiFetch, bearerHeaders } from "./base";
import type { BackendEvent } from "@/lib/partnershipEvents";

export interface EventsResponse {
  data: BackendEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EventResponse {
  data: BackendEvent;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
}

export interface EventPayload {
  event_title: string;
  event_desc?: string;
  event_date?: string;
  photo_path?: string;
  asset?: File;
}

export const getEvents = (params?: GetEventsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const query = searchParams.toString();
  const endpoint = query ? `/events?${query}` : "/events";

  return apiFetch<EventsResponse>(endpoint, {
    method: "GET",
    headers: bearerHeaders(),
  });
};

export const getEventById = (eventId: number) =>
  apiFetch<EventResponse>(`/events/${eventId}`, {
    method: "GET",
    headers: bearerHeaders(),
  });

export const createEvent = (payload: EventPayload) =>
  (() => {
    const formData = new FormData();
    formData.append("event_title", payload.event_title);
    if (payload.event_desc !== undefined) {
      formData.append("event_desc", payload.event_desc);
    }
    if (payload.event_date !== undefined) {
      formData.append("event_date", payload.event_date);
    }
    if (payload.photo_path !== undefined) {
      formData.append("photo_path", payload.photo_path);
    }
    if (payload.asset) {
      formData.append("asset", payload.asset);
    }

    return apiFetch<EventResponse>("/events", {
      method: "POST",
      headers: {
        ...bearerHeaders(),
      },
      body: formData,
    });
  })();

export const updateEvent = (
  eventId: number,
  payload: Partial<EventPayload>,
) =>
  (() => {
    const useFormData = Boolean(payload.asset);

    if (useFormData) {
      const formData = new FormData();
      if (payload.event_title !== undefined) {
        formData.append("event_title", payload.event_title);
      }
      if (payload.event_desc !== undefined) {
        formData.append("event_desc", payload.event_desc);
      }
      if (payload.event_date !== undefined) {
        formData.append("event_date", payload.event_date);
      }
      if (payload.photo_path !== undefined) {
        formData.append("photo_path", payload.photo_path);
      }
      if (payload.asset) {
        formData.append("asset", payload.asset);
      }

      return apiFetch<EventResponse>(`/events/${eventId}`, {
        method: "PUT",
        headers: {
          ...bearerHeaders(),
        },
        body: formData,
      });
    }

    return apiFetch<EventResponse>(`/events/${eventId}`, {
      method: "PUT",
      headers: {
        ...bearerHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  })();

export const deleteEvent = (eventId: number) =>
  apiFetch<{ message: string }>(`/events/${eventId}`, {
    method: "DELETE",
    headers: bearerHeaders(),
  });
