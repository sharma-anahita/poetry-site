"use client";

import { useState } from "react";
import Link from "next/link";
import { togglePublish, deletePoem } from "@/lib/actions/poems";
import type { Poem } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminPoemList({ initialPoems }: { initialPoems: Poem[] }) {
  const [poems, setPoems] = useState(initialPoems);

  async function handleToggle(id: string, current: boolean) {
    await togglePublish(id, !current);
    setPoems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this poem forever?")) return;
    await deletePoem(id);
    setPoems((prev) => prev.filter((p) => p.id !== id));
  }

  if (poems.length === 0) {
    return (
      <p className="poem-content text-parchment/30 italic text-center mt-12">
        Nothing written yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {poems.map((poem) => (
        <div
          key={poem.id}
          className="py-5 border-b border-white/5 flex items-center justify-between gap-4 group hover:border-white/10 transition-colors duration-300"
        >
          <div className="flex-1 min-w-0">
            <Link
              href={`/admin/editor/${poem.id}`}
              className="poem-title text-base text-parchment/80 hover:text-parchment transition-colors duration-300 block truncate"
            >
              {poem.title}
            </Link>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-sans text-xs text-mist/30 tracking-[0.1em]">
                {formatDate(poem.created_at)}
              </span>
              {poem.tags?.length > 0 && (
                <span className="font-sans text-xs text-mist/25">
                  {poem.tags.slice(0, 2).join(", ")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Published status badge */}
            <button
              onClick={() => handleToggle(poem.id, poem.is_published)}
              className={`font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${
                poem.is_published
                  ? "text-blush/60 hover:text-blush"
                  : "text-mist/25 hover:text-mist/60"
              }`}
            >
              {poem.is_published ? "Published" : "Draft"}
            </button>

            {/* Edit */}
            <Link
              href={`/admin/editor/${poem.id}`}
              className="font-sans text-xs tracking-[0.1em] uppercase text-mist/30 hover:text-mist/70 transition-colors duration-300"
            >
              Edit
            </Link>

            {/* Delete */}
            <button
              onClick={() => handleDelete(poem.id)}
              className="font-sans text-xs tracking-[0.1em] uppercase text-mist/20 hover:text-red-400/60 transition-colors duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}