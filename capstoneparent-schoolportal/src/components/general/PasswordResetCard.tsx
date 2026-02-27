import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export const PasswordResetCard = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset requested for:", email)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="overflow-hidden rounded-3xl border border-(--button-green)/25 bg-(--signin-bg) shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-between bg-(--button-green) p-8 text-white md:p-10">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-full bg-white/20 p-2">
                  <img src="/Logo.png" alt="Bayog Elementary National School Logo" className="h-full w-full object-contain" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider">Parent-School Portal</p>
              </div>
              <h1 className="text-4xl font-bold leading-tight">Password Reset</h1>
              <p className="mt-3 text-sm text-white/90">
                Enter your account email and we’ll process your password reset request.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/30 bg-white/10 p-4 text-sm backdrop-blur-sm text-white/95">
              For demo use, submit any registered dummy account email.
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
              <p className="mt-1 text-sm text-gray-600">We’ll help you recover access to your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border border-gray-300 bg-white px-4 text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-(--button-green)"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-(--button-green) text-base font-semibold text-white transition-colors hover:bg-(--button-hover-green)"
              >
                Submit Request
              </Button>

              <p className="text-sm text-gray-600">
                Remembered your password?{" "}
                <Link to="/login" className="font-semibold text-(--button-green) hover:underline">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}