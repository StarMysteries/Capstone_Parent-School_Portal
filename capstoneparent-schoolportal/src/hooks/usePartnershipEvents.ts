import { useCallback, useEffect, useState } from "react";
import {
  createEvent as createEventRequest,
  deleteEvent as deleteEventRequest,
  getEvents,
  updateEvent as updateEventRequest,
} from "@/lib/api/eventsApi";
import type { PartnershipEventItem } from "@/lib/partnershipEvents";
import { mapBackendEventToPartnershipEvent } from "@/lib/partnershipEvents";

const toIsoDate = (value?: string) => {
  const candidate = value?.trim();
  if (!candidate) {
    return undefined;
  }

  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().slice(0, 10);
};

export const usePartnershipEvents = () => {
  const [events, setEvents] = useState<PartnershipEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getEvents({ limit: 100 });
      setEvents(response.data.map(mapBackendEventToPartnershipEvent));
    } catch (error) {
      console.error("Failed to fetch partnership events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addEvent = useCallback(
    async (event: Omit<PartnershipEventItem, "id" | "slug">) => {
      const response = await createEventRequest({
        event_title: event.title.trim(),
        event_desc: event.description.trim(),
        ...(event.imageFile
          ? { asset: event.imageFile }
          : event.imageUrl.trim()
            ? { photo_path: event.imageUrl.trim() }
            : {}),
      });

      const createdEvent = mapBackendEventToPartnershipEvent(response.data);
      setEvents((prev) => [createdEvent, ...prev]);
      return createdEvent;
    },
    [],
  );

  const updateEvent = useCallback(
    async (id: number, updates: Partial<PartnershipEventItem>) => {
      const payload: {
        event_title?: string;
        event_desc?: string;
        event_date?: string;
        photo_path?: string;
        asset?: File;
      } = {};

      if (updates.title !== undefined) {
        payload.event_title = updates.title.trim();
      }
      if (updates.description !== undefined) {
        payload.event_desc = updates.description.trim();
      }
      if (updates.eventDate !== undefined) {
        const isoDate = toIsoDate(updates.eventDate);
        if (isoDate) {
          payload.event_date = isoDate;
        }
      }
      if (updates.imageUrl !== undefined) {
        payload.photo_path = updates.imageUrl.trim();
      }
      if (updates.imageFile !== undefined) {
        payload.asset = updates.imageFile;
        if (updates.imageFile) {
          delete payload.photo_path;
        }
      }

      const response = await updateEventRequest(id, payload);
      const normalizedEvent = mapBackendEventToPartnershipEvent(response.data);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? normalizedEvent : event)),
      );
      return normalizedEvent;
    },
    [],
  );

  const deleteEvent = useCallback(async (id: number) => {
    await deleteEventRequest(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  return {
    events,
    isLoading,
    reload,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
