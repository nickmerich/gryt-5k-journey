import { Link } from "@tanstack/react-router";
import { useState } from "react";
import the51st from "@/assets/press-the51st.png.asset.json";
import popville from "@/assets/press-popville.png.asset.json";
import runwashington from "@/assets/press-runwashington.png.asset.json";
import washingtonfamily from "@/assets/press-washingtonfamily.png.asset.json";
import montgomery from "@/assets/press-montgomery.png.asset.json";

type Pub = { name: string; size?: string; logo: string; w: number; h: number; href: string; label: string };

const PUBS: Pub[] = [
  { name: "The 51st", size: "h-10 sm:h-14", logo: the51st.url, w: 286, h: 134, href: "https://51st.news/washington-dc-events-things-to-do-weekend-july-30/", label: "Read Run Takoma With Love coverage in The 51st." },
  { name: "PoPville", size: "h-10 sm:h-14", logo: popville.url, w: 440, h: 148, href: "https://www.popville.com/events/run-takoma-with-love--free-community-5k-picnic-27314/", label: "View the Run Takoma With Love listing on PoPville." },
  { name: "RunWashington", size: "h-8 sm:h-11", logo: runwashington.url, w: 440, h: 114, href: "https://www.runwashington.com/events/run-takoma-with-love-free-community-5k-picnic-27307/", label: "View the Run Takoma With Love listing on RunWashington." },
  { name: "Washington FAMILY", size: "h-6 sm:h-8", logo: washingtonfamily.url, w: 440, h: 72, href: "https://www.washingtonfamily.com/calendar/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08", label: "View the Run Takoma With Love listing in Washington FAMILY." },
  { name: "Montgomery Magazine", size: "h-10 sm:h-12", logo: montgomery.url, w: 440, h: 139, href: "https://www.montgomerymag.com/events/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08", label: "View the Run Takoma With Love listing in Montgomery Magazine." },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="press-row" aria-hidden={hidden || undefined}>
      {PUBS.map((p) => (
        <li key={p.name}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            aria-label={hidden ? undefined : `${p.label} (opens in a new tab)`}
            className="flex min-h-14 items-center px-1 opacity-80 transition duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
          >
            <img src={p.logo} alt="" width={p.w} height={p.h} loading="lazy" className={`${p.size ?? "h-7 sm:h-9"} w-auto select-none`} draggable={false} style={{ maxWidth: "none" }} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PressBar() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="press-heading" className="relative z-10 mx-auto mb-12 max-w-6xl px-5 sm:px-6">
      <div className="py-6 sm:py-10">
        <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mb-7 sm:gap-5">
          <span aria-hidden className="h-px bg-hairline/40" />
          <h2 id="press-heading" className="eyebrow text-[0.8rem] tracking-[0.28em] text-forest sm:text-sm"><Link to="/press" className="hover:text-terracotta">Featured In</Link></h2>
          <span className="flex items-center gap-3">
            <span aria-hidden className="h-px flex-1 bg-hairline/40" />
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              aria-label={paused ? "Play logo scroll" : "Pause logo scroll"}
              className="press-toggle grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline/50 text-ink-soft transition-colors hover:bg-forest hover:text-[color:var(--color-forest-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta active:translate-y-px"
            >
              {paused ? (
                <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
              ) : (
                <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
              )}
            </button>
          </span>
        </div>
        <div className={`press-viewport ${paused ? "is-paused" : ""}`}>
          <div className="press-track">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
