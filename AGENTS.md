<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Series pages
- Homepage artist testimonials and the closing album slide use the shared ArtistQuotes carousel with directional manual controls and swipe, keeping artist content separate from page layout.
- The 5K Series route reuses Run2Hub and EVENT_PHOTOS so signups, confirmation persistence, and event imagery stay consistent with the homepage.
- Future runs show tentative dates and unconfirmed routes explicitly; interest-list entries are not race registrations.
- Run #03 uses its own validated server function and form; shared run2_interest rows are separated by event_code so new runs cannot mix with the existing list.
- Shared SiteNav (src/components/SiteNav.tsx) is the header on homepage, /takoma and /artists; /brands redirects to /partners to keep the existing sponsor URL.

## Public site audit
- Define recap share-image metadata through the shared site-meta module on content leaf routes, never the root layout, so per-page social metadata remains independent.
- Reuse AuditFooterLinks inside existing footers and SiteFooter on pages without a footer to keep press, contact, and event destinations consistent.
- Retain a 404 status on unknown URLs; root head detects notFound matches for server-rendered fallback titles because thrown catch-all loaders do not contribute leaf metadata.
