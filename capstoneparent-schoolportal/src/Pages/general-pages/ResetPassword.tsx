import { ResetPasswordCard } from "@/components/general/ResetPasswordCard";

export const ResetPassword = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/school-bg.png')" }}
    >
      <ResetPasswordCard />
    </div>
  );
};
