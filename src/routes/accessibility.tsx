import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { breadcrumbJsonLd, canonicalLinks, jsonLdScript, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TITLE = "Accessibility Statement · GRYT Runs";
const DESCRIPTION =
  "How grytrun.com and GRYT's artist-led 5Ks work for people with disabilities: website standards, known issues, event-day access in Takoma Park, and how to ask for an accommodation.";

// Intentionally no Event schema here: this is a policy page, not an event page.
// Event structured data lives on /story and /5k-series where the events are described.
export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { property: "og:type", content: "website" },
      ogUrl("/accessibility"),
      { name: "twitter:card", content: "summary_large_image" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { name: "twitter:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: canonicalLinks("/accessibility"),
    scripts: [
      jsonLdScript(
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accessibility Statement", path: "/accessibility" },
        ]),
      ),
    ],
  }),
  component: AccessibilityPage,
});

const linkCls = "underline decoration-terracotta underline-offset-4";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="display-tight text-xl uppercase tracking-wide">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

function AccessibilityPage() {
  const updated = "October 29, 2026";
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
          <Block title="Our commitment">
            <p>
              GRYT Club is committed to making grytrun.com and our artist-led 5Ks, starting with Run Takoma With Love,
              welcoming and usable for as many people as possible, including people with disabilities. This page is
              maintained by GRYT Club. It covers how the website is built, what we know still needs work, what to expect
              on event day, and how to reach us if something gets in your way.
            </p>
            <p>
              Our runs are built on a simple idea: every pace is welcome, walkers too. Accessibility is part of that
              promise, not an add-on.
            </p>
          </Block>

          <Block title="On the website">
            <p>
              We aim to align this site with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Current
              practices include:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Semantic HTML landmarks and a single main content region on each page.</li>
              <li>Headings in a logical order, so screen reader users can jump between sections.</li>
              <li>Text alternatives on meaningful images and labels on all form fields.</li>
              <li>Keyboard-navigable controls with visible focus states.</li>
              <li>Color choices intended to meet AA contrast on body text and controls.</li>
              <li>Responsive layout that works on mobile, tablet, and desktop.</li>
              <li>Form errors written out in text next to the field, not shown by color alone.</li>
            </ul>
          </Block>

          <Block title="Known limitations">
            <p>We would rather tell you what is not there yet than claim it is perfect.</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                The Run #01 recap video does not have captions or a transcript yet. The same story is told in text and
                photos on the <Link to="/takoma" className={linkCls}>Run Takoma recap</Link> and{" "}
                <Link to="/story" className={linkCls}>story</Link> pages.
              </li>
              <li>
                The photo gallery has a lot of images. Each one has a short text description, but some descriptions are
                brief.
              </li>
              <li>
                Course maps are drawn graphics. Where we show a map, we also describe the route in words, for example the
                Run #02 draft route of 6 laps inside Takoma-Piney Branch Local Park.
              </li>
            </ul>
            <p>If one of these blocks you, tell us and we will send the information another way.</p>
          </Block>

          <Block title="On event day">
            <p>
              These details describe how we set up Run #01 at Takoma-Piney Branch Local Park in Takoma Park, Maryland.
              We plan to keep the same approach for future runs, and we will post any changes on the run's page.
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Any pace.</strong> Walkers, strollers, adaptive athletes, and supporters are welcome. The finish
                line stays open until the last person is home.
              </li>
              <li>
                <strong>Parking and paths.</strong> There is a lot at the park. ADA parking spaces and accessible routes
                are kept clear all day.
              </li>
              <li>
                <strong>Restrooms.</strong> The existing park restrooms are on site.
              </li>
              <li>
                <strong>A shaded home base.</strong> The covered picnic shelter is HQ for check-in, water, and first aid.
              </li>
              <li>
                <strong>Strollers and leashed dogs.</strong> Welcome at a walking pace. Lining up toward the back at the
                start gives everyone a clean first quarter mile.
              </li>
              <li>
                <strong>A quieter day.</strong> Nothing is amplified, on the route or at the shelter. That helps if loud
                sound is hard for you, and it also means announcements are spoken, so ask a volunteer if you miss one.
              </li>
              <li>
                <strong>People on the course.</strong> Volunteer marshals stand at every turn and at both road crossings.
              </li>
              <li>
                <strong>The Run #02 draft route</strong> stays inside the park as 6 laps, so you are never far from the
                shelter. The final route depends on park approval.
              </li>
            </ul>
          </Block>

          <Block title="Asking for an accommodation">
            <p>
              If you need something specific, like a reserved accessible parking spot, help at the start line, an ASL
              interpreter, a buddy on course, or a quiet place to rest, email us before the run so we can plan with you.
              The earlier you tell us, the more we can do. You do not have to explain why you need it.
            </p>
          </Block>

          <Block title="Third-party content">
            <p>
              Some features rely on third parties, for example Strava for club connection and email for the run lists.
              We do not control the accessibility of those external services, but we are happy to help you complete any
              step another way. If you cannot use a form on this site, email us and we will sort it out with you.
            </p>
          </Block>

          <Block title="Feedback and contact">
            <p>
              If you run into an accessibility barrier on this site or at a run, email{" "}
              <a href="mailto:hello@grytrun.com" className={linkCls}>
                hello@grytrun.com
              </a>{" "}
              or use the{" "}
              <a href="mailto:merichnick@gmail.com" className={linkCls}>
                Contact
              </a>{" "}
              link in the footer. Please include the page or situation and what would help. We aim to respond within 5
              business days.
            </p>
            <p>
              Looking for a welcoming run in general? Our{" "}
              <a href="/guides/social-5k-runs" className={linkCls}>
                guide to social 5Ks where walkers are welcome
              </a>{" "}
              lists options beyond GRYT.
            </p>
          </Block>
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
