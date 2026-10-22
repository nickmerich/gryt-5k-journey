import { ArtistPitchForm } from "@/components/ArtistPitchForm";
import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";

const TITLE = "Host a run · Artist-led 5Ks · GRYT";
const DESC = "Your album. Your neighborhood. Your fans, moving together. Bring a free GRYT artist-led 5K to your city.";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { name: "twitter:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://grytrun.com/artists" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://grytrun.com/artists" }],
  }),
  component: ArtistsPage,
});

const STEPS = [
  ["01", "The album drops", "It starts with music about a real place."],
  ["02", "We build the route", "A 5K through the neighborhood the album is about."],
  ["03", "Fans run it with you", "Then everyone hangs out after. Free to join."],
];

function ArtistsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-5 pb-14 pt-10 sm:px-6 sm:pt-16">
        <p className="eyebrow text-terracotta">For artists and managers</p>
        <h1 className="mt-3 display-tight text-7xl text-forest sm:text-9xl">HOST A RUN.</h1>
        <p className="mt-4 max-w-xl serif-italic text-2xl text-ink-soft sm:text-3xl">
          Your album. Your neighborhood. Your fans, moving together.
        </p>

        <ol className="mt-14 grid gap-0 border-t-2 border-ink">
          {STEPS.map(([n, t, b]) => (
            <li key={n} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-hairline py-6 sm:grid-cols-[6rem_1fr]">
              <span className="display-tight text-4xl text-terracotta sm:text-5xl">{n}</span>
              <div>
                <p className="display-tight text-3xl text-forest">{t}</p>
                <p className="mt-1 text-ink-soft">{b}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="ink-card mt-14 p-6 sm:p-8">
          <p className="eyebrow text-terracotta">Case study</p>
          <p className="mt-2 display-tight text-4xl text-forest sm:text-5xl">Run Takoma With Love</p>
          <p className="mt-2 text-ink-soft">With Heno. and Oddisee, named for the album From Takoma With Love. 248 signed up. 98 finished.</p>
          <Link to="/takoma" className="mt-5 inline-flex min-h-12 items-center border-2 border-ink px-5 display-tight text-lg text-forest hover:bg-ink hover:text-[color:var(--color-paper)]">
            See the run
          </Link>
        </div>

        <ArtistPitchForm />
      </section>
    <SiteFooter />
    </main>
  );
}
