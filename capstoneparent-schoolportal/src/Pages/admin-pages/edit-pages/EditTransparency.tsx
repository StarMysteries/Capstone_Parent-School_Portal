import { EditTransparencyModal } from "@/components/admin/EditTransparencyModal";
import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { type TransparencyContent } from "@/lib/transparencyContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pagesApi } from "@/lib/api/pagesApi";

export const EditTransparency = () => {
	const navigate = useNavigate();
	const [content, setContent] = useState<TransparencyContent | null>(null);

	useEffect(() => {
		pagesApi.getTransparency().then(setContent).catch(console.error);
	}, []);

	const handleClose = () => {
		navigate("/transparency");
	};

	const handleSave = async (content: TransparencyContent, file?: File) => {
		try {
			await pagesApi.updateTransparency(file);
			navigate("/transparency");
		} catch (error) {
			console.error("Failed to save transparency", error);
		}
	};

	return (
		<div>
			<RoleAwareNavbar />
			<div className="mx-auto max-w-7xl px-4 py-10">
				{!content ? (
					<div className="p-8 text-center">Loading...</div>
				) : (
					<EditTransparencyModal
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
