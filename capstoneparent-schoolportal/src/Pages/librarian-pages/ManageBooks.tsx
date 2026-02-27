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

interface Book {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
}

const booksData: Book[] = [
  { id: "1", title: "Sibiks at Kultura", subject: "Sibika", gradeLevel: "Grade 1" },
  { id: "2", title: "Fun in English", subject: "English", gradeLevel: "Grade 1" },
  { id: "3", title: "Ang Bayan kong Mahal", subject: "Filipino", gradeLevel: "Grade 1" },
  { id: "4", title: "Realistic Math", subject: "Math", gradeLevel: "Grade 2" },
  { id: "5", title: "The New Science Links", subject: "Science", gradeLevel: "Grade 3" },
];

export const ManageBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const subjects = ["all", "Sibika", "English", "Filipino", "Math", "Science"];
  const grades = ["all", "Grade 1", "Grade 2", "Grade 3", "Grade 4"];

  const filteredBooks = booksData.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || b.subject === subjectFilter;
    const matchesGrade =
      gradeFilter === "all" || b.gradeLevel === gradeFilter;
    return matchesSearch && matchesSubject && matchesGrade;
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
              placeholder="Search Book"
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
              // TODO: open add book modal or navigate
            }}
          >
            Add Book
          </Button>

          <div className="flex gap-2">
            <Select
              value={subjectFilter}
              onValueChange={(v) => setSubjectFilter(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All" : s}
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

        {/* book list */}
        <section className="space-y-2">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
            >
              <span className="text-lg font-medium">{book.title}</span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                  {book.subject}
                </span>
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                  {book.gradeLevel}
                </span>
                <Pencil
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                  size={18}
                />
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <p className="text-center text-gray-500">No books found.</p>
          )}
        </section>
        </div>
      </main>
    </div>
  );
};
