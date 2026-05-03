"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/poems", label: "Poems" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between"
      style={{ background: "linear-gradient(to bottom, rgba(26,16,38,0.95) 0%, transparent 100%)" }}>
      
      {/* Logo / Site Name */}
      <Link href="/" className="group">
        <span className="font-serif text-parchment-dim text-sm tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          In the Still Hours
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? "!text-parchment" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}