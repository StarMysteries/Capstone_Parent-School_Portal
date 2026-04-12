import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import type { LibraryCategory } from '@/lib/api/types';
import { GRADE_LEVELS } from '@/lib/store/libraryStore';

interface AddBookModalProps {
	onClose: () => void;
	onAdd?: (book: { title: string; author: string; category_id: number; gl_id: number }) => void;
	categories: LibraryCategory[];
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAdd, categories }) => {
	const [bookTitle, setBookTitle] = React.useState('');
	const [authorName, setAuthorName] = React.useState('');
	const [categoryId, setCategoryId] = React.useState<number | ''>('');
	const [glId, setGlId] = React.useState<number | ''>('');

	const handleAdd = () => {
		if (!bookTitle.trim() || categoryId === '' || glId === '') {
			return;
		}

		onAdd?.({
			title: bookTitle.trim(),
			author: authorName.trim(),
			category_id: categoryId,
			gl_id: glId,
		});
		onClose();
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Add Book">
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
						value={categoryId}
						onChange={(event) => setCategoryId(Number(event.target.value))}
						className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
					>
						<option value="" disabled>SUBJECT</option>
						{categories.map((cat) => (
							<option key={cat.category_id} value={cat.category_id}>
								{cat.category_name}
							</option>
						))}
					</select>
					<select
						value={glId}
						onChange={(event) => setGlId(Number(event.target.value))}
						className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
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
						className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-full"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleAdd}
						className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full"
					>
						Add
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AddBookModal;

