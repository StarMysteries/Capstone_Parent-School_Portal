import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import type { LibraryCategory } from '@/lib/api/types';
import { GRADE_LEVELS } from '@/lib/store/libraryStore';

interface EditLearningResourceModalProps {
	onClose: () => void;
	onSave?: (resource: { title: string; category_id: number; gl_id: number }) => void;
	categories: LibraryCategory[];
	initialResource?: {
		title?: string;
		category_id?: number;
		gl_id?: number;
	};
}

const EditLearningResourceModal: React.FC<EditLearningResourceModalProps> = ({
	onClose,
	onSave,
	initialResource,
	categories,
}) => {
	const [resourceTitle, setResourceTitle] = React.useState(initialResource?.title ?? '');
	const [categoryId, setCategoryId] = React.useState<number | ''>(initialResource?.category_id ?? '');
	const [glId, setGlId] = React.useState<number | ''>(initialResource?.gl_id ?? '');

	const hasChanges =
		resourceTitle.trim() !== (initialResource?.title ?? '').trim() ||
		categoryId !== (initialResource?.category_id ?? '') ||
		glId !== (initialResource?.gl_id ?? '');

	const handleSave = () => {
		if (!resourceTitle.trim() || categoryId === '' || glId === '') {
			return;
		}

		onSave?.({
			title: resourceTitle.trim(),
			category_id: categoryId as number,
			gl_id: glId as number,
		});
		onClose();
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Edit Learning Resource">
			<div className="space-y-4">
				<input
					type="text"
					value={resourceTitle}
					onChange={(event) => setResourceTitle(event.target.value)}
					placeholder="Name of Learning Resource"
					className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
				/>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<select
						value={categoryId}
						onChange={(event) => setCategoryId(Number(event.target.value))}
						className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green)"
					>
						<option value="" disabled>CATEGORY</option>
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
							<option key={g.id} value={g.id}>
								{g.label}
							</option>
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
						onClick={handleSave}
						disabled={!hasChanges}
						className="bg-(--button-green) hover:bg-(--button-hover-green) text-white px-8 py-3 text-lg rounded-full disabled:bg-gray-400 disabled:text-white disabled:hover:bg-gray-400"
					>
						Save
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default EditLearningResourceModal;
