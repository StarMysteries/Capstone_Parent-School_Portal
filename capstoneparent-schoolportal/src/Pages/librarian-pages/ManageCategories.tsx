import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen">
      <NavbarLibrarian />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Categories</h1>
            <button
              className="rounded-md bg-(--button-green) px-4 py-2 text-white font-semibold hover:bg-(--button-hover-green) transition-colors"
              type="button"
            >
              Add Category
            </button>
          </div>

          <div className="w-full max-w-md">
            <Input
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filtered.map((c) => (
                  <div
                    key={c}
                    className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                  >
                    {c}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-4 text-gray-500">
                    No categories found.
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
