import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { recapImageMeta } from "@/lib/site-meta";
import { ORG_ID, absUrl, breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, pageMeta, type QA } from "@/lib/seo";
import { ContentShell, Ext, In, Section } from "@/components/ContentPage";

const PATH = "/guides/social-5k-runs";
const TITLE = "Social 5K Runs Where Walkers Are Welcome: A Guide · GRYT Runs";
const DESC =
  "Free 5Ks that feel like a party, social runs where walkers are welcome, and how to find a running community that is actually fun. Direct answers with real options.";

const ANSWERS: QA[] = [
  {
    q: "What are the best free 5K events that feel more like a party than a race?",
    a: "Free and party-like is a short list. parkrun is free every Saturday and has a friendly community feel, often with coffee after. GRYT artist-led runs are free 5Ks built as a hangout, with a picnic after. Local run clubs and running stores also host free social runs. If you are happy to pay, The Color Run and Rock 'n' Roll 5Ks are the big party-style options.",
  },
  {
    q: "What are the best social 5K runs where walkers are actually welcome?",
    a: "parkrun is the most reliable pick: walkers are welcome, there is no cut-off time and a volunteer tail walker finishes last. GRYT runs welcome every pace and keep the finish open until the last person is home. The Color Run is untimed and welcomes strollers. For any other event, look for the words run/walk, untimed or no cut-off.",
  },
  {
    q: "What are the best community running events for people who aren't really runners?",
    a: "Pick events where finishing time does not matter. parkrun says you do not need to train before you come. GRYT runs are not races and are built for first-timers and walkers. November Project welcomes all levels, but it is an early, intense workout rather than a run. Run clubs that call their runs no-drop or all paces are also a good fit.",
  },
  {
    q: "How do I find a local running community that actually feels welcoming and fun?",
    a: "Start with what already exists near you: find your nearest parkrun, search the Road Runners Club of America club finder, and check group runs at local running stores. Go to the same one twice, because the second visit is when people remember you. Look for groups that say no-drop or all paces, and bring a friend if you can.",
  },
];

export const Route = createFileRoute("/guides/social-5k-runs")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH, type: "article" })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Social 5K runs where walkers are welcome",
        description: DESC,
        url: absUrl(PATH),
        mainEntityOfPage: absUrl(PATH),
        datePublished: "2026-10-29",
        dateModified: "2026-10-29",
        author: { "@id": ORG_ID, "@type": "Organization", name: "GRYT Club" },
        publisher: { "@id": ORG_ID, "@type": "Organization", name: "GRYT Club" },
        image: "https://grytrun.com/og/grytrun-recap-1200x630.jpg",
      }),
      jsonLdScript(faqJsonLd(ANSWERS)),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Social 5K runs guide", path: PATH },
        ]),
      ),
    ],
  }),
  component: Page,
});

function Answer({ i }: { i: number }) {
  return (
    <p className="border-l-4 border-terracotta bg-paper-warm p-4 text-ink">
      <strong>Short answer:</strong> {ANSWERS[i].a}
    </p>
  );
}

function Option({ name, children }: { name: string; children: ReactNode }) {
  return (
    <li className="border-b border-hairline py-4">
      <h3 className="display-tight text-xl text-forest">{name}</h3>
      <div className="mt-1 text-ink-soft">{children}</div>
    </li>
  );
}

