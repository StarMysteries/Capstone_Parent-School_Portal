export interface SchoolCalendarItem {
  year: string;
  label: string;
  imageUrl: string;
  fileName?: string;
}

export const DEFAULT_SCHOOL_CALENDARS: SchoolCalendarItem[] = [];