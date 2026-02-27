import { Button } from "@/components/ui/button"

interface AccountPendingCardProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function AccountPendingCard({ isModal = false, onClose }: AccountPendingCardProps) {
  const content = (
    <div className="w-full max-w-lg rounded-2xl bg-(--signin-bg) p-12 shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Application Pending</h1>

      <p className="text-lg text-gray-900 leading-relaxed mb-8">
        This email is already linked to an account application. Please wait for a teacher to verify your application.
      </p>

      <div className="flex justify-center pt-8">
        <Button
          className="h-12 rounded-full bg-(--button-green) px-12 text-base font-semibold text-white hover:bg-(--button-hover-green) transition-colors"
          onClick={onClose}
        >
          {isModal ? "Close" : "Confirm"}
        </Button>
      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="flex flex-col items-center pt-20 bg-gray-50 min-h-screen">
      {content}
    </div>
  );
}