import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
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
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  category: string;
  gradeLevel: string;
}

const resourcesData: Resource[] = [
  { id: "1", title: "World Map", category: "Map", gradeLevel: "Grade 2" },
  { id: "2", title: "Philippine Map", category: "Map", gradeLevel: "Grade 2" },
  { id: "3", title: "Chess Board", category: "Game", gradeLevel: "Grade 1" },
  { id: "4", title: "Scrabble Board", category: "Game", gradeLevel: "Grade 3" },
  { id: "5", title: "Water Cycle Formation", category: "Infographic", gradeLevel: "Grade 2" },
];

export const ManageLearningResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const categories = ["all", "Map", "Game", "Infographic"];
  const grades = ["all", "Grade 1", "Grade 2", "Grade 3", "Grade 4"];

  const filteredResources = resourcesData.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || r.category === categoryFilter;
    const matchesGrade =
      gradeFilter === "all" || r.gradeLevel === gradeFilter;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-white">
      <NavbarLibrarian />
      <main className="mx-auto max-w-7xl px-6 pb-12 pt-6">
        <div className="rounded-xl bg-gray-100 p-6">
          {/* controls */}
          <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Search Item"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 rounded-full"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
              >
                <Search className="size-4" />
              </button>
            </div>

            <Button
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
              onClick={() => {
                // TODO: open add resource modal or navigate
              }}
            >
              Add Item
            </Button>

            <div className="flex gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "all" ? "All" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g === "all" ? "All" : g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* resource list */}
          <section className="space-y-2">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
              >
                <span className="text-lg font-medium">{res.title}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                    {res.category}
                  </span>
                  <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                    {res.gradeLevel}
                  </span>
                  <Pencil
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    size={18}
                  />
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <p className="text-center text-gray-500">No items found.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
