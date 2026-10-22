import { Link } from "@tanstack/react-router";

export function AuditFooterLinks() {
  return <nav aria-label="Press and contact" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-ink-soft">
    <Link to="/press" className="hover:text-terracotta">Press</Link>
    <a href="mailto:merichnick@gmail.com" className="hover:text-terracotta">Contact</a>
    <a href="https://phihackathon.pplx.app" target="_blank" rel="noopener" className="hover:text-terracotta">Shake &amp; Ship</a>
  </nav>;
}

export function SiteFooter() {
  return <footer className="relative z-10 border-t border-hairline bg-paper text-ink">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-6">
      <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
      <AuditFooterLinks />
    </div>
  </footer>;
}