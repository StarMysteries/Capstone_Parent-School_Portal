import { EditHistoryModal } from "@/components/admin/EditHistoryModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { type HistoryContent } from "@/lib/historyContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pagesApi } from "@/lib/api/pagesApi";

export const EditHistory = () => {
	const navigate = useNavigate();
	const [content, setContent] = useState<HistoryContent | null>(null);

	useEffect(() => {
		pagesApi.getHistory().then(setContent).catch(console.error);
	}, []);

	const handleClose = () => {
		navigate("/history");
	};

	const handleSave = async (updated: HistoryContent) => {
		try {
			await pagesApi.updateHistory(updated);
			navigate("/history");
		} catch (error) {
			console.error("Failed to save history", error);
		}
	};

	return (
		<div>
			<RoleAwareNavbar />
			<div className="mx-auto max-w-7xl px-4 py-10">
				{!content ? (
					<div className="p-8 text-center">Loading...</div>
				) : (
					<EditHistoryModal
						isOpen
						onClose={handleClose}
						initialContent={content}
						onSave={handleSave}
					/>
				)}
			</div>
		</div>
	);
};
