import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ForgotPasswordCard = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
          "If that email is registered, a password reset link has been sent. The link expires in 1 hour.",
      });
      setEmail("");
    } catch {
      setStatus({
        type: "error",
        message: "Unable to connect to the server. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-white px-4 py-12 md:py-16">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-(--signin-bg) px-8 py-10 md:px-12 md:py-12">
        <h1 className="mb-10 text-center text-5xl font-bold text-gray-900">
          Password Reset
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            disabled={isLoading}
            className="h-13 rounded-2xl border border-gray-500 bg-gray-100 px-6 text-3xl text-gray-800 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-(--button-green)"
          />

          {status ? (
            <p
              className={`rounded-xl px-4 py-3 text-base font-medium ${
                status.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </p>
          ) : null}

          <div className="pt-2 text-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 min-w-36 rounded-full bg-(--button-green) px-10 text-2xl font-semibold text-white transition-colors hover:bg-(--button-hover-green) disabled:opacity-60"
            >
              {isLoading ? "Sending…" : "Enter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
