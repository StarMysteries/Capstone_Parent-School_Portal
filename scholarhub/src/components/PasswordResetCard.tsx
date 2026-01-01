import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PasswordResetCard() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset requested for:", email)
  }

  return (
    <div className="flex flex-col items-center pt-20 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg rounded-2xl bg-[#f4f4c0] p-12 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Password Reset</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="h-12 rounded-full border-2 border-gray-900 bg-white px-6 text-base placeholder:text-gray-500"
          />

          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              className="h-12 rounded-full bg-[#4a9d5f] px-12 text-base font-semibold text-white hover:bg-[#3d8550] transition-colors"
            >
              Enter
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}