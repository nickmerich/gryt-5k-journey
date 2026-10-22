import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";

const TITLE = "Press · GRYT Run";
const DESCRIPTION = "Coverage, listings and conversations about GRYT's artist-led runs, starting with Run Takoma With Love.";
export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [{ title: TITLE }, { name: "description", content: DESCRIPTION }, { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION }, { name: "twitter:title", content: TITLE }, { name: "twitter:description", content: DESCRIPTION }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:url", content: "https://grytrun.com/press" }, ...recapImageMeta],
    links: [{ rel: "canonical", href: "https://grytrun.com/press" }],
  }),
  component: PressPage,
});

const NEWS = [
  ["The 51st", "Weekend guide · July 30, 2026", "Read the weekend guide", "https://51st.news/washington-dc-events-things-to-do-weekend-july-30/"],
  ["TribLIVE", "Community brief · Aug 26, 2026", "August brief", "https://community.triblive.com/news/4124358"],
  ["TribLIVE", "Community brief · Sep 23, 2026", "September brief", "https://community.triblive.com/news/4146304"],
];
const LISTINGS = [
  ["PoPville", "https://www.popville.com/events/run-takoma-with-love--free-community-5k-picnic-27314/"],
  ["RunWashington", "https://www.runwashington.com/events/run-takoma-with-love-free-community-5k-picnic-27307/"],
  ["Washington FAMILY", "https://www.washingtonfamily.com/calendar/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08"],
  ["Montgomery Magazine", "https://www.montgomerymag.com/events/#/details/run-takoma-with-love-free-community-5k-picnic/19476773/2026-08-02T08"],
];
function PressPage() {
  return <main className="min-h-screen bg-paper text-ink">
    <SiteNav />
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-6 sm:pt-16">
      <p className="eyebrow text-terracotta">PRESS</p>
      <h1 className="mt-3 display-tight text-5xl text-forest sm:text-7xl">Press &amp; conversations</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">Run Takoma With Love started as an album and became a starting line. Here is where the story has shown up so far.</p>
      <section className="mt-14 border-t-2 border-ink pt-7"><h2 className="display-tight text-3xl text-forest">In the news</h2>
        <ul className="mt-4 divide-y divide-hairline">{NEWS.map(([name, detail, label, url]) => <li key={url} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="display-tight text-2xl text-forest">{name}</h3><p className="mt-2 text-sm text-ink-soft">{detail}</p></div><a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-terracotta underline underline-offset-4">{label}<ArrowUpRight aria-hidden className="size-4 shrink-0" /></a></li>)}</ul>
      </section>
      <section className="mt-10 border-t-2 border-ink pt-7"><h2 className="display-tight text-3xl text-forest">In conversation</h2><h3 className="mt-6 display-tight text-2xl text-forest">The Founder Exhale</h3><p className="mt-2 text-sm text-ink-soft">Founder interview · Aug 1, 2026</p><a href="https://www.thefounderexhale.com/nick-merich-nobody-warns-you-about-burnout-after-the-exit/" target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-terracotta underline underline-offset-4">Listen from 27:32, where Nick talks GRYT<ArrowUpRight aria-hidden className="size-4 shrink-0" /></a></section>
      <section className="mt-10 border-t-2 border-ink pt-7"><h2 className="display-tight text-3xl text-forest">Event listings</h2><ul className="mt-5 grid gap-x-8 sm:grid-cols-2">{LISTINGS.map(([name, url]) => <li key={name} className="border-b border-hairline py-4"><a href={url} target="_blank" rel="noopener" className="flex items-center justify-between gap-3 text-forest hover:text-terracotta">{name}<ArrowUpRight aria-hidden className="size-5 shrink-0" /></a></li>)}</ul></section>
      <section className="mt-10 border-t-2 border-ink pt-7"><h2 className="display-tight text-3xl text-forest">Fast facts</h2><ul className="mt-5 space-y-4 leading-relaxed text-ink-soft"><li>Run Takoma With Love · Sunday, August 2, 2026 · Takoma Park, MD</li><li>Inspired by Heno. and Oddisee's album <em>From Takoma With Love</em></li><li>248 signed up · 98 finished</li><li>Run #02 returns to Takoma Park in December 2026</li><li><a href="https://phihackathon.pplx.app" target="_blank" rel="noopener" className="text-terracotta underline underline-offset-4">Next: Shake &amp; Ship Philadelphia · Nov 20 to 21, 2026</a></li></ul></section>
      <section className="mt-10 border-t-2 border-ink pt-7"><h2 className="display-tight text-3xl text-forest">Media contact</h2><p className="mt-5 text-ink-soft">Nick Merich, Founder, GRYT</p><div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center"><Button asChild className="brush-btn min-h-12 rounded-none bg-terracotta px-6 display-tight text-lg text-terracotta-ink hover:bg-forest hover:text-forest-ink"><a href="mailto:merichnick@gmail.com?subject=GRYT%20press%20inquiry"><Mail />Email for press</a></Button><a href="https://grytrunclub.com/press" target="_blank" rel="noopener" className="text-forest underline underline-offset-4">Pittsburgh run club press page</a></div></section>
    </div>
    <SiteFooter />
  </main>;
}