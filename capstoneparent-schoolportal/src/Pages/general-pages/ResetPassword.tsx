import { ResetPasswordCard } from "@/components/general/ResetPasswordCard";

export const ResetPassword = () => {
  return (
    <div
      className="absolute inset-0 min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/History_Pic.jpg')" 
      }}
    >
      <div className="w-full flex justify-center">
        <ResetPasswordCard />
      </div>
    </div>
  );
};
