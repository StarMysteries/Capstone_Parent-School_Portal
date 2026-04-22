import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import type { LibrarySubject } from '@/lib/api/types';
import { GRADE_LEVELS } from '@/lib/libraryHelpers';
import { ActionConfirmationModal } from '../general/ActionConfirmationModal';

interface EditBookModalProps {
	onClose: () => void;
	onSave?: (book: { title: string; author: string; subject_id: number; gl_id: number }) => Promise<void> | void;
	subjects: LibrarySubject[];
	initialBook?: {
		title?: string;
		author?: string;
		subject_id?: number;
		gl_id?: number;
	};
}

const EditBookModal: React.FC<EditBookModalProps> = ({ onClose, onSave, initialBook, subjects }) => {
	const [bookTitle, setBookTitle] = React.useState(initialBook?.title ?? '');
	const [authorName, setAuthorName] = React.useState(initialBook?.author ?? '');
	const [subjectId, setSubjectId] = React.useState<number | ''>(initialBook?.subject_id ?? '');
	const [glId, setGlId] = React.useState<number | ''>(initialBook?.gl_id ?? '');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleSaveClick = () => {
		if (!bookTitle.trim() || subjectId === '' || glId === '') {
			return;
		}
		setShowConfirm(true);
	};

	const handleSaveConfirm = async () => {
		setShowConfirm(false);
		if (isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		try {
			await onSave?.({
				title: bookTitle.trim(),
				author: authorName.trim(),
				subject_id: subjectId as number,
				gl_id: glId as number,
			});
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Edit Book">
			<div className="space-y-4">
				<input
					type="text"
					value={bookTitle}
					onChange={(event) => setBookTitle(event.target.value)}
					placeholder="Name of Book"
					className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
				/>
				<input
					type="text"
					value={authorName}
					onChange={(event) => setAuthorName(event.target.value)}
					placeholder="Name of Author (Optional)"
					className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
				/>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<select
						value={subjectId}
						onChange={(event) => setSubjectId(Number(event.target.value))}
						className="w-full bg-white px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
					>
						<option value="" disabled>SUBJECT</option>
						{subjects.map((subject) => (
							<option key={subject.subject_id} value={subject.subject_id}>
								{subject.name}
							</option>
						))}
					</select>
					<select
						value={glId}
						onChange={(event) => setGlId(Number(event.target.value))}
						className="w-full bg-white px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
					>
						<option value="" disabled>GRADE LEVEL</option>
						{GRADE_LEVELS.map((g) => (
							<option key={g.id} value={g.id}>{g.label}</option>
						))}
					</select>
				</div>
				<div className="flex justify-end gap-3">
					<Button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-full"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSaveClick}
						disabled={isSubmitting}
						className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full disabled:bg-gray-400 disabled:text-white disabled:hover:bg-gray-400"
					>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</div>
			</div>

			<ActionConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={() => void handleSaveConfirm()}
				title="Confirm Save Changes"
				message="Are you sure you want to save the changes to this book?"
				confirmLabel="Save Changes"
				isLoading={isSubmitting}
			/>
		</Modal>
	);
};

export default EditBookModal;
