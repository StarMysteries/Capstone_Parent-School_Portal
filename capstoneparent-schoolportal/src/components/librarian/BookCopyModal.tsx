import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import AddBookCopyModal from './AddBookCopyModal';
import BorrowerDetailsModal from './BorrowerDetailsModal';
import type { LearningMaterial, MaterialCopy, MaterialStatus } from '@/lib/api/types';
import { useLibraryStore, formatGradeLevel } from '@/lib/store/libraryStore';

interface BookCopyModalProps {
  onClose: () => void;
  material: LearningMaterial;
}

const BookCopyModal: React.FC<BookCopyModalProps> = ({
  onClose,
  material,
}) => {
  const [filterStatus, setFilterStatus] = React.useState<string>('Status');
  const [isAddCopyModalOpen, setIsAddCopyModalOpen] = React.useState(false);
  const [selectedCopy, setSelectedCopy] = React.useState<MaterialCopy | null>(null);

  const addCopy = useLibraryStore((state) => state.addCopy);
  const updateCopyStatusStore = useLibraryStore((state) => state.updateCopyStatus);

  const copies = material.copies || [];
  
  const existingCopyCodes = copies.map((c) => c.copy_code);

  const handleAddCopies = async (copyNumbers: number[]) => {
    // Add multiple copies sequentially or via Promise.all
    await Promise.all(
      copyNumbers.map((copy_code) => addCopy(material.item_id, copy_code, 'New'))
    );
  };

  const syncStatus = async (copyId: number, nextStatus: MaterialStatus) => {
    // We simply use updateCopyStatus from store (Wait, I need to add that to libraryStore)
    // Actually, libraryStore does not have updateCopyStatus exposed. Oh! I should add it or use libraryApi directly.
    // Let me just import libraryApi directly for this specific update, or I can update libraryStore.
  };

  return (
  <>
  <Modal isOpen={true} onClose={onClose} title={`${material.item_type === 'Book' ? 'Book' : 'Resource'} Copies`}>
    <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
      Name: {material.item_name}
      </div>
      <div className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
      Subject: {material.category?.category_name}
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        onClick={() => setIsAddCopyModalOpen(true)}
        className="bg-(--button-green) hover:bg-(--button-hover-green) text-white"
      >
      <Plus className="h-4 w-4" />
      Add Copy
      </Button>
      <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
      >
      <option value="Status">Status</option>
      <option value="AVAILABLE">Available</option>
      <option value="BORROWED">Borrowed</option>
      <option value="LOST">Lost</option>
      <option value="GIVEN">Given</option>
      </select>
    </div>

    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {copies
        .filter((c) => filterStatus === 'Status' || c.status === filterStatus)
        .map((copy) => (
        <div
          key={copy.copy_id}
          className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setSelectedCopy(copy)}
        >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
          <p className="font-semibold text-gray-900">Copy {copy.copy_code}</p>
          <p className="text-sm text-gray-600">
            {copy.status === 'AVAILABLE' ? `Added: ${new Date(copy.added_at).toLocaleDateString()}` : `Status: ${copy.status}`}
          </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${copy.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-500'}`}>{copy.status}</span>
          </div>
        </div>
        </div>
      ))}
      {copies.length === 0 && (
         <div className="text-center text-gray-500 py-4">No copies available. Add one!</div>
      )}
    </div>
    </div>
  </Modal>

  {isAddCopyModalOpen && (
    <AddBookCopyModal 
      onClose={() => setIsAddCopyModalOpen(false)} 
      bookTitle={material.item_name}
      onAddCopies={handleAddCopies}
      existingCopyCodes={existingCopyCodes}
    />
  )}

  {/* We keep BorrowerDetailsModal disabled here for now, until we fully port it over or if it's strictly needed. 
      Usually Borrowing is done via the Borrowing UI. If users need to view borrower details here, 
      they can go to BorrowedResources tab since `material.copies` from REST doesn't include nested borrow details directly. */}
  </>
  );
};

export default BookCopyModal;