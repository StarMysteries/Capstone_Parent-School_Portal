import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import AddCategoryModal from "@/components/librarian/AddCategoryModal";
import { Input } from "@/components/ui/input";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { useEffect, useState } from "react";

export const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const categories = useLibraryStore((state) => state.categories);
  const fetchCategories = useLibraryStore((state) => state.fetchCategories);
  const createCategory = useLibraryStore((state) => state.createCategory);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (newCategory: string) => {
    await createCategory(newCategory);
    setShowAddCategoryModal(false);
  };

  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <NavbarLibrarian />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Categories</h1>
            <button
              className="rounded-md bg-(--button-green) px-4 py-2 text-white font-semibold hover:bg-(--button-hover-green) transition-colors"
              type="button"
              onClick={() => setShowAddCategoryModal(true)}
            >
              Add Category
            </button>
          </div>

          <div className="mx-auto w-full max-w-md">
            <Input
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2 text-center focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filtered.map((c) => (
                  <div
                    key={c.category_id}
                    className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 last:border-b-0"
                  >
                    <span className="min-w-32 text-left">{c.category_name}</span>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No categories found.
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>

      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={handleAddCategory}
        />
      )}
    </div>
  );
};

