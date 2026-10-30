import { createFileRoute } from "@tanstack/react-router";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, pageMeta, type QA } from "@/lib/seo";
import { BestFor, CompareTable, ContentShell, Ext, FaqList, In, Section } from "@/components/ContentPage";

const PATH = "/compare/gryt-vs-rock-n-roll-running-series";
const TITLE = "GRYT vs Rock 'n' Roll Running Series: Music Runs Compared · GRYT Runs";
const DESC =
  "Rock 'n' Roll races put live bands along big-city courses. GRYT runs are free artist-led 5Ks built around one album and one neighborhood. How they compare.";

const FAQ: QA[] = [
  {
    q: "How is a GRYT run different from a Rock 'n' Roll race?",
    a: "Rock 'n' Roll Running Series events are large, paid, timed races in major cities, with bands along the course and a finish line concert. GRYT runs are free, small artist-led 5Ks in a neighborhood park, built around one album and the place it is about, with a picnic after instead of a concert.",
  },
  {
    q: "Do both have music?",
    a: "In different ways. Rock 'n' Roll puts live bands, DJs and cheer teams on the course. A GRYT run is inspired by an artist's album and the artists are part of the day, but Run #01 had nothing amplified on the route or at the shelter.",
  },
  {
    q: "Is a Rock 'n' Roll 5K good for beginners?",
    a: "Many Rock 'n' Roll weekends include a 5K alongside the half marathon, so it can be a fun first race if you want a big crowd and a medal. If you would rather walk with friends and skip the clock, a GRYT run is the calmer choice.",
  },
  {
    q: "Is there a Rock 'n' Roll race in Washington DC?",
    a: "Yes. Rock 'n' Roll Washington DC offers a half marathon and a 5K, and its 2026 event was on March 21.",
  },
];

export const Route = createFileRoute("/compare/gryt-vs-rock-n-roll-running-series")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH, type: "article" })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript(faqJsonLd(FAQ)),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "GRYT vs Rock 'n' Roll Running Series", path: PATH },
        ]),
      ),
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ContentShell
      currentPath={PATH}
      crumbs={[
        { name: "Home", to: "/" },
        { name: "Compare", to: "/compare" },
        { name: "GRYT vs Rock 'n' Roll", to: PATH },
      ]}
      eyebrow="Compare · Music and running"
      title="GRYT vs Rock 'n' Roll Running Series"
      updated="October 2026"
      intro={
        <p>
          <strong className="text-ink">Short answer:</strong> the Rock 'n' Roll Running Series is a set of big, paid, timed
          races in major cities, with live bands along the course and a concert at the finish. GRYT runs are free, small
          artist-led 5Ks in a neighborhood park, built around one album and the place it is about, with a picnic after.
          Rock 'n' Roll brings the concert to the race. GRYT brings fans of one album together in its neighborhood.
        </p>
      }
    >
      <Section id="table" title="Side by side">
        <CompareTable
          caption="GRYT runs compared with the Rock 'n' Roll Running Series"
          columns={["GRYT runs", "Rock 'n' Roll Running Series"]}
          rows={[
            ["What it is", "An artist-led community 5K and park hangout.", <>A race series started in San Diego in 1998, known for "live bands, cheer teams, and entertaining water stations" (<Ext href="https://www.runningusa.org/industry-news/rock-n-roll-running-series-san-diego-runners-are-on-the-rise-with-more-participating-in-race-weekend-year-over-year/">Running USA</Ext>).</>],
            ["Who runs it", "GRYT Club, with local partners.", <>The IRONMAN Group (<Ext href="https://endurance.biz/2026/industry-news/movin-on-up-rock-n-roll-running-series-expands-to-quito-ecuador/">Endurance Business</Ext>).</>],
            ["Distances", "5K.", <>Varies by city. Washington DC offers a half marathon and 5K (<Ext href="https://www.runrocknroll.com/events/washington-dc">Rock 'n' Roll DC</Ext>). Las Vegas offers a half, 10K and 5K (<Ext href="https://www.runrocknroll.com/events/las-vegas">Rock 'n' Roll Las Vegas</Ext>).</>],
            ["Cost", "Free for runners.", <>Paid, priced per event. The Las Vegas registration page lists entries from $109 including fees (<Ext href="https://www.runrocknroll.com/events/las-vegas/register">Rock 'n' Roll Las Vegas</Ext>).</>],
            ["Timing", "Not a race. No splits, no podiums.", <>Timed races with overall winners, such as the San Diego half marathon results (<Ext href="https://www.runningusa.org/industry-news/rock-n-roll-running-series-san-diego-runners-are-on-the-rise-with-more-participating-in-race-weekend-year-over-year/">Running USA</Ext>).</>],
            ["Music", "Built around one artist's album. Run #01 had nothing amplified on the route or at the shelter.", <>Live music on course plus a finish line festival and encore concert (<Ext href="https://www.runrocknroll.com/events/las-vegas/register">Rock 'n' Roll Las Vegas</Ext>).</>],
            ["Size", "Small on purpose. Run #01 had 248 signups and 98 finishers.", <>Large. San Diego drew more than 30,000 participants (<Ext href="https://www.10news.com/news/local-news/thousands-participate-in-rock-n-roll-marathons-half-marathons-in-san-diego">10News</Ext>).</>],
          ]}
        />
      </Section>

      <Section id="different" title="How is GRYT different from Rock 'n' Roll?">
        <p>
          Both care about music, but they use it differently. Rock 'n' Roll treats music as fuel for a big race: bands
          every so often along a city course, thousands of runners, a medal and a concert at the end. It is a great
          way to make a half marathon or a destination race feel like a festival.
        </p>
        <p>
          A GRYT run starts with one specific album and the neighborhood it is about. Run Takoma With Love was named for{" "}
          <em>From Takoma With Love</em>, the album by Heno. and Oddisee, and took place in Takoma Park, Maryland. The music
          is the reason people came, not a soundtrack along the way. The point is the people: you walk or run 5K together,
          then stay for the picnic. Read <In to="/story">the story behind Run #01</In>.
        </p>
      </Section>

      <Section id="best-for" title="Who each one is best for">
        <BestFor
          items={[
            { name: "Rock 'n' Roll Running Series", body: "Runners who want a big-city race, a finish time, live bands on course and a concert after, and are happy to pay race fees." },
            { name: "GRYT runs", body: "Fans of the artist and people in the neighborhood who want a free, untimed 5K and time to actually meet each other." },
          ]}
        />
      </Section>

      <Section id="faq" title="FAQ">
        <FaqList items={FAQ} />
      </Section>

      <Section id="next" title="Bring it to your city">
        <p>
          If you make music about a real place, GRYT can build a run there. <In to="/artists">See how artist-led 5Ks work</In>,
          or <In to="/5k-series">follow the 5K Series</In> for Run #02 in December 2026.
        </p>
      </Section>
    </ContentShell>
  );
}
