import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ResetPasswordCard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null); // null = still checking
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On mount: validate the token and fetch the masked email
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const fetchInfo = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/reset-password-info?token=${token}`,
        );
        if (!response.ok) {
          setTokenValid(false);
          return;
        }
        const data = await response.json();
        setMaskedEmail(data.data?.maskedEmail ?? null);
        setTokenValid(true);
      } catch {
        setTokenValid(false);
      }
    };

    fetchInfo();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Password has been reset successfully. Please log in.",
      });
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setStatus({
        type: "error",
        message: "Unable to connect to the server. Please try again later.",
      });
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
            src="../../../public/Logo.png"
            alt="School Logo"
            className="h-14 w-14 flex-shrink-0 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Update Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Masked email */}
          {maskedEmail && (
            <div className="text-base text-gray-800">
              Email: <span className="font-bold">{maskedEmail}</span>
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
              required
              disabled={isLoading || status?.type === "success"}
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
              required
              disabled={isLoading || status?.type === "success"}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 focus-visible:ring-2 focus-visible:ring-(--button-green)"
            />
          </div>

          {/* Status message */}
          {status ? (
            <p
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                status.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
              {status.type === "success" && (
                <span className="mt-0.5 block text-xs opacity-75">
                  Redirecting to login…
                </span>
              )}
            </p>
          ) : null}

          {/* Submit */}
          <div className="pt-1 text-center">
            <Button
              type="submit"
              disabled={isLoading || status?.type === "success"}
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
