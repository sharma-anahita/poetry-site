"use client";


import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
	const [sent, setSent] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", message: "" });


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Replace these with your actual EmailJS service, template, and public key
			const serviceId = "YOUR_SERVICE_ID";
			const templateId = "YOUR_TEMPLATE_ID";
			const publicKey = "YOUR_PUBLIC_KEY";

			await emailjs.send(
				serviceId,
				templateId,
				{
					from_name: form.name,
					from_email: form.email,
					message: form.message,
					to_email: "sharma.anahita.as@gmail.com",
				},
				publicKey
			);
			setSent(true);
		} catch (error) {
			alert("Failed to send message. Please try again later.");
		}
	};

	return (
		<div className="min-h-screen px-6 pt-32 pb-24">
			<div className="max-w-md mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<p
						className="animate-fade-in font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-6"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "100ms" }}
					>
						Reach out
					</p>
					<h1
						className="animate-fade-up poem-title text-3xl"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "200ms" }}
					>
						Say something
					</h1>
					<div
						className="animate-fade-in divider mt-8"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "400ms" }}
					/>
				</div>

				{sent ? (
					<div
						className="animate-fade-up text-center"
						style={{ opacity: 0, animationFillMode: "forwards" }}
					>
						<p className="poem-content text-parchment/70 italic">
							Your words have been received.
						</p>
						<p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/40 mt-4">
							Thank you for writing.
						</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="animate-fade-up space-y-10"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "500ms" }}
					>
						<div>
							<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
								Your name
							</label>
							<input
								type="text"
								required
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								className="admin-input"
								placeholder="What do they call you?"
							/>
						</div>

						<div>
							<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
								Email
							</label>
							<input
								type="email"
								required
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								className="admin-input"
								placeholder="Where shall I reply?"
							/>
						</div>

						<div>
							<label className="block font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mb-3">
								Message
							</label>
							<textarea
								required
								rows={5}
								value={form.message}
								onChange={(e) => setForm({ ...form, message: e.target.value })}
								className="admin-textarea min-h-0 !h-auto border-b border-white/10"
								placeholder="Say whatever you need to say..."
							/>
						</div>

						<div className="text-center pt-4">
							<button type="submit" className="btn-ghost">
								Send
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
