import { EditSchoolCalendarModal } from "@/components/admin/EditSchoolCalendarModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import {
	getSchoolCalendars,
	updateSchoolCalendar,
	type SchoolCalendarItem,
} from "@/lib/schoolCalendarContent";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const EditSchoolCalendar = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const calendars = useMemo(() => getSchoolCalendars(), []);
	const [selectedYear, setSelectedYear] = useState(
		searchParams.get("year") ?? calendars[0]?.year ?? "2025",
	);

	const handleClose = () => {
		navigate("/schoolcalendar");
	};

	const handleSave = (updatedCalendar: SchoolCalendarItem) => {
		updateSchoolCalendar(updatedCalendar);
		navigate("/schoolcalendar");
	};

	return (
		<div>
			<RoleAwareNavbar />
			<div className="mx-auto max-w-7xl px-4 py-10">
				<EditSchoolCalendarModal
					isOpen
					onClose={handleClose}
					calendars={calendars}
					selectedYear={selectedYear}
					onSelectYear={setSelectedYear}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};
