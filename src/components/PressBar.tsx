import { useState } from "react";
import the51st from "@/assets/press-the51st.png.asset.json";
import popville from "@/assets/press-popville.png.asset.json";
import runwashington from "@/assets/press-runwashington.png.asset.json";
import washingtonfamily from "@/assets/press-washingtonfamily.png.asset.json";
import montgomery from "@/assets/press-montgomery.png.asset.json";

type Pub = { name: string; logo: string; w: number; h: number; href: string; label: string };

const PUBS: Pub[] = [
  { name: "The 51st", logo: the51st.url, w: 286, h: 134, href: "https://51st.news/washington-dc-events-things-to-do-weekend-july-30/", label: "Read Run Takoma With Love coverage in The 51st." },
  { name: "PoPville", logo: popville.url, w: 440, h: 148, href: "https://www.popville.com/events/run-takoma-with-love--free-community-5k-picnic-27314/", label: "View the Run Takoma With Love listing on PoPville." },
  { name: "RunWashington", logo: runwashington.url, w: 440, h: 114, href: "https://www.runwashington.com/events/run-takoma-with-love-free-community-5k-picnic-27307/", label: "View the Run Takoma With Love listing on RunWashington." },
  { name: "Washington FAMILY", logo: washingtonfamily.url, w: 440, h: 72, href: "https://www.washingtonfamily.com/calendar/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08", label: "View the Run Takoma With Love listing in Washington FAMILY." },
  { name: "Montgomery Magazine", logo: montgomery.url, w: 440, h: 139, href: "https://www.montgomerymag.com/events/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08", label: "View the Run Takoma With Love listing in Montgomery Magazine." },
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
            className="flex min-h-12 items-center px-2 opacity-85 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
          >
            <img src={p.logo} alt="" width={p.w} height={p.h} loading="lazy" className="h-6 w-auto sm:h-9" style={{ maxWidth: "none" }} />
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
      <div className="border-y border-hairline/30 py-6 sm:py-8">
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <h2 id="press-heading" className="display-tight text-2xl sm:text-3xl text-forest">Highlighted by</h2>
            <p className="mt-1 text-sm text-ink-soft">Run Takoma With Love coverage and community calendar listings.</p>
          </div>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="press-toggle min-h-11 shrink-0 border border-hairline px-3 eyebrow hover:bg-forest hover:text-[color:var(--color-forest-ink)]"
          >
            {paused ? "Play" : "Pause"}
            <span className="sr-only"> logo scroll</span>
          </button>
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
