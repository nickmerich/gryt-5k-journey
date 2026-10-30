import { createFileRoute } from "@tanstack/react-router";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, pageMeta, type QA } from "@/lib/seo";
import { BestFor, CompareTable, ContentShell, Ext, FaqList, In, Section } from "@/components/ContentPage";

const PATH = "/compare/gryt-vs-parkrun";
const TITLE = "GRYT vs parkrun: Free Community 5Ks Compared · GRYT Runs";
const DESC =
  "parkrun is a free, timed 5K every Saturday morning. GRYT runs are free artist-led 5Ks that happen a few times a year. Here is how they differ and who each one suits.";

const FAQ: QA[] = [
  {
    q: "Is GRYT the same thing as parkrun?",
    a: "No. parkrun is a free, volunteer-run, timed 5K that happens every Saturday morning at the same park. GRYT runs are one-off artist-led 5Ks built around an album and a neighborhood, with a hangout after. Both are free and welcome walkers.",
  },
  {
    q: "Which one is better for a first 5K?",
    a: "Either works. parkrun is the easier habit because it happens every week. A GRYT run is a good first 5K if you want a bigger occasion with friends, music fans and a picnic after, since GRYT runs are not races with splits or podiums.",
  },
  {
    q: "Can I walk a GRYT run or a parkrun?",
    a: "Yes. parkrun says everyone is welcome to walk, jog, run or volunteer, and a volunteer tail walker makes sure nobody finishes last. GRYT runs welcome every pace, walkers included, and Run #01 held the finish open until the last person was home.",
  },
  {
    q: "Do I need to register?",
    a: "parkrun asks you to register once for free and bring your barcode if you want a time. For GRYT, you join the free list for the next run on grytrun.com so you get the date, meeting point and bib details when they are ready.",
  },
  {
    q: "Is there a parkrun near Takoma Park?",
    a: "Yes. There are five parkruns in DC and Maryland, including College Park parkrun on the Paint Branch Trail, which starts every Saturday at 9:00am.",
  },
];

export const Route = createFileRoute("/compare/gryt-vs-parkrun")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH, type: "article" })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript(faqJsonLd(FAQ)),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "GRYT vs parkrun", path: PATH },
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
        { name: "GRYT vs parkrun", to: PATH },
      ]}
      eyebrow="Compare · Free community 5Ks"
      title="GRYT vs parkrun"
      updated="October 2026"
      intro={
        <>
          <p>
            <strong className="text-ink">Short answer:</strong> parkrun is a free, timed 5K that happens every Saturday
            morning in the same park, run by volunteers. GRYT runs are free artist-led 5Ks that happen a few times a year,
            built around an album and the neighborhood it is about, with a long hangout after. If you want a weekly habit,
            go to parkrun. If you want a bigger day with music fans and a picnic, come to a GRYT run. Plenty of people do
            both.
          </p>
        </>
      }
    >
      <Section id="table" title="Side by side">
        <CompareTable
          caption="GRYT runs compared with parkrun"
          columns={["GRYT runs", "parkrun"]}
          rows={[
            ["What it is", "An artist-led community 5K and park hangout, built around an album and a real neighborhood.", <>A free, weekly 5K community event in parks and open spaces around the world (<Ext href="https://www.parkrun.com/">parkrun</Ext>).</>],
            ["How often", "A few times a year. Run #01 was August 2, 2026. Run #02 is targeting early December 2026.", <>Every Saturday morning (<Ext href="https://www.parkrun.com/about/join-us/">parkrun</Ext>).</>],
            ["Cost", "Free for runners.", <>Free to take part (<Ext href="https://www.parkrun.com/about/join-us/">parkrun</Ext>).</>],
            ["Timing", "Not a race. No splits, no podiums.", <>Timed. Bring your barcode to get a result: "No barcode, no time, no exception" (<Ext href="https://support.parkrun.com/hc/en-us/articles/200566883-1-4-Barcodes">parkrun support</Ext>).</>],
            ["Walkers", "Every pace welcome, walkers included. Strollers and leashed dogs welcome at a walking pace.", <>Walk, jog, run or volunteer. A tail walker means nobody finishes last (<Ext href="https://www.parkrun.com/">parkrun</Ext>).</>],
            ["Sign-up", "Join the free list for the next run on grytrun.com.", <>Register once, for life, then turn up at any parkrun (<Ext href="https://support.parkrun.com/hc/en-us/articles/205595392-1-1-How-do-I-register-for-parkrun">parkrun support</Ext>).</>],
            ["After the run", "A picnic and hangout in the park. Run #01 used the covered shelter as home base.", <>Many events grab coffee together after, for example <Ext href="https://www.parkrun.us/anacostia/aboutus/">Anacostia parkrun</Ext>.</>],
            ["Where", "Takoma Park, Maryland so far, at Takoma-Piney Branch Local Park.", <>Worldwide. In the DC area there are five: Kensington, College Park, Roosevelt Island, Fletcher's Cove and Anacostia (<Ext href="https://wamu.org/story/26/04/02/get-out-there-and-run/">WAMU</Ext>).</>],
          ]}
        />
      </Section>

      <Section id="different" title="How is GRYT different from parkrun?">
        <p>
          The biggest difference is rhythm. parkrun is built on repetition: same park, same 5K, every Saturday, with your
          time recorded each week so you can watch yourself improve. That consistency is the whole point, and it works.
        </p>
        <p>
          A GRYT run is an occasion. It starts with an artist and a place. Run Takoma With Love was named for{" "}
          <em>From Takoma With Love</em>, the album by Heno. and Oddisee, and the 5K went through the neighborhood that
          album is about. 248 people signed up and 98 finished. It was not a race with splits and podiums. It was a hang
          with a 5K in the middle. See the <In to="/takoma">Run Takoma With Love recap</In>.
        </p>
        <p>
          parkrun is run entirely by local volunteers. GRYT produces its runs: the permit, the course, the runner
          experience and the day itself, working with partners like Montgomery Parks and smartwater for Run #01.
        </p>
      </Section>

      <Section id="best-for" title="Who each one is best for">
        <BestFor
          items={[
            { name: "parkrun", body: "People who want a free weekly routine, a recorded time to chase, and the same friendly faces every Saturday." },
            { name: "GRYT runs", body: "Music fans, first-timers and friend groups who want one big, warm day out, with no clock and a long picnic after." },
          ]}
        />
        <p>
          They fit together well. A GRYT run can be the day that gets you out the door, and your local parkrun can be how
          you keep going between runs.
        </p>
      </Section>

      <Section id="faq" title="FAQ">
        <FaqList items={FAQ} />
      </Section>

      <Section id="next" title="Get on the list">
        <p>
          Run #02 is coming back to Takoma Park in December 2026. The date and route are still being confirmed, so the
          list is how you hear first. <In to="/5k-series">See the 5K Series</In> or <a href="/#run2" className="text-forest underline decoration-terracotta underline-offset-4">join the Run #02 list</a>.
        </p>
      </Section>
    </ContentShell>
  );
}
