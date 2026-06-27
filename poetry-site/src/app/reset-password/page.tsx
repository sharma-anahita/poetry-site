"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
	const router = useRouter();
	const [isVerifying, setIsVerifying] = useState(true);
	const [sessionVerified, setSessionVerified] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const supabase = createClient();
		let isMounted = true;

		async function checkRecoverySession() {
			try {
				// 1. If there's a code parameter (PKCE), exchange it first
				const params = new URLSearchParams(window.location.search);
				const code = params.get("code");

				if (code) {
					const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
					if (exchangeError && isMounted) {
						setError(`Failed to verify recovery link: ${exchangeError.message}`);
						setIsVerifying(false);
						return;
					}
				}

				// 2. Check if a session already exists
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();
				
				if (sessionError && isMounted) {
					setError(`Session verification error: ${sessionError.message}`);
					setIsVerifying(false);
					return;
				}

				if (session && isMounted) {
					setSessionVerified(true);
					setIsVerifying(false);
					return;
				}

				// 3. Subscribe to auth changes (helpful since hash tokens are parsed asynchronously)
				const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
					if (!isMounted) return;

					if (currentSession) {
						setSessionVerified(true);
						setIsVerifying(false);
						subscription.unsubscribe();
					}
				});

				// 4. Set a short timeout. If no session is detected within 3 seconds, show error.
				const timeoutId = setTimeout(() => {
					if (isMounted) {
						subscription.unsubscribe();
						if (!sessionVerified) {
							setError("No active recovery session found. Please request a new password reset link.");
							setIsVerifying(false);
						}
					}
				}, 3000);

				return () => {
					clearTimeout(timeoutId);
					subscription.unsubscribe();
				};
			} catch (err: any) {
				if (isMounted) {
					setError("An unexpected error occurred during verification.");
					setIsVerifying(false);
				}
			}
		}

		checkRecoverySession();

		return () => {
			isMounted = false;
		};
	}, [sessionVerified]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		// Password validation
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		const supabase = createClient();

		try {
			const { error: updateError } = await supabase.auth.updateUser({
				password: password,
			});

			if (updateError) {
				setError(updateError.message);
				setLoading(false);
				return;
			}

			setSuccess(true);
			setLoading(false);

			// Redirect to login after a short delay
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		} catch (err: any) {
			setError("An unexpected error occurred. Please try again.");
			setLoading(false);
		}
	}

	return (
		<div className="page-wrapper min-h-screen flex items-center justify-center px-6">
			<div className="ambient-left" />
			<div className="ambient-right" />

			<div className="relative z-10 w-full max-w-sm">
				<div className="text-center mb-12">
					<p className="font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-4">
						Security
					</p>
					<h1 className="poem-title text-2xl">Reset Password</h1>
					<div className="divider mt-6" />
				</div>

				{isVerifying ? (
					<div className="text-center py-8">
						<p className="font-sans text-xs tracking-wider text-mist/70 animate-pulse">
							Verifying recovery session...
						</p>
					</div>
				) : error && !sessionVerified ? (
					<div className="text-center space-y-6">
						<p className="font-sans text-xs text-blush/70 tracking-wide leading-relaxed">
							{error}
						</p>
						<div className="pt-4">
							<button onClick={() => router.push("/login")} className="btn-ghost">
								Back to Login
							</button>
						</div>
					</div>
				) : success ? (
					<div className="text-center space-y-6">
						<p className="font-sans text-xs text-mist/90 tracking-wide leading-relaxed">
							Your password has been successfully updated.
						</p>
						<p className="font-sans text-[10px] text-mist/40 tracking-wider animate-pulse">
							Redirecting to the entrance...
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-8">
						{error && (
							<p className="font-sans text-xs text-blush/70 text-center tracking-wide">
								{error}
							</p>
						)}

						<div>
							<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
								New Password
							</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="admin-input"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
								Confirm Password
							</label>
							<input
								type="password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="admin-input"
								placeholder="••••••••"
							/>
						</div>

						<div className="text-center pt-4">
							<button
								type="submit"
								disabled={loading}
								className="btn-ghost disabled:opacity-30"
							>
								{loading ? "Updating..." : "Update Password"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
