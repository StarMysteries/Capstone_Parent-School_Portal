import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { NavbarAdmin } from "../../components/admin/NavbarAdmin";
import { Button } from "../../components/ui/button";
import { StatusDropdown } from "../../components/StatusDropdown";
import { Modal } from "../../components/ui/modal";

interface Student {
  id: number;
  name: string;
  lrn: string;
  gradeLevel: string;
  section: string;
  status: "ENROLLED" | "TRANSFERRED" | "GRADUATED" | "DROPPED" | "SUSPENDED";
  dateEnrolled: string;
}

export const ManageStudents = () => {
  // Sample data - replace with actual data from your backend
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Angela Reyes", lrn: "501142400721", gradeLevel: "Grade 1", section: "Section A", status: "ENROLLED", dateEnrolled: "03/7/2024" },
    { id: 2, name: "Ethan Navarro", lrn: "501142400722", gradeLevel: "Grade 1", section: "Section A", status: "ENROLLED", dateEnrolled: "03/7/2025" },
    { id: 3, name: "Jasmine Tolentino", lrn: "501142400723", gradeLevel: "Grade 4", section: "Section B", status: "TRANSFERRED", dateEnrolled: "03/7/2024" },
    { id: 4, name: "Lorenzo Castillo", lrn: "501142400724", gradeLevel: "Grade 6", section: "Section A", status: "GRADUATED", dateEnrolled: "03/7/2024" },
    { id: 5, name: "Sophia Dizon", lrn: "501142400725", gradeLevel: "Grade 2", section: "Section C", status: "DROPPED", dateEnrolled: "03/7/2024" },
    { id: 6, name: "Joshua Salvador", lrn: "501142400726", gradeLevel: "Grade 5", section: "Section C", status: "DROPPED", dateEnrolled: "03/7/2024" },
    { id: 7, name: "Angela Navarro", lrn: "501142400726", gradeLevel: "Grade 5", section: "Section D", status: "SUSPENDED", dateEnrolled: "03/7/2024" },
    { id: 8, name: "Joshua Salvador", lrn: "501142400727", gradeLevel: "Grade 5", section: "Section D", status: "SUSPENDED", dateEnrolled: "03/7/2024" },
    { id: 2, name: "Ethan Navarro", lrn: "501142400722", gradeLevel: "Grade 1", section: "Section A", status: "ENROLLED", dateEnrolled: "03/7/2025" },
    { id: 3, name: "Jasmine Tolentino", lrn: "501142400723", gradeLevel: "Grade 4", section: "Section B", status: "TRANSFERRED", dateEnrolled: "03/7/2024" },
    { id: 4, name: "Lorenzo Castillo", lrn: "501142400724", gradeLevel: "Grade 6", section: "Section A", status: "GRADUATED", dateEnrolled: "03/7/2024" },
    { id: 5, name: "Sophia Dizon", lrn: "501142400725", gradeLevel: "Grade 2", section: "Section C", status: "DROPPED", dateEnrolled: "03/7/2024" },
    { id: 6, name: "Joshua Salvador", lrn: "501142400726", gradeLevel: "Grade 5", section: "Section C", status: "DROPPED", dateEnrolled: "03/7/2024" },
    { id: 7, name: "Angela Navarro", lrn: "501142400726", gradeLevel: "Grade 5", section: "Section D", status: "SUSPENDED", dateEnrolled: "03/7/2024" },
    { id: 8, name: "Joshua Salvador", lrn: "501142400727", gradeLevel: "Grade 5", section: "Section D", status: "SUSPENDED", dateEnrolled: "03/7/2024" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sex: "Male",
    lrn: "",
    gradeLevel: "Grade 1",
    section: "Section A",
    status: "ENROLLED" as "ENROLLED" | "TRANSFERRED" | "GRADUATED" | "DROPPED" | "SUSPENDED",
    dateEnrolled: "",
  });

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Filtered students
  const filteredStudents = useMemo(() => {
    let filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lrn.includes(searchQuery)
    );

    if (gradeLevelFilter !== "all") {
      filtered = filtered.filter((s) => s.gradeLevel === gradeLevelFilter);
    }

    if (sectionFilter !== "all") {
      filtered = filtered.filter((s) => s.section === sectionFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    return filtered;
  }, [students, searchQuery, gradeLevelFilter, sectionFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENROLLED":
        return "text-(--status-enrolled) bg-green-100";
      case "TRANSFERRED":
        return "text-(--status-transferred) bg-yellow-100";
      case "GRADUATED":
        return "text-(--status-graduated) bg-blue-100";
      case "DROPPED":
        return "text-(--status-dropped) bg-red-100";
      case "SUSPENDED":
        return "text-(--status-suspended) bg-purple-100";
      default:
        return "text-gray-900 bg-gray-100";
    }
  };

  // Get unique grade levels and sections for filters
  const gradeLevels = ["all", ...Array.from(new Set(students.map(s => s.gradeLevel))).sort((a, b) => {
    const numA = parseInt(a.replace("Grade ", ""));
    const numB = parseInt(b.replace("Grade ", ""));
    return numA - numB;
  })];
  const sections = ["all", ...Array.from(new Set(students.map(s => s.section)))];

  // Add student handler
  const handleAddStudent = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.lrn.trim() || !formData.dateEnrolled) return;

    const newStudent: Student = {
      id: Math.max(...students.map((s) => s.id), 0) + 1,
      name: `${formData.firstName} ${formData.lastName}`,
      lrn: formData.lrn,
      gradeLevel: formData.gradeLevel,
      section: formData.section,
      status: formData.status,
      dateEnrolled: formData.dateEnrolled,
    };

    setStudents([...students, newStudent]);
    setFormData({
      firstName: "",
      lastName: "",
      sex: "Male",
      lrn: "",
      gradeLevel: "Grade 1",
      section: "Section A",
      status: "ENROLLED",
      dateEnrolled: "",
    });
    setIsAddModalOpen(false);
  };

  // Edit student handlers
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    const nameParts = student.name.split(" ");
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      sex: "Male", // Default, you may want to store this in the Student interface
      lrn: student.lrn,
      gradeLevel: student.gradeLevel,
      section: student.section,
      status: student.status,
      dateEnrolled: student.dateEnrolled,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent || !formData.firstName.trim() || !formData.lastName.trim() || !formData.lrn.trim() || !formData.dateEnrolled)
      return;

    setStudents(
      students.map((student) =>
        student.id === editingStudent.id
          ? {
              ...student,
              name: `${formData.firstName} ${formData.lastName}`,
              lrn: formData.lrn,
              gradeLevel: formData.gradeLevel,
              section: formData.section,
              status: formData.status,
              dateEnrolled: formData.dateEnrolled,
            }
          : student,
      ),
    );
    setFormData({
      firstName: "",
      lastName: "",
      sex: "Male",
      lrn: "",
      gradeLevel: "Grade 1",
      section: "Section A",
      status: "ENROLLED",
      dateEnrolled: "",
    });
    setEditingStudent(null);
    setIsEditModalOpen(false);
  };

  // Delete student handlers
  const handleDeleteClick = (student: Student) => {
    setDeletingStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!deletingStudent) return;

    setStudents(
      students.filter((student) => student.id !== deletingStudent.id),
    );
    setDeletingStudent(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <NavbarAdmin />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Students</h1>
            <Button
              className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-6 py-2"
              onClick={() => {
                setFormData({
                  firstName: "",
                  lastName: "",
                  sex: "Male",
                  lrn: "",
                  gradeLevel: "Grade 1",
                  section: "Section A",
                  status: "ENROLLED",
                  dateEnrolled: "",
                });
                setIsAddModalOpen(true);
              }}
            >
              Add New Student
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search student name or LRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <StatusDropdown
              value={gradeLevelFilter}
              onChange={setGradeLevelFilter}
              placeholder="Grade Level"
              options={gradeLevels.map(grade => ({
                value: grade,
                label: grade === "all" ? "Grade Level" : grade
              }))}
            />
            <StatusDropdown
              value={sectionFilter}
              onChange={setSectionFilter}
              placeholder="Section"
              options={sections.map(section => ({
                value: section,
                label: section === "all" ? "Section" : section
              }))}
            />
            <StatusDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
              options={[
                { value: "all", label: "Status" },
                { value: "ENROLLED", label: "Enrolled", className: "text-(--status-enrolled)" },
                { value: "TRANSFERRED", label: "Transferred", className: "text-(--status-transferred)" },
                { value: "GRADUATED", label: "Graduated", className: "text-(--status-graduated)" },
                { value: "DROPPED", label: "Dropped", className: "text-(--status-dropped)" },
                { value: "SUSPENDED", label: "Suspended", className: "text-(--status-suspended)" },
              ]}
            />
          </div>

          {/* Table */}
          {filteredStudents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">LRN</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Grade Level & Section</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date Enrolled</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">{student.name}</td>
                      <td className="py-4 px-6">{student.lrn}</td>
                      <td className="py-4 px-6">{student.gradeLevel} - {student.section}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">{student.dateEnrolled}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3">
                          <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            aria-label="View student"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="text-(--button-green) hover:text-(--button-hover-green) transition-colors"
                            aria-label="Edit student"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Delete student"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? "bg-(--button-green) text-white border-(--button-green)"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-3 py-1">...</span>
              )}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            firstName: "",
            lastName: "",
            sex: "Male",
            lrn: "",
            gradeLevel: "Grade 1",
            section: "Section A",
            status: "ENROLLED",
            dateEnrolled: "",
          });
        }}
        title="Add Student"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="LRN Number"
            value={formData.lrn}
            onChange={(e) => setFormData({ ...formData, lrn: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <select
            value={formData.gradeLevel}
            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
          </select>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
            <option value="Section D">Section D</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="ENROLLED" className="text-green-600">ENROLLED</option>
            <option value="TRANSFERRED" className="text-yellow-600">TRANSFERRED</option>
            <option value="GRADUATED" className="text-blue-600">GRADUATED</option>
            <option value="DROPPED" className="text-red-600">DROPPED</option>
            <option value="SUSPENDED" className="text-purple-600">SUSPENDED</option>
          </select>
          <input
            type="text"
            placeholder="Date Enrolled (MM/DD/YY)"
            value={formData.dateEnrolled}
            onChange={(e) => setFormData({ ...formData, dateEnrolled: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddStudent}
              className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full"
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStudent(null);
          setFormData({
            firstName: "",
            lastName: "",
            sex: "Male",
            lrn: "",
            gradeLevel: "Grade 1",
            section: "Section A",
            status: "ENROLLED",
            dateEnrolled: "",
          });
        }}
        title="Edit Student"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="LRN Number"
            value={formData.lrn}
            onChange={(e) => setFormData({ ...formData, lrn: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <select
            value={formData.gradeLevel}
            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
          </select>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
            <option value="Section D">Section D</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
          >
            <option value="ENROLLED" className="text-green-600">ENROLLED</option>
            <option value="TRANSFERRED" className="text-yellow-600">TRANSFERRED</option>
            <option value="GRADUATED" className="text-blue-600">GRADUATED</option>
            <option value="DROPPED" className="text-red-600">DROPPED</option>
            <option value="SUSPENDED" className="text-purple-600">SUSPENDED</option>
          </select>
          <input
            type="text"
            placeholder="Date Enrolled (MM/DD/YY)"
            value={formData.dateEnrolled}
            onChange={(e) => setFormData({ ...formData, dateEnrolled: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateStudent}
              className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full"
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingStudent(null);
        }}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-lg">
            Are you sure you want to delete{" "}
            <strong>{deletingStudent?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingStudent(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteStudent}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};