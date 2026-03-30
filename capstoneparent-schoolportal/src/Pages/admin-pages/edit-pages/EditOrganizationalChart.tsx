import { EditOrganizationalChartModal } from "@/components/admin/EditOrganizationalChartModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import {
	getOrganizationalCharts,
	updateOrganizationalChart,
	type OrganizationalChartItem,
} from "@/lib/organizationalChartContent";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const EditOrganizationalChart = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const charts = useMemo(() => getOrganizationalCharts(), []);
	const [selectedYear, setSelectedYear] = useState(
		searchParams.get("year") ?? charts[0]?.year ?? "2025",
	);

	const handleClose = () => {
		navigate("/orginizationalchart");
	};

	const handleSave = (updatedChart: OrganizationalChartItem) => {
		updateOrganizationalChart(updatedChart);
		navigate("/orginizationalchart");
	};

	return (
		<div>
			<RoleAwareNavbar />
			<div className="mx-auto max-w-7xl px-4 py-10">
				<EditOrganizationalChartModal
					isOpen
					onClose={handleClose}
					charts={charts}
					selectedYear={selectedYear}
					onSelectYear={setSelectedYear}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};
