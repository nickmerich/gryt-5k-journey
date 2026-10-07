import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import smartwaterLogo from "@/assets/partner-IMG_8388.png.asset.json";
import mocoParksLogo from "@/assets/partner-IMG_8387.png.asset.json";
import { EVENT_PHOTOS } from "@/lib/event-photos";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Run2Hub } from "@/components/Run2Hub";

const TITLE = "Partner with Run Takoma With Love #02 — GRYT Club";
const DESC =
  "Run #01 drew 248 signups and 98 finishers in Takoma Park. See the room, the photos, and the partner packages for Run #02 this December.";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

// Prices are DRAFT placeholders until the GRYT team confirms them.
const TIERS = [
  {
    name: "Supporter",
    price: "$500",
    note: "or product equivalent",
    perks: [
      "Your product in every finisher BIB packet (~100)",
      "Sampling at the post-run shelter",
      "Logo on the site partner wall and recap page",
    ],
  },
  {
    name: "Station",
    price: "$1,500",
    note: "hydration, recovery or audio",
    featured: true,
    perks: [
      "Everything in Supporter",
      "Your own branded station or tent on site",
      "Logo on the printed BIB packet",
      "Dedicated post on @grytrunclub",
      "2 bibs for your team",
    ],
  },
  {
    name: "Presenting",
    price: "$3,500",
    note: "one partner only",
    perks: [
      "Everything in Station",
      '"Run Takoma With Love #02 presented by [you]"',
      "Start/finish banner placement",
      "Logo across print, video and recap",
      "5 bibs for your team",
    ],
  },
];

function PartnersPage() {
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent("run2:open", { detail: "brand" })), 50);
    return () => clearTimeout(t);
  }, []);
  const openForm = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("run2:open", { detail: "brand" }));
    document.getElementById("run2")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="display-tight text-2xl">gryt</Link>
        <a href="#run2" onClick={openForm} className="eyebrow text-terracotta underline underline-offset-4">Talk to us</a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <p className="eyebrow text-terracotta">Partners · Run #02 · Early December 2026</p>
        <h1 className="display-tight mt-4 text-6xl sm:text-8xl">
          Put your brand <span className="brush-script normal-case text-terracotta">in the room</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          A free community 5K in Takoma Park. Real people, a real Sunday morning, and a hang that lasts long after the finish.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#tiers" className="brush-btn bg-terracotta px-8 py-4 text-center display-tight text-lg tracking-[0.1em] text-[color:var(--color-terracotta-ink)]">See packages</a>
          <a href="#run2" onClick={openForm} className="border-2 border-ink px-8 py-4 text-center display-tight text-lg tracking-[0.1em] hover:bg-ink hover:text-paper">Start a conversation</a>
        </div>
      </section>

      <section className="border-y-2 border-ink bg-forest text-[color:var(--color-forest-ink)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-12 md:grid-cols-4">
          {[
            ["248", "Signups for Run #01"],
            ["98", "Finishers"],
            ["~100", "Bibs for Run #02"],
            ["55+", "Event photos"],
          ].map(([n, l]) => (
            <div key={l} className="py-4">
              <p className="display-tight text-6xl sm:text-7xl">{n}</p>
              <p className="eyebrow mt-2 text-[color:var(--color-forest-ink)] opacity-80">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow text-terracotta">Who's in the room</p>
        <h2 className="display-tight mt-3 text-5xl">Neighbors, not a mailing list</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Local", "Takoma Park and the surrounding DC/Maryland community, at a Montgomery Parks venue."],
            ["Every pace", "Runners, joggers and walkers. A community run, not a race with podiums."],
            ["They stay", "Food, music and games at the shelter after the finish — time to actually meet people."],
          ].map(([h, b]) => (
            <div key={h} className="border-2 border-ink bg-paper-warm p-6">
              <h3 className="display-tight text-3xl">{h}</h3>
              <p className="mt-3 text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <p className="eyebrow text-ink-soft">Run #01 partners</p>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <img src={smartwaterLogo.url} alt="smartwater" className="h-16 w-auto object-contain" loading="lazy" />
            <img src={mocoParksLogo.url} alt="Montgomery Parks" className="h-16 w-auto object-contain" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="border-t-2 border-ink bg-paper-warm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="eyebrow text-terracotta">The proof</p>
          <h2 className="display-tight mt-3 text-5xl">See Run #01</h2>
          <div className="mt-8"><PhotoGallery photos={EVENT_PHOTOS} /></div>
        </div>
      </section>

      <section id="tiers" className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow text-terracotta">Packages</p>
        <h2 className="display-tight mt-3 text-5xl">Exactly what you get</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`flex flex-col border-2 border-ink p-6 ${t.featured ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper-warm"}`}>
              <p className="eyebrow" style={{ color: "inherit" }}>{t.name}{t.featured ? " · Most picked" : ""}</p>
              <p className="display-tight mt-3 text-6xl">{t.price}</p>
              <p className="text-sm opacity-80">{t.note}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2"><span aria-hidden>—</span><span>{p}</span></li>
                ))}
              </ul>
              <a href="#run2" onClick={openForm} className={`mt-8 border-2 px-6 py-3 text-center display-tight tracking-[0.1em] ${t.featured ? "border-[color:var(--color-forest-ink)] hover:bg-paper hover:text-ink" : "border-ink hover:bg-ink hover:text-paper"}`}>
                Ask about {t.name}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">Custom and in-kind packages welcome. Final terms confirmed in writing.</p>
      </section>

      <section className="border-t-2 border-ink">
        <Run2Hub />
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:justify-between">
          <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
          <div className="flex gap-4">
            <Link to="/" className="eyebrow text-ink-soft hover:text-ink">Home</Link>
            <Link to="/story" className="eyebrow text-ink-soft hover:text-ink">The Story</Link>
            <Link to="/terms" className="eyebrow text-ink-soft hover:text-ink">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
