import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Run Takoma With Love 5K — GRYT Club" },
      {
        name: "description",
        content:
          "Run Takoma, with love. A neighborhood 5K from GRYT Club — Sunday, August 2, 2026 at 9:00 AM in Takoma Park, Maryland. Community. Movement. Takoma.",
      },
      { property: "og:title", content: "Run Takoma With Love 5K — GRYT Club" },
      {
        property: "og:description",
        content:
          "Sunday, August 2, 2026 · 9:00 AM · Takoma Park, MD. Presented by GRYT in partnership with smartwater.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RunTakomaOnePager,
});

function RunTakomaOnePager() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      {/* Paper grain / vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 15%, oklch(0.34 0.045 165 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 85%, oklch(0.60 0.15 32 / 0.14), transparent 55%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.15 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top rule / eyebrow bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 sm:pt-8">
        <span className="eyebrow text-ink-soft">GRYT Club · 5K Series</span>
        <span className="eyebrow text-ink-soft hidden sm:inline">
          08 · 02 · 2026
        </span>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-10 pb-16 text-center sm:pt-14">
        <ShieldLogo className="mx-auto h-40 w-40 sm:h-48 sm:w-48" />

        <RuledLabel className="mt-6">Presented by GRYT</RuledLabel>

        <h1 className="mt-6 display-tight text-[clamp(4rem,14vw,10rem)] leading-[0.88]">
          <span className="block text-forest">RUN</span>
          <span className="block text-terracotta">TAKOMA</span>
        </h1>

        <p className="mt-4 serif-italic text-forest text-[clamp(2.25rem,6vw,4rem)] leading-none">
          with love{" "}
          <span aria-hidden className="inline-block align-middle text-terracotta">
            ♡
          </span>
        </p>

        <div className="mt-2 flex items-center justify-center gap-3">
          <Dash />
          <span className="display-tight text-forest text-[clamp(2rem,5vw,3rem)]">
            5K
          </span>
          <Dash />
        </div>

        {/* Date / Location card */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="border-y-2 border-ink py-5">
            <p className="display-tight text-terracotta text-xl sm:text-2xl">
              Sunday August 2, 2026 · 9:00 AM
            </p>
            <p className="mt-2 display-tight text-forest text-lg sm:text-xl">
              Takoma Park, Maryland
            </p>
          </div>

          <RuledLabel className="mt-6">In partnership with</RuledLabel>
          <p className="mt-3 font-sans font-bold text-2xl tracking-tight text-ink">
            smartwater<span className="align-super text-[0.5em]">®</span>
          </p>
        </div>

        {/* Register CTA — brushstroke pill */}
        <a
          href="https://grytrun.com"
          target="_blank"
          rel="noreferrer"
          className="group relative mt-10 inline-flex items-center justify-center px-10 py-5"
          style={{
            backgroundColor: "var(--color-forest)",
            color: "var(--color-forest-ink)",
            clipPath:
              "polygon(2% 15%, 8% 0%, 30% 8%, 55% 0%, 78% 10%, 96% 0%, 100% 40%, 98% 85%, 90% 100%, 65% 92%, 40% 100%, 15% 90%, 0% 100%, 3% 55%)",
          }}
        >
          <span className="display-tight text-xl sm:text-2xl tracking-[0.08em]">
            REGISTER | GRYTRUN.COM
          </span>
        </a>
      </section>

      {/* Torn terracotta ribbon */}
      <section
        className="relative z-10 mt-4 py-6"
        style={{
          backgroundColor: "var(--color-terracotta)",
          color: "var(--color-terracotta-ink)",
          clipPath:
            "polygon(0 22%, 4% 8%, 12% 18%, 22% 4%, 34% 14%, 46% 2%, 58% 16%, 70% 6%, 82% 18%, 92% 4%, 100% 20%, 100% 100%, 0 100%)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-6 px-6 pt-4">
          <span aria-hidden className="serif-italic text-2xl text-forest">
            ♡
          </span>
          <p className="display-tight text-sm sm:text-base tracking-[0.32em] text-center">
            COMMUNITY. &nbsp; MOVEMENT. &nbsp; TAKOMA.
          </p>
          <span aria-hidden className="serif-italic text-2xl text-forest">
            ♡
          </span>
        </div>
      </section>

      {/* Supporting one-pager sections */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <Feature
            kicker="The Route"
            title="3.1 miles through Takoma"
            body="A flat, tree-lined loop from Ed Wilhelm Field, out through the old neighborhoods and back down Carroll Avenue."
          />
          <Feature
            kicker="The Vibe"
            title="Neighborhood block party energy"
            body="Live DJ at the start, coffee and pastries at the finish, kids' zone on the field. Come for the run, stay for the morning."
          />
          <Feature
            kicker="The Cause"
            title="Every entry moves the block"
            body="Proceeds support youth run clubs and community fridges across Takoma Park and Silver Spring."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="eyebrow text-ink-soft">
            © GRYT Club · Takoma Park, MD
          </p>
          <p className="eyebrow text-ink-soft">
            grytrun.com · @grytclub
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------ bits ------------------------------ */

function Dash() {
  return (
    <span
      aria-hidden
      className="inline-block h-[3px] w-10 bg-forest"
      style={{ clipPath: "polygon(0 40%, 5% 0, 95% 20%, 100% 60%, 95% 100%, 5% 80%)" }}
    />
  );
}

function RuledLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-ink" />
      <span className="eyebrow">{children}</span>
      <span className="h-px w-10 bg-ink" />
    </div>
  );
}

function Feature({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <article className="text-center sm:text-left">
      <p className="eyebrow text-terracotta">{kicker}</p>
      <h3 className="mt-3 display-tight text-2xl text-forest">{title}</h3>
      <p className="mt-3 text-ink-soft leading-relaxed">{body}</p>
    </article>
  );
}

/* ---- GRYT-style shield/bear mark (vector interpretation, not the trademark) ---- */
function ShieldLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-label="GRYT Club shield">
      <defs>
        <clipPath id="shield">
          <path d="M100 6 L188 34 V108 C188 148 152 178 100 194 C48 178 12 148 12 108 V34 Z" />
        </clipPath>
      </defs>

      {/* Shield body */}
      <path
        d="M100 6 L188 34 V108 C188 148 152 178 100 194 C48 178 12 148 12 108 V34 Z"
        fill="var(--color-forest)"
      />
      {/* Inner border */}
      <path
        d="M100 14 L180 40 V108 C180 144 148 172 100 186 C52 172 20 144 20 108 V40 Z"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="2"
      />

      {/* Bear silhouette (stylized) */}
      <g clipPath="url(#shield)" fill="var(--color-paper)">
        {/* Head */}
        <ellipse cx="100" cy="82" rx="46" ry="38" />
        {/* Ears */}
        <circle cx="62" cy="52" r="14" />
        <circle cx="138" cy="52" r="14" />
        <circle cx="62" cy="52" r="6" fill="var(--color-forest)" />
        <circle cx="138" cy="52" r="6" fill="var(--color-forest)" />
        {/* Snout */}
        <ellipse cx="100" cy="100" rx="24" ry="16" />
        {/* Roaring mouth */}
        <path
          d="M82 104 Q100 128 118 104 Q112 118 100 120 Q88 118 82 104 Z"
          fill="var(--color-forest)"
        />
        {/* Teeth */}
        <path
          d="M88 108 L92 116 L96 108 L100 118 L104 108 L108 116 L112 108 Z"
          fill="var(--color-paper)"
        />
        {/* Eyes */}
        <path d="M80 74 Q86 68 92 74 Q86 78 80 74 Z" fill="var(--color-forest)" />
        <path d="M120 74 Q126 68 132 74 Q126 78 120 74 Z" fill="var(--color-forest)" />
        {/* Nose */}
        <ellipse cx="100" cy="92" rx="6" ry="4" fill="var(--color-forest)" />
      </g>

      {/* GRYT wordmark ribbon */}
      <g transform="translate(100 148)">
        <rect x="-42" y="-14" width="84" height="28" fill="var(--color-paper)" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontFamily="Oswald, sans-serif"
          fontWeight="700"
          fontSize="22"
          letterSpacing="2"
          fill="var(--color-forest)"
        >
          GRYT
        </text>
      </g>
      <text
        x="100"
        y="176"
        textAnchor="middle"
        fontFamily="Oswald, sans-serif"
        fontWeight="600"
        fontSize="10"
        letterSpacing="4"
        fill="var(--color-paper)"
      >
        CLUB
      </text>
    </svg>
  );
}
