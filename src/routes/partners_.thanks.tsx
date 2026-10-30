import { SiteFooter } from "@/components/AuditFooterLinks";
import { canonicalLinks, ogUrl } from "@/lib/seo";
import { recapImageMeta } from "@/lib/site-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SPONSOR_LABELS } from "@/components/SponsorInquiryForm";

const TITLE = "Inquiry received — Run Takoma With Love #02 partners";
const DESC = "Thanks for reaching out about partnering on Run Takoma With Love #02. Here's what happens next.";

export const Route = createFileRoute("/partners_/thanks")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { name: "twitter:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ogUrl("/partners/thanks"),
    ],
    links: canonicalLinks("/partners/thanks"),
  }),
  component: Thanks,
});

type Info = { id: string; name: string; company: string; package: string; budget: string };

function Thanks() {
  const [info, setInfo] = useState<Info | null>(null);
  useEffect(() => {
    try { const s = sessionStorage.getItem("sponsor-inquiry"); if (s) setInfo(JSON.parse(s)); } catch { /* ignore */ }
  }, []);
  const first = info?.name.split(" ")[0];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <Link to="/" className="display-tight text-2xl">gryt</Link>
        <Link to="/partners" className="eyebrow hover:text-terracotta">Back to partners</Link>
      </header>
      <section className="mx-auto max-w-4xl px-6 py-12 rise-in">
        <p className="eyebrow text-terracotta">Inquiry received</p>
        <h1 className="display-tight mt-3 text-[clamp(3rem,10vw,6rem)] leading-[0.88]">
          {first ? `Thanks, ${first}.` : "Thanks."}
          <span className="block brush-script text-forest text-[clamp(2rem,6vw,3.5rem)]">we'll be in touch</span>
        </h1>

        {info && (
          <dl className="mt-10 grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
            {[["Brand", info.company], ["Package", SPONSOR_LABELS.package[info.package] ?? info.package], ["Budget", SPONSOR_LABELS.budget[info.budget] ?? info.budget]].map(([k, v]) => (
              <div key={k} className="bg-paper-warm p-5">
                <dt className="eyebrow text-ink-soft">{k}</dt>
                <dd className="display-tight mt-2 text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {info && <p className="mt-3 eyebrow text-ink-soft">Ref · {info.id.slice(0, 8).toUpperCase()}</p>}

        <h2 className="display-tight mt-14 text-4xl">What happens next</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["01", "We read it", "A real person from GRYT Club reads your note."],
            ["02", "We talk", "A short call to match a package to what you want out of Run #02."],
            ["03", "In writing", "Final terms, deliverables and dates confirmed in writing."],
          ].map(([n, t, d]) => (
            <li key={n} className="border-2 border-ink p-5">
              <p className="display-tight text-4xl text-terracotta">{n}</p>
              <p className="display-tight mt-2 text-xl">{t}</p>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-3 sm:flex">
          <Link to="/story" className="brush-btn inline-flex min-h-14 items-center justify-center bg-terracotta px-8 py-4 display-tight text-lg tracking-[0.1em] text-[color:var(--color-terracotta-ink)] hover:bg-forest">READ THE STORY</Link>
          <Link to="/partners" className="inline-flex min-h-14 items-center justify-center border-2 border-ink px-8 py-4 display-tight text-lg tracking-[0.1em] hover:bg-ink hover:text-paper">SEE RUN #01 AGAIN</Link>
        </div>
        <p className="mt-8 text-sm text-ink-soft">Questions in the meantime? DM <a className="underline" href="https://instagram.com/grytrunclub" target="_blank" rel="noopener noreferrer">@grytrunclub</a>.</p>
      </section>
    <SiteFooter />
    </main>
  );
}
