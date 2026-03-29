export interface SchoolCalendarItem {
  year: string;
  label: string;
  imageUrl: string;
  fileName?: string;
}

const STORAGE_KEY = "school-calendar-content";

export const DEFAULT_SCHOOL_CALENDARS: SchoolCalendarItem[] = [
  {
    year: "2025",
    label: "2025 - 2026",
    imageUrl: "/school-calendar-2025-2026.png",
    fileName: "school-calendar-2025-2026.png",
  },
  {
    year: "2024",
    label: "2024 - 2025",
    imageUrl: "/school-calendar-2024-2025.png",
    fileName: "school-calendar-2024-2025.png",
  },
  {
    year: "2023",
    label: "2023 - 2024",
    imageUrl: "/school-calendar-2023-2024.png",
    fileName: "school-calendar-2023-2024.png",
  },
  {
    year: "2022",
    label: "2022 - 2023",
    imageUrl: "/school-calendar-2022-2023.png",
    fileName: "school-calendar-2022-2023.png",
  },
  {
    year: "2021",
    label: "2021 - 2022",
    imageUrl: "/school-calendar-2021-2022.png",
    fileName: "school-calendar-2021-2022.png",
  },
];

function getFileNameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || "calendar-image";
}

function normalizeCalendarItem(
  item: Partial<SchoolCalendarItem>,
  fallback: SchoolCalendarItem,
): SchoolCalendarItem {
  return {
    year: typeof item.year === "string" && item.year ? item.year : fallback.year,
    label:
      typeof item.label === "string" && item.label
        ? item.label
        : fallback.label,
    imageUrl:
      typeof item.imageUrl === "string" && item.imageUrl
        ? item.imageUrl
        : fallback.imageUrl,
    fileName:
      typeof item.fileName === "string" && item.fileName
        ? item.fileName
        : getFileNameFromUrl(
            typeof item.imageUrl === "string" && item.imageUrl
              ? item.imageUrl
              : fallback.imageUrl,
          ),
  };
}

function normalizeCalendars(raw: unknown): SchoolCalendarItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_SCHOOL_CALENDARS;
  }

  return DEFAULT_SCHOOL_CALENDARS.map((defaultItem) => {
    const maybeItem = raw.find(
      (item) =>
        typeof item === "object" &&
        item != null &&
        "year" in item &&
        (item as { year?: unknown }).year === defaultItem.year,
    ) as Partial<SchoolCalendarItem> | undefined;

    return normalizeCalendarItem(maybeItem ?? defaultItem, defaultItem);
  });
}

export function getSchoolCalendars(): SchoolCalendarItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_SCHOOL_CALENDARS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_SCHOOL_CALENDARS),
      );
      return DEFAULT_SCHOOL_CALENDARS;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeCalendars(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_SCHOOL_CALENDARS),
    );
    return DEFAULT_SCHOOL_CALENDARS;
  }
}

export function setSchoolCalendars(calendars: SchoolCalendarItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeCalendars(calendars);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function updateSchoolCalendar(updatedItem: SchoolCalendarItem): void {
  const calendars = getSchoolCalendars();
  const next = calendars.map((calendar) =>
    calendar.year === updatedItem.year
      ? normalizeCalendarItem(updatedItem, calendar)
      : calendar,
  );
  setSchoolCalendars(next);
}