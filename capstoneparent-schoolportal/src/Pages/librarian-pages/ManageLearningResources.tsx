import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import AddLearningResourceModal from "@/components/librarian/AddLearningResourceModal";
import EditLearningResourceModal from "@/components/librarian/EditLearningResourceModal";
import BookCopyModal from "@/components/librarian/BookCopyModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLibraryStore, formatGradeLevel, GRADE_LEVELS } from "@/lib/store/libraryStore";

export const ManageLearningResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [isAddLearningResourceModalOpen, setIsAddLearningResourceModalOpen] = useState(false);
  const [isEditLearningResourceModalOpen, setIsEditLearningResourceModalOpen] = useState(false);
  const [isLearningResourceCopyModalOpen, setIsLearningResourceCopyModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);

  const materials = useLibraryStore((state) => state.materials);
  const categories = useLibraryStore((state) => state.categories);
  const fetchMaterials = useLibraryStore((state) => state.fetchMaterials);
  const fetchCategories = useLibraryStore((state) => state.fetchCategories);
  const createMaterial = useLibraryStore((state) => state.createMaterial);
  const updateMaterial = useLibraryStore((state) => state.updateMaterial);

  useEffect(() => {
    fetchMaterials({ item_type: "Learning_Resource" });
    fetchCategories();
  }, [fetchMaterials, fetchCategories]);

  const resources = useMemo(() => materials.filter((m) => m.item_type === "Learning_Resource"), [materials]);

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || r.category_id.toString() === categoryFilter;
    const matchesGrade =
      gradeFilter === "all" || r.gl_id.toString() === gradeFilter;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const handleAddResources = async (newResource: {
    title: string;
    category_id: number;
    gl_id: number;
  }) => {
    await createMaterial({
      item_name: newResource.title,
      category_id: newResource.category_id,
      gl_id: newResource.gl_id,
      item_type: "Learning_Resource",
    });
  };

  const selectedResource = resources.find((resource) => resource.item_id === selectedResourceId);

  const handleOpenEditLearningResourceModal = (resourceId: number) => {
    setSelectedResourceId(resourceId);
    setIsEditLearningResourceModalOpen(true);
  };

  const handleCloseEditLearningResourceModal = () => {
    setIsEditLearningResourceModalOpen(false);
    setSelectedResourceId(null);
  };

  const handleSaveEditedResource = async (updatedResource: {
    title: string;
    category_id: number;
    gl_id: number;
  }) => {
    if (!selectedResourceId) return;
    await updateMaterial(selectedResourceId, {
      item_name: updatedResource.title,
      category_id: updatedResource.category_id,
      gl_id: updatedResource.gl_id,
    });
  };

  return (
    <>
      <div className="min-h-screen">
        <NavbarLibrarian />
        <main className="max-w-6xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold">Manage Learning Resources</h1>
              <Button
                className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-6 py-2"
                onClick={() => setIsAddLearningResourceModalOpen(true)}
              >
                Add Item
              </Button>
            </div>

            <section className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => setCategoryFilter(v)}
                >
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.category_id} value={c.category_id.toString()}>
                        {c.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={gradeFilter}
                  onValueChange={(v) => setGradeFilter(v)}
                >
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Grade Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {GRADE_LEVELS.map((g) => (
                      <SelectItem key={g.id} value={g.id.toString()}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {filteredResources.map((res) => (
                <div
                  key={res.item_id}
                  className="flex items-center justify-between px-4 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedResourceId(res.item_id);
                    setIsLearningResourceCopyModalOpen(true);
                  }}
                >
                  <span className="text-lg font-medium">{res.item_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {res.category?.category_name}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {formatGradeLevel(res.gl_id)}
                    </span>
                    <Pencil
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenEditLearningResourceModal(res.item_id);
                      }}
                      className="cursor-pointer text-(--button-green) hover:text-(--button-hover-green)"
                      size={18}
                    />
                  </div>
                </div>
              ))}
              {filteredResources.length === 0 && (
                <p className="text-center text-gray-500 py-8">No items found.</p>
              )}
            </section>
          </div>
        </main>
      </div>

      {isAddLearningResourceModalOpen && (
        <AddLearningResourceModal
          onClose={() => setIsAddLearningResourceModalOpen(false)}
          onAdd={handleAddResources}
          categories={categories}
        />
      )}

      {isEditLearningResourceModalOpen && selectedResource && (
        <EditLearningResourceModal
          onClose={handleCloseEditLearningResourceModal}
          onSave={handleSaveEditedResource}
          categories={categories}
          initialResource={{
            title: selectedResource.item_name,
            category_id: selectedResource.category_id,
            gl_id: selectedResource.gl_id,
          }}
        />
      )}

      {isLearningResourceCopyModalOpen && selectedResource && (
        <BookCopyModal
          material={selectedResource}
          onClose={() => {
            setIsLearningResourceCopyModalOpen(false);
            setSelectedResourceId(null);
          }}
        />
      )}
    </>
  );
};

