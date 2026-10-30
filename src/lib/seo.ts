import bearLogo from "@/assets/gryt-bear.png.asset.json";

export const BASE_URL = "https://grytrun.com";

export const absUrl = (path: string) => (path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`);

/** Self-referencing canonical plus og:url for a route path such as "/artists". */
export function canonicalLinks(path: string) {
  return [{ rel: "canonical", href: absUrl(path) }];
}

export function ogUrl(path: string) {
  return { property: "og:url", content: absUrl(path) };
}

export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export const ORG_ID = `${BASE_URL}/#organization`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "@id": ORG_ID,
  name: "GRYT Club",
  alternateName: ["GRYT Run", "GRYT Runs"],
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}${bearLogo.url}`,
  image: "https://grytrun.com/og/grytrun-recap-1200x630.jpg",
  sport: "Running",
  slogan: "Do hard things together",
  description:
    "GRYT Club produces artist-led community 5Ks. The first, Run Takoma With Love with Heno. and Oddisee, took place in Takoma Park, Maryland on August 2, 2026.",
  founder: { "@type": "Person", name: "Nick Merich" },
  email: "merichnick@gmail.com",
  sameAs: [
    "https://instagram.com/grytrunclub",
    "https://facebook.com/grytrunclub",
    "https://www.strava.com/clubs/1708552",
    "https://grytrunclub.com",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "GRYT Run",
  url: `${BASE_URL}/`,
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID },
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}

export type QA = { q: string; a: string };

export function faqJsonLd(items: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Standard meta block for a content page. */
export function pageMeta(opts: { title: string; description: string; path: string; type?: "website" | "article" }) {
  return [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { name: "twitter:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { name: "twitter:description", content: opts.description },
    { property: "og:type", content: opts.type ?? "website" },
    ogUrl(opts.path),
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
