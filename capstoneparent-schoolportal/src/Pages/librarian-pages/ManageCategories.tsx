import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

export const ManageCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Mathematics",
    "Science",
    "Games",
    "History",
  ];

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <NavbarLibrarian />
      <main className="mx-auto max-w-7xl px-6 pb-12 pt-6">
        <h1 className="mb-6 text-2xl font-semibold text-center">
          Manage Category
        </h1>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-gray-100 p-6">
              <Input
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="mt-4 bg-white rounded-lg shadow">
                {filtered.map((c) => (
                  <div
                    key={c}
                    className="px-4 py-2 border-b last:border-b-0 text-center"
                  >
                    {c}
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
        </div>
        <button
          className="fixed bottom-6 right-6 rounded-full bg-green-500 p-4 text-white hover:bg-green-600"
          type="button"
        >
          <Plus className="size-6" />
        </button>
      </main>
    </div>
  );
};
