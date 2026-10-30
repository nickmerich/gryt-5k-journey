import { createFileRoute } from "@tanstack/react-router";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, pageMeta, type QA } from "@/lib/seo";
import { BestFor, CompareTable, ContentShell, Ext, FaqList, In, Section } from "@/components/ContentPage";

const PATH = "/compare/gryt-vs-the-color-run";
const TITLE = "GRYT vs The Color Run: Fun 5Ks Compared · GRYT Runs";
const DESC =
  "The Color Run is a paid, untimed 5K with color zones and a finish party. GRYT runs are free artist-led 5Ks with a picnic after. How they compare and who each suits.";

const FAQ: QA[] = [
  {
    q: "What is the difference between GRYT and The Color Run?",
    a: "The Color Run is a ticketed, untimed 5K where you pass through color zones and finish with a color throw party. GRYT runs are free artist-led 5Ks built around an album and a neighborhood, with a picnic and hangout after. Both are untimed and made for people who are not racing.",
  },
  {
    q: "Is The Color Run free?",
    a: "No. Its events page lists paid registration, for example $54.95 for its October 2026 Portland and San Diego events, with limited-time offers sometimes lower. GRYT runs are free for runners.",
  },
  {
    q: "Can I walk either one?",
    a: "Yes. The Color Run says you can walk, jog or dance the course, and strollers are welcome. GRYT runs welcome every pace, walkers included.",
  },
  {
    q: "Which one is better for kids and families?",
    a: "Both are family friendly. The Color Run is a big, loud, colorful event. GRYT runs are smaller and calmer, in a neighborhood park, with strollers welcome at a walking pace.",
  },
];

export const Route = createFileRoute("/compare/gryt-vs-the-color-run")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH, type: "article" })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript(faqJsonLd(FAQ)),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "GRYT vs The Color Run", path: PATH },
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
        { name: "GRYT vs The Color Run", to: PATH },
      ]}
      eyebrow="Compare · Fun 5Ks"
      title="GRYT vs The Color Run"
      updated="October 2026"
      intro={
        <p>
          <strong className="text-ink">Short answer:</strong> The Color Run is a ticketed, untimed 5K where you get covered
          in color powder and finish at a color throw party. GRYT runs are free artist-led 5Ks in a neighborhood park,
          built around an album and the place it is about, with a picnic after. Both skip the race clock. The Color Run is
          a big spectacle. A GRYT run is a smaller, slower hang with people from the neighborhood and fans of the music.
        </p>
      }
    >
      <Section id="table" title="Side by side">
        <CompareTable
          caption="GRYT runs compared with The Color Run"
          columns={["GRYT runs", "The Color Run"]}
          rows={[
            ["What it is", "An artist-led community 5K and park hangout.", <>"The Happiest 5K On The Planet," with five color zones of plant-based powder (<Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>).</>],
            ["Cost", "Free for runners.", <>Paid. Listed at $54.95 for its October 2026 Portland and San Diego events (<Ext href="https://thecolorrun.com/events">The Color Run events</Ext>).</>],
            ["Timing", "Not a race. No splits, no podiums.", <>Untimed course "that anyone can finish" (<Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>).</>],
            ["Walkers and strollers", "Every pace welcome. Strollers and leashed dogs at a walking pace.", <>Walk, jog or dance. Strollers welcome (<Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>).</>],
            ["What you get", "Run #01 finishers got a medal, then water, snacks and a picnic at the park shelter.", <>Standard package includes a bib, finisher medal, color powder pack and the post-race color throw party (<Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>).</>],
            ["Size and setting", "Small on purpose, in a neighborhood park. Run #01 had 248 signups and 98 finishers.", <>Large venues such as Portland International Raceway, with "thousands of participants" (<Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>).</>],
            ["The hook", "An artist's album and the neighborhood it is about.", "The color, the photos and the party."],
          ]}
        />
      </Section>

      <Section id="different" title="How is GRYT different from The Color Run?">
        <p>
          The Color Run is built for spectacle: color zones along the course, color everywhere by the finish, and a party at
          the end. It travels from city to city and lands at large venues. If you want that energy and great photos, it
          delivers.
        </p>
        <p>
          GRYT runs are built for connection. Each one starts with an artist and a real neighborhood. Run Takoma With Love
          was named for <em>From Takoma With Love</em>, the album by Heno. and Oddisee, and took place in Takoma Park,
          Maryland. Nothing on the course was amplified. People ran, jogged or walked 5K, then stayed on the lawn to meet
          each other. It is free for runners and built with local partners. See the <In to="/takoma">Run #01 recap</In>.
        </p>
      </Section>

      <Section id="best-for" title="Who each one is best for">
        <BestFor
          items={[
            { name: "The Color Run", body: "Friend groups and families who want a loud, colorful party 5K and are happy to buy a ticket." },
            { name: "GRYT runs", body: "Music fans and neighbors who want a free, low-key 5K with real conversation after, at whatever pace they like." },
          ]}
        />
      </Section>

      <Section id="faq" title="FAQ">
        <FaqList items={FAQ} />
      </Section>

      <Section id="next" title="Get on the list">
        <p>
          Run #02 returns to Takoma Park in December 2026, with the date and route still being confirmed.{" "}
          <In to="/5k-series">See the 5K Series</In> or read our{" "}
          <In to="/guides/social-5k-runs">guide to social 5Ks where walkers are welcome</In>.
        </p>
      </Section>
    </ContentShell>
  );
}
