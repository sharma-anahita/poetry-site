"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const formData = new FormData(e.currentTarget);
		const result = await signIn(formData);
		if (result?.error) {
			setError(result.error);
			setLoading(false);
		}
	}

	return (
		<div className="page-wrapper min-h-screen flex items-center justify-center px-6">
			<div className="ambient-left" />
			<div className="ambient-right" />

			<div className="relative z-10 w-full max-w-sm">
				<div className="text-center mb-16">
					<p className="font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-4">
						Private entrance
					</p>
					<h1 className="poem-title text-2xl">In the Still Hours</h1>
					<div className="divider mt-6" />
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					<div>
						<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
							Email
						</label>
						<input
							name="email"
							type="email"
							required
							autoComplete="email"
							className="admin-input"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
							Password
						</label>
						<input
							name="password"
							type="password"
							required
							autoComplete="current-password"
							className="admin-input"
							placeholder="••••••••"
						/>
					</div>

					{error && (
						<p className="font-sans text-xs text-blush/70 text-center tracking-wide">
							{error}
						</p>
					)}

					<div className="text-center pt-4">
						<button
							type="submit"
							disabled={loading}
							className="btn-ghost disabled:opacity-30"
						>
							{loading ? "Entering..." : "Enter"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