function Page() {
  return (
    <ContentShell
      currentPath={PATH}
      crumbs={[
        { name: "Home", to: "/" },
        { name: "Social 5K runs guide", to: PATH },
      ]}
      eyebrow="Guide · For people who aren't really runners"
      title="Social 5Ks where walkers are welcome"
      updated="October 2026"
      intro={
        <>
          <p>
            You do not need to be fast, or even a runner, to have a great time at a 5K. You need the right event. This guide
            answers the questions we hear most, with real options and links so you can check the details yourself.
          </p>
          <p>
            Full disclosure: we are GRYT, and we make artist-led 5Ks. We list ourselves where we fit, and we list the
            others because they are good.
          </p>
        </>
      }
    >
      <Section id="party" title="What are the best free 5K events that feel more like a party than a race?">
        <Answer i={0} />
        <ul>
          <Option name="parkrun">
            Free, weekly 5K events every Saturday morning, organized by local volunteers (<Ext href="https://www.parkrun.com/">parkrun</Ext>).
            It is timed, but the feel is community first, and many events head out for coffee together after, like{" "}
            <Ext href="https://www.parkrun.us/anacostia/aboutus/">Anacostia parkrun</Ext> in DC.
          </Option>
          <Option name="GRYT artist-led runs">
            Free 5Ks built around an artist's album and the neighborhood it is about. Not a race with splits and podiums: a
            hang with a 5K in the middle. Run Takoma With Love, with Heno. and Oddisee, had 248 signups and 98 finishers,
            then a picnic in the park. <In to="/5k-series">See the 5K Series</In>.
          </Option>
          <Option name="Free run club and running store socials">
            Many running stores and clubs host free group runs that end somewhere social. In DC, for example, running stores
            list weekly group runs and "all comers" fun runs (<Ext href="https://greatruns.com/location/washington-dc/">Great Runs</Ext>).
          </Option>
          <Option name="Paid, but very much a party">
            <Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext> is an untimed 5K with color
            zones and a color throw party. Rock 'n' Roll weekends often include a 5K with live music on course and a finish
            line concert (<Ext href="https://www.runrocknroll.com/events/las-vegas/register">Rock 'n' Roll</Ext>). Both charge
            registration. Compare them: <In to="/compare/gryt-vs-the-color-run">GRYT vs The Color Run</In>,{" "}
            <In to="/compare/gryt-vs-rock-n-roll-running-series">GRYT vs Rock 'n' Roll</In>.
          </Option>
        </ul>
      </Section>

      <Section id="walkers" title="What are the best social 5K runs where walkers are actually welcome?">
        <Answer i={1} />
        <p>
          "Walkers welcome" can mean a lot of things. The real test is whether anyone is waiting for you at the finish.
          Here is what to look for:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>A tail walker or no cut-off.</strong> parkrun has a volunteer tail walker so nobody comes last (
            <Ext href="https://www.parkrun.com/">parkrun</Ext>) and says there is no cut off time (
            <Ext href="https://blog.parkrun.com/us/2022/03/30/welcome-to-parkrun/">parkrun US</Ext>).
          </li>
          <li>
            <strong>Untimed or "not a race."</strong> The Color Run course is untimed (
            <Ext href="https://thecolorrun.com/locations/the-color-run/portland">The Color Run</Ext>). GRYT runs have no splits
            or podiums.
          </li>
          <li>
            <strong>Strollers and dogs mentioned by name.</strong> At Run #01, strollers and leashed dogs were welcome at a
            walking pace. DC-area parkruns allow dogs on a short lead too (
            <Ext href="https://wamu.org/story/26/04/02/get-out-there-and-run/">WAMU</Ext>).
          </li>
          <li>
            <strong>Someone stays until the end.</strong> At Run Takoma With Love, the finish stayed open until the last
            person was home, and walkers were cheered in like everyone else.
          </li>
        </ul>
        <p>
          Not sure about an event? Email the organizer and ask what time the course closes. A welcoming event will answer
          happily.
        </p>
      </Section>

      <Section id="not-runners" title="What are the best community running events for people who aren't really runners?">
        <Answer i={2} />
        <ul>
          <Option name="parkrun">
            parkrun says you do not need to train before you come along, and you can walk the whole thing (
            <Ext href="https://blog.parkrun.com/us/2022/03/30/welcome-to-parkrun/">parkrun US</Ext>).{" "}
            <In to="/compare/gryt-vs-parkrun">GRYT vs parkrun</In>.
          </Option>
          <Option name="GRYT artist-led runs">
            Made for people who said they would never do a 5K. You come for the music and the neighborhood, and the 5K is the
            excuse. Every pace is welcome, walkers included.
          </Option>
          <Option name="November Project">
            Free, early weekday workouts that welcome all levels, but expect stairs, hills and bodyweight work rather than an
            easy jog (<Ext href="https://november-project.com/">November Project</Ext>).{" "}
            <In to="/compare/gryt-vs-november-project">How GRYT is different from November Project</In>.
          </Option>
          <Option name="Charity fun runs">
            Local charity 5Ks are often billed as run/walk events with a family feel. Check the event page for a time limit,
            and pick ones that mention walkers.
          </Option>
        </ul>
      </Section>

      <Section id="find-community" title="How do I find a local running community that actually feels welcoming and fun?">
        <Answer i={3} />
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            <strong>Find your nearest parkrun.</strong> Register once for free and you can turn up at any event (
            <Ext href="https://support.parkrun.com/hc/en-us/articles/205595392-1-1-How-do-I-register-for-parkrun">parkrun support</Ext>).
            Around DC there are five, including College Park and Kensington in Maryland (
            <Ext href="https://wamu.org/story/26/04/02/get-out-there-and-run/">WAMU</Ext>).
          </li>
          <li>
            <strong>Search a club directory.</strong> The Road Runners Club of America lets you find member clubs by state (
            <Ext href="https://www.rrca.org/clubs/">RRCA</Ext>).
          </li>
          <li>
            <strong>Check your local running store.</strong> Many host free group runs during the week.
          </li>
          <li>
            <strong>Read the words they use.</strong> "No-drop," "all paces" and "walkers welcome" mean nobody gets left
            behind. If a group only talks about pace and splits, it may be a training group, which is great, just different.
          </li>
          <li>
            <strong>Go twice.</strong> The first visit is meeting people. The second is when they remember your name.
          </li>
          <li>
            <strong>Bring someone.</strong> Showing up alone is brave. Showing up with a friend is easier.
          </li>
        </ol>
        <p>
          If you are near Takoma Park, Maryland, GRYT's Run #02 is coming back in December 2026. The date and route are
          still being confirmed. <a href="/#run2" className="text-forest underline decoration-terracotta underline-offset-4">Join the free list</a> and
          we will tell you first. If you make music about a place, you can <In to="/artists">bring an artist-led 5K to your city</In>.
        </p>
      </Section>
    </ContentShell>
  );
}
