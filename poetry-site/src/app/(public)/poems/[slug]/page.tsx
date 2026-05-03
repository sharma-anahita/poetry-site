import { getPoemBySlug } from "@/lib/actions/poems";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const revalidate = 60;

// Uses a plain client with no cookies — safe for build-time static generation
async function getAllPublishedSlugs() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("poems")
    .select("slug")
    .eq("is_published", true);
  return data || [];
}

export async function generateStaticParams() {
  const poems = await getAllPublishedSlugs();
  return poems.map((poem) => ({ slug: poem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);
  if (!poem) return { title: "Not Found" };
  return {
    title: `${poem.title} — In the Still Hours`,
    description: poem.content.slice(0, 120),
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);

  if (!poem) notFound();

  return (
    <div className="min-h-screen px-6 pt-32 pb-24">
      <article className="max-w-xl mx-auto">
        {/* Back link */}
        <div
          className="animate-fade-in mb-16 text-center"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "100ms" }}
        >
          <Link href="/poems" className="nav-link text-xs">
            ← All poems
          </Link>
        </div>

        {/* Date */}
        <p
          className="animate-fade-in text-center font-sans text-xs tracking-[0.25em] uppercase text-mist/40 mb-8"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "200ms" }}
        >
          {formatDate(poem.created_at)}
        </p>

        {/* Title */}
        <h1
          className="animate-fade-up poem-title text-2xl md:text-3xl lg:text-4xl text-center mb-4 glow-blush"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "300ms" }}
        >
          {poem.title}
        </h1>

        {/* Divider */}
        <div
          className="animate-fade-in divider mt-8 mb-16"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "500ms" }}
        />

        {/* Poem content */}
        <div
          className="animate-fade-up text-center"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "600ms" }}
        >
          <p className="poem-content text-base md:text-lg mx-auto">
            {poem.content}
          </p>
        </div>

        {/* Tags */}
        {poem.tags?.length > 0 && (
          <div
            className="animate-fade-in flex flex-wrap justify-center gap-2 mt-16"
            style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "800ms" }}
          >
            {poem.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div
          className="animate-fade-in text-center mt-20"
          style={{ opacity: 0, animationFillMode: "forwards", animationDelay: "900ms" }}
        >
          <div className="divider mb-10" />
          <Link href="/poems" className="nav-link text-xs">
            Return to the archive
          </Link>
        </div>
      </article>
    </div>
  );
}