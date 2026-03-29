import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { getAuthUser } from "@/lib/auth";
import {
  getSchoolCalendars,
  type SchoolCalendarItem,
} from "@/lib/schoolCalendarContent";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CalendarPreview = ({ imageUrl, label }: { imageUrl: string; label: string }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return (
      <div className="flex min-h-130 w-full items-center justify-center rounded-sm bg-white p-8 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-700">Calendar file not found</p>
          <p className="mt-2 text-lg text-gray-600">
            Add the file for School Year {label} in `public/` to display it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`School Calendar ${label}`}
      onError={() => setHasImageError(true)}
      className="h-auto w-full rounded-sm bg-white object-contain"
    />
  );
};

export const SchoolCalendar = () => {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin";
  const schoolCalendars = getSchoolCalendars();

  const [selectedYear, setSelectedYear] = useState(schoolCalendars[0]?.year ?? "2025");
  const selectedCalendar =
    schoolCalendars.find((calendar) => calendar.year === selectedYear) ?? schoolCalendars[0];

  if (!selectedCalendar) {
    return (
      <div>
        <RoleAwareNavbar />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="mb-8 text-4xl font-bold">School Calendar</h1>
          <p>No school calendar data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <RoleAwareNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">School Calendar ({selectedCalendar.label})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="w-full rounded-sm bg-gray-300 p-8">
              <CalendarPreview
                imageUrl={selectedCalendar.imageUrl}
                label={selectedCalendar.label}
              />
            </div>
            <p className="text-center font-bold mt-4">School Year {selectedCalendar.label}</p>
          </div>

          <div className="lg:col-span-1 flex lg:block lg:w-full w-fit mx-auto">
            <div>
              <h3 className="font-bold text-lg mb-4">Year</h3>
              <div className="space-y-2">
                {schoolCalendars.map((calendar: SchoolCalendarItem) => (
                  <button
                    key={calendar.year}
                    onClick={() => setSelectedYear(calendar.year)}
                    className={`block w-full text-left py-2 px-3 rounded transition ${
                      selectedYear === calendar.year
                        ? "bg-blue-500 text-white font-semibold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {calendar.year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Link
            to={`/editschoolcalendar?year=${selectedYear}`}
            className="fixed bottom-8 right-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Edit School Calendar"
          >
            <Pencil className="h-10 w-10" />
          </Link>
        )}
      </div>
    </div>
  );
};