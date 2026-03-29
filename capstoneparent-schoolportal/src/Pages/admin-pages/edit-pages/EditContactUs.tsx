import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import {
	getContactUsContent,
	setContactUsContent,
	type ContactUsContent,
} from "@/lib/contactUsContent";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export const EditContactUs = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<ContactUsContent>(() =>
		getContactUsContent(),
	);

	const handleChange =
		(field: keyof ContactUsContent) =>
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
		};

	const handleSave = () => {
		setContactUsContent(formData);
		navigate("/contactus");
	};

	return (
		<div>
			<RoleAwareNavbar />

			<div className="mx-auto max-w-7xl px-4 py-12">
				<h1 className="mb-8 text-4xl font-bold">Edit Contact us</h1>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div className="rounded-lg bg-[#e8e4b8] p-8 text-black">
						<div className="space-y-6">
							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="principalOffice">
									Principal's Office:
								</label>
								<input
									id="principalOffice"
									type="text"
									value={formData.principalOffice}
									onChange={handleChange("principalOffice")}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>

							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="libraryOffice">
									Library Office:
								</label>
								<input
									id="libraryOffice"
									type="text"
									value={formData.libraryOffice}
									onChange={handleChange("libraryOffice")}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>

							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="facultyOffice">
									Faculty Office:
								</label>
								<input
									id="facultyOffice"
									type="text"
									value={formData.facultyOffice}
									onChange={handleChange("facultyOffice")}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>

							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="facebookPageLabel">
									Facebook Page Name:
								</label>
								<input
									id="facebookPageLabel"
									type="text"
									value={formData.facebookPageLabel}
									onChange={handleChange("facebookPageLabel")}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>

							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="facebookPageUrl">
									Facebook Page URL:
								</label>
								<input
									id="facebookPageUrl"
									type="url"
									value={formData.facebookPageUrl}
									onChange={handleChange("facebookPageUrl")}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>

							<div>
								<label className="mb-2 block text-xl font-semibold" htmlFor="mapEmbedUrl">
									Google Map Embed URL:
								</label>
								<textarea
									id="mapEmbedUrl"
									value={formData.mapEmbedUrl}
									onChange={handleChange("mapEmbedUrl")}
									rows={4}
									className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--button-green)"
								/>
							</div>
						</div>
					</div>

					<div className="h-100 overflow-hidden rounded-lg shadow-lg md:h-auto">
						<iframe
							src={formData.mapEmbedUrl}
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Pagsabungan Elementary School Location"
						/>
					</div>
				</div>

				<div className="mt-6 flex justify-center">
					<button
						type="button"
						onClick={handleSave}
						className="rounded-2xl bg-(--button-green) px-6 py-3 text-3xl font-medium text-white transition-colors hover:bg-green-600"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};
