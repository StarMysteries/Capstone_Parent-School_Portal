import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { useApiFeedbackStore } from "@/lib/store/apiFeedbackStore";

export const ResetPasswordCard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess, clearFeedback } = useApiFeedbackStore();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const fetchInfo = async () => {
      try {
        const result = await authApi.getResetPasswordInfo(token);
        setMaskedEmail(result.data?.maskedEmail ?? null);
        setTokenValid(true);
      } catch {
        setTokenValid(false);
      }
    };

    fetchInfo();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!token) {
      showError("This password reset link is missing or invalid.");
      return;
    }

    if (!newPassword) {
      showError("New password is required.");
      return;
    }

    if (!confirmPassword) {
      showError("Please confirm your new password.");
      return;
    }

    if (newPassword.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.resetPassword(token, newPassword);
      showSuccess(
        result.message ||
          "Password has been reset successfully. Redirecting to login...",
      );
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Still checking token validity ──────────────────────────────────────────
  if (tokenValid === null) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-(--signin-bg) px-8 py-10 shadow-xl text-center text-gray-600">
          Verifying link…
        </div>
      </div>
    );
  }

  // ── Invalid / missing token ─────────────────────────────────────────────────
  if (!tokenValid) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-(--signin-bg) px-8 py-10 shadow-xl">
          <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Invalid Link
          </h1>
          <p className="mb-8 text-center text-base text-gray-600">
            This password reset link is missing or has expired. Please request a
            new one.
          </p>
          <div className="text-center">
            <Button
              onClick={() => navigate("/forgotpassword")}
              className="rounded-full bg-(--button-green) px-8 py-2 text-base font-semibold text-white hover:bg-(--button-hover-green)"
            >
              Request Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Valid token — show the form ─────────────────────────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-(--signin-bg) px-8 py-8 shadow-xl">
        {/* Header: Logo + Title */}
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/Logo.png"
            alt="School Logo"
            className="h-14 w-14 flex-shrink-0 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Update Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Masked email */}
          {maskedEmail && (
            <div className="text-base text-gray-800">
              Email:{" "}
              <span className="font-bold italic text-gray-900">
                {maskedEmail}
              </span>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1">
            <label
              htmlFor="new-password"
              className="block text-base text-gray-800"
            >
              New Password:
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              disabled={isLoading}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 focus-visible:ring-2 focus-visible:ring-(--button-green)"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="confirm-password"
              className="block text-base text-gray-800"
            >
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              disabled={isLoading}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 focus-visible:ring-2 focus-visible:ring-(--button-green)"
            />
          </div>



          {/* Submit */}
          <div className="pt-1 text-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-(--button-green) px-10 py-2 text-base font-semibold text-white hover:bg-(--button-hover-green) disabled:opacity-60"
            >
              {isLoading ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
