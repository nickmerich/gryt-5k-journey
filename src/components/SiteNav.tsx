import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import bearLogo from "@/assets/gryt-bear.png.asset.json";

const LINKS = [
  { to: "/5k-series", label: "Runs" },
  { to: "/artists", label: "Artists" },
  { to: "/partners", label: "Brands" },
  { to: "/story", label: "Story" },
  { to: "/press", label: "Press" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 mx-auto max-w-6xl px-5 pt-5 sm:px-6 sm:pt-7">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex min-h-12 items-center gap-3" aria-label="GRYT home">
          <img src={bearLogo.url} alt="" width={56} height={60} className="h-11 w-auto sm:h-14" />
          <span className="font-display text-2xl font-bold leading-none text-forest sm:text-3xl">gryt</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="eyebrow text-sm text-ink transition-colors hover:text-terracotta" activeProps={{ className: "text-terracotta" }}>
              {l.label}
            </Link>
          ))}
          <a href="/#run2" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 eyebrow text-sm text-[color:var(--color-paper)] transition-colors hover:bg-terracotta">
            Join the list
          </a>
        </nav>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center border-2 border-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="mt-3 grid gap-1 border-2 border-ink bg-paper-warm p-2 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center px-3 display-tight text-xl text-forest">
              {l.label}
            </Link>
          ))}
          <a href="/#run2" onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center bg-ink display-tight text-xl text-[color:var(--color-paper)]">
            Join the list
          </a>
        </nav>
      )}
    </header>
  );
}
