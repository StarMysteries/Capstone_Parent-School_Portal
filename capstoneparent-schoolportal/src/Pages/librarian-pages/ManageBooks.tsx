import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import AddBookModal from "@/components/librarian/AddBookModal";
import EditBookModal from "@/components/librarian/EditBookModal";
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
import type { LearningMaterial } from "@/lib/api/types";

export const ManageBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isBookCopyModalOpen, setIsBookCopyModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const materials = useLibraryStore((state) => state.materials);
  const categories = useLibraryStore((state) => state.categories);
  const fetchMaterials = useLibraryStore((state) => state.fetchMaterials);
  const fetchCategories = useLibraryStore((state) => state.fetchCategories);
  const createMaterial = useLibraryStore((state) => state.createMaterial);
  const updateMaterial = useLibraryStore((state) => state.updateMaterial);

  useEffect(() => {
    fetchMaterials({ item_type: "Book" });
    fetchCategories();
  }, [fetchMaterials, fetchCategories]);

  const books = useMemo(() => materials.filter((m) => m.item_type === "Book"), [materials]);

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || b.category_id.toString() === subjectFilter;
    const matchesGrade =
      gradeFilter === "all" || b.gl_id.toString() === gradeFilter;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const handleAddBooks = async (newBook: {
    title: string;
    author: string;
    category_id: number;
    gl_id: number;
  }) => {
    await createMaterial({
      item_name: newBook.title,
      author: newBook.author,
      category_id: newBook.category_id,
      gl_id: newBook.gl_id,
      item_type: "Book",
    });
  };

  const selectedBook = books.find((book) => book.item_id === selectedBookId);

  const handleOpenEditBookModal = (bookId: number) => {
    setSelectedBookId(bookId);
    setIsEditBookModalOpen(true);
  };

  const handleCloseEditBookModal = () => {
    setIsEditBookModalOpen(false);
    setSelectedBookId(null);
  };

  const handleSaveEditedBook = async (updatedBook: {
    title: string;
    author: string;
    category_id: number;
    gl_id: number;
  }) => {
    if (!selectedBookId) return;
    await updateMaterial(selectedBookId, {
      item_name: updatedBook.title,
      author: updatedBook.author,
      category_id: updatedBook.category_id,
      gl_id: updatedBook.gl_id,
    });
  };

  return (
    <>
      <div className="min-h-screen">
        <NavbarLibrarian />
        <main className="max-w-6xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold">Manage Books</h1>
              <Button
                className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-6 py-2"
                onClick={() => setIsAddBookModalOpen(true)}
              >
                Add Book
              </Button>
            </div>

            <section className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={subjectFilter}
                  onValueChange={(v) => setSubjectFilter(v)}
                >
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Subject" />
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
              {filteredBooks.map((book) => (
                <div
                  key={book.item_id}
                  className="flex items-center justify-between px-4 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => { setSelectedBookId(book.item_id); setIsBookCopyModalOpen(true); }}
                >
                  <span className="text-lg font-medium">{book.item_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {book.category?.category_name}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {formatGradeLevel(book.gl_id)}
                    </span>
                    <Pencil
                      onClick={(e) => { e.stopPropagation(); handleOpenEditBookModal(book.item_id); }}
                      className="cursor-pointer text-(--button-green) hover:text-(--button-hover-green)"
                      size={18}
                    />
                  </div>
                </div>
              ))}
              {filteredBooks.length === 0 && (
                <p className="text-center text-gray-500 py-8">No books found.</p>
              )}
            </section>
          </div>
        </main>
      </div>

      {isAddBookModalOpen && (
        <AddBookModal
          onClose={() => setIsAddBookModalOpen(false)}
          onAdd={handleAddBooks}
          categories={categories}
        />
      )}

      {isEditBookModalOpen && selectedBook && (
        <EditBookModal
          onClose={handleCloseEditBookModal}
          onSave={handleSaveEditedBook}
          categories={categories}
          initialBook={{
            title: selectedBook.item_name,
            author: selectedBook.author || "",
            category_id: selectedBook.category_id,
            gl_id: selectedBook.gl_id,
          }}
        />
      )}

      {isBookCopyModalOpen && selectedBook && (
        <BookCopyModal
          material={selectedBook}
          onClose={() => { setIsBookCopyModalOpen(false); setSelectedBookId(null); }}
        />
      )}
    </>
  );
};

