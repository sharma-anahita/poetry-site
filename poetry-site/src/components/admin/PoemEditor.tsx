"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPoem, updatePoem } from "@/lib/actions/poems";
import type { Poem } from "@/types";

interface PoemEditorProps {
  poem?: Poem;
}

type Mode = "write" | "preview";

const AUTOSAVE_DELAY = 2000;

const SUGGESTED_TAGS = [
  "grief", "memory", "love", "loss", "longing",
  "night", "silence", "body", "home", "time",
  "dream", "autumn", "light", "solitude", "tenderness",
];

export default function PoemEditor({ poem }: PoemEditorProps) {
  const router = useRouter();
  const isEditing = !!poem;

  const [title, setTitle] = useState(poem?.title ?? "");
  const [content, setContent] = useState(poem?.content ?? "");
  const [tags, setTags] = useState<string[]>(poem?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isPublished, setIsPublished] = useState(poem?.is_published ?? false);
  const [mode, setMode] = useState<Mode>("write");

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [isSaving, setIsSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(poem?.id ?? null);
  const [showTagPanel, setShowTagPanel] = useState(false);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContent = useRef({ title: poem?.title ?? "", content: poem?.content ?? "" });
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Autosave logic
  const save = useCallback(
    async (asDraft = true) => {
      if (!title.trim()) return;

      const hasChanges =
        title !== lastSavedContent.current.title ||
        content !== lastSavedContent.current.content;

      if (!hasChanges && asDraft) return;

      setIsSaving(true);
      setSaveStatus("saving");

      try {
        if (currentId) {
          await updatePoem(currentId, {
            title,
            content,
            tags,
            is_published: !asDraft ? isPublished : undefined,
          });
        } else {
          const created = await createPoem({
            title,
            content,
            tags,
            is_published: false,
          });
          setCurrentId(created.id);
          router.replace(`/admin/editor/${created.id}`);
        }

        lastSavedContent.current = { title, content };
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    },
    [title, content, tags, isPublished, currentId, router]
  );

  // Schedule autosave on content change
  useEffect(() => {
    if (!title.trim()) return;

    setSaveStatus("unsaved");

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      save(true);
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [title, content, save]);

  // Keyboard shortcut: Cmd+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  async function handlePublish() {
    if (!title.trim() || !content.trim()) return;

    const newPublished = !isPublished;
    setIsPublished(newPublished);
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      if (currentId) {
        await updatePoem(currentId, { is_published: newPublished });
      } else {
        const created = await createPoem({
          title, content, tags, is_published: newPublished,
        });
        setCurrentId(created.id);
        router.replace(`/admin/editor/${created.id}`);
      }
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
      setIsPublished(!newPublished);
    } finally {
      setIsSaving(false);
    }
  }

  function addTag(tag: string) {
    const cleaned = tag.trim().toLowerCase();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const lineCount = content.split("\n").filter(Boolean).length;

  const saveStatusLabel = {
    saved: "Saved",
    saving: "Saving...",
    unsaved: "Unsaved",
    error: "Error saving",
  }[saveStatus];

  const saveStatusColor = {
    saved: "text-mist/30",
    saving: "text-mist/50 animate-pulse",
    unsaved: "text-blush/30",
    error: "text-red-400/50",
  }[saveStatus];

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-ink-secondary/50 rounded-sm p-0.5">
            {(["write", "preview"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 font-sans text-xs tracking-[0.12em] uppercase rounded-sm transition-all duration-300 ${
                  mode === m
                    ? "bg-ink-tertiary text-parchment"
                    : "text-mist/40 hover:text-mist/70"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-4">
            <span className={`font-sans text-xs tracking-[0.1em] uppercase ${saveStatusColor}`}>
              {saveStatusLabel}
            </span>

            <button
              onClick={() => setShowTagPanel(!showTagPanel)}
              className={`btn-ghost text-xs ${showTagPanel ? "!text-blush !border-blush/30" : ""}`}
            >
              Tags {tags.length > 0 ? `(${tags.length})` : ""}
            </button>

            <button
              onClick={handlePublish}
              disabled={isSaving || !title.trim()}
              className={`text-xs tracking-[0.12em] uppercase font-sans transition-all duration-300 px-4 py-2 rounded-sm border disabled:opacity-30 ${
                isPublished
                  ? "border-blush/40 text-blush hover:bg-blush/10"
                  : "btn-blush"
              }`}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        {/* Tags panel */}
        {showTagPanel && (
          <div className="mb-8 p-6 border border-white/5 rounded-sm bg-ink-secondary/30 animate-fade-in">
            {/* Tag input */}
            <div className="flex flex-wrap gap-2 items-center mb-4 min-h-[2rem]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="tag flex items-center gap-1.5 cursor-pointer hover:!border-red-400/30 hover:!text-red-400/60"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <span className="text-xs opacity-50">×</span>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="bg-transparent border-none outline-none font-sans text-xs text-parchment/70 placeholder:text-mist/25 min-w-[120px]"
                placeholder="Type a tag, press Enter..."
              />
            </div>

            {/* Suggested tags */}
            <div>
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/25 mb-3">
                Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                  <button
                    key={t}
                    onClick={() => addTag(t)}
                    className="tag hover:!text-parchment hover:!border-white/20"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === "write" ? (
          <>
            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full bg-transparent border-none outline-none poem-title text-2xl md:text-3xl text-parchment/90 placeholder:text-parchment/15 mb-8"
            />

            {/* Divider */}
            <div className="divider mb-10" />

            {/* Content textarea */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin here..."
              className="admin-textarea w-full"
              style={{ overflow: "hidden" }}
            />
          </>
        ) : (
          /* Preview mode */
          <div className="animate-fade-in">
            <h1 className="poem-title text-3xl text-center mb-4 glow-blush">
              {title || <span className="text-parchment/20">Untitled</span>}
            </h1>

            {!isPublished && (
              <p className="text-center font-sans text-xs tracking-[0.15em] uppercase text-blush/40 mb-2">
                Draft
              </p>
            )}

            <div className="divider mt-6 mb-14" />

            <div className="text-center">
              {content ? (
                <p className="poem-content text-parchment/80 mx-auto max-w-md">
                  {content}
                </p>
              ) : (
                <p className="poem-content text-parchment/20 italic">
                  Nothing written yet.
                </p>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-16">
                {tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom bar: stats */}
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs text-mist/25 tracking-[0.1em]">
              {wordCount} words
            </span>
            <span className="font-sans text-xs text-mist/15">·</span>
            <span className="font-sans text-xs text-mist/25 tracking-[0.1em]">
              {lineCount} lines
            </span>
          </div>

          {isEditing && (
            <a
              href={isPublished ? `/poems/${poem?.slug}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-sans text-xs tracking-[0.1em] uppercase ${
                isPublished
                  ? "text-mist/30 hover:text-mist/60 transition-colors"
                  : "text-mist/15 cursor-not-allowed"
              }`}
            >
              {isPublished ? "View live ↗" : "Not published"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}