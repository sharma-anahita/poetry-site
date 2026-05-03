"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between border-b border-white/5"
      style={{ background: "rgba(26, 16, 38, 0.95)", backdropFilter: "blur(10px)" }}
    >
      {/* Left: site name */}
      <Link href="/admin" className="font-sans text-xs tracking-[0.25em] uppercase text-mist/50 hover:text-mist transition-colors duration-300">
        Admin
      </Link>

      {/* Center: links */}
      <div className="flex items-center gap-6">
        <Link
          href="/admin"
          className={`nav-link text-xs ${pathname === "/admin" ? "!text-parchment" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/editor"
          className={`nav-link text-xs ${pathname.startsWith("/admin/editor") ? "!text-parchment" : ""}`}
        >
          New poem
        </Link>
        <Link
          href="/"
          target="_blank"
          className="nav-link text-xs"
        >
          View site ↗
        </Link>
      </div>

      {/* Right: sign out */}
      <form action={signOut}>
        <button
          type="submit"
          className="font-sans text-xs tracking-[0.15em] uppercase text-mist/30 hover:text-blush/70 transition-colors duration-300"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}