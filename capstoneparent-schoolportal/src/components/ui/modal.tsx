import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
			onClick={onClose}
		>
			{/* Backdrop with opacity */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			{/* Modal Content */}
			<div
				className="relative bg-yellow-100 rounded-lg shadow-2xl w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-start p-6 pb-3">
					<h2 className="text-3xl font-bold text-black">{title}</h2>
					<button
						onClick={onClose}
						className="text-red-600 hover:text-red-800 transition-colors text-3xl font-bold leading-none"
						aria-label="Close modal"
					>
						<X className="h-8 w-8" strokeWidth={3} />
					</button>
				</div>

				{/* Body */}
				<div className="px-6 pb-6">{children}</div>
			</div>
		</div>
	);
};
