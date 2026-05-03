import { getAllPoems } from "@/lib/actions/poems";
import AdminPoemList from "@/components/admin/AdminPoemList";
import Link from "next/link";

export default async function AdminDashboard() {
	const poems = await getAllPoems();
	const published = poems.filter((p) => p.is_published).length;
	const drafts = poems.filter((p) => !p.is_published).length;

	return (
		<div className="px-8 py-12 max-w-3xl mx-auto">
			{/* Header */}
			<div className="mb-12">
				<h1 className="poem-title text-2xl text-parchment mb-2">Your poems</h1>
				<p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/40">
					{published} published · {drafts} draft{drafts !== 1 ? "s" : ""}
				</p>
			</div>

			{/* New poem CTA */}
			<div className="mb-10">
				<Link href="/admin/editor" className="btn-ghost inline-block text-center">
					+ Write something new
				</Link>
			</div>

			{/* Poem list */}
			<AdminPoemList initialPoems={poems} />
		</div>
	);
}
