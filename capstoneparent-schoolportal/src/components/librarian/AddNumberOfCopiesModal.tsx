import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { useApiFeedbackStore } from "@/lib/store/apiFeedbackStore";

interface AddNumberOfCopiesModalProps {
	onClose: () => void;
	onAdd?: (numberOfCopies: number) => void;
}

const AddNumberOfCopiesModal: React.FC<AddNumberOfCopiesModalProps> = ({ onClose, onAdd }) => {
	const [numberOfCopies, setNumberOfCopies] = React.useState<string>('');
	const { showError, clearFeedback } = useApiFeedbackStore();

	const handleAdd = () => {
		clearFeedback();
		const parsedNumber = Number(numberOfCopies);
		if (!Number.isNaN(parsedNumber) && parsedNumber > 0) {
			onAdd?.(parsedNumber);
			onClose();
		} else {
			showError("Please enter a valid number of copies.");
		}
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Add Copies">
			<div className="space-y-4">
				<input
					type="number"
					min={1}
					value={numberOfCopies}
					onChange={(event) => setNumberOfCopies(event.target.value)}
					placeholder="Input Number of Copies"
					className="w-full px-4 py-3 text-lg border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-(--button-green) placeholder-gray-400"
				/>
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

export default AddNumberOfCopiesModal;
