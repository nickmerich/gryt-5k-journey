import { useEffect, useMemo, useState } from "react";

export type GalleryPhoto = { src: string; alt: string };
type Cat = "all" | "pre" | "course" | "medal";

const STICKERS = ["TAKOMA ♡ 5K", "MILE 2 ENERGY", "DO HARD THINGS", "MEDAL BITE CLUB", "WE SHOWED UP", "FINISHED."];

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const tagged = useMemo(
    () =>
      photos.map((p, i) => ({
        ...p,
        n: i + 1,
        cat: (i < 6 ? "pre" : i < 39 ? "course" : "medal") as Exclude<Cat, "all">,
      })),
    [photos],
  );
  // Curated picks spanning the day
  const highlightIdx = [0, 2, 6, 14, 22, 30, 41, 47].filter((i) => i < tagged.length);
  const highlights = highlightIdx.map((i) => tagged[i]);

  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<Cat>("all");
  const [view, setView] = useState<number | null>(null);
  const list = cat === "all" ? tagged : tagged.filter((p) => p.cat === cat);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") view !== null ? setView(null) : setOpen(false);
      if (view !== null && e.key === "ArrowRight") setView((v) => ((v ?? 0) + 1) % list.length);
      if (view !== null && e.key === "ArrowLeft") setView((v) => ((v ?? 0) - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, view, list.length]);

  const openAt = (n: number) => {
    setCat("all");
    setOpen(true);
    setView(n - 1);
  };

  const counts = {
    all: tagged.length,
    pre: tagged.filter((p) => p.cat === "pre").length,
    course: tagged.filter((p) => p.cat === "course").length,
    medal: tagged.filter((p) => p.cat === "medal").length,
  };
  const tabs: { k: Cat; l: string }[] = [
    { k: "all", l: "All" },
    { k: "pre", l: "Pre-race hangs" },
    { k: "course", l: "On the course" },
    { k: "medal", l: "Medal club" },
  ];
  const current = view !== null ? list[view] : null;

  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <p className="eyebrow mb-6 text-center text-forest">Highlights · Aug 2, 2026</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {highlights.map((p, i) => (
          <button
            type="button"
            key={p.src}
            onClick={() => openAt(p.n)}
            className={`group relative block text-left transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${
              i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : ""
            } ${i === 0 || i === 5 ? "sm:col-span-2 sm:row-span-2" : ""}`}
            aria-label={`Open photo: ${p.alt}`}
          >
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 opacity-80"
              style={{ backgroundColor: "var(--color-paper-warm)", border: "1px solid var(--color-ink)" }}
            />
            <span className="block overflow-hidden border-2 border-ink bg-paper-warm p-1.5">
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </span>
            {i % 2 === 0 && (
              <span
                className="absolute bottom-3 left-3 display-tight text-xs sm:text-sm tracking-[0.14em] px-2 py-1 -rotate-3 border-2 border-ink"
                style={{
                  backgroundColor: i % 4 === 0 ? "var(--color-terracotta)" : "var(--color-forest)",
                  color: i % 4 === 0 ? "var(--color-terracotta-ink)" : "var(--color-forest-ink)",
                }}
              >
                {STICKERS[(i / 2) % STICKERS.length]}
              </span>
            )}
            <span className="absolute top-3 right-3 display-tight text-[10px] tracking-[0.14em] px-1.5 py-0.5 bg-paper-warm text-forest border border-ink">
              #{String(p.n).padStart(2, "0")} / {tagged.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setView(null);
            setOpen(true);
          }}
          className="brush-btn inline-flex items-center justify-center px-8 py-4 display-tight text-lg tracking-[0.1em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors"
        >
          SEE ALL {tagged.length} PHOTOS
        </button>
        <p className="eyebrow text-ink-soft">Find yourself · save your shot</p>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All race photos"
          className="fixed inset-0 z-[100] flex flex-col bg-paper"
        >
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3 sm:px-6">
            <p className="display-tight text-xl sm:text-2xl text-forest">
              THE PHOTO VAULT <span className="text-terracotta">♡</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="display-tight tracking-[0.14em] border-2 border-ink px-3 py-1.5 hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)]"
            >
              CLOSE ✕
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto border-b-2 border-ink px-4 py-3 sm:px-6">
            {tabs.map((t) => (
              <button
                key={t.k}
                type="button"
                aria-pressed={cat === t.k}
                onClick={() => {
                  setCat(t.k);
                  setView(null);
                }}
                className={`shrink-0 display-tight text-sm tracking-[0.12em] border-2 border-ink px-3 py-1.5 ${
                  cat === t.k ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper-warm text-forest"
                }`}
              >
                {t.l.toUpperCase()} ({counts[t.k]})
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setView(i)}
                  className="hover-lift relative overflow-hidden border-2 border-ink bg-paper-warm"
                  aria-label={`View photo: ${p.alt}`}
                >
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="block w-full aspect-[3/4] object-cover" />
                  <span className="absolute top-2 left-2 display-tight text-[10px] tracking-[0.14em] px-1.5 py-0.5 bg-paper-warm text-forest border border-ink">
                    #{String(p.n).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {current && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-4"
              style={{ backgroundColor: "oklch(0.15 0.01 60 / 0.94)" }}
              onClick={() => setView(null)}
            >
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[75vh] max-w-full border-2 border-paper object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="max-w-xl text-center text-sm" style={{ color: "var(--color-paper)" }}>
                #{String(current.n).padStart(2, "0")} · {current.alt}
              </p>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {[
                  { l: "← PREV", f: () => setView((v) => ((v ?? 0) - 1 + list.length) % list.length) },
                  { l: "NEXT →", f: () => setView((v) => ((v ?? 0) + 1) % list.length) },
                ].map((b) => (
                  <button key={b.l} type="button" onClick={b.f} className="display-tight tracking-[0.14em] border-2 border-ink bg-paper-warm text-forest px-4 py-2">
                    {b.l}
                  </button>
                ))}
                <a
                  href={current.src}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="display-tight tracking-[0.14em] border-2 border-ink bg-terracotta text-[color:var(--color-terracotta-ink)] px-4 py-2"
                >
                  SAVE
                </a>
                <button type="button" onClick={() => setView(null)} className="display-tight tracking-[0.14em] border-2 border-ink bg-paper-warm text-forest px-4 py-2">
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
