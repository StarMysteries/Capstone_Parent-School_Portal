import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	contentClassName?: string;
}

export const Modal = ({ isOpen, onClose, title, children, contentClassName }: ModalProps) => {
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
<<<<<<< Updated upstream
			className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 animate-in fade-in duration-200"
=======
			className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 animate-in fade-in duration-200 sm:items-center sm:py-6"
>>>>>>> Stashed changes
			onClick={onClose}
		>
			{/* Backdrop with opacity */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

			{/* Modal Content */}
			<div
				className={cn(
<<<<<<< Updated upstream
					"relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-yellow-100 shadow-2xl animate-in zoom-in-95 duration-200",
=======
					"relative mx-4 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg bg-yellow-100 shadow-2xl animate-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)]",
>>>>>>> Stashed changes
					contentClassName
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex justify-between items-start p-6 pb-3">
						<h2 className="text-3xl font-bold text-black">{title}</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-red-600 hover:text-red-800 transition-colors text-3xl font-bold leading-none"
							aria-label="Close modal"
						>
							<X className="h-8 w-8" strokeWidth={3} />
						</button>
					</div>
				)}

				<div className={cn(title ? "px-6 pb-6" : "")}>{children}</div>
			</div>
		</div>
	);
};
