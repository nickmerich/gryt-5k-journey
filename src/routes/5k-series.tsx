import { AuditFooterLinks } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { Run2Course } from "@/components/Run2Course";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Run2Hub } from "@/components/Run2Hub";
import { PhotoGallery } from "@/components/lazy";
import { EVENT_PHOTOS } from "@/lib/event-photos";
import { ORG_ID, absUrl, breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, ogUrl, type QA } from "@/lib/seo";
import bearLogo from "@/assets/gryt-bear.png.asset.json";
import largeGroupPhoto from "@/assets/rtwl-group-1920.webp.asset.json";
import recapVideo from "@/assets/rtwl-recap.mp4.asset.json";
import recapPoster from "@/assets/rtwl-recap-poster.jpg.asset.json";
import { ResponsiveImg } from "@/components/ResponsiveImg";
import { imageAtLeast } from "@/lib/responsive-image";

const TITLE = "Artist-Led 5K Series: Run Takoma With Love · GRYT Club";
const DESCRIPTION = "Explore the Run Takoma With Love 5K series: Run #01 photos and recap, Takoma route details, and the Run #02 December 2026 interest list.";

const SERIES_FAQ: QA[] = [
  {
    q: "What is the GRYT 5K Series?",
    a: "A series of free, artist-led 5Ks in Takoma Park, Maryland, inspired by \"From Takoma With Love\" by Heno. and Oddisee. Each run is a walk/run 5K with neighbors, then a hang after.",
  },
  {
    q: "When is Run #02?",
    a: "Run #02 is targeting early December 2026. The date is not confirmed yet. The weekends on the table are Dec 5 to 6, Dec 12 to 13 and Dec 19 to 20. Join the interest list and we will email you when it is set.",
  },
  {
    q: "Where is Run #02?",
    a: "In the Takoma community. The draft route is 6 laps inside Takoma-Piney Branch Local Park. The meeting point and start time will be announced, and the final route depends on park approval.",
  },
  {
    q: "Is the interest list a registration?",
    a: "No. The interest list is not a confirmed race registration. It is how you get first word when the date, route and bibs are ready.",
  },
  {
    q: "Can I walk it?",
    a: "Yes. Every pace is welcome, walkers too. At Run #01 the finish stayed open until the last person was home.",
  },
  {
    q: "What about Run #03?",
    a: "Run #03 has its own interest list. Its date and route are still to be confirmed.",
  },
];

const RUN1_EVENT = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Run Takoma With Love 5K (Run #01)",
  description: "Free artist-led community 5K and picnic in Takoma Park, Maryland, inspired by the album From Takoma With Love by Heno. and Oddisee. 248 signed up and 98 finished.",
  startDate: "2026-08-02T09:00:00-04:00",
  endDate: "2026-08-02T11:00:00-04:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  sport: "Running",
  isAccessibleForFree: true,
  image: ["https://grytrun.com/og/grytrun-recap-1200x630.jpg"],
  url: absUrl("/takoma"),
  location: {
    "@type": "Place",
    name: "Takoma-Piney Branch Local Park",
    address: { "@type": "PostalAddress", addressLocality: "Takoma Park", addressRegion: "MD", addressCountry: "US" },
  },
  organizer: { "@type": "SportsOrganization", "@id": ORG_ID, name: "GRYT Club", url: "https://grytrun.com/" },
};

/** Run #02: month only, no eventStatus, because the date is not confirmed. */
const RUN2_EVENT = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Run Takoma With Love 5K, Run #02 (date to be confirmed)",
  description: "Run #02 of the GRYT 5K Series is targeting early December 2026 in Takoma Park, Maryland. Date to be confirmed. Draft route is 6 laps inside Takoma-Piney Branch Local Park, pending park approval. The current list is an interest list, not registration.",
  startDate: "2026-12",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Running",
  isAccessibleForFree: true,
  url: absUrl("/5k-series"),
  location: {
    "@type": "Place",
    name: "Takoma-Piney Branch Local Park",
    address: { "@type": "PostalAddress", addressLocality: "Takoma Park", addressRegion: "MD", addressCountry: "US" },
  },
  organizer: { "@type": "SportsOrganization", "@id": ORG_ID, name: "GRYT Club", url: "https://grytrun.com/" },
};

