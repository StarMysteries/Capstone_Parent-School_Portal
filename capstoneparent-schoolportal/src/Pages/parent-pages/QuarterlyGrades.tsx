import { AboutChildNavbar } from "@/components/parent/AboutChildNavbar";
import { NavbarParent } from "@/components/parent/NavbarParent";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

interface GradeData {
	subject: string;
	q1: number;
	q2: number;
	q3: number;
	q4: number;
	finalGrade: number;
	remarks: string;
}

const gradeData: GradeData[] = [
	{ subject: "Filipino", q1: 89, q2: 91, q3: 90, q4: 92, finalGrade: 90, remarks: "PASSED" },
	{ subject: "English", q1: 88, q2: 90, q3: 90, q4: 91, finalGrade: 90, remarks: "PASSED" },
	{ subject: "Mathematics", q1: 90, q2: 93, q3: 92, q4: 94, finalGrade: 92, remarks: "PASSED" },
	{ subject: "Science", q1: 87, q2: 88, q3: 88, q4: 90, finalGrade: 89, remarks: "PASSED" },
	{ subject: "Araling Panlipunan", q1: 85, q2: 88, q3: 86, q4: 87, finalGrade: 87, remarks: "PASSED" },
	{ subject: "MAPEH", q1: 92, q2: 93, q3: 94, q4: 95, finalGrade: 94, remarks: "PASSED" },
	{ subject: "Edukasyon an Pagpapakatao", q1: 88, q2: 90, q3: 89, q4: 91, finalGrade: 90, remarks: "PASSED" },
	{ subject: "Technology and Livelihood Education", q1: 86, q2: 88, q3: 87, q4: 89, finalGrade: 88, remarks: "PASSED" },
];

const gradingScale = [
	{ description: "Outstanding", scale: "90 - 100", remarks: "Passed" },
	{ description: "Very Satisfactory", scale: "85 - 89", remarks: "Passed" },
	{ description: "Satisfactory", scale: "80 - 84", remarks: "Passed" },
	{ description: "Fairly Satisfactory", scale: "75 - 79", remarks: "Passed" },
	{ description: "Did Not Meet Expectations", scale: "Below 75", remarks: "Failed" },
];

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

export const QuarterlyGrades = () => {
	const [selectedChild, setSelectedChild] = useState<Child>(childrenData[0]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const otherChildren = childrenData.filter(child => child.id !== selectedChild.id && child.status === "VERIFIED");

	const handleSelectChild = (child: Child) => {
		setSelectedChild(child);
		setIsDropdownOpen(false);
	};

	return (
		<div className="min-h-screen bg-white">
			<NavbarParent />
			<AboutChildNavbar activeTab="quarterly-grades" />

			<main className="mx-auto max-w-7xl px-6 pb-12 pt-6">
				{/* Student Information */}
				<section className="mb-6 rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-2xl font-bold">Student Information</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
						<div className="space-y-2">
							<p className="text-lg">
								<span className="font-semibold">Student Name:</span> {selectedChild.name}
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
								<span className="font-semibold">Grade Level & Section:</span> {selectedChild.gradeLevel} - {selectedChild.section}
							</p>
							<p className="text-lg">
								<span className="font-semibold">School Year:</span> {selectedChild.schoolYear}
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
								<ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
							</button>
							{isDropdownOpen && otherChildren.length > 0 && (
								<div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-300 bg-white shadow-lg z-10">
									{otherChildren.map((child) => (
										<button
											key={child.id}
											type="button"
											onClick={() => handleSelectChild(child)}
											className="block w-full px-4 py-3 text-left text-lg hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
										>
											{child.name}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</section>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Quarterly Grades */}
					<section className="rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-2xl font-bold">Quarterly Grades</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-center text-sm">
								<thead>
									<tr className="bg-gray-100">
										<th className="border border-gray-400 px-2 py-2 text-base font-semibold">
											Learning Areas
										</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Q1</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Q2</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Q3</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Q4</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">
											Final Grade
										</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Remarks</th>
									</tr>
								</thead>
								<tbody>
									{gradeData.map((row, index) => (
										<tr key={index} className="hover:bg-gray-50">
											<td className="border border-gray-400 px-2 py-2 text-left">{row.subject}</td>
											<td className="border border-gray-400 px-2 py-2">{row.q1}</td>
											<td className="border border-gray-400 px-2 py-2">{row.q2}</td>
											<td className="border border-gray-400 px-2 py-2">{row.q3}</td>
											<td className="border border-gray-400 px-2 py-2">{row.q4}</td>
											<td className="border border-gray-400 px-2 py-2 font-semibold">
												{row.finalGrade}
											</td>
											<td className="border border-gray-400 px-2 py-2 font-semibold">
												{row.remarks}
											</td>
										</tr>
									))}
									<tr className="bg-gray-100 font-bold">
										<td className="border border-gray-400 px-2 py-2 text-left">General Average</td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2">90</td>
										<td className="border border-gray-400 px-2 py-2">PASSED</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					{/* Attendance Records */}
					<section className="rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-2xl font-bold">Attendance Records</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-center text-sm">
								<thead>
									<tr className="bg-gray-100">
										<th className="border border-gray-400 px-2 py-2 font-semibold">Months</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Jun</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Jul</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Aug</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Sept</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Oct</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Nov</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Dec</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Jan</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Feb</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Mar</th>
										<th className="border border-gray-400 px-2 py-2 font-semibold">Total</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="border border-gray-400 px-2 py-2 text-left font-semibold">
											No. of School Days
										</td>
										<td className="border border-gray-400 px-2 py-2">22</td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2 font-semibold">22</td>
									</tr>
									<tr>
										<td className="border border-gray-400 px-2 py-2 text-left font-semibold">
											No. of Days Present
										</td>
										<td className="border border-gray-400 px-2 py-2">22</td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2 font-semibold">22</td>
									</tr>
									<tr>
										<td className="border border-gray-400 px-2 py-2 text-left font-semibold">
											No. of Times Absent
										</td>
										<td className="border border-gray-400 px-2 py-2">0</td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2"></td>
										<td className="border border-gray-400 px-2 py-2 font-semibold">0</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</div>

				{/* Grading Scale & Remarks */}
				<section className="mt-6 rounded-xl border-2 border-gray-300 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-2xl font-bold">Grading Scale & Remarks</h2>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-center">
							<thead>
								<tr className="bg-gray-100">
									<th className="border border-gray-400 px-4 py-3 text-base font-semibold">
										Description
									</th>
									<th className="border border-gray-400 px-4 py-3 text-base font-semibold">
										Grading Scale
									</th>
									<th className="border border-gray-400 px-4 py-3 text-base font-semibold">
										Remarks
									</th>
								</tr>
							</thead>
							<tbody>
								{gradingScale.map((row, index) => (
									<tr key={index} className="hover:bg-gray-50">
										<td className="border border-gray-400 px-4 py-3 text-left">{row.description}</td>
										<td className="border border-gray-400 px-4 py-3">{row.scale}</td>
										<td className="border border-gray-400 px-4 py-3 font-semibold">{row.remarks}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}
