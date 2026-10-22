import { SiteFooter } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms · GRYT Run" },
      {
        name: "description",
        content:
          "Terms of Service, participant waiver, and event policies for the Run Takoma With Love 5K presented by GRYT Club.",
      },
      { property: "og:title", content: "Terms · GRYT Run" },
      { name: "twitter:title", content: "Terms · GRYT Run" },
      {
        property: "og:description",
        content:
          "Terms of Service, participant waiver, and event policies for the Run Takoma With Love 5K.",
      },
      {
        name: "twitter:description",
        content:
          "Terms of Service, participant waiver, and event policies for the Run Takoma With Love 5K.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const updated = "July 16, 2026";
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          to="/"
          className="eyebrow text-ink-soft hover:text-ink transition-colors"
        >
          ← Back to Run Takoma
        </Link>

        <h1 className="display-tight mt-6 text-4xl sm:text-6xl leading-[0.95] uppercase">
          Terms of Service
        </h1>
        <p className="eyebrow mt-3 text-ink-soft">Last updated · {updated}</p>

        <div className="prose-gryt mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">1. Agreement</h2>
            <p className="mt-2">
              These Terms of Service ("Terms") govern your registration and
              participation in the Run Takoma With Love 5K (the "Event")
              presented by GRYT Club ("GRYT," "we," "us"). By registering,
              checking the waiver box, or attending the Event, you agree to
              these Terms on behalf of yourself and any minor you register.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              2. Eligibility & registration
            </h2>
            <p className="mt-2">
              Participants under 18 must be registered by a parent or legal
              guardian. Registration is personal and non-transferable. We may
              refuse or cancel any registration at our discretion, including for
              incomplete information, unsafe behavior, or capacity limits.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              3. Assumption of risk & waiver
            </h2>
            <p className="mt-2">
              Running, walking, and community events involve inherent risks
              including but not limited to falls, contact with other
              participants, effects of weather, traffic, and course conditions.
              You voluntarily assume all such risks. To the fullest extent
              permitted by law, you release and hold harmless GRYT Club, its
              organizers, volunteers, sponsors, and partners from any claim
              arising out of your participation, except for gross negligence or
              willful misconduct.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              4. Health & safety
            </h2>
            <p className="mt-2">
              You represent that you are physically able to participate. Follow
              all course marshals, posted signage, and local traffic laws. We
              may modify, delay, or cancel the Event for weather, safety, or
              other conditions without refund.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              5. Media release
            </h2>
            <p className="mt-2">
              Photography and video will be captured at the Event. You grant
              GRYT and its partners a non-exclusive, royalty-free license to use
              your name, likeness, and voice in Event coverage and community
              promotion.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              6. Communications & data
            </h2>
            <p className="mt-2">
              We use the name and email you provide to send registration
              confirmations, Event logistics, and related community updates.
              You may unsubscribe from non-essential email at any time via the
              link in any message. If you connect Strava, we store your Strava
              athlete ID and public profile to personalize your dashboard and
              club invitations; you can disconnect at any time from Strava.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              7. Conduct
            </h2>
            <p className="mt-2">
              Do hard things together — kindly. Harassment, discrimination, or
              unsafe behavior toward participants, volunteers, or the
              neighborhood will result in removal from the Event without refund
              and may be reported to local authorities.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              8. Refunds
            </h2>
            <p className="mt-2">
              Registration fees, where applicable, are non-refundable but may be
              deferred at our discretion in case of Event cancellation.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              9. Changes to these Terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. Material changes
              affecting a live registration will be communicated by email to the
              address on file.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">
              10. Contact
            </h2>
            <p className="mt-2">
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@grytrun.com"
                className="underline decoration-terracotta underline-offset-4"
              >
                hello@grytrun.com
              </a>
              .
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
