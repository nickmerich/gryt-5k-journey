import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/AuditFooterLinks";
import type { QA } from "@/lib/seo";

/** Pages in the compare + guide cluster, used for cross-linking. */
export const GUIDE_PAGES = [
  { to: "/guides/social-5k-runs", label: "Guide: social 5K runs where walkers are welcome" },
  { to: "/compare/gryt-vs-parkrun", label: "GRYT vs parkrun" },
  { to: "/compare/gryt-vs-november-project", label: "GRYT vs November Project" },
  { to: "/compare/gryt-vs-the-color-run", label: "GRYT vs The Color Run" },
  { to: "/compare/gryt-vs-rock-n-roll-running-series", label: "GRYT vs Rock 'n' Roll Running Series" },
] as const;

export function ContentShell({
  crumbs,
  eyebrow,
  title,
  intro,
  updated,
  children,
  currentPath,
}: {
  crumbs: { name: string; to: string }[];
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  updated?: string;
  children: ReactNode;
  currentPath: string;
}) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {crumbs.map((c, i) => (
              <li key={c.to} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-ink">{c.name}</span>
                ) : (
                  <a href={c.to} className="underline decoration-hairline underline-offset-4 hover:text-terracotta">{c.name}</a>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mt-8 text-terracotta">{eyebrow}</p>
        <h1 className="mt-3 display-tight text-5xl leading-[0.95] text-forest sm:text-7xl">{title}</h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">{intro}</div>
        {updated && <p className="eyebrow mt-5 text-ink-soft">Last reviewed · {updated}</p>}
        <div className="mt-10 space-y-12 leading-relaxed">{children}</div>
        <RelatedPages currentPath={currentPath} />
      </article>
      <SiteFooter />
    </main>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t-2 border-ink pt-7">
      <h2 id={id} className="display-tight text-3xl text-forest sm:text-4xl">{title}</h2>
      <div className="mt-4 space-y-4 text-ink-soft [&_strong]:text-ink">{children}</div>
    </section>
  );
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-forest underline decoration-terracotta underline-offset-4 hover:text-terracotta">
      {children}
    </a>
  );
}

export function In({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={to} className="text-forest underline decoration-terracotta underline-offset-4 hover:text-terracotta">
      {children}
    </a>
  );
}

export function CompareTable({ caption, columns, rows }: { caption: string; columns: [string, string]; rows: [string, ReactNode, ReactNode][] }) {
  return (
    <div>
      <table className="w-full table-fixed border-collapse border-2 border-ink text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper-warm">
          <tr>
            <th scope="col" className="hidden w-[22%] border-b-2 border-ink p-3 eyebrow text-ink-soft sm:table-cell">What</th>
            <th scope="col" className="border-b-2 border-ink p-3 display-tight text-lg text-forest sm:border-l">{columns[0]}</th>
            <th scope="col" className="border-b-2 border-l border-ink p-3 display-tight text-lg text-forest">{columns[1]}</th>
          </tr>
        </thead>
        {rows.map(([label, a, b]) => (
          <tbody key={label}>
            {/* On phones the row label sits on its own line above the two columns. */}
            <tr className="sm:hidden">
              <th scope="colgroup" colSpan={2} className="bg-paper-warm/60 px-3 pb-1 pt-3 eyebrow text-ink">{label}</th>
            </tr>
            <tr className="align-top">
              <th scope="row" className="hidden border-b border-hairline p-3 font-semibold text-ink sm:table-cell">{label}</th>
              <td className="break-words border-b border-hairline p-3 text-ink-soft sm:border-l">{a}</td>
              <td className="break-words border-b border-l border-hairline p-3 text-ink-soft">{b}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export function FaqList({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {items.map((item) => (
        <div key={item.q} className="py-5">
          <h3 className="display-tight text-xl text-forest">{item.q}</h3>
          <p className="mt-2 text-ink-soft">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

export function BestFor({ items }: { items: { name: string; body: ReactNode }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.name} className="ink-card p-5">
          <p className="eyebrow text-terracotta">Best for</p>
          <p className="mt-1 display-tight text-2xl text-forest">{item.name}</p>
          <div className="mt-2 text-ink-soft">{item.body}</div>
        </div>
      ))}
    </div>
  );
}

export function RelatedPages({ currentPath }: { currentPath: string }) {
  const links = GUIDE_PAGES.filter((p) => p.to !== currentPath);
  return (
    <aside aria-labelledby="related-title" className="mt-14 border-t-2 border-ink pt-7">
      <h2 id="related-title" className="display-tight text-2xl text-forest">Keep reading</h2>
      <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.to} className="border-b border-hairline py-3">
            <a href={l.to} className="text-forest hover:text-terracotta">{l.label}</a>
          </li>
        ))}
        <li className="border-b border-hairline py-3">
          <Link to="/5k-series" className="text-forest hover:text-terracotta">The GRYT 5K Series</Link>
        </li>
        <li className="border-b border-hairline py-3">
          <Link to="/artists" className="text-forest hover:text-terracotta">Host an artist-led 5K</Link>
        </li>
      </ul>
    </aside>
  );
}
