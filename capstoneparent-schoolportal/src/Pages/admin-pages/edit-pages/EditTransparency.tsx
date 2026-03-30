import { EditTransparencyModal } from "@/components/admin/EditTransparencyModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import {
	getTransparencyContent,
	setTransparencyContent,
	type TransparencyContent,
} from "@/lib/transparencyContent";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const EditTransparency = () => {
	const navigate = useNavigate();
	const content = useMemo(() => getTransparencyContent(), []);

	const handleClose = () => {
		navigate("/transparency");
	};

	const handleSave = (updatedContent: TransparencyContent) => {
		setTransparencyContent(updatedContent);
		navigate("/transparency");
	};

	return (
		<div>
			<RoleAwareNavbar />
			<div className="mx-auto max-w-7xl px-4 py-10">
				<EditTransparencyModal
					isOpen
					onClose={handleClose}
					initialContent={content}
					onSave={handleSave}
				/>
			</div>
		</div>
	);
};
