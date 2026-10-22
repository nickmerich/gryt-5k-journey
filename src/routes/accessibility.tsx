import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Accessibility · GRYT Run" },
      {
        name: "description",
        content:
          "Our commitment to making the Run Takoma With Love 5K and grytrun.com accessible to everyone.",
      },
      { property: "og:title", content: "Accessibility · GRYT Run" },
      { name: "twitter:title", content: "Accessibility · GRYT Run" },
      {
        property: "og:description",
        content:
          "Our commitment to making the Run Takoma With Love 5K and grytrun.com accessible to everyone.",
      },
      {
        name: "twitter:description",
        content:
          "Our commitment to making the Run Takoma With Love 5K and grytrun.com accessible to everyone.",
      },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const updated = "July 20, 2026";
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link to="/" className="eyebrow text-ink-soft hover:text-ink transition-colors">
          ← Back to Run Takoma
        </Link>

        <h1 className="display-tight mt-6 text-4xl sm:text-6xl leading-[0.95] uppercase">
          Accessibility Statement
        </h1>
        <p className="eyebrow mt-3 text-ink-soft">Last updated · {updated}</p>

        <div className="prose-gryt mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">Our commitment</h2>
            <p className="mt-2">
              GRYT Club is committed to making the Run Takoma With Love 5K and
              grytrun.com welcoming and usable for as many people as possible,
              including people with disabilities. This page is maintained by
              GRYT Club to describe the accessibility of this site and event.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">On the website</h2>
            <p className="mt-2">
              We aim to align this site with the Web Content Accessibility
              Guidelines (WCAG) 2.1 Level AA. Current practices include:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Semantic HTML landmarks and a single main content region on each page.</li>
              <li>Text alternatives on meaningful images and labels on all form fields.</li>
              <li>Keyboard-navigable controls with visible focus states.</li>
              <li>Color choices intended to meet AA contrast on body text and controls.</li>
              <li>Responsive layout that works on mobile, tablet, and desktop.</li>
            </ul>
            <p className="mt-3">
              Accessibility is ongoing work — if you find something that
              doesn't meet these goals, please let us know.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">On event day</h2>
            <p className="mt-2">
              The 5K course runs on public streets and paths in Takoma Park.
              Walkers, strollers, adaptive athletes, and supporters at any pace
              are welcome. If you need a specific accommodation — accessible
              parking, a start-line assist, an ASL interpreter for
              announcements, or something else — email us in advance so we can
              plan with you.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">Third-party content</h2>
            <p className="mt-2">
              Some features rely on third parties (for example Strava for club
              connection). We don't control the accessibility of those
              external services, but we're happy to help you complete any step
              another way — just reach out.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">Feedback & contact</h2>
            <p className="mt-2">
              If you run into an accessibility barrier on this site or at the
              event, email{" "}
              <a
                href="mailto:hello@grytrun.com"
                className="underline decoration-terracotta underline-offset-4"
              >
                hello@grytrun.com
              </a>
              . Please include the page or situation and what would help. We
              aim to respond within 5 business days.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-hairline pt-6">
          <Link to="/" className="eyebrow text-ink-soft hover:text-ink transition-colors">
            ← Back to Run Takoma
          </Link>
        </div>
      </div>
    <SiteFooter />
    </main>
  );
}
