I have completed the integration of the library backend data. All components within the library module now pull and modify real data via the existing API instead of using static dummy records.

Here is a summary of the accomplishments:

Books & Learning Resources API Integration: ManageBooks.tsx and ManageLearningResources.tsx have been refactored to use useLibraryStore relying on real category_id and standardized grade levels natively mapping to the server. Add and Edit modals were refactored to consume primary ID types directly.
Library Copy Status Operations: BookCopyModal retrieves nested exact copy rows mapped to materials. Operations on adding copies map to real actions tracked by the system immediately.
Borrow History Tracking for Librarians: Changed BorrowedCopyModal (accessible in BorrowedResources.tsx) to pull ONLY actively registered "BORROWED" records. Librarians can natively view and verify the borrower mapping, and mark copies dynamically as "Returned."
Library Summary for Parents: Set LibraryRecords.tsx to automatically pull dynamic history logs matching their child, accurately parsing summaries matching pending, returned, or overdue actions along with their respective fines tracking.
Project Data Clean-Up: Removed the completely outdated mock files: src/lib/borrowedResources.ts and src/lib/libraryCategories.ts.
It's all summarized neatly for you in the newly created 
walkthrough.md
. You can navigate through the portal with the Librarian and Parent roles to test the behaviors! Let me know if you need to tackle a different module next.