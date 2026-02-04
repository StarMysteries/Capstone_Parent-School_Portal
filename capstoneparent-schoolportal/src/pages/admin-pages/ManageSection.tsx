import { Search, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useMemo } from "react";
import { NavbarAdmin } from "../../components/admin/NavbarAdmin";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";

interface Section {
  id: number;
  name: string;
  adviser: string;
  students: number;
}

export const ManageSection = () => {
  // State management MUST CHANGE LATER TO API INTEGRATION
  const [sections, setSections] = useState<Section[]>([
    { id: 1, name: "Section A", adviser: "Mrs. Santos", students: 32 },
    { id: 2, name: "Section B", adviser: "Mr. Cruz", students: 30 },
    { id: 3, name: "Section C", adviser: "Ms. Reyes", students: 31 },
    { id: 4, name: "Section D", adviser: "Mr. Lim", students: 29 },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Section | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [formData, setFormData] = useState({
    name: "",
    adviser: "",
    students: 0,
  });

  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  // Sorting function
  const handleSort = (field: keyof Section) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered and sorted sections
  const filteredSections = useMemo(() => {
    let filtered = sections.filter(
      (section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.adviser.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }, [sections, searchQuery, sortField, sortDirection]);

  // Add section
  const handleAddSection = () => {
    if (!formData.name.trim() || !formData.adviser.trim()) return;

    const newSection: Section = {
      id: Math.max(...sections.map((s) => s.id), 0) + 1,
      name: formData.name,
      adviser: formData.adviser,
      students: formData.students,
    };

    setSections([...sections, newSection]);
    setFormData({ name: "", adviser: "", students: 0 });
    setIsAddModalOpen(false);
  };

  // Edit section
  const handleEditClick = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      adviser: section.adviser,
      students: section.students,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSection = () => {
    if (!editingSection || !formData.name.trim() || !formData.adviser.trim())
      return;

    setSections(
      sections.map((section) =>
        section.id === editingSection.id
          ? {
              ...section,
              name: formData.name,
              adviser: formData.adviser,
              students: formData.students,
            }
          : section,
      ),
    );
    setFormData({ name: "", adviser: "", students: 0 });
    setEditingSection(null);
    setIsEditModalOpen(false);
  };

  // Delete section
  const handleDeleteClick = (section: Section) => {
    setDeletingSection(section);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSection = () => {
    if (!deletingSection) return;

    setSections(
      sections.filter((section) => section.id !== deletingSection.id),
    );
    setDeletingSection(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Sections</h1>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-6 py-2"
                onClick={() => {
                  setFormData({ name: "", adviser: "", students: 0 });
                  setIsAddModalOpen(true);
                }}
              >
                Add New Section
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 hover:text-(--button-hover-green) transition-colors"
                    >
                      Section Name
                      {sortField === "name" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("adviser")}
                      className="flex items-center gap-2 hover:text-(--button-hover-green) transition-colors"
                    >
                      Adviser
                      {sortField === "adviser" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("students")}
                      className="flex items-center gap-2 hover:text-(--button-hover-green) transition-colors"
                    >
                      Students
                      {sortField === "students" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No sections found
                    </td>
                  </tr>
                ) : (
                  filteredSections.map((section) => (
                    <tr
                      key={section.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">{section.name}</td>
                      <td className="py-4 px-6">{section.adviser}</td>
                      <td className="py-4 px-6">{section.students}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(section)}
                            className="text-(--button-green) hover:text-(--button-hover-green) transition-colors"
                            aria-label="Edit section"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(section)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Delete section"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ name: "", adviser: "", students: 0 });
        }}
        title="Add Section"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Section name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Adviser name"
            value={formData.adviser}
            onChange={(e) =>
              setFormData({ ...formData, adviser: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="Number of students"
            value={formData.students || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                students: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddSection}
              className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full"
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSection(null);
          setFormData({ name: "", adviser: "", students: 0 });
        }}
        title="Edit Section"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Section name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Adviser name"
            value={formData.adviser}
            onChange={(e) =>
              setFormData({ ...formData, adviser: e.target.value })
            }
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="Number of students"
            value={formData.students || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                students: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateSection}
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
          setDeletingSection(null);
        }}
        title="Delete Section"
      >
        <div className="space-y-4">
          <p className="text-lg">
            Are you sure you want to delete{" "}
            <strong>{deletingSection?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingSection(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSection}
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
