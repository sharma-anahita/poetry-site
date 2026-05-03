import Link from "next/link";
import type { Poem } from "@/types";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getExcerpt(content: string, lines = 3): string {
  return content.split("\n").filter(Boolean).slice(0, lines).join("\n");
}

interface PoemCardProps {
  poem: Poem;
  index?: number;
}

export default function PoemCard({ poem, index = 0 }: PoemCardProps) {
  const delay = index * 100;

  return (
    <Link href={`/poems/${poem.slug}`} className="block group">
      <article
        className="animate-fade-up py-10 border-b border-white/5 hover:border-blush/10 transition-colors duration-700"
        style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: "forwards" }}
      >
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            {/* Title */}
            <h2 className="poem-title text-xl md:text-2xl mb-4 group-hover:text-blush transition-colors duration-500">
              {poem.title}
            </h2>

            {/* Excerpt */}
            <p className="poem-content text-sm leading-[2] text-parchment/50 group-hover:text-parchment/70 transition-colors duration-500 line-clamp-3">
              {getExcerpt(poem.content)}
            </p>

            {/* Tags + Date */}
            <div className="flex items-center gap-4 mt-5">
              <span className="font-sans text-xs tracking-[0.15em] uppercase text-mist/40">
                {formatDate(poem.created_at)}
              </span>
              {poem.tags?.length > 0 && (
                <div className="flex gap-2">
                  {poem.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 pt-2">
            <span className="text-blush text-xl">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}