export const Route = createFileRoute("/5k-series")({
  head: () => ({ meta: [
      ...recapImageMeta,
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: TITLE },
      { name: "twitter:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
      { name: "twitter:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    ogUrl("/5k-series"),
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: canonicalLinks("/5k-series"),
  scripts: [
    jsonLdScript(RUN1_EVENT),
    jsonLdScript(RUN2_EVENT),
    jsonLdScript(faqJsonLd(SERIES_FAQ)),
    jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "5K Series", path: "/5k-series" }])),
  ],
  }),
  component: SeriesPage,
});

function SeriesPage() {
  function join() {
    window.dispatchEvent(new CustomEvent("run2:open", { detail: "runner" }));
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-6 sm:py-7">
        <Button asChild variant="link" className="h-auto p-0 text-forest">
          <Link to="/"><ArrowLeft /> <span className="eyebrow">Back to Run Takoma</span></Link>
        </Button>
        <Link to="/" aria-label="GRYT Club homepage"><ResponsiveImg asset={bearLogo.url} sizes="60px" alt="GRYT Club" width={56} height={60} loading="eager" className="h-12 w-auto sm:h-16" /></Link>
      </header>

      <section className="relative isolate bg-forest">
        <ResponsiveImg asset={largeGroupPhoto.url} sizes="100vw" alt="Run Takoma With Love finishers together with medals in the park" width={1824} height={1215} priority className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_65%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/65" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow text-paper">GRYT Club · Takoma Park, Maryland</p>
          <h1 className="mt-5 display-tight text-7xl text-paper sm:text-8xl">5K SERIES<span className="mt-2 block brush-script text-4xl text-paper sm:text-6xl">Run Takoma with love</span></h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper sm:text-lg">Music brought us here. Movement brings us back. Five kilometers. One neighborhood. Do it together.</p>
          <Button onClick={join} className="brush-btn mt-7 h-auto min-h-14 w-full whitespace-normal rounded-none bg-terracotta px-6 py-4 display-tight text-lg text-terracotta-ink shadow-none hover:bg-paper hover:text-forest sm:w-auto">Join the Run #02 list <ArrowDown /></Button>
        </div>
      </section>

      <section aria-label="Series at a glance" className="border-b-2 border-ink bg-paper-warm">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-ink/20 px-3 py-6 sm:px-6 sm:py-8">
          {[['5K', 'The distance'], ['TAKOMA', 'The neighborhood'], ['TOGETHER', 'The point']].map(([value, label]) => <div key={label} className="px-2 text-center"><p className="display-tight text-2xl text-forest sm:text-4xl">{value}</p><p className="mt-2 text-xs text-ink-soft sm:text-sm">{label}</p></div>)}
        </div>
      </section>

      <section aria-labelledby="next-run-title" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="eyebrow text-terracotta">Next up · Run #02</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 id="next-run-title" className="display-tight text-5xl text-forest sm:text-6xl">SAME HEART.<span className="mt-2 block brush-script text-terracotta">Next starting line.</span></h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">Run #02 is targeting early December 2026. Choose the weekend that works for you and get first word when the date, route, and bibs are ready.</p>
            <p className="mt-4 text-sm font-medium text-forest">This is the interest list, not a confirmed race registration.</p>
            <Button onClick={join} variant="link" className="mt-4 h-auto px-0 text-terracotta">Put me on the list <ArrowDown /></Button>
          </div>
          <dl className="divide-y-2 divide-ink border-y-2 border-ink">
            <div className="flex gap-4 py-5"><CalendarDays className="mt-1 size-5 shrink-0 text-terracotta" /><div><dt className="eyebrow text-forest">Date · To be confirmed</dt><dd className="mt-2 text-lg font-medium">December 2026</dd><dd className="mt-1 text-sm leading-relaxed text-ink-soft">Tell us: Dec 5–6, Dec 12–13, Dec 19–20, or any weekend.</dd></div></div>
            <div className="flex gap-4 py-5"><MapPin className="mt-1 size-5 shrink-0 text-terracotta" /><div><dt className="eyebrow text-forest">Location</dt><dd className="mt-2 text-lg font-medium">Takoma community</dd><dd className="mt-1 text-sm text-ink-soft">Meeting point and start time to be announced.</dd></div></div>
            <div className="flex gap-4 py-5"><RouteIcon className="mt-1 size-5 shrink-0 text-terracotta" /><div><dt className="eyebrow text-forest">Route</dt><dd className="mt-2 text-lg font-medium">5K · 6 laps inside Takoma-Piney Branch Local Park</dd><dd className="mt-1 text-sm leading-relaxed text-ink-soft">Draft course below. Final route depends on park approval.</dd></div></div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="past-run-title" className="border-y-2 border-ink bg-paper-warm">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="eyebrow text-terracotta">Past runs · Run #01</p><h2 id="past-run-title" className="mt-4 display-tight text-4xl text-forest sm:text-6xl">RUN TAKOMA<span className="mt-1 block brush-script text-terracotta">with love</span></h2></div>
            <p className="eyebrow text-forest">August 2, 2026 · Completed</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-lg">
            {[['248', 'Signed up'], ['98', 'Finished']].map(([number, label]) => <div key={label} className="ink-card p-5"><p className="display-tight text-5xl text-terracotta">{number}</p><p className="eyebrow mt-2 text-forest">{label}</p></div>)}
          </div>
          <video controls playsInline preload="none" poster={imageAtLeast(recapPoster.url, 960)} className="mt-8 aspect-video w-full border-2 border-ink bg-ink" aria-label="Run Takoma With Love Run #01 recap"><source src={recapVideo.url} type="video/mp4" /><a href={recapVideo.url}>Watch the recap video</a></video>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div><h3 className="display-tight text-2xl text-forest">THE RUN #01 ROUTE</h3><p className="mt-3 leading-relaxed text-ink-soft">A 5K through Takoma, gathering at Takoma-Piney Branch Local Park. Neighborhood streets, familiar faces, and a finish worth sharing.</p><Button asChild variant="link" className="mt-3 h-auto px-0 text-terracotta"><a href="https://www.google.com/maps/search/?api=1&query=Takoma-Piney+Branch+Local+Park+Takoma+Park+MD" target="_blank" rel="noopener noreferrer">Find the Run #01 park <ArrowUpRight /></a></Button></div>
            <div><h3 className="display-tight text-2xl text-forest">FROM MUSIC TO MOVEMENT</h3><p className="mt-3 leading-relaxed text-ink-soft">Inspired by <em>From Takoma With Love</em>, the album by Heno. and Oddisee. A story rooted in Takoma, brought to life by the people who showed up.</p><Button asChild variant="link" className="mt-3 h-auto px-0 text-terracotta"><Link to="/story">Read how we got here <ArrowUpRight /></Link></Button></div>
          </div>
          <PhotoGallery photos={EVENT_PHOTOS} />
        </div>
      </section>

      <section aria-labelledby="about-series-title" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="eyebrow text-terracotta">About the series</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 id="about-series-title" className="display-tight text-4xl text-forest sm:text-6xl">AN ARTIST-LED 5K<span className="mt-1 block brush-script text-terracotta">in one neighborhood</span></h2>
            <div className="mt-6 max-w-xl space-y-4 leading-relaxed text-ink-soft">
              <p>The GRYT 5K Series started with an album. Heno. and Oddisee made "From Takoma With Love" about Takoma, and we built a 5K around it so people could move through the place the music is about, together.</p>
              <p>Run #01 happened on Sunday, August 2, 2026 at Takoma-Piney Branch Local Park in Takoma Park, Maryland. 248 people signed up and 98 finished. Check-in opened at the covered picnic shelter, which doubled as HQ for water and first aid, and the day wound down with a picnic in the park.</p>
              <p>It is not a race with splits and podiums. It is a hang with a 5K in the middle. Free for runners, built with local partners. For Run #01 that meant smartwater as hydration partner and Montgomery Parks (M-NCPPC) as parks partner.</p>
              <p>Run #02 comes back to the same park in December 2026, with a draft route of 6 laps inside the park. Run #03 is next after that. Want one in your city? <Link to="/artists" className="text-forest underline decoration-terracotta underline-offset-4">Artists can pitch a run</Link>.</p>
            </div>
          </div>
          <div>
            <h3 className="display-tight text-2xl text-forest">WHAT TO EXPECT</h3>
            <ul className="mt-4 divide-y divide-ink/20 border-y-2 border-ink text-ink-soft">
              <li className="py-3"><strong className="text-ink">Every pace.</strong> Walkers, first-timers and fast folks all welcome. The finish stays open until the last person is home.</li>
              <li className="py-3"><strong className="text-ink">Strollers and leashed dogs.</strong> Welcome at a walking pace. Line up at the back.</li>
              <li className="py-3"><strong className="text-ink">A real home base.</strong> The covered shelter for check-in, water and first aid, with park restrooms on site.</li>
              <li className="py-3"><strong className="text-ink">Marshals on course.</strong> At Run #01, at every turn and both road crossings.</li>
              <li className="py-3"><strong className="text-ink">Small on purpose.</strong> Run #01 had 100 bibs so the day stayed personal.</li>
            </ul>
            <p className="mt-4 text-sm text-ink-soft">Accessibility details: <Link to="/accessibility" className="underline decoration-terracotta underline-offset-4">accessibility statement</Link>. New to social 5Ks? Read our <a href="/guides/social-5k-runs" className="underline decoration-terracotta underline-offset-4">guide to social 5K runs where walkers are welcome</a> or see <a href="/compare" className="underline decoration-terracotta underline-offset-4">how GRYT compares</a>.</p>
          </div>
        </div>
        <div className="mt-14">
          <h2 className="display-tight text-3xl text-forest sm:text-4xl">5K SERIES FAQ</h2>
          <dl className="mt-5 grid gap-x-10 divide-y divide-ink/20 border-y-2 border-ink sm:grid-cols-2 sm:divide-y-0">
            {SERIES_FAQ.map((f) => <div key={f.q} className="py-4"><dt className="display-tight text-xl text-forest">{f.q}</dt><dd className="mt-1 leading-relaxed text-ink-soft">{f.a}</dd></div>)}
          </dl>
        </div>
      </section>

      <Run2Course />
      <Run2Hub />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6"><p className="eyebrow text-terracotta">Looking ahead · Run #03</p><h2 className="mt-4 display-tight text-4xl text-forest">THE NEXT CHAPTER.</h2><p className="mt-4 max-w-lg leading-relaxed text-ink-soft">Run #03 has its own interest list. Date and route are still to be confirmed.</p><Button asChild variant="link" className="mt-4 h-auto px-0 text-terracotta"><Link to="/run-03">Explore Run #03 <ArrowUpRight /></Link></Button></section>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-ink-soft sm:px-6"><a href="https://phihackathon.pplx.app" target="_blank" rel="noopener" className="underline decoration-terracotta underline-offset-4">Also on the calendar: Shake &amp; Ship Philadelphia, Nov 20 to 21, 2026</a></p>
      <section className="border-y-2 border-ink bg-forest px-5 py-12 text-center text-forest-ink"><p className="eyebrow text-forest-ink">Run #02 · Partners</p><h2 className="mt-4 display-tight text-4xl">HELP BUILD THE NEXT ONE.</h2><Button asChild className="brush-btn mt-6 h-auto min-h-14 whitespace-normal rounded-none bg-paper px-6 py-4 display-tight text-lg text-forest shadow-none hover:bg-terracotta hover:text-terracotta-ink"><Link to="/partners">Partner with us <ArrowUpRight /></Link></Button></section>
      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-5 py-10 sm:flex-row sm:px-6">
        <p className="display-tight text-2xl text-forest">DO HARD THINGS TOGETHER</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-ink-soft"><Link to="/">Home</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/accessibility">Accessibility</Link><a href="https://www.strava.com/clubs/1708552" target="_blank" rel="noopener noreferrer">Strava</a></nav>
      <div className="px-5 pb-8"><AuditFooterLinks /></div>
      </footer>
    </main>
  );
}