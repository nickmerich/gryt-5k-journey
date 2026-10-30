import { createFileRoute } from "@tanstack/react-router";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, jsonLdScript, pageMeta, absUrl } from "@/lib/seo";
import { ContentShell, In, Section } from "@/components/ContentPage";

const PATH = "/compare";
const TITLE = "Compare GRYT With Other Community 5Ks and Run Groups · GRYT Runs";
const DESC =
  "Honest side-by-side comparisons of GRYT artist-led 5Ks with parkrun, November Project, The Color Run and the Rock 'n' Roll Running Series.";

const PAGES = [
  {
    to: "/compare/gryt-vs-parkrun",
    name: "GRYT vs parkrun",
    body: "Free weekly timed 5K vs free artist-led 5Ks held as occasional special events.",
  },
  {
    to: "/compare/gryt-vs-november-project",
    name: "GRYT vs November Project",
    body: "Free early weekday workouts vs a free 5K and picnic built around an album.",
  },
  {
    to: "/compare/gryt-vs-the-color-run",
    name: "GRYT vs The Color Run",
    body: "Paid, untimed color party 5K vs a free, low-key neighborhood 5K.",
  },
  {
    to: "/compare/gryt-vs-rock-n-roll-running-series",
    name: "GRYT vs Rock 'n' Roll Running Series",
    body: "Big-city timed races with bands on course vs one album, one neighborhood.",
  },
];

export const Route = createFileRoute("/compare/")({
  head: () => ({
    meta: [...recapImageMeta, ...pageMeta({ title: TITLE, description: DESC, path: PATH })],
    links: canonicalLinks(PATH),
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "GRYT comparisons",
        itemListElement: PAGES.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absUrl(p.to) })),
      }),
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: PATH },
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
        { name: "Compare", to: PATH },
      ]}
      eyebrow="Compare"
      title="How GRYT compares"
      updated="October 2026"
      intro={
        <p>
          GRYT makes free artist-led 5Ks: a run built around an album and the neighborhood it is about, with a picnic
          after. There are a lot of great ways to run with other people. These pages lay out, honestly, how GRYT differs
          from the ones people ask us about most, and who each one suits.
        </p>
      }
    >
      <Section id="list" title="Comparisons">
        <ul className="grid gap-5 sm:grid-cols-2">
          {PAGES.map((p) => (
            <li key={p.to}>
              <a href={p.to} className="ink-card ink-card-hover block h-full p-5">
                <p className="display-tight text-2xl text-forest">{p.name}</p>
                <p className="mt-2 text-ink-soft">{p.body}</p>
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="guide" title="Not sure where to start?">
        <p>
          Read our <In to="/guides/social-5k-runs">guide to social 5K runs where walkers are welcome</In>. It covers free
          5Ks that feel like a party, events for people who aren't really runners, and how to find a running community that
          is actually fun.
        </p>
      </Section>
    </ContentShell>
  );
}
