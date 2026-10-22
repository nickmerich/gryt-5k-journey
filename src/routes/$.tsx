import { createFileRoute, notFound } from "@tanstack/react-router";
import { SITE_DESCRIPTION, recapImageMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/$")({
  loader: () => { throw notFound(); },
  head: () => ({ meta: [
    { title: "Page not found · GRYT Run" },
    { property: "og:title", content: "Page not found · GRYT Run" },
    { name: "twitter:title", content: "Page not found · GRYT Run" },
    { name: "description", content: SITE_DESCRIPTION },
    { property: "og:description", content: SITE_DESCRIPTION },
    { name: "twitter:description", content: SITE_DESCRIPTION },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
    ...recapImageMeta,
  ] }),
});