import { createFileRoute } from "@tanstack/react-router";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, faqJsonLd, jsonLdScript, pageMeta, type QA } from "@/lib/seo";
import { BestFor, CompareTable, ContentShell, Ext, FaqList, In, Section } from "@/components/ContentPage";

const PATH = "/compare/gryt-vs-november-project";
const TITLE = "How Is GRYT Different From November Project? · GRYT Runs";
const DESC =
  "November Project is a free early-morning weekday workout group. GRYT runs are free artist-led 5Ks with a picnic after. An honest comparison, plus who each one suits.";

const FAQ: QA[] = [
  {
    q: "How is GRYT different from November Project?",
    a: "November Project is a free workout group that meets early on weekday mornings, every week, for stairs, hills and bodyweight work. GRYT runs are free artist-led 5K events that happen a few times a year, built around an album and its neighborhood, with a walk/run 5K and a long picnic after. November Project is a weekly training habit. A GRYT run is a special day out.",
  },
  {
    q: "Are both free?",
    a: "Yes. November Project says its workouts cost nothing, always. GRYT runs are free for runners.",
  },
  {
    q: "Do I need to sign up?",
    a: "November Project says there are no sign-up forms: you just show up, though some cities ask for a one-time waiver. For a GRYT run you join the free list on grytrun.com so you get the date, meeting point and bib details.",
  },
  {
    q: "Which is better if I am not really a runner?",
    a: "A GRYT run is the gentler start. It is a 5K you can walk, and nobody is timing you. November Project welcomes all levels too, but the workouts are intense and early, so it suits people who want a hard weekly session.",
  },
  {
    q: "Is there a November Project in the DC area?",
    a: "Yes. November Project DC lists free workouts on Mondays at Malcolm X Park, Wednesdays at the Lincoln Memorial steps and Fridays at a rotating location.",
  },
];

export const Route = createFileRoute("/compare/gryt-vs-november-project")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH, type: "article" })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript(faqJsonLd(FAQ)),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "GRYT vs November Project", path: PATH },
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
        { name: "GRYT vs November Project", to: PATH },
      ]}
      eyebrow="Compare · Free community fitness"
      title="GRYT vs November Project"
      updated="October 2026"
      intro={
        <p>
          <strong className="text-ink">Short answer:</strong> November Project is a free workout group that meets early
          on weekday mornings, every week, for stairs, hills and bodyweight work. GRYT runs are free artist-led 5Ks that
          happen a few times a year, built around an album and its neighborhood, with a walk/run 5K and a long picnic after.
          November Project is a weekly training habit. A GRYT run is a special day out. Both are free, both are about
          showing up for each other.
        </p>
      }
    >
      <Section id="table" title="Side by side">
        <CompareTable
          caption="GRYT runs compared with November Project"
          columns={["GRYT runs", "November Project"]}
          rows={[
            ["What it is", "An artist-led community 5K and park hangout.", <>A free fitness movement that started in Boston "to stay in shape during cold New England months" (<Ext href="https://november-project.com/">November Project</Ext>).</>],
            ["Activity", "A 5K you can run, jog or walk.", <>Workouts that mix running, stairs and bodyweight exercises (<Ext href="https://runningcrews.com/networks/november-project">RunningCrews</Ext>). Boston's Wednesday session is the Harvard Stadium stairs (<Ext href="https://november-project.com/boston/">November Project Boston</Ext>).</>],
            ["When", "A few times a year, on a weekend morning. Run #01 was Sunday, August 2, 2026.", <>"Always in the morning and always on weekdays" (<Ext href="https://november-project.com/">November Project</Ext>).</>],
            ["Cost", "Free for runners.", <>"Nothing. Zero." (<Ext href="https://november-project.com/">November Project</Ext>).</>],
            ["Sign-up", "Join the free list for the next run.", <>"No sign up forms." Just show up (<Ext href="https://november-project.com/">November Project</Ext>). Boston asks for a one-time waiver (<Ext href="https://november-project.com/boston/">November Project Boston</Ext>).</>],
            ["Vibe", "No clock, no podiums. A hang with a 5K in the middle.", <>High energy, with hugs and newcomers introduced at the start (<Ext href="https://www.bostonglobe.com/2024/08/27/metro/november-project-growth-exercise/">Boston Globe</Ext>).</>],
            ["Where", "Takoma Park, Maryland so far.", <>Many cities. Founded in Boston in 2011 by Brogan Graham and Bojan Mandaric (<Ext href="https://en.wikipedia.org/wiki/November_Project">Wikipedia</Ext>). DC meets Monday, Wednesday and Friday (<Ext href="https://november-project.com/washington-dc/">November Project DC</Ext>).</>],
          ]}
        />
      </Section>

      <Section id="different" title="How is GRYT different from November Project?">
        <p>
          November Project is about the weekly promise. You say you will be there early on Wednesday morning, and the group
          holds you to it. The workouts are hard on purpose and the community is built through showing up again and again.
          It is a great fit if you want free, intense training with friendly people.
        </p>
        <p>
          GRYT starts somewhere else: with an artist and a place. Run Takoma With Love was named for{" "}
          <em>From Takoma With Love</em>, the album by Heno. and Oddisee, and went through the neighborhood that album is
          about. 248 people signed up and 98 finished, at every pace, walkers included. Then everyone stayed for the
          picnic. There is no workout to keep up with. The 5K is the excuse to be together. Read{" "}
          <In to="/story">how Run Takoma With Love came together</In>.
        </p>
        <p>
          The two also differ in who does the work. November Project is led by unpaid volunteer co-leaders in each city (<Ext href="https://runningcrews.com/networks/november-project">RunningCrews</Ext>). GRYT
          produces each run, from the park permit and course to the runner experience on the day.
        </p>
      </Section>

      <Section id="best-for" title="Who each one is best for">
        <BestFor
          items={[
            { name: "November Project", body: "Early risers who want a free, tough workout every week and a crew that notices when they miss one." },
            { name: "GRYT runs", body: "People who want a gentler, special-occasion 5K tied to music they love, with friends, family and a picnic after." },
          ]}
        />
      </Section>

      <Section id="faq" title="FAQ">
        <FaqList items={FAQ} />
      </Section>

      <Section id="next" title="Come to the next one">
        <p>
          Run #02 is coming back to Takoma Park in December 2026, with the date and route still being confirmed.{" "}
          <In to="/5k-series">See the 5K Series</In>, or if you are an artist, <In to="/artists">bring a run to your city</In>.
        </p>
      </Section>
    </ContentShell>
  );
}
