"use client";

import { useState } from "react";
import { signIn, sendPasswordResetEmail } from "@/lib/actions/auth";

export default function LoginPage() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isForgotMode, setIsForgotMode] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);
		
		const formData = new FormData(e.currentTarget);
		
		if (isForgotMode) {
			const result = await sendPasswordResetEmail(formData);
			if (result?.error) {
				setError(result.error);
			} else {
				setSuccess("A password reset link has been sent to your email address.");
			}
			setLoading(false);
		} else {
			const result = await signIn(formData);
			if (result?.error) {
				setError(result.error);
				setLoading(false);
			}
		}
	}

	return (
		<div className="page-wrapper min-h-screen flex items-center justify-center px-6">
			<div className="ambient-left" />
			<div className="ambient-right" />

			<div className="relative z-10 w-full max-w-sm">
				<div className="text-center mb-16">
					<p className="font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-4">
						{isForgotMode ? "Security" : "Private entrance"}
					</p>
					<h1 className="poem-title text-2xl">
						{isForgotMode ? "Reset Password" : "In the Still Hours"}
					</h1>
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

					{!isForgotMode && (
						<div>
							<div className="flex justify-between items-center mb-3">
								<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50">
									Password
								</label>
								<button
									type="button"
									onClick={() => {
										setIsForgotMode(true);
										setError(null);
										setSuccess(null);
									}}
									className="font-sans text-[10px] tracking-wider uppercase text-mist/40 hover:text-blush transition-colors"
								>
									Forgot?
								</button>
							</div>
							<input
								name="password"
								type="password"
								required
								autoComplete="current-password"
								className="admin-input"
								placeholder="••••••••"
							/>
						</div>
					)}

					{error && (
						<p className="font-sans text-xs text-blush/70 text-center tracking-wide leading-relaxed">
							{error}
						</p>
					)}

					{success && (
						<p className="font-sans text-xs text-mist/80 text-center tracking-wide leading-relaxed">
							{success}
						</p>
					)}

					<div className="text-center pt-4 space-y-4">
						<button
							type="submit"
							disabled={loading}
							className="btn-ghost disabled:opacity-30"
						>
							{loading 
								? (isForgotMode ? "Sending..." : "Entering...") 
								: (isForgotMode ? "Send Reset Link" : "Enter")}
						</button>
						
						{isForgotMode && (
							<div>
								<button
									type="button"
									onClick={() => {
										setIsForgotMode(false);
										setError(null);
										setSuccess(null);
									}}
									className="font-sans text-[10px] tracking-[0.15em] uppercase text-mist/40 hover:text-blush transition-colors mt-2"
								>
									Back to Entrance
								</button>
							</div>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
