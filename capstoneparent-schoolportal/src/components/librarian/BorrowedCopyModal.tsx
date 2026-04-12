import React, { useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useLibraryStore, formatGradeLevel } from '@/lib/store/libraryStore';
import { useApiFeedbackStore } from "@/lib/store/apiFeedbackStore";
import type { BorrowRecord } from '@/lib/api/types';
import BorrowerDetailsModal from './BorrowerDetailsModal';

const BorrowedCopyModal: React.FC = () => {
	const [searchTerm, setSearchTerm] = React.useState('');
	const [subjectFilter, setSubjectFilter] = React.useState<string>('All');
	const [gradeFilter, setGradeFilter] = React.useState<string>('All');
	const [selectedItem, setSelectedItem] = React.useState<BorrowRecord | null>(null);
	const { showError, clearFeedback } = useApiFeedbackStore();

	const fetchBorrowHistory = useLibraryStore((state) => state.fetchBorrowHistory);
	const borrowHistory = useLibraryStore((state) => state.borrowHistory);
	const returnMaterial = useLibraryStore((state) => state.returnMaterial);
	const categories = useLibraryStore((state) => state.categories);

	useEffect(() => {
		// Only fetch active borrows for this view
		fetchBorrowHistory({ status: 'borrowed' });
	}, [fetchBorrowHistory]);

	const handleReturn = async (mbr_id: number) => {
		clearFeedback();
		try {
			await returnMaterial(mbr_id, { remarks: "Returned via Librarian Dashboard" });
		} catch (error) {
			console.error("Failed to return material", error);
			showError(error instanceof Error ? error.message : "Failed to return material.");
		}
	};

	const filteredItems = borrowHistory.filter((record) => {
		const itemTitle = record.copy?.item?.item_name || '';
		const matchesSearch = itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubject = subjectFilter === 'All' || record.copy?.item?.category_id.toString() === subjectFilter;
		const matchesGrade = gradeFilter === 'All' || record.copy?.item?.gl_id.toString() === gradeFilter;

		return matchesSearch && matchesSubject && matchesGrade;
	});

	const getBorrowerName = (record: BorrowRecord) => {
		if (record.student) return `${record.student.fname} ${record.student.lname}`;
		if (record.user) return `${record.user.fname} ${record.user.lname}`;
		return 'Unknown Borrower';
	};

	const getDateAndTime = (isoString?: string | null) => {
		if (!isoString) return { date: 'N/A', time: 'N/A' };
		const d = new Date(isoString);
		return {
			date: d.toLocaleDateString(),
			time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		};
	};

	return (
		<>
			<div className="mx-auto max-w-280 rounded-lg bg-white shadow-md p-6">
				<div className="flex flex-col gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search item"
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
						/>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="relative">
								<select
									value={subjectFilter}
									onChange={(event) => setSubjectFilter(event.target.value)}
									className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
								>
									<option value="All">All Subjects</option>
									{categories.map((c) => (
										<option key={c.category_id} value={c.category_id.toString()}>{c.category_name}</option>
									))}
								</select>
								<ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
							</div>

							<div className="relative">
								<select
									value={gradeFilter}
									onChange={(event) => setGradeFilter(event.target.value)}
									className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
								>
									<option value="All">All Grade Levels</option>
									<option value="1">Kindergarten</option>
									<option value="2">Grade 1</option>
									<option value="3">Grade 2</option>
									<option value="4">Grade 3</option>
									<option value="5">Grade 4</option>
									<option value="6">Grade 5</option>
									<option value="7">Grade 6</option>
								</select>
								<ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
							</div>
						</div>

						<button
							type="button"
							onClick={() => {
								setSearchTerm('');
								setSubjectFilter('All');
								setGradeFilter('All');
							}}
							className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:shrink-0"
						>
							Clear Filter
						</button>
					</div>

					<div className="space-y-3">
						{filteredItems.length === 0 && (
							<div className="rounded-md border border-gray-200 p-6 text-center text-gray-500">
								No borrowed items found.
							</div>
						)}

						{filteredItems.map((record) => {
							const isOverdue = new Date(record.due_at) < new Date();
							return (
								<div
									key={record.mbr_id}
									className="rounded-md border border-gray-200 p-4"
								>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px] sm:items-center">
										<button
											type="button"
											onClick={() => setSelectedItem(record)}
											className="text-left cursor-pointer"
										>
											<h3 className="text-lg font-bold text-gray-900">
												{record.copy?.item?.item_name} (Copy {record.copy?.copy_code})
											</h3>
											<p className="mt-1 text-sm text-gray-600">
												Borrower: <span className="font-semibold">{getBorrowerName(record)}</span>
											</p>
										</button>

										<div className="relative flex flex-col items-end">
											<button
												type="button"
												className="w-full rounded-full px-4 py-2 text-sm font-bold cursor-default bg-blue-100 text-blue-700 text-center mb-2"
											>
												BORROWED
											</button>
											<button
												onClick={() => handleReturn(record.mbr_id)}
												className="w-full rounded-full px-4 py-2 text-sm font-bold bg-green-500 text-white hover:bg-green-600 text-center"
											>
												Mark as Returned
											</button>
											{record.due_at && (
												<p className={`mt-2 text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
													Due: {getDateAndTime(record.due_at).date} {getDateAndTime(record.due_at).time}
												</p>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{selectedItem && (
				<BorrowerDetailsModal
					onClose={() => setSelectedItem(null)}
					itemName={`${selectedItem.copy?.item?.item_name} (Copy ${selectedItem.copy?.copy_code})`}
					status="BORROWED"
					onStatusChange={async (status) => {
						if (status === 'AVAILABLE') {
							await handleReturn(selectedItem.mbr_id);
							setSelectedItem(null);
						}
					}}
					borrowedDate={getDateAndTime(selectedItem.borrowed_at).date}
					borrowedTime={getDateAndTime(selectedItem.borrowed_at).time}
					dueDate={getDateAndTime(selectedItem.due_at).date}
					dueTime={getDateAndTime(selectedItem.due_at).time}
					borrowerName={getBorrowerName(selectedItem)}
					gradeLevel={formatGradeLevel(selectedItem.copy?.item?.gl_id || 0)}
					section="N/A"
				/>
			)}
		</>
	);
};

export default BorrowedCopyModal;
