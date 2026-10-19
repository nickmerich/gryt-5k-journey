import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Privacy Policy — Run Takoma With Love 5K" },
      {
        name: "description",
        content:
          "How GRYT Club collects, uses, and protects your information for the Run Takoma With Love 5K.",
      },
      { property: "og:title", content: "Privacy Policy — Run Takoma With Love 5K" },
      {
        property: "og:description",
        content:
          "How GRYT Club collects, uses, and protects your information for the Run Takoma With Love 5K.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const updated = "July 20, 2026";
  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link to="/" className="eyebrow text-ink-soft hover:text-ink transition-colors">
          ← Back to Run Takoma
        </Link>

        <h1 className="display-tight mt-6 text-4xl sm:text-6xl leading-[0.95] uppercase">
          Privacy Policy
        </h1>
        <p className="eyebrow mt-3 text-ink-soft">Last updated · {updated}</p>

        <div className="prose-gryt mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">1. What we collect</h2>
            <p className="mt-2">
              When you register for the Run Takoma With Love 5K, we collect your
              name, email address, ticket type, and your acceptance of the
              waiver and Terms of Service. If you connect Strava, we also store
              your Strava athlete ID and public profile (name, avatar).
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">2. How we use it</h2>
            <p className="mt-2">
              We use your information to confirm your registration, send Event
              logistics and reminders, personalize your Strava-connected
              experience, and invite you to GRYT Run Club activities. We do not
              sell your data.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">3. Email</h2>
            <p className="mt-2">
              Transactional email (registration confirmations, event-day info)
              is sent from notify.grytrunclub.com. You can unsubscribe from
              non-essential email at any time via the link in any message.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">4. Third parties</h2>
            <p className="mt-2">
              We use Strava (for club connect), and email + hosting providers to
              operate this site. These providers process data on our behalf
              under their own privacy terms. You can disconnect Strava at any
              time from your Strava account settings.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">5. Retention</h2>
            <p className="mt-2">
              We keep registration records for as long as needed to run the
              Event and our community programs. You may request deletion of
              your data at any time by emailing us.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">6. Your choices</h2>
            <p className="mt-2">
              You can request access, correction, or deletion of your personal
              information by contacting us. We honor applicable rights under
              U.S. state privacy laws and the GDPR where they apply.
            </p>
          </section>

          <section>
            <h2 className="display-tight text-xl uppercase tracking-wide">7. Contact</h2>
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
    </main>
  );
}
