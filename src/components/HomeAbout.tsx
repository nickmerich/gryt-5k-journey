import type { QA } from "@/lib/seo";

/** Visible FAQ on the homepage. Also emitted as FAQPage JSON-LD from the route head. */
export const HOME_FAQ: QA[] = [
  {
    q: "What is a GRYT run?",
    a: "A GRYT run is an artist-led 5K. We take an album about a real place, map a route through that neighborhood, and invite fans and neighbors to run or walk it together, then hang out after. It is not a race with splits and podiums. It is a hang with a 5K in the middle.",
  },
  {
    q: "Who is behind GRYT?",
    a: "GRYT Club was founded by Nick Merich. It started as his own project of early mornings, long miles and doing hard things, and grew into a run club community in Pittsburgh. Nick and Heno. had worked together for five years, so when \"From Takoma With Love\" came out, a 5K in Takoma was the natural next step.",
  },
  {
    q: "What happens on the day?",
    a: "At Run #01, check-in opened at 8:30 at the covered picnic shelter, there was a welcome, then everyone walked or ran the 5K with marshals at every turn. After that came water, snacks and a picnic, with the park left clean by 2:00. Nothing amplified, no stage.",
  },
  {
    q: "Do I have to be a runner?",
    a: "No. Every pace is welcome, walkers too. At Run Takoma With Love the finish stayed open until the last person was home, and strollers and leashed dogs joined at a walking pace from the back.",
  },
  {
    q: "How much does it cost?",
    a: "GRYT runs are free for runners and built with local partners. Run #01 was supported by smartwater as hydration partner and Montgomery Parks (M-NCPPC) as parks partner.",
  },
  {
    q: "When is the next run?",
    a: "Run #02 is planned for early December 2026 in Takoma Park, Maryland. The date and route are still being confirmed with the park. Join the free list and we will email you when it is locked.",
  },
  {
    q: "How is GRYT different from parkrun or November Project?",
    a: "parkrun is a free timed 5K every Saturday, and November Project is free early-morning weekday workouts. GRYT happens a few times a year, each run built around one album and one neighborhood, with the artists there and a picnic after. Our compare pages go into detail.",
  },
  {
    q: "Can I bring a GRYT run to my city?",
    a: "Yes, if you are an artist with music about a place. Pitch your idea on the artists page and we will review it and follow up. Brands and local businesses can partner through the partners page.",
  },
];

export function HomeAbout() {
  return (
    <section aria-labelledby="what-is-gryt" className="relative z-10 mx-auto max-w-5xl px-5 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-terracotta">About GRYT</p>
          <h2 id="what-is-gryt" className="display-tight mt-3 text-5xl text-forest sm:text-6xl">
            What is a GRYT run?
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              GRYT makes artist-led 5Ks. An artist makes an album about a real place. We map a route through that
              neighborhood, and fans and neighbors run it together, with the artist there. Then everybody hangs out.
            </p>
            <p>
              The first one was Run Takoma With Love, inspired by "From Takoma With Love" by Heno. and Oddisee. On
              August 2, 2026, 248 people signed up and 98 finished in Takoma-Piney Branch Local Park in Takoma Park,
              Maryland, followed by a picnic under the shelter.
            </p>
            <p>
              It is small on purpose. Free for runners, built with local partners. Every pace welcome, walkers too.
            </p>
          </div>
          <ul className="mt-6 grid gap-2 text-ink">
            <li>
              <a href="/5k-series" className="underline decoration-terracotta underline-offset-4 hover:text-terracotta">The 5K Series: every run, past and next</a>
            </li>
            <li>
              <a href="/guides/social-5k-runs" className="underline decoration-terracotta underline-offset-4 hover:text-terracotta">Guide: social 5Ks where walkers are welcome</a>
            </li>
            <li>
              <a href="/compare" className="underline decoration-terracotta underline-offset-4 hover:text-terracotta">How GRYT compares with parkrun, November Project and more</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow text-ink">Questions people ask</h2>
          <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
            {HOME_FAQ.map((item) => (
              <div key={item.q} className="py-4">
                <dt className="display-tight text-xl text-forest">{item.q}</dt>
                <dd className="mt-1 text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
