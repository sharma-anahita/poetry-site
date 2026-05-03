import { getFeaturedPoem } from "@/lib/actions/poems";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
	const featured = await getFeaturedPoem();

	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero */}
			<section className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
				<div className="max-w-2xl w-full text-center">
          
					{/* Eyebrow */}
					<p
						className="animate-fade-in font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-12"
						style={{ animationDelay: "200ms", opacity: 0, animationFillMode: "forwards" }}
					>
						Latest
					</p>

					{featured ? (
						<>
							{/* Poem title */}
							<h1
								className="animate-fade-up poem-title text-3xl md:text-4xl lg:text-5xl mb-10 glow-blush"
								style={{ animationDelay: "400ms", opacity: 0, animationFillMode: "forwards" }}
							>
								{featured.title}
							</h1>

							{/* Divider */}
							<div
								className="animate-fade-in divider mb-10"
								style={{ animationDelay: "600ms", opacity: 0, animationFillMode: "forwards" }}
							/>

							{/* Opening lines */}
							<div
								className="animate-fade-up"
								style={{ animationDelay: "700ms", opacity: 0, animationFillMode: "forwards" }}
							>
								<p className="poem-content text-base md:text-lg text-parchment/70 mx-auto max-w-lg">
									{featured.content.split("\n").filter(Boolean).slice(0, 4).join("\n")}
								</p>
							</div>

							{/* Read link */}
							<div
								className="animate-fade-in mt-14"
								style={{ animationDelay: "900ms", opacity: 0, animationFillMode: "forwards" }}
							>
								<Link
									href={`/poems/${featured.slug}`}
									className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-blush hover:text-parchment transition-colors duration-500 border-b border-blush/30 pb-1 hover:border-parchment/30"
								>
									Read in full
								</Link>
							</div>
						</>
					) : (
						<p className="poem-content text-parchment/30 italic">
							The pages are still empty. Come back soon.
						</p>
					)}
				</div>
			</section>

			{/* Browse all link */}
			<div
				className="animate-fade-in text-center pb-20"
				style={{ animationDelay: "1100ms", opacity: 0, animationFillMode: "forwards" }}
			>
				<Link
					href="/poems"
					className="nav-link text-xs"
				>
					Browse all poems
				</Link>
			</div>
		</div>
	);
}
