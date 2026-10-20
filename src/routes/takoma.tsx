import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ArtistQuotes } from "@/components/ArtistQuotes";
import { Run2Hub } from "@/components/Run2Hub";
import { PressBar } from "@/components/PressBar";
import { EVENT_PHOTOS } from "@/lib/event-photos";
import recapVideo from "@/assets/rtwl-recap.mp4.asset.json";
import recapPoster from "@/assets/rtwl-recap-poster.jpg.asset.json";

const TITLE = "Run Takoma With Love · 08.02.26 · GRYT";
const DESC = "The first GRYT artist-led run. 248 signed up, 98 finished in Takoma Park, MD, with Heno. and Oddisee. Watch the recap and find your photo.";

export const Route = createFileRoute("/takoma")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://grytrun.com/takoma" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://grytrun.com/takoma" }],
  }),
  component: TakomaPage,
});

function TakomaPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-6 sm:pt-16">
        <p className="eyebrow text-terracotta">Run #01 · 08.02.26 · Takoma Park, MD</p>
        <h1 className="mt-3 display-tight text-6xl text-forest sm:text-8xl">
          WE RAN <span className="text-terracotta">TAKOMA</span>
          <span className="mt-2 block brush-script text-5xl normal-case sm:text-6xl">with love.</span>
        </h1>
        <div className="relative mx-auto mt-10 max-w-4xl">
          <div aria-hidden className="absolute -inset-2 -z-10 bg-terracotta sm:-inset-3" style={{ transform: "rotate(0.8deg)" }} />
          <video className="block w-full border-2 border-ink bg-ink" src={recapVideo.url} poster={recapPoster.url} controls playsInline preload="metadata" aria-label="Run Takoma With Love recap video" />
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
          {[["248", "signed up"], ["98", "finished"], ["5K", "one loop"], ["2", "artists"]].map(([n, u]) => (
            <div key={u} className="ink-card p-4 text-center sm:p-5">
              <p className="display-tight text-5xl leading-none text-terracotta sm:text-6xl">{n}</p>
              <p className="eyebrow mt-2 text-forest">{u}</p>
            </div>
          ))}
        </div>
        <PhotoGallery photos={EVENT_PHOTOS} />
        <p className="mt-8 text-center">
          <Link to="/story" className="display-tight text-xl text-forest underline decoration-terracotta decoration-2 underline-offset-4 hover:text-terracotta">Read the full story</Link>
        </p>
      </section>
      <PressBar />
      <ArtistQuotes />
      <Run2Hub />
    </main>
  );
}
