import { useEffect, useRef, useState } from "react";
import groupPhoto from "@/assets/rtwl-group-finishers.jpg.asset.json";
import g1920 from "@/assets/rtwl-group-1920.webp.asset.json";
import { ResponsiveImg } from "@/components/ResponsiveImg";

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
    <section className="relative z-10 mx-auto max-w-6xl px-0 pt-3 pb-8 sm:px-6 sm:pt-8 sm:pb-16">
      <figure className="group relative">
        <div aria-hidden className="absolute -inset-3 -z-10 hidden sm:block" style={{ backgroundColor: "var(--color-forest)", transform: "rotate(-0.8deg)" }} />
        <button
          type="button"
          onClick={() => { setZoom(false); setOpen(true); }}
          className="relative block w-full overflow-hidden border-y-2 sm:border-2 border-ink bg-forest focus-visible:outline-none"
          aria-label="Open the finisher group photo to find yourself"
        >
          <ResponsiveImg
            asset={g1920.url}
            sizes="(min-width: 1152px) 1104px, (min-width: 640px) calc(100vw - 48px), 100vw"
            width={1824}
            height={1215}
            alt={ALT}
            priority
            className="block w-full aspect-[4/3] sm:aspect-[3/2] object-cover object-[50%_78%] sm:object-[50%_70%] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block" style={{ background: "linear-gradient(to top, oklch(0.15 0.02 160 / 0.85), oklch(0.15 0.02 160 / 0.1) 55%, transparent)" }} />
          <span className="pointer-events-none absolute left-2 top-2 sm:left-5 sm:top-5 -rotate-2 w-[140px] sm:w-[200px] text-terracotta" aria-label="98 finishers · one frame">
            <svg aria-hidden="true" viewBox="0 0 320 170" className="block h-auto w-full overflow-visible">
              <path fill="currentColor" d="M0.8,0 L266.7,0 L273.4,118.1 L320,119.2 L305.8,158.7 L294.7,160.2 L275,165.9 L259.6,170 L260,154.6 L254.1,148.4 L262.4,141.8 L251.3,126.3 L247.8,133 L232.8,131.5 L227.7,114.5 L232.4,114.5 L232.8,92.4 L237.5,83.7 L231.2,53.9 L239.1,36.5 L251.3,33.4 L253.3,15.4 L244.2,17.5 L243.8,26.7 L224.9,38.5 L219.4,49.3 L218.2,76.5 L211.1,89.4 L214.3,110.9 L223.7,125.8 L222.5,137.1 L228.5,148.4 L225.3,156.1 L208.7,141.2 L185.1,134 L178,119.7 L164.5,127.9 L159.4,116.6 L170.1,102.2 L176.4,87.3 L185.8,77.6 L176.8,68.3 L170.9,74 L161.4,65.2 L146.4,60.6 L146.4,46.7 L138.5,39 L127.4,37.5 L119.2,11.3 L106.9,11.3 L94.7,2.6 L88,9.8 L76.2,9.2 L73.4,19.5 L52.1,12.8 L37.9,26.7 L28.4,23.6 L14.2,39.5 L0,48.3 Z" />
              <g fill="currentColor" className="display-tight text-terracotta-ink" textAnchor="middle">
                <text x="190" y="34" fontSize="38">98</text>
                <text x="190" y="54" fontSize="21">FINISHERS</text>
                <text x="190" y="68" fontSize="11">ONE FRAME</text>
              </g>
            </svg>
          </span>
          <span className="absolute right-2 top-2 sm:right-5 sm:top-5 rotate-2 bg-paper px-2 py-1 sm:px-3 sm:py-1.5 eyebrow text-forest">
            08.02.26
          </span>
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-paper px-3 py-2 eyebrow text-ink sm:hidden">
            <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            Find yourself
          </span>
          <span className="absolute inset-x-0 bottom-0 hidden flex-col items-start gap-3 p-8 text-left sm:flex">
            <span className="display-tight text-[clamp(3rem,8vw,6.5rem)] leading-[0.86] text-paper">
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

      {/* Mobile headline (overlay on larger screens) */}
      <h1 className="mt-5 px-5 display-tight text-[clamp(2.75rem,13vw,4rem)] leading-[0.86] sm:hidden">
        <span className="text-forest">WE RAN </span><span className="text-terracotta">TAKOMA</span>
        <span className="block brush-script text-forest text-[clamp(2rem,9vw,2.75rem)]">with love</span>
      </h1>

      <div className="mt-4 grid gap-5 px-5 sm:mt-8 sm:px-0 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <p className="text-ink-soft text-base sm:text-lg max-w-xl">
          Join Us December 2026 for Run #2
        </p>
        <div className="grid gap-3 sm:flex sm:flex-row lg:justify-end">
          <a href="#run2" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("run2:open", { detail: "runner" })); }} className="brush-btn inline-flex min-h-14 w-full sm:w-auto items-center justify-center px-8 py-4 display-tight text-lg tracking-[0.1em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] active:translate-y-px transition-colors">
            GET ON THE RUN #02 LIST
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
