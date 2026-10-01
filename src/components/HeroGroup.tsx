import { useEffect, useRef, useState } from "react";
import groupPhoto from "@/assets/rtwl-group-finishers.jpg.asset.json";

const ALT =
  "Run Takoma With Love finishers posing together with their medals in a Takoma Park garden";

export function HeroGroup() {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-16">
      <figure className="group relative">
        <div aria-hidden className="absolute -inset-2 -z-10 sm:-inset-3" style={{ backgroundColor: "var(--color-forest)", transform: "rotate(-0.8deg)" }} />
        <button
          type="button"
          onClick={() => { setZoom(false); setOpen(true); }}
          className="relative block w-full overflow-hidden border-2 border-ink focus-visible:outline-none"
          aria-label="Open the finisher group photo to find yourself"
        >
          <img
            src={groupPhoto.url}
            alt={ALT}
            fetchPriority="high"
            className="block w-full aspect-[4/5] sm:aspect-[3/2] object-cover object-[50%_70%] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.15 0.02 160 / 0.85), oklch(0.15 0.02 160 / 0.1) 55%, transparent)" }} />
          <span className="absolute left-3 top-3 sm:left-5 sm:top-5 -rotate-2 bg-terracotta px-3 py-1.5 display-tight text-sm sm:text-base tracking-[0.12em] text-[color:var(--color-terracotta-ink)]">
            98 FINISHERS · ONE FRAME
          </span>
          <span className="absolute right-3 top-3 sm:right-5 sm:top-5 rotate-2 bg-paper px-3 py-1.5 eyebrow text-forest">
            Takoma Park · 08.02.26
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 text-left sm:p-8">
            <span className="display-tight text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.86] text-paper">
              WE RAN <span className="text-terracotta">TAKOMA</span>
              <span className="block brush-script text-[clamp(2rem,5vw,3.75rem)] text-paper">with love</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-paper px-4 py-2 eyebrow text-ink transition-colors group-hover:bg-terracotta group-hover:text-[color:var(--color-terracotta-ink)]">
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              Tap to find yourself
            </span>
          </span>
        </button>
      </figure>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <p className="text-ink-soft text-lg max-w-xl">
          248 signed up. 98 crossed the line. One neighborhood showed up. Run #02 is next. Get in early.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a href="#run2" className="brush-btn inline-flex items-center justify-center px-8 py-4 display-tight text-lg tracking-[0.1em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors">
            JOIN THE RUN #02 LIST
          </a>
          <a href="#run2" onClick={() => setTimeout(() => (document.querySelectorAll('#run2 [role=tab]')[1] as HTMLElement | undefined)?.click(), 50)} className="brush-btn inline-flex items-center justify-center px-8 py-4 display-tight text-lg tracking-[0.1em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors">
            PARTNER WITH US
          </a>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Finisher group photo" className="fixed inset-0 z-[100] flex flex-col bg-ink">
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <span className="eyebrow text-paper">{zoom ? "Move to look around · tap to zoom out" : "Tap the photo to zoom in"}</span>
            <div className="flex gap-2">
              <a href={groupPhoto.url} download="run-takoma-finishers.jpg" className="bg-paper px-3 py-2 eyebrow text-ink hover:bg-terracotta">Save photo</a>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="bg-terracotta px-3 py-2 eyebrow text-[color:var(--color-terracotta-ink)]">Close</button>
            </div>
          </div>
          <div
            className="relative flex-1 overflow-hidden"
            style={{ cursor: zoom ? "zoom-out" : "zoom-in", touchAction: zoom ? "none" : "auto" }}
            onPointerMove={zoom ? move : undefined}
            onClick={(e) => { if (!zoom) move(e as unknown as React.PointerEvent<HTMLDivElement>); setZoom((z) => !z); }}
          >
            <img
              src={groupPhoto.url}
              alt={ALT}
              className="h-full w-full object-contain transition-transform duration-200"
              style={{ transform: zoom ? "scale(2.6)" : "scale(1)", transformOrigin: origin }}
            />
          </div>
          <p className="p-3 text-center eyebrow text-paper">Spot yourself? Tag @grytrunclub</p>
        </div>
      )}
    </section>
  );
}
