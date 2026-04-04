import { EditSchoolCalendarModal } from "@/components/admin/EditSchoolCalendarModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { type SchoolCalendarItem } from "@/lib/schoolCalendarContent";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { pagesApi } from "@/lib/api/pagesApi";

const currentCalendarYear = () => String(new Date().getFullYear());

export const EditSchoolCalendar = () => {
  const navigate = useNavigate();

  const [calendars, setCalendars] = useState<SchoolCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pagesApi
      .getSchoolCalendars()
      .then((data) => {
        setCalendars(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  /** Same rule as the public page: edit the latest calendar, or create for the current calendar year if none. */
  const year = useMemo(() => {
    if (calendars.length > 0) {
      return calendars[0].year;
    }
    return currentCalendarYear();
  }, [calendars]);

  const handleClose = () => {
    navigate("/schoolcalendar");
  };

  const handleSave = async (updatedCalendar: SchoolCalendarItem, file?: File) => {
    try {
      await pagesApi.updateSchoolCalendar(updatedCalendar, file);
      navigate("/schoolcalendar");
    } catch (error) {
      console.error("Failed to save calendar", error);
    }
  };

  return (
    <div>
      <RoleAwareNavbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <EditSchoolCalendarModal
            isOpen
            onClose={handleClose}
            calendars={calendars}
            year={year}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};
