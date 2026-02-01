import { Navbar as NavbarAdmin } from "../../components/admin/NavbarAdmin";

export const ManageSection = () => {
	return (
		<div className="min-h-screen bg-white">
			<NavbarAdmin />
			<main className="mx-auto w-full max-w-5xl px-6 py-10">
				<h1 className="text-2xl font-bold text-gray-900">Manage Sections</h1>
				<p className="mt-2 text-gray-600">
					This page is ready for section management features.
				</p>
				<div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<p className="text-sm text-gray-500">
						Add section tools here when you are ready.
					</p>
				</div>
			</main>
		</div>
	);
};
