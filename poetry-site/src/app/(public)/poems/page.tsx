import { getPublishedPoems } from "@/lib/actions/poems";
import PoemCard from "@/components/public/PoemCard";

export const revalidate = 60;

export default async function PoemsPage() {
	const poems = await getPublishedPoems();

	return (
		<div className="min-h-screen px-6 pt-32 pb-20">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-20">
					<p
						className="animate-fade-in font-sans text-xs tracking-[0.3em] uppercase text-mist/50 mb-6"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "100ms" }}
					>
						Archive
					</p>
					<h1
						className="animate-fade-up poem-title text-3xl md:text-4xl"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "200ms" }}
					>
						All Poems
					</h1>
					<div
						className="animate-fade-in divider mt-8"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "400ms" }}
					/>
				</div>

				{/* Poem list */}
				{poems.length === 0 ? (
					<p className="text-center poem-content text-parchment/30 italic mt-20">
						Nothing has been written yet.
					</p>
				) : (
					<div>
						{poems.map((poem, i) => (
							<PoemCard key={poem.id} poem={poem} index={i} />
						))}
					</div>
				)}

				{/* Count */}
				{poems.length > 0 && (
					<p
						className="animate-fade-in text-center font-sans text-xs tracking-[0.2em] uppercase text-mist/25 mt-16"
						style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "600ms" }}
					>
						{poems.length} {poems.length === 1 ? "poem" : "poems"}
					</p>
				)}
			</div>
		</div>
	);
}

// export default async function PoemsPage() {
//   let poems = [];
//   let errorMsg = null;
  
//   try {
//     poems = await getPublishedPoems();
//   } catch (e: any) {
//     errorMsg = e.message;
//   }

//   return (
//     <div className="min-h-screen px-6 pt-32 pb-20">
//       {errorMsg && (
//         <p className="text-red-400 text-center">{errorMsg}</p>
//       )}
//       {/* rest of your JSX */}
//     </div>
//   );
// }