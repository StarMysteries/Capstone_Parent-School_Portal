import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignInCard() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Sign In submitted:", { email, password })
	}

	return (
		<div className="flex flex-col items-center pt-20 bg-gray-50 min-h-screen">
			<div className="w-full max-w-lg rounded-2xl bg-[#f4f4c0] p-12 shadow-lg">
				<div className="mb-8 flex items-center gap-4">
					<div className="relative h-20 w-20 shrink-0">
						<img src="/Logo.png" alt="Bayog Elementary National School Logo" className="object-contain h-full w-full" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900">LOGIN</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="h-12 rounded-full border-2 border-gray-900 bg-white px-6 text-base placeholder:text-gray-500"
						/>
					</div>

					<div>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="h-12 rounded-full border-2 border-gray-900 bg-white px-6 text-base placeholder:text-gray-500"
						/>
					</div>

					<div className="text-sm">
						<span className="text-gray-900">Forgot Password? </span>
						<a href="/login" className="text-blue-600 hover:underline">
							Click Here
						</a>
					</div>

					<div className="flex justify-center pt-4">
						<Button
							type="submit"
							className="h-12 rounded-full bg-[#4a9d5f] px-12 text-base font-semibold text-white hover:bg-[#3d8550] transition-colors"
						>
							Sign In
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}