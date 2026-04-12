import { AboutChildNavbar } from "@/components/parent/AboutChildNavbar";
import { NavbarParent } from "@/components/parent/NavbarParent";
import { ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useLibraryStore } from "@/lib/store/libraryStore";

// Keep dummy children for now, as parent module dynamic children are out of scope for this task
interface Child {
	id: string;
	name: string;
	status: "VERIFIED" | "PENDING" | "DENIED";
	lrn?: string;
	gradeLevel?: string;
	section?: string;
	schoolYear?: string;
	sex?: string;
}

const childrenData: Child[] = [
	{
		id: "1",
		name: "Angela Reyes",
		status: "VERIFIED",
		lrn: "501142400721",
		gradeLevel: "Grade 1",
		section: "Section A",
		schoolYear: "2024 - 2025",
		sex: "Female",
	},
	{
		id: "2",
		name: "Miguel Fernandez",
		status: "VERIFIED",
		lrn: "501142400722",
		gradeLevel: "Grade 2",
		section: "Section B",
		schoolYear: "2024 - 2025",
		sex: "Male",
	},
	{
		id: "3",
		name: "Jasmine Tolentino",
		status: "VERIFIED",
		lrn: "501142400723",
		gradeLevel: "Grade 3",
		section: "Section C",
		schoolYear: "2024 - 2025",
		sex: "Female",
	},
];

export const LibraryRecords = () => {
	const [selectedChild, setSelectedChild] = useState<Child>(childrenData[0]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

	const borrowHistory = useLibraryStore((state) => state.borrowHistory);
	const fetchBorrowHistory = useLibraryStore((state) => state.fetchBorrowHistory);

	useEffect(() => {
		// Pass selected child ID to filter fetch. Uses dummy 1, 2, 3 as fallback.
		fetchBorrowHistory({ student_id: parseInt(selectedChild.id) || 1 });
	}, [fetchBorrowHistory, selectedChild.id]);

	const otherChildren = childrenData.filter(
		(child) => child.id !== selectedChild.id && child.status === "VERIFIED"
	);

	const handleSelectChild = (child: Child) => {
		setSelectedChild(child);
		setIsDropdownOpen(false);
	};

	const filteredTransactions = borrowHistory.filter((transaction) => {
		const title = transaction.copy?.item?.item_name || "";
		const author = transaction.copy?.item?.author || "";
		
		const matchesSearch =
			title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			author.toLowerCase().includes(searchQuery.toLowerCase());
			
		const computedStatus = transaction.returned_at ? "RETURNED" : (new Date(transaction.due_at) < new Date() ? "OVERDUE" : "BORROWED");
		
		const matchesStatus =
			statusFilter === "all" || computedStatus === statusFilter;
			
		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "BORROWED":
				return "bg-green-500 text-white";
			case "RETURNED":
				return "bg-blue-500 text-white";
			case "OVERDUE":
				return "bg-red-600 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	// Calculate summary
	const totalBooksBorrowed = borrowHistory.length;
	const currentlyBorrowed = borrowHistory.filter(
		(t) => !t.returned_at
	).length;
	const overdueBooks = borrowHistory.filter(
		(t) => !t.returned_at && new Date(t.due_at) < new Date()
	).length;
	const totalFines = borrowHistory.reduce((sum, t) => {
		const penalty = typeof t.penalty_cost === "string" ? parseFloat(t.penalty_cost) : (t.penalty_cost || 0);
		return sum + penalty;
	}, 0);

	const formatDate = (isoStr?: string | null) => {
		if (!isoStr) return "-";
		return new Date(isoStr).toLocaleDateString();
	};

	return (
		<div className="min-h-screen bg-white">
			<NavbarParent />
			<AboutChildNavbar activeTab="library-records" />

			<main className="mx-auto max-w-7xl px-6 pb-12 pt-6">
				{/* Student Information */}
				<section className="mb-6 rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-2xl font-bold">Student Information</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
						<div className="space-y-2">
							<p className="text-lg">
								<span className="font-semibold">Student Name:</span>{" "}
								{selectedChild.name}
							</p>
							<p className="text-lg">
								<span className="font-semibold">Sex:</span> {selectedChild.sex}
							</p>
							<p className="text-lg">
								<span className="font-semibold">LRN:</span> {selectedChild.lrn}
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-lg">
								<span className="font-semibold">Grade Level & Section:</span>{" "}
								{selectedChild.gradeLevel} - {selectedChild.section}
							</p>
							<p className="text-lg">
								<span className="font-semibold">School Year:</span>{" "}
								{selectedChild.schoolYear}
							</p>
						</div>
					</div>
					<div className="mt-4 flex justify-end">
						<div className="relative">
							<button
								type="button"
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-2 rounded-lg border border-gray-400 bg-white px-4 py-2 text-lg font-medium transition-colors hover:bg-gray-50"
							>
								Switch to another child
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										isDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>
							{isDropdownOpen && otherChildren.length > 0 && (
								<div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-300 bg-white shadow-lg">
									{otherChildren.map((child) => (
										<button
											key={child.id}
											type="button"
											onClick={() => handleSelectChild(child)}
											className="block w-full px-4 py-3 text-left text-lg transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100"
										>
											{child.name}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</section>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
					{/* Library Transactions */}
					<section className="rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-2xl font-bold">Library Transactions</h2>

						{/* Search and Filter */}
						<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Search"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-base transition-colors focus:border-gray-400 focus:outline-none"
								/>
							</div>
							<div className="relative">
								<button
									type="button"
									onClick={() =>
										setIsStatusDropdownOpen(!isStatusDropdownOpen)
									}
									className="flex w-48 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors hover:bg-gray-50"
								>
									<span>
										{statusFilter === "all"
											? "Status"
											: statusFilter.charAt(0) +
											  statusFilter.slice(1).toLowerCase()}
									</span>
									<ChevronDown
										className={`h-5 w-5 transition-transform ${
											isStatusDropdownOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								{isStatusDropdownOpen && (
									<div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
										{["all", "BORROWED", "RETURNED", "OVERDUE"].map(
											(status) => (
												<button
													key={status}
													type="button"
													onClick={() => {
														setStatusFilter(status);
														setIsStatusDropdownOpen(false);
													}}
													className="block w-full px-4 py-2 text-left text-base transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100"
												>
													{status === "all"
														? "All Status"
														: status.charAt(0) + status.slice(1).toLowerCase()}
												</button>
											)
										)}
									</div>
								)}
							</div>
						</div>

						{/* Transactions Table */}
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-left text-sm">
								<thead>
									<tr className="bg-gray-100">
										<th className="border border-gray-400 px-3 py-3 font-semibold">
											Book Title
										</th>
										<th className="border border-gray-400 px-3 py-3 font-semibold">
											Author
										</th>
										<th className="border border-gray-400 px-3 py-3 font-semibold">
											Date Borrowed
										</th>
										<th className="border border-gray-400 px-3 py-3 font-semibold">
											Due Date
										</th>
										<th className="border border-gray-400 px-3 py-3 font-semibold">
											Date Returned
										</th>
										<th className="border border-gray-400 px-3 py-3 text-center font-semibold">
											Status
										</th>
										<th className="border border-gray-400 px-3 py-3 text-center font-semibold">
											Fines
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredTransactions.length > 0 ? (
										filteredTransactions.map((transaction) => {
											const tStatus = transaction.returned_at ? "RETURNED" : (new Date(transaction.due_at) < new Date() ? "OVERDUE" : "BORROWED");
											const penalty = typeof transaction.penalty_cost === "string" ? parseFloat(transaction.penalty_cost) : (transaction.penalty_cost || 0);

											return (
												<tr key={transaction.mbr_id} className="hover:bg-gray-50">
													<td className="border border-gray-400 px-3 py-3">
														{transaction.copy?.item?.item_name || "-"} (Copy {transaction.copy?.copy_code})
													</td>
													<td className="border border-gray-400 px-3 py-3">
														{transaction.copy?.item?.author || "-"}
													</td>
													<td className="border border-gray-400 px-3 py-3">
														{formatDate(transaction.borrowed_at)}
													</td>
													<td className="border border-gray-400 px-3 py-3">
														{formatDate(transaction.due_at)}
													</td>
													<td className="border border-gray-400 px-3 py-3 text-center">
														{transaction.returned_at ? formatDate(transaction.returned_at) : "-"}
													</td>
													<td className="border border-gray-400 px-3 py-3 text-center">
														<span
															className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(tStatus)}`}
														>
															{tStatus}
														</span>
													</td>
													<td className="border border-gray-400 px-3 py-3 text-center">
														{penalty > 0
															? `₱ ${penalty.toFixed(2)}`
															: "-"}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td
												colSpan={7}
												className="border border-gray-400 px-3 py-8 text-center text-gray-500"
											>
												No transactions found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</section>

					{/* Library Account Summary */}
					<aside className="rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-bold">Library Account Summary</h2>
						<div className="space-y-3">
							<div className="flex items-center justify-between border-b border-gray-200 pb-2">
								<span className="text-base font-medium">
									Total Books Borrowed:
								</span>
								<span className="text-base font-bold">{totalBooksBorrowed}</span>
							</div>
							<div className="flex items-center justify-between border-b border-gray-200 pb-2">
								<span className="text-base font-medium">
									Currently Borrowed:
								</span>
								<span className="text-base font-bold">{currentlyBorrowed}</span>
							</div>
							<div className="flex items-center justify-between border-b border-gray-200 pb-2">
								<span className="text-base font-medium">Overdue Books:</span>
								<span className="text-base font-bold">{overdueBooks}</span>
							</div>
							<div className="flex items-center justify-between pt-2">
								<span className="text-base font-medium">Total Fines:</span>
								<span className="text-base font-bold">
									₱ {totalFines.toFixed(2)}
								</span>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</div>
	);
}