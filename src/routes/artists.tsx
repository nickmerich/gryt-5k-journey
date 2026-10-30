import { ArtistPitchForm } from "@/components/ArtistPitchForm";
import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { breadcrumbJsonLd, faqJsonLd, jsonLdScript, type QA } from "@/lib/seo";

const TITLE = "Host an Artist-Led 5K in Your Neighborhood · GRYT";
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
    scripts: [
      jsonLdScript(faqJsonLd(ARTIST_FAQ)),
      jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Artists", path: "/artists" }])),
    ],
  }),
  component: ArtistsPage,
});

const STEPS = [
  ["01", "The album drops", "It starts with music about a real place."],
  ["02", "We build the route", "A 5K through the neighborhood the album is about."],
  ["03", "Fans run it with you", "Then everyone hangs out after. Free to join."],
];

const HANDLES = [
  ["Permits and the route", "We work with the city or parks department, map a 5K that tells the album's story, and get it approved."],
  ["Insurance and registration", "Coverage for the day, a sign-up flow for your fans, and bibs."],
  ["Safety", "Marshals at turns and crossings, water, first aid, and a plan for walkers so nobody gets left behind."],
  ["Day-of operations", "Check-in, start, finish, cleanup, and volunteers who keep it running."],
  ["Partners", "Local partners who help make it free for runners, like smartwater and Montgomery Parks at Run #01."],
  ["The recap", "Photos, video, and a recap page so the day lives on."],
];

const ARTIST_FAQ: QA[] = [
  {
    q: "What is an artist-led 5K?",
    a: "A 5K built around an album and the real place it is about. Fans and neighbors run or walk a route through that neighborhood with the artist, then hang out after. It is not a concert and not a promo. It is a hang with a 5K in the middle.",
  },
  {
    q: "Do I have to be a runner?",
    a: "No. Walk it, jog it, run it. What matters is that you show up and share the story behind the music. Every pace is welcome, for you and your fans.",
  },
  {
    q: "What does GRYT handle?",
    a: "Permits, the route, insurance, registration, safety, day-of operations, partners, and the recap. You bring the story, the audience, and yourself.",
  },
  {
    q: "Does it cost fans anything?",
    a: "GRYT runs are free for runners and built with local partners.",
  },
  {
    q: "What happens after I pitch?",
    a: "Your pitch is saved, and we will review your idea and follow up by email.",
  },
];

function ArtistsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-5 pb-14 pt-10 sm:px-6 sm:pt-16">
        <p className="eyebrow text-terracotta">For artists and managers</p>
        <h1 className="mt-3 display-tight text-7xl text-forest sm:text-9xl">HOST A RUN.<span className="mt-2 block brush-script text-4xl text-terracotta sm:text-6xl">Artist-led 5Ks, in your neighborhood</span></h1>
        <p className="mt-4 max-w-xl serif-italic text-2xl text-ink-soft sm:text-3xl">
          Your album. Your neighborhood. Your fans, moving together.
        </p>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            An artist-led 5K is a run built around your music and the real place it is about. We map a route through that
            neighborhood, your fans and neighbors run or walk it with you, and then everybody hangs out. It is not a concert.
            It is not a promo. It is a hang with a 5K in the middle.
          </p>
          <p>
            You do not have to be a runner, and neither do your fans. Every pace is welcome, walkers too. The point is
            moving through the place together.
          </p>
        </div>

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

        <section aria-labelledby="handles-title" className="mt-14">
          <h2 id="handles-title" className="display-tight text-4xl text-forest sm:text-5xl">WHAT GRYT HANDLES</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">You make the music. We produce the run, so it feels easy for you and safe for everyone who shows up.</p>
          <dl className="mt-6 grid gap-x-10 border-t-2 border-ink sm:grid-cols-2">
            {HANDLES.map(([t, b]) => (
              <div key={t} className="border-b border-hairline py-4">
                <dt className="display-tight text-2xl text-forest">{t}</dt>
                <dd className="mt-1 text-ink-soft">{b}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="brings-title" className="mt-14 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 id="brings-title" className="display-tight text-4xl text-forest sm:text-5xl">WHAT YOU BRING</h2>
            <ul className="mt-4 space-y-3 text-ink-soft">
              <li><strong className="text-ink">The story.</strong> Why this place, why this album. That becomes the route and the reason people come.</li>
              <li><strong className="text-ink">The audience.</strong> You tell your fans. A few posts go a long way when the invite is this personal.</li>
              <li><strong className="text-ink">You, on the day.</strong> Run it, walk it, cheer at the finish, stay for the hang.</li>
            </ul>
          </div>
          <div>
            <h2 className="display-tight text-4xl text-forest sm:text-5xl">SMALL ON PURPOSE</h2>
            <p className="mt-4 text-ink-soft">
              Run #01 had 100 bibs. Keeping it small means fans actually meet you and each other, the course stays calm, and
              the neighborhood stays happy to have us back. No stage, no VIP section, no fastest-finisher prize. Free for
              runners, built with local partners.
            </p>
          </div>
        </section>

        <div className="ink-card mt-14 p-6 sm:p-8">
          <p className="eyebrow text-terracotta">Case study</p>
          <p className="mt-2 display-tight text-4xl text-forest sm:text-5xl">Run Takoma With Love</p>
          <p className="mt-2 text-ink-soft">With Heno. and Oddisee, named for the album From Takoma With Love. 248 signed up. 98 finished.</p>
          <p className="mt-3 text-ink-soft">
            On August 2, 2026, fans and neighbors met at the covered shelter in Takoma-Piney Branch Local Park in Takoma
            Park, Maryland. They ran and walked a 5K through the neighborhood the album is about, with marshals at every turn,
            then stayed for a picnic. Run #02 is planned for December 2026 in the same park.
          </p>
          <Link to="/takoma" className="mt-5 inline-flex min-h-12 items-center border-2 border-ink px-5 display-tight text-lg text-forest hover:bg-ink hover:text-[color:var(--color-paper)]">
            See the run
          </Link>
        </div>

        <section aria-labelledby="pitch-steps-title" className="mt-14">
          <h2 id="pitch-steps-title" className="display-tight text-4xl text-forest sm:text-5xl">HOW TO PITCH</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Tell us about the album, the place it is about, and the city you have in mind. Managers and teams can pitch on
            an artist's behalf. We will review your idea and follow up by email.
          </p>
        </section>

        <ArtistPitchForm />

        <section aria-labelledby="artist-faq-title" className="mt-14">
          <h2 id="artist-faq-title" className="display-tight text-4xl text-forest sm:text-5xl">ARTIST FAQ</h2>
          <dl className="mt-5 divide-y divide-hairline border-y-2 border-ink">
            {ARTIST_FAQ.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="display-tight text-2xl text-forest">{f.q}</dt>
                <dd className="mt-1 text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-ink-soft">
            Curious how this compares with other community runs? See <a href="/compare" className="text-forest underline decoration-terracotta underline-offset-4">how GRYT compares</a> or the <a href="/5k-series" className="text-forest underline decoration-terracotta underline-offset-4">5K Series</a>.
          </p>
        </section>
      </section>
    <SiteFooter />
    </main>
  );
}
