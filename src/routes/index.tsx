import { ShakeAndShip } from "@/components/ShakeAndShip";
import { AuditFooterLinks } from "@/components/AuditFooterLinks";
import { recapImageMeta } from "@/lib/site-meta";
import { Run2Course } from "@/components/Run2Course";
import { ArtistQuotes } from "@/components/ArtistQuotes";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PartnerQA } from "@/components/PartnerQA";
import smartwaterLogo from "@/assets/partner-IMG_8388.png.asset.json";
import mocoParksLogo from "@/assets/partner-IMG_8387.png.asset.json";
import { useEffect, useRef, useState } from "react";
import { HeroGroup } from "@/components/HeroGroup";
import { PressBar } from "@/components/PressBar";
import { SiteNav } from "@/components/SiteNav";
import { z } from "zod";
import flyerAsset from "@/assets/rtwl-flyer.png.asset.json";
import recapVideo from "@/assets/rtwl-recap.mp4.asset.json";
import recapPoster from "@/assets/rtwl-recap-poster.jpg.asset.json";
import { EVENT_PHOTOS } from "@/lib/event-photos";
import { buildBibPdf } from "@/lib/bib-pdf";
import { Run2Hub } from "@/components/Run2Hub";
import { PhotoGallery } from "@/components/PhotoGallery";
import { imageAtLeast } from "@/lib/responsive-image";


const STRAVA_CLUB_URL = "https://www.strava.com/clubs/1708552";
const STRAVA_EVENT_URL =
  "https://www.strava.com/clubs/1708552/group_events/3512937555494892876/occurrences/FQIWmNW3loWGu8BhHBTUHxQQFAQUEhQAFAAAHBaAwvqo-GcAAA==";

// Event date: Sunday, August 2, 2026 · 9:00 AM ET (UTC-4 EDT) → 13:00 UTC
// End: 11:00 AM ET → 15:00 UTC
function buildEventIcs(): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GRYT Club//Run Takoma With Love 5K//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:rtwl-5k-2026-08-02@grytrun.com",
    `DTSTAMP:${dtStamp}`,
    "DTSTART:20260802T130000Z",
    "DTEND:20260802T150000Z",
    "SUMMARY:Run Takoma With Love 5K",
    "LOCATION:Takoma Park\\, Maryland",
    "DESCRIPTION:Run Takoma With Love 5K — presented by GRYT Club. Details & registration: https://grytrun.com",
    "URL:https://grytrun.com",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function downloadEventIcs() {
  if (typeof window === "undefined") return;
  const blob = new Blob([buildEventIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "run-takoma-with-love-5k.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


type StravaAthlete = {
  id: string;
  firstname: string | null;
  username: string | null;
  profile: string | null;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...recapImageMeta,
      { title: "Run Takoma With Love Recap & Run #02 · GRYT" },
      {
        name: "description",
        content:
          "248 signups, 98 finishers, one community. Relive Run Takoma With Love and get on the list for Run #02. Runners and brands welcome.",
      },
      { property: "og:title", content: "Run Takoma With Love Recap & Run #02 · GRYT" },
      { name: "twitter:title", content: "Run Takoma With Love Recap & Run #02 · GRYT" },
      {
        property: "og:description",
        content:
          "248 signups, 98 finishers, one community. Relive Run Takoma With Love and get on the list for Run #02. Runners and brands welcome.",
      },
      {
        name: "twitter:description",
        content:
          "248 signups, 98 finishers, one community. Relive Run Takoma With Love and get on the list for Run #02. Runners and brands welcome.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RunTakomaOnePager,
});

const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Full name is required" })
    .max(100, { message: "Name must be under 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" })
    .max(255),
  ticket: z.enum(["5k", "walker", "supporter"], {
    message: "Choose a ticket type",
  }),
  waiver: z.literal(true, {
    message: "You must accept the waiver to register",
  }),
  tos: z.literal(true, {
    message: "You must accept the Terms of Service to register",
  }),
});

type FormState = {
  name: string;
  email: string;
  ticket: "5k" | "walker" | "supporter" | "";
  waiver: boolean;
  tos: boolean;
};

const initialForm: FormState = {
  name: "",
  email: "",
  ticket: "",
  waiver: false,
  tos: false,
};

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;
    const motionOff =
      document.documentElement.classList.contains("motion-off") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOff || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

type Chapter = {
  number: string;
  title: string;
  teaser: string;
  eyebrow: string;
  body: string[];
};

const CHAPTERS: Chapter[] = [
  {
    number: "01",
    title: "A love letter dropped.",
    teaser:
      "April 30, 2026 — Oddisee and Heno. release From Takoma With Love. Twelve tracks about the block that raised them both. Not nostalgia — gratitude. Two artists, a generation apart, writing home to the same neighborhood.",
    eyebrow: "April 30, 2026 · Takoma Park",
    body: [
      "Some albums are made for the charts. This one was made for a zip code.",
      "From Takoma With Love is Oddisee and Heno. writing back to Takoma Park — the porches, the corner stores, the people who knew them before anyone else did. Twelve tracks that don't romanticize the neighborhood. They thank it.",
      "That's the rare kind of project: artists at two different points in their careers, pointing all of it back at the place that made them. Not a victory lap. A returned favor.",
    ],
  },
  {
    number: "02",
    title: "Five years. Then a collision.",
    teaser:
      "Four hundred miles away in Pittsburgh, one of the first listeners wasn't a stranger. Nick and Heno. had spent five years building together — music ventures, tech partnerships, late-night ideas that became real things. The last two years, Nick's project was different: doing hard things and getting his health back.",
    eyebrow: "May 2026 · Pittsburgh",
    body: [
      "Nick and Heno. have been partners longer than they've been anything else. Five years of joint ventures across music and tech — some worked, some didn't, all of them built on the same handshake.",
      "Two years ago, Nick's hardest project stopped being a company. It became his own body. Early mornings. Long miles. Doing hard things, together, until it turned into a community called GRYT.",
      "So when From Takoma With Love dropped, Nick heard it the way you hear a friend's work — twice. Once as a listener. Once as a builder. An album about giving back to a neighborhood. A life rebuilt one run at a time. Those two things were always going to collide.",
    ],
  },
  {
    number: "03",
    title: "We run it back.",
    teaser:
      "August 2, 2026 — Run Takoma With Love. One loop through the neighborhood the album is written to. Free, 100 runners, small on purpose. Not a concert. Not a promo. A community moving through its own streets — the most physical way to say thank you.",
    eyebrow: "August 2, 2026 · 9:00 AM · Takoma Park",
    body: [
      "The best way to honor a love letter to a neighborhood is to move through it.",
      "So on August 2, we run Takoma Park. One loop. A neighborhood pace. A shared playlist. A bib for every finisher. Capped at 100 because this isn't about scale — it's about the block.",
      "This is Nick and GRYT supporting Heno.'s community, and the neighborhood both artists came up in, the way GRYT knows how: physically, positively, together. You don't have to be fast. You have to show up.",
      "That's how we got here. That's how we finish it — on foot.",
    ],
  },
];


function ChapterModal({
  chapter,
  onClose,
}: {
  chapter: Chapter | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!chapter) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [chapter, onClose]);

  if (!chapter) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-paper-warm border border-hairline shadow-lift p-6 sm:p-8 rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-terracotta">Chapter {chapter.number}</p>
            <h3
              id="chapter-modal-title"
              className="mt-1 display-tight text-3xl sm:text-4xl text-forest leading-tight"
            >
              {chapter.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{chapter.eyebrow}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mt-1 -mr-1 h-9 w-9 inline-flex items-center justify-center rounded-full border border-hairline text-ink hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="mt-5 space-y-4 text-ink-soft leading-relaxed">
          {chapter.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/story"
            onClick={onClose}
            className="brush-btn inline-flex items-center justify-center px-5 py-2.5 display-tight text-sm tracking-[0.14em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors"
          >
            READ THE FULL STORY
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="eyebrow text-ink-soft hover:text-terracotta transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- BIB CARD (shareable) ----------

function bibNumberFrom(id: string | null | undefined): string {
  if (!id) return "042";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const n = hash % 101; // 0–100
  return String(n).padStart(3, "0");

}

function drawBibCanvas(opts: {
  canvas: HTMLCanvasElement;
  name: string;
  bib: string;
  ticket: string;
}) {
  const { canvas, name, bib, ticket } = opts;
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Paper background
  ctx.fillStyle = "#f4ede1";
  ctx.fillRect(0, 0, W, H);

  // Grain (subtle noise)
  const grain = ctx.createImageData(W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const v = 235 + Math.floor(Math.random() * 20);
    grain.data[i] = v;
    grain.data[i + 1] = v - 8;
    grain.data[i + 2] = v - 20;
    grain.data[i + 3] = 14;
  }
  ctx.putImageData(grain, 0, 0);

  // Forest border frame
  ctx.strokeStyle = "#1f3a2e";
  ctx.lineWidth = 10;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  // Top eyebrow
  ctx.fillStyle = "#1f3a2e";
  ctx.font = "600 28px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  const trackText = (t: string, y: number, size: number, letterSpacing: number, color: string) => {
    ctx.fillStyle = color;
    ctx.font = `700 ${size}px "Bebas Neue", "Oswald", Impact, sans-serif`;
    const chars = t.split("");
    const widths = chars.map((c) => ctx.measureText(c).width + letterSpacing);
    const total = widths.reduce((a, b) => a + b, 0) - letterSpacing;
    let x = (W - total) / 2;
    chars.forEach((c, i) => {
      ctx.fillText(c, x + widths[i] / 2 - letterSpacing / 2, y);
      x += widths[i];
    });
  };

  trackText("RUN TAKOMA WITH LOVE 5K", 170, 44, 6, "#1f3a2e");
  trackText("AUG · 02 · 2026 — TAKOMA PARK", 220, 30, 8, "#7a6b58");

  // Terracotta diagonal slash behind BIB
  ctx.save();
  ctx.translate(W / 2, 640);
  ctx.rotate(-0.06);
  ctx.fillStyle = "#c2503b";
  ctx.fillRect(-460, -220, 920, 440);
  ctx.restore();

  // Grain over slash
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000";
  for (let i = 0; i < 400; i++) {
    ctx.fillRect(120 + Math.random() * 840, 430 + Math.random() * 420, 2, 2);
  }
  ctx.restore();

  // BIB label
  trackText("BIB", 510, 44, 10, "#f4ede1");

  // BIG BIB number
  ctx.fillStyle = "#f4ede1";
  ctx.font = "700 340px \"Bebas Neue\", \"Oswald\", Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(bib, W / 2, 690);
  ctx.textBaseline = "alphabetic";

  // Name — brush script
  ctx.fillStyle = "#1f3a2e";
  ctx.font = "400 96px \"Caveat Brush\", \"Playfair Display\", cursive";
  ctx.textAlign = "center";
  const nameToShow = name.length > 22 ? name.slice(0, 21) + "…" : name;
  ctx.fillText(nameToShow, W / 2, 970);

  // Ticket + mission
  trackText(ticket.toUpperCase(), 1030, 26, 8, "#7a6b58");

  // Bottom tagline
  trackText("DO HARD THINGS", 1180, 62, 6, "#1f3a2e");
  trackText("TOGETHER", 1250, 62, 6, "#c2503b");

  // Corner marks
  ctx.strokeStyle = "#1f3a2e";
  ctx.lineWidth = 3;
  [[64, 64], [W - 64, 64], [64, H - 64], [W - 64, H - 64]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
  });
}

function BibCard({
  name,
  registrationId,
  ticket,
}: {
  name: string;
  registrationId: string | null;
  ticket: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [printOpened, setPrintOpened] = useState(false);

  const [shared, setShared] = useState<"idle" | "shared" | "copied">("idle");

  const bib = bibNumberFrom(registrationId);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const paint = () =>
      drawBibCanvas({ canvas: c, name, bib, ticket: ticketShort(ticket) });
    paint();
    // Repaint once brand fonts have loaded so canvas uses them, not fallback.
    const anyDoc = document as Document & { fonts?: { ready: Promise<unknown> } };
    if (anyDoc.fonts?.ready) {
      anyDoc.fonts.ready.then(paint).catch(() => {});
    }
  }, [name, bib, ticket]);

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `rtwl-bib-${bib}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2400);
  };

  const downloadPdf = () => {
    const blob = buildBibPdf({ name, bib, ticket: ticketShort(ticket) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rtwl-bib-${bib}-print.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2400);
  };

  const printNow = () => {
    const blob = buildBibPdf({ name, bib, ticket: ticketShort(ticket) });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "noopener");
    if (!win) {
      // Popup blocked — fall back to downloading the PDF.
      downloadPdf();
      return;
    }
    // Ask the PDF viewer to open the print dialog once it has rendered.
    const tryPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
        /* viewer blocks scripted print — user can print from the tab */
      }
    };
    win.addEventListener?.("load", () => setTimeout(tryPrint, 400));
    setTimeout(tryPrint, 1200);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    setPrintOpened(true);
    setTimeout(() => setPrintOpened(false), 2400);
  };




  const share = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const shareUrl = `https://grytrun.com/?bib=${bib}`;
    const shareText = `I'm in for Run Takoma With Love 5K · Aug 2, 2026. Bib #${bib}. Come run with us:`;
    const blob: Blob | null = await new Promise((res) =>
      c.toBlob((b) => res(b), "image/png"),
    );
    const file = blob
      ? new File([blob], `rtwl-bib-${bib}.png`, { type: "image/png" })
      : null;
    const nav = navigator as Navigator & {
      canShare?: (d: { files?: File[]; url?: string }) => boolean;
      share?: (d: { files?: File[]; title?: string; text?: string; url?: string }) => Promise<void>;
    };
    // Native Web Share (mobile): share the bib image + link
    if (file && nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({
          files: [file],
          title: "I'm running Takoma with Love",
          text: shareText,
          url: shareUrl,
        });
        setShared("shared");
        setTimeout(() => setShared("idle"), 2400);
        return;
      } catch {
        /* user cancelled — bail without fallback */
        return;
      }
    }
    // Desktop fallback: copy shareable link to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShared("copied");
      setTimeout(() => setShared("idle"), 2400);
    } catch {
      download();
    }
  };

  return (
    <div className="mt-6 border-2 border-dashed border-terracotta/70 bg-[color:var(--color-paper)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow text-terracotta">Your race bib</p>
        <p className="eyebrow text-ink-soft">Bib #{bib}</p>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Save it. Post it. Tag <span className="font-semibold text-ink">@grytrunclub</span>.
        Every share pulls one more neighbor onto the start line.
      </p>

      <div className="mt-4 flex justify-center">
        <div
          className="relative w-full max-w-[320px] aspect-[4/5] overflow-hidden border border-hairline shadow-lift bg-paper-warm hover-lift"
          aria-label={`Race bib preview for ${name}, bib number ${bib}`}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={share}
          className="brush-btn inline-flex items-center justify-center gap-2 px-5 py-3 display-tight text-sm tracking-[0.12em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {shared === "shared" ? "Shared!" : shared === "copied" ? "Link copied ✓" : "Share my bib"}
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-hairline hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors eyebrow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloaded ? "Downloaded ✓" : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          title="High-contrast black & white bib, US Letter, with cut line and pin marks"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-hairline hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors eyebrow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          {printed ? "PDF saved ✓" : "Print-ready PDF"}
        </button>
        <button
          type="button"
          onClick={printNow}
          title="Opens the print-ready bib in a new tab and starts the print dialog"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-hairline hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors eyebrow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
            <polyline points="9 18 12 21 15 18" />
          </svg>
          {printOpened ? "Print dialog opened ✓" : "Print now"}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Print-ready PDF: US Letter, pure black on white, cut line and pin marks included.

      </p>

    </div>
  );
}

function ticketShort(t: string): string {
  // keep the visible ticket label compact for the bib
  if (!t) return "Community entry";
  return t.length > 32 ? t.slice(0, 31) + "…" : t;
}

function RunTakomaOnePager() {
  useScrollReveal();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState<
    | null
    | {
        name: string;
        email?: string;
        ticket: string;
        waiverAccepted?: boolean;
        tosAccepted?: boolean;
        confirmedAt?: string;
        registrationId: string | null;
        strava: StravaAthlete | null;
        stravaStatus: "idle" | "denied" | "error";
      }
  >(null);
  const [resendState, setResendState] = useState<
    { status: "idle" | "sending" | "sent" | "rate_limited" | "error"; message?: string }
  >({ status: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [openChapter, setOpenChapter] = useState<null | 0 | 1 | 2>(null);

  // On mount, detect Strava OAuth return via query string and hydrate the success state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const strava = params.get("strava");
    const rid = params.get("rid");
    if (!strava || !rid) {
      // No Strava callback — restore last registration from localStorage if present.
      try {
        const raw = localStorage.getItem("rtwl-last-submitted");
        if (raw) {
          const prev = JSON.parse(raw);
          if (prev && typeof prev === "object" && prev.name && prev.ticket) {
            setSubmitted((s) => s ?? prev);
          }
        }
      } catch {}
      return;
    }


    // Clean the URL so a refresh doesn't re-trigger this.
    const clean = new URL(window.location.href);
    clean.searchParams.delete("strava");
    clean.searchParams.delete("rid");
    clean.searchParams.delete("reason");
    window.history.replaceState({}, "", clean.pathname + clean.search + "#register");

    (async () => {
      try {
        const res = await fetch(`/api/public/strava/status?rid=${encodeURIComponent(rid)}`);
        if (!res.ok) throw new Error("status failed");
        const data = (await res.json()) as {
          name: string;
          ticket: string;
          strava: StravaAthlete | null;
        };
        setSubmitted({
          name: data.name,
          ticket: data.ticket,
          registrationId: rid,
          strava: data.strava,
          stravaStatus: strava === "denied" ? "denied" : strava === "ok" ? "idle" : "error",
        });
      } catch {
        setSubmitted((s) => s ?? {
          name: "runner",
          ticket: "5k",
          registrationId: rid,
          strava: null,
          stravaStatus: strava === "denied" ? "denied" : "error",
        });
      }
    })();
  }, []);

  function validateField<K extends keyof FormState>(key: K, value: FormState[K]): string | null {
    const shape = (registrationSchema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape;
    const fieldSchema = shape[key as string];
    if (!fieldSchema) return null;
    const result = fieldSchema.safeParse(value);
    return result.success ? null : result.error.issues[0]?.message ?? "Invalid value";
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Re-validate live once the field has been touched (or for instant-choice fields).
    setErrors((prev) => {
      const shouldValidate = touched[key as string] || key === "ticket" || key === "waiver" || key === "tos";
      if (!shouldValidate) {
        if (!prev[key as string]) return prev;
        const { [key as string]: _drop, ...rest } = prev;
        return rest;
      }
      const msg = validateField(key, value);
      const next = { ...prev };
      if (msg) next[key as string] = msg;
      else delete next[key as string];
      return next;
    });
  }

  function handleBlur<K extends keyof FormState>(key: K) {
    setTouched((t) => (t[key as string] ? t : { ...t, [key as string]: true }));
    const msg = validateField(key, form[key]);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[key as string] = msg;
      else delete next[key as string];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setTouched({ name: true, email: true, ticket: true, waiver: true, tos: true });
      setShowSummary(true);
      // Focus first invalid field for keyboard/screen-reader users.
      const order = ["name", "email", "ticket", "waiver", "tos"];
      const firstBad = order.find((k) => next[k]);
      if (firstBad && typeof document !== "undefined") {
        const el = document.getElementById(firstBad) as HTMLElement | null;
        el?.focus();
      }
      return;
    }
    setShowSummary(false);
    setSubmitting(true);
    try {
      const key = "rtwl-registrations";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      existing.push({ ...parsed.data, ts: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));

      let registrationId: string | null = null;
      let serverRejected = false;
      try {
        const res = await fetch("/api/public/rtwl-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const payload = (await res.json().catch(() => ({}))) as {
          registrationId?: string | null;
          fieldErrors?: Record<string, string>;
          error?: string;
        };
        if (res.status === 400 && payload.fieldErrors) {
          // Server rejected input — surface field errors inline and keep form values.
          setErrors(payload.fieldErrors);
          setTouched({ name: true, email: true, ticket: true, waiver: true, tos: true });
          setShowSummary(true);
          serverRejected = true;
        } else if (!res.ok) {
          console.warn("Registration email request failed", payload);
        } else {
          registrationId = payload.registrationId ?? null;
        }
      } catch (err) {
        console.warn("Registration email request errored", err);
      }

      if (serverRejected) return;

      const nextSubmitted = {
        name: parsed.data.name,
        email: parsed.data.email,
        ticket: parsed.data.ticket,
        waiverAccepted: parsed.data.waiver,
        tosAccepted: parsed.data.tos,
        confirmedAt: new Date().toISOString(),
        registrationId,
        strava: null,
        stravaStatus: "idle" as const,
      };
      setSubmitted(nextSubmitted);
      try {
        localStorage.setItem("rtwl-last-submitted", JSON.stringify(nextSubmitted));
      } catch {}

      setForm(initialForm);
      setErrors({});
      setTouched({});

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      {/* Paper grain / vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 15%, oklch(0.34 0.045 165 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 85%, oklch(0.60 0.15 32 / 0.14), transparent 55%)",
        }}
      />

      <SiteNav />



      {/* HERO — group finisher photo + Run #02 call */}
      <HeroGroup />
      <PressBar />
      {/* RECAP — official event recap video + final stats */}
      <section
        id="recap"
        aria-labelledby="recap-heading"
        className="relative z-10 mx-auto max-w-6xl px-5 pb-14 sm:px-6 sm:pb-20"
      >
        <RuledLabel>The Recap</RuledLabel>
        <h2
          id="recap-heading"
          className="mt-4 text-center display-tight text-4xl sm:text-6xl leading-[0.9]"
        >
          <span className="text-forest">WE RAN </span>
          <span className="text-terracotta">TAKOMA</span>
          <span className="block brush-script text-forest text-4xl sm:text-5xl mt-2">
            with love <span aria-hidden className="text-terracotta">♡</span>
          </span>
        </h2>

        <div className="relative mx-auto mt-8 max-w-4xl">
          <div
            aria-hidden
            className="absolute -inset-2 -z-10 sm:-inset-3"
            style={{ backgroundColor: "var(--color-terracotta)", transform: "rotate(0.8deg)" }}
          />
          <video
            className="block w-full border-2 border-ink bg-ink"
            src={recapVideo.url}
            poster={imageAtLeast(recapPoster.url, 960)}
            controls
            playsInline
            preload="metadata"
            aria-label="Run Takoma With Love 5K official recap video"
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
          {[
            { n: "248", u: "signed up" },
            { n: "98", u: "finished" },
            { n: "5K", u: "one loop" },
            { n: "1", u: "neighborhood" },
          ].map((s) => (
            <div
              key={s.u}
              className="ink-card ink-card-hover p-4 sm:p-5 text-center"
            >
              <p className="display-tight text-5xl sm:text-6xl text-terracotta leading-none">
                {s.n}
              </p>
              <p className="eyebrow mt-2 text-forest">{s.u}</p>
            </div>
          ))}
        </div>
        <PhotoGallery photos={EVENT_PHOTOS} />
        <p className="mt-6 text-center display-tight tracking-[0.14em] text-forest">
          DO HARD THINGS TOGETHER
        </p>
      </section>

      <ArtistQuotes />

      <Run2Hub />
      <ShakeAndShip />
      <Run2Course />
      <section
        aria-label="Partners"
        className="relative z-10 mx-auto mb-14 max-w-4xl px-5 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-ink/30" />
          <p className="eyebrow shrink-0 text-ink-soft">In partnership with</p>
          <span aria-hidden className="h-px flex-1 bg-ink/30" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5">
          {[
            { src: smartwaterLogo.url, alt: "Glacéau smartwater", bg: "#EAF0FB", accent: "#1E3FAE", label: "Hydration partner", blend: true },
            { src: mocoParksLogo.url, alt: "Montgomery Parks, M-NCPPC", bg: "#EEF5EC", accent: "#1F7A3A", label: "Parks partner", blend: false },
          ].map((p) => (
            <div key={p.alt} className="ink-card ink-card-hover relative flex flex-col overflow-hidden" style={{ backgroundColor: p.bg }}>
              <div aria-hidden className="h-1.5 sm:h-2" style={{ backgroundColor: p.accent }} />
              <div className="flex aspect-square items-center justify-center p-4 sm:aspect-auto sm:h-44 sm:p-6">
                <img src={p.src} alt={p.alt} className="max-h-full w-full max-w-[150px] object-contain sm:max-h-32 sm:w-auto sm:max-w-none" style={p.blend ? { mixBlendMode: "multiply" } : undefined} loading="lazy" />
              </div>
              <p className="mt-auto border-t-2 border-ink bg-paper-warm px-2 py-2 text-center display-tight text-[0.72rem] tracking-[0.12em] sm:text-sm sm:tracking-[0.14em]" style={{ color: p.accent }}>
                {p.label}
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-6 ink-card p-5 text-center sm:mt-8 sm:p-7">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2 bg-terracotta px-3 py-1 eyebrow text-[color:var(--color-terracotta-ink)]">
            Run #02 · Dec 2026
          </span>
          <p className="mt-2 display-tight text-3xl leading-none text-forest">YOUR BRAND HERE?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft sm:text-base">Fuel the community at the start line for Run #02.</p>
          <a
            href="/partners"
            className="brush-btn mt-4 inline-flex min-h-14 w-full sm:w-auto items-center justify-center px-6 py-4 display-tight text-base sm:text-lg tracking-[0.1em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta active:translate-y-px transition-colors"
          >
            PARTNER WITH US FOR RUN #02
          </a>
        </div>
        <PartnerQA />
      </section>



      {/* Marquee ticker — infinite scrolling love */}
      <section
        aria-hidden
        className="relative z-10 overflow-hidden border-y-2 border-ink bg-paper-warm py-4"
      >
        <div className="marquee-track whitespace-nowrap display-tight text-2xl sm:text-3xl tracking-[0.18em] text-forest">
          {Array.from({ length: 2 }).map((_, block) => (
            <span key={block} className="inline-flex items-center gap-12">
              <span>RUN TAKOMA</span>
              <span className="heart-pulse text-terracotta">♡</span>
              <span className="brush-script text-terracotta text-4xl sm:text-5xl">with love</span>
              <span className="heart-pulse text-terracotta">♡</span>
              <span>RUN #02 · COMING SOON</span>
              <span className="heart-pulse text-terracotta">♡</span>
              <span>DO HARD THINGS TOGETHER</span>
              <span className="heart-pulse text-terracotta">♡</span>
              <span>TAKOMA PARK, MD</span>
              <span className="heart-pulse text-terracotta">♡</span>
            </span>
          ))}
        </div>
      </section>

      {/* Torn terracotta ribbon */}
      <section
        className="relative z-10 py-6"
        style={{
          backgroundColor: "var(--color-terracotta)",
          color: "var(--color-terracotta-ink)",
          clipPath:
            "polygon(0 22%, 4% 8%, 12% 18%, 22% 4%, 34% 14%, 46% 2%, 58% 16%, 70% 6%, 82% 18%, 92% 4%, 100% 20%, 100% 100%, 0 100%)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-6 px-6 pt-4">
          <span aria-hidden className="serif-italic text-2xl text-forest">♡</span>
          <p className="display-tight text-sm sm:text-base tracking-[0.32em] text-center">
            COMMUNITY. &nbsp; MOVEMENT. &nbsp; TAKOMA.
          </p>
          <span aria-hidden className="serif-italic text-2xl text-forest">♡</span>
        </div>
      </section>

      {/* HOW WE GOT HERE — condensed story with link to full /story */}

      <section
        id="story"
        className="relative z-10 mx-auto max-w-5xl px-5 pt-14 pb-6 sm:px-6 sm:pt-20"
      >
        <div className="flex flex-col items-center text-center">
          <RuledLabel>The story</RuledLabel>
          <h2 className="mt-4 display-tight text-4xl sm:text-6xl leading-[0.9]">
            <span className="text-forest">How we </span>
            <span className="brush-script text-terracotta">got here</span>
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            A love letter to a neighborhood — and the run that turned it into
            a Sunday morning ritual.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {CHAPTERS.map((ch, i) => (
            <li
              key={ch.number}
              data-reveal
              style={{ transitionDelay: `${i * 120}ms` }}
              className="reveal-on-scroll ink-card ink-card-hover p-6 sm:p-7 flex flex-col"
            >
              <p className="eyebrow text-terracotta">Chapter {ch.number}</p>
              <h3 className="mt-2 display-tight text-2xl text-forest leading-tight">
                {ch.title}
              </h3>
              <p className="mt-3 text-ink-soft">{ch.teaser}</p>
              <button
                type="button"
                onClick={() => setOpenChapter(i as 0 | 1 | 2)}
                className="mt-4 self-start inline-flex items-center gap-1 eyebrow text-forest hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                aria-haspopup="dialog"
              >
                Read more <span aria-hidden>→</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/story"
            className="brush-btn inline-flex items-center justify-center px-8 py-4 display-tight text-base tracking-[0.14em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors"
          >
            READ THE FULL STORY
          </Link>
          <p className="eyebrow text-ink-soft">
            The album · the friendship · the route
          </p>
        </div>

        <ChapterModal
          chapter={openChapter !== null ? CHAPTERS[openChapter] : null}
          onClose={() => setOpenChapter(null)}
        />
      </section>





      {/* REGISTRATION FORM */}
      {submitted && (
      <section
        id="register"
        className="relative z-10 mx-auto max-w-2xl px-5 pb-32 sm:px-6 sm:pb-24 scroll-mt-4 sm:scroll-mt-16"
      >
        <div className="ink-card relative p-5 sm:p-8 md:p-10">

          <RuledLabel>Registration</RuledLabel>
          <h2 className="mt-4 display-tight text-4xl sm:text-5xl">
            <span className="text-forest">Grab your </span>
            <span className="brush-script text-terracotta text-5xl sm:text-6xl">bib</span>
            <span className="text-forest">.</span>
          </h2>
          <p className="mt-3 text-ink-soft">
            All finishers get a BIB packet. <span className="text-terracotta" aria-hidden>♡</span>
          </p>

          {/* Trust strip — GoFundMe/Stripe-style reassurance */}
          {!submitted && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="trust-chip">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-forest" />
                Free to enter
              </span>
              <span className="trust-chip">
                <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="10" rx="1.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Secure form
              </span>
              <span className="trust-chip">
                <span aria-hidden>⏱</span>
                Under 60 seconds
              </span>
            </div>
          )}


          {submitted ? (
            <div
              role="status"
              className="card-lift relative mt-8 overflow-hidden border-2 border-forest bg-paper p-6"
            >
              {/* Confetti heart burst */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
                <span className="heart-burst" style={{ ["--dx" as string]: "-60px", ["--dy" as string]: "-30px", animationDelay: "0ms", fontSize: "1.25rem" }}>♡</span>
                <span className="heart-burst" style={{ ["--dx" as string]: "-20px", ["--dy" as string]: "-50px", animationDelay: "120ms", fontSize: "1rem" }}>♡</span>
                <span className="heart-burst" style={{ ["--dx" as string]: "20px", ["--dy" as string]: "-46px", animationDelay: "240ms", fontSize: "1.1rem" }}>♡</span>
                <span className="heart-burst" style={{ ["--dx" as string]: "60px", ["--dy" as string]: "-28px", animationDelay: "360ms", fontSize: "0.9rem" }}>♡</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-[color:var(--color-forest-ink)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <p className="eyebrow text-terracotta">You're in <span aria-hidden>♡</span></p>
              </div>
              <p className="mt-3 display-tight text-2xl">
                <span className="text-forest">See you Sunday, </span>
                <span className="brush-script text-terracotta text-3xl">{submitted.name.split(" ")[0]}</span>
                <span className="text-forest">.</span>
              </p>

              <p className="mt-2 text-ink-soft">
                We saved your spot for the{" "}
                <span className="font-semibold text-ink">
                  {ticketLabel(submitted.ticket)}
                </span>{" "}
                entry. A confirmation is on its way to your inbox.
              </p>

              {/* Shareable race bib */}
              <BibCard
                name={submitted.name}
                registrationId={submitted.registrationId}
                ticket={ticketLabel(submitted.ticket)}
              />

              {/* Receipt-style summary */}
              <div className="mt-6 border border-dashed border-forest/60 bg-[color:var(--color-paper)] p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="eyebrow text-forest">Registration receipt</p>
                  <p className="eyebrow text-ink-soft">
                    #{(submitted.registrationId ?? "pending").slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <p className="mt-3 display-tight text-xl leading-tight text-ink">
                  Run Takoma With Love 5K
                </p>
                <p className="text-ink-soft text-sm">
                  Sunday, August 2, 2026 · 9:00 AM · Takoma Park, MD
                </p>

                <dl className="mt-4 divide-y divide-hairline text-sm">
                  <ReceiptRow label="Name" value={submitted.name} />
                  {submitted.email && <ReceiptRow label="Email" value={submitted.email} />}
                  <ReceiptRow label="Event" value="Run Takoma With Love 5K" />
                  <ReceiptRow label="Date" value="Sun, Aug 2, 2026 · 9:00 AM" />
                  <ReceiptRow label="Location" value="Takoma Park, MD" />
                  <ReceiptRow
                    label="Ticket"
                    value={ticketLabel(submitted.ticket)}
                    emphasize
                  />
                  <ReceiptRow
                    label="Price"
                    value="Community — pay what moves you at check-in"
                  />
                  {typeof submitted.waiverAccepted === "boolean" && (
                    <ReceiptRow
                      label="Waiver"
                      value={submitted.waiverAccepted ? "Accepted ✓" : "Not on file"}
                    />
                  )}
                  {typeof submitted.tosAccepted === "boolean" && (
                    <ReceiptRow
                      label="Terms of Service"
                      value={submitted.tosAccepted ? "Accepted ✓" : "Not on file"}
                    />
                  )}
                  {submitted.confirmedAt && (
                    <ReceiptRow
                      label="Confirmed"
                      value={new Date(submitted.confirmedAt).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    />
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={downloadEventIcs}
                    className="brush-btn inline-flex items-center justify-center px-5 py-3 display-tight text-sm tracking-[0.12em] bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors"
                  >
                    + ADD TO CALENDAR
                  </button>
                  <span className="text-xs text-ink-soft">
                    Downloads an .ics file for Apple, Google & Outlook.
                  </span>
                </div>

                <p className="mt-4 text-xs text-ink-soft">
                  Keep this for your records. Present your name at check-in — we'll
                  have your BIB packet ready.
                </p>
              </div>


              {/* Strava connect / personalized CTA */}
              <div className="mt-6 border-t border-hairline pt-6">
                {submitted.strava ? (
                  <>
                    <p className="eyebrow text-forest">Strava connected</p>
                    <div className="mt-3 flex items-center gap-3">
                      {submitted.strava.profile ? (
                        <img
                          src={submitted.strava.profile}
                          alt=""
                          className="h-10 w-10 rounded-full border border-hairline"
                        />
                      ) : null}
                      <p className="text-ink">
                        Linked as{" "}
                        <span className="font-semibold">
                          {submitted.strava.firstname ?? submitted.strava.username ?? "athlete"}
                        </span>
                        {submitted.strava.username ? (
                          <span className="text-ink-soft"> · @{submitted.strava.username}</span>
                        ) : null}
                        .
                      </p>
                    </div>
                    <p className="mt-3 text-ink-soft text-sm">
                      One tap to join the club on Strava — you'll finish the join
                      in the Strava app.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={STRAVA_CLUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 display-tight tracking-[0.08em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors"
                      >
                        Join GRYT Run Club on Strava
                      </a>
                      <a
                        href={STRAVA_EVENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 display-tight tracking-[0.08em] border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
                      >
                        RSVP to race day on Strava
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-terracotta">Optional · Strava</p>
                    <p className="mt-2 text-ink">
                      Connect Strava so we can add your athlete profile to the
                      race roster and give you a one-tap join for the club.
                    </p>
                    {submitted.stravaStatus === "denied" && (
                      <p className="mt-2 text-sm text-terracotta">
                        You cancelled the Strava connect. You can still join the
                        club manually below.
                      </p>
                    )}
                    {submitted.stravaStatus === "error" && (
                      <p className="mt-2 text-sm text-terracotta">
                        Something went wrong linking your Strava account. Try
                        again or join the club manually.
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {submitted.registrationId ? (
                        <a
                          href={`/api/public/strava/start?rid=${encodeURIComponent(submitted.registrationId)}`}
                          className="inline-flex items-center justify-center px-6 py-3 display-tight tracking-[0.08em] bg-[#FC4C02] text-white hover:opacity-90 transition-opacity"
                        >
                          Connect Strava
                        </a>
                      ) : null}
                      <a
                        href={STRAVA_CLUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 display-tight tracking-[0.08em] border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
                      >
                        Join the club manually
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  disabled={
                    resendState.status === "sending" ||
                    resendState.status === "sent" ||
                    resendState.status === "rate_limited"
                  }
                  onClick={async () => {
                    if (!submitted) return;
                    setResendState({ status: "sending" });
                    try {
                      const res = await fetch("/api/public/rtwl-resend", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ registrationId: submitted.registrationId }),
                      });
                      const payload = (await res.json().catch(() => ({}))) as { error?: string };
                      if (res.status === 429) {
                        setResendState({
                          status: "rate_limited",
                          message:
                            payload.error ??
                            "You just requested one. Please wait about a minute before trying again.",
                        });
                        // Auto-clear after 60s so the user can try again.
                        setTimeout(() => {
                          setResendState((s) =>
                            s.status === "rate_limited" ? { status: "idle" } : s,
                          );
                        }, 60_000);
                      } else if (!res.ok) {
                        setResendState({
                          status: "error",
                          message: payload.error ?? "Something went wrong. Please try again.",
                        });
                      } else {
                        setResendState({ status: "sent" });
                      }
                    } catch {
                      setResendState({
                        status: "error",
                        message: "Network error — check your connection and try again.",
                      });
                    }
                  }}
                  className="eyebrow underline underline-offset-4 hover:text-terracotta disabled:opacity-50 disabled:no-underline"
                >
                  {resendState.status === "sending"
                    ? "Sending…"
                    : resendState.status === "sent"
                      ? "Sent ✓ — check your inbox"
                      : resendState.status === "rate_limited"
                        ? "Please wait a minute…"
                        : "Didn't get the email? Resend it"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setResendState({ status: "idle" });
                  }}
                  className="eyebrow underline underline-offset-4 hover:text-terracotta"
                >
                  Register another runner
                </button>
              </div>
              {resendState.status === "sent" && (
                <p className="mt-2 text-sm text-forest">
                  Confirmation email is on its way. Give it a minute, and check your spam folder just in case.
                </p>
              )}
              {resendState.status === "rate_limited" && (
                <p className="mt-2 text-sm text-ink-soft">
                  {resendState.message} To prevent spam, resends are limited to once per minute.
                </p>
              )}
              {resendState.status === "error" && (
                <p className="mt-2 text-sm text-terracotta">{resendState.message}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
              {showSummary && Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="border-2 border-terracotta bg-terracotta/10 px-4 py-3 text-sm text-ink"
                >
                  <p className="display-tight tracking-wider text-terracotta">
                    Please fix the fields below
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-ink-soft">
                    {["name", "email", "ticket", "waiver", "tos"].map((k) =>
                      errors[k] ? <li key={k}>{errors[k]}</li> : null,
                    )}
                  </ul>
                </div>
              )}

              <Field
                label="Full name"
                htmlFor="name"
                error={errors.name}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  maxLength={100}
                  className={inputCls(!!errors.name)}
                  placeholder="Nick Merich"
                />
              </Field>

              <Field
                label="Email"
                htmlFor="email"
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  maxLength={255}
                  className={inputCls(!!errors.email)}
                  placeholder="you@grytrun.com"
                />
              </Field>

              <Field label="Ticket" htmlFor="ticket" error={errors.ticket}>
                <div
                  className="grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-label="Ticket type"
                  aria-invalid={!!errors.ticket}
                  aria-describedby={errors.ticket ? "ticket-error" : undefined}
                >
                  {(
                    [
                      { v: "5k", label: "5K", sub: "Runner" },
                      { v: "walker", label: "Walker", sub: "" },
                      { v: "supporter", label: "Support", sub: "" },
                    ] as const
                  ).map((opt, i) => {
                    const active = form.ticket === opt.v;
                    return (
                      <label
                        key={opt.v}
                        className={`cursor-pointer border-2 px-2 py-3 text-center display-tight text-sm sm:text-base tracking-wider transition-colors ${
                          active
                            ? "border-forest bg-forest text-forest-ink"
                            : errors.ticket
                              ? "border-terracotta hover:bg-ink hover:text-paper"
                              : "border-ink hover:bg-ink hover:text-paper"
                        }`}
                      >
                        <input
                          id={i === 0 ? "ticket" : undefined}
                          type="radio"
                          name="ticket"
                          value={opt.v}
                          checked={active}
                          onChange={() => update("ticket", opt.v)}
                          className="sr-only"
                        />
                        {opt.label}
                        {opt.sub && (
                          <span className="hidden sm:inline"> {opt.sub}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </Field>


              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="waiver"
                    type="checkbox"
                    checked={form.waiver}
                    onChange={(e) => update("waiver", e.target.checked)}
                    aria-invalid={!!errors.waiver}
                    aria-describedby={errors.waiver ? "waiver-error" : undefined}
                    className={`mt-1 h-5 w-5 accent-[color:var(--color-forest)] border-2 ${errors.waiver ? "border-terracotta" : "border-ink"}`}
                  />
                  <span className="text-sm text-ink-soft">
                    I accept the{" "}
                    <span className="font-semibold text-ink">
                      GRYT Club participant waiver
                    </span>{" "}
                    and understand that running is a physical activity with
                    inherent risks. I'm here on my own recognizance to do hard
                    things, together.
                  </span>
                </label>
                {errors.waiver && (
                  <p id="waiver-error" className="mt-2 text-sm text-terracotta">
                    {errors.waiver}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="tos"
                    type="checkbox"
                    checked={form.tos}
                    onChange={(e) => update("tos", e.target.checked)}
                    aria-invalid={!!errors.tos}
                    aria-describedby={errors.tos ? "tos-error" : undefined}
                    className={`mt-1 h-5 w-5 accent-[color:var(--color-forest)] border-2 ${errors.tos ? "border-terracotta" : "border-ink"}`}
                  />
                  <span className="text-sm text-ink-soft">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline decoration-terracotta underline-offset-4"
                    >
                      Terms of Service
                    </a>
                    .
                  </span>
                </label>
                {errors.tos && (
                  <p id="tos-error" className="mt-2 text-sm text-terracotta">
                    {errors.tos}
                  </p>
                )}
              </div>



              <button
                type="submit"
                disabled={submitting}
                className="brush-btn w-full display-tight text-lg tracking-[0.1em] py-5 bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-3"
              >
                {submitting && <span className="spinner" aria-hidden />}
                {submitting ? "Signing you up…" : "LOCK IN MY SPOT ♡"}
              </button>
              <p className="mt-3 text-center text-xs text-ink-soft">
                No payment required. You'll get a confirmation email within a minute.
              </p>

            </form>
          )}
        </div>
      </section>
      )}

      <section aria-labelledby="past-runs" className="relative z-10 mx-auto max-w-5xl px-5 py-14 sm:px-6">
        <RuledLabel>Past runs</RuledLabel>
        <h2 id="past-runs" className="sr-only">Past runs</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Link to="/takoma" className="ink-card ink-card-hover block p-6">
            <p className="eyebrow text-terracotta">08.02.26 · Takoma Park, MD</p>
            <p className="mt-2 display-tight text-4xl text-forest">Run Takoma With Love</p>
            <p className="mt-2 text-ink-soft">98 finishers</p>
          </Link>
          <Link to="/artists" className="block border-2 border-dashed border-ink/50 p-6 transition-colors hover:border-terracotta">
            <p className="eyebrow text-ink-soft">Next up</p>
            <p className="mt-2 display-tight text-4xl text-ink-soft">Your city next?</p>
            <p className="mt-2 text-ink-soft">Bring a run to your neighborhood.</p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="doors" className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-6">
        <RuledLabel>Find your door</RuledLabel>
        <h2 id="doors" className="sr-only">Find your door</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            { k: "For runners", t: "Join the list", b: "Free. Every pace welcome.", href: "/#run2" },
            { k: "For brands", t: "Partner with us", b: "Meet the community face to face.", href: "/partners" },
            { k: "For artists", t: "Host a run", b: "Your album. Your neighborhood.", href: "/artists" },
          ].map((d) => (
            <a key={d.k} href={d.href} className="ink-card ink-card-hover block p-6">
              <p className="eyebrow text-terracotta">{d.k}</p>
              <p className="mt-2 display-tight text-3xl text-forest">{d.t}</p>
              <p className="mt-2 text-ink-soft">{d.b}</p>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="closing-title" className="relative z-10 isolate overflow-hidden border-t border-hairline bg-paper-warm">
        <TakomaStreetGrid />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="eyebrow text-terracotta">Run #02 · Early December 2026</p>
          <h2 id="closing-title" className="display-tight mt-3 text-5xl sm:text-7xl">
            Do hard things <span className="brush-script text-terracotta normal-case">together</span>
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div>
              <p className="eyebrow text-ink-soft">01 · The opportunity</p>
              <h3 className="display-tight mt-2 text-3xl">100 bibs. One neighborhood.</h3>
              <p className="mt-3 text-ink-soft leading-relaxed">
                Run #02 is coming to Takoma Park this December. Free for runners, built with local partners. Grab a spot on the list or bring your brand to the start line.
              </p>
            </div>
            <div>
              <p className="eyebrow text-ink-soft">02 · The value</p>
              <h3 className="display-tight mt-2 text-3xl">248 signed up. 98 finished.</h3>
              <p className="mt-3 text-ink-soft leading-relaxed">
                Run #01 filled fast with every pace and every experience level, walkers included. Partners met a real community face to face, at the shelter and on the field, long after the finish.
              </p>
            </div>
            <div>
              <p className="eyebrow text-ink-soft">03 · The story</p>
              <h3 className="display-tight mt-2 text-3xl">A hang with a 5K in the middle.</h3>
              <p className="mt-3 text-ink-soft leading-relaxed">
                Not a race with splits and podiums. We're here to love Takoma and each other; the run is just the excuse. Food, games, music, and we leave the park better than we found it.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a href="#run2" className="brush-btn display-tight text-lg tracking-[0.1em] px-8 py-4 bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors text-center">
              Join the Run #02 list
            </a>
            <a href="/story" className="display-tight text-lg tracking-[0.1em] px-8 py-4 border border-hairline hover:bg-ink hover:text-paper transition-colors text-center">
              Read the full story
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 pb-28 text-center sm:flex-row sm:justify-between sm:pb-8 sm:text-left">
          <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-4">
              <a href="/story" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                The Story
              </a>
              <a href="/terms" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                Terms
              </a>
              <a href="/privacy" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                Privacy
              </a>
              <a href="/accessibility" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                Accessibility
              </a>
            </div>
            <p className="eyebrow text-ink-soft">grytrun.com · @grytrunclub</p>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/grytrunclub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GRYT Run Club on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-terracotta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com/grytrunclub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GRYT Run Club on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-terracotta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      <div className="px-5 pb-8"><AuditFooterLinks /></div>
      </footer>


      {/* Sticky mobile CTA — hidden once the user has registered */}
      {!submitted && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/95 backdrop-blur-md px-4 pt-3 lg:hidden shadow-[0_-12px_30px_-12px_oklch(0.20_0.01_60/0.25)]"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <a
            href="#run2"
            className="brush-btn flex w-full items-center justify-center gap-2 text-center display-tight text-base tracking-[0.14em] py-4 bg-terracotta text-[color:var(--color-terracotta-ink)] active:scale-[0.99] transition-transform"
          >
            RUN #02 LIST · FREE
          </a>
          <p className="mt-1.5 text-center text-[0.65rem] tracking-[0.14em] uppercase text-ink-soft">
            Runners and brands, 30 seconds
          </p>
        </div>
      )}

    </main>

  );
}

/* --- helpers --- */

// Stylized Takoma Park street map: square blocks cut by the diagonal avenues and Sligo Creek.
function TakomaStreetGrid() {
  const v = Array.from({ length: 25 }, (_, i) => i * 60);
  const h = Array.from({ length: 14 }, (_, i) => i * 60);
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-forest">
      <g stroke="currentColor" fill="none" strokeOpacity="0.14" strokeWidth="1">
        {v.map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x + 40} y2="800" />)}
        {h.map((y) => <line key={`h${y}`} x1="0" y1={y} x2="1440" y2={y - 30} />)}
      </g>
      <g stroke="currentColor" fill="none" strokeOpacity="0.2" strokeLinecap="round">
        <path d="M-20 720 L760 180 L1460 -40" strokeWidth="5" />
        <path d="M120 -20 L640 420 L1180 820" strokeWidth="4" />
        <path d="M-20 300 L1460 520" strokeWidth="3" />
        <path d="M980 -20 C 900 160, 1060 280, 960 420 S 1020 680, 900 820" strokeWidth="6" strokeOpacity="0.22" />
      </g>
    </svg>
  );
}

function ticketLabel(v: string) {
  if (v === "5k") return "5K Runner";
  if (v === "walker") return "Walker";
  return "Supporter";
}

function ReceiptRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="eyebrow text-ink-soft shrink-0">{label}</dt>
      <dd
        className={
          emphasize
            ? "text-right font-semibold text-terracotta"
            : "text-right text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}



function inputCls(hasError: boolean) {
  return [
    "field-focus w-full border-2 bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/60",
    "focus:outline-none",
    hasError ? "border-terracotta" : "border-ink",
  ].join(" ");
}


function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow block mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="mt-1.5 text-sm text-terracotta"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function RuledLabel({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "lg-left";
}) {
  const justify =
    align === "lg-left" ? "justify-center lg:justify-start" : "justify-center";
  return (
    <div className={`flex items-center gap-3 ${justify}`}>
      <span className="h-px w-10 bg-ink" />
      <span className="eyebrow">{children}</span>
      <span className="h-px w-10 bg-ink" />
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink/50" />;
}

function SmartwaterLogo() {
  return (
    <span
      role="img"
      aria-label="smartwater"
      className="text-4xl sm:text-5xl tracking-tight text-ink"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      <span className="font-light">smart</span>
      <span className="font-bold">water</span>
    </span>
  );
}

function MontgomeryParksLogo() {
  return (
    <span role="img" aria-label="Montgomery Parks" className="flex items-center gap-3 text-forest">
      <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden fill="currentColor">
        <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 8c-6 5-9 10-9 15 0 4 2.5 7 6 8v6h6v-6c3.5-1 6-4 6-8 0-5-3-10-9-15z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight">Montgomery</span>
        <span className="text-lg sm:text-xl font-semibold tracking-[0.2em] uppercase">Parks</span>
      </span>
    </span>
  );
}

function PartnerMark({ label, bold = false }: { label: string; bold?: boolean }) {
  return (
    <span
      className={`text-ink ${bold ? "font-black" : "font-semibold"} tracking-tight text-lg`}
    >
      {label}
    </span>
  );
}

function Feature({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <article className="text-center sm:text-left">
      <p className="eyebrow text-terracotta">{kicker}</p>
      <h3 className="mt-3 display-tight text-2xl text-forest">{title}</h3>
      <p className="mt-3 text-ink-soft leading-relaxed">{body}</p>
    </article>
  );
}


const EVENT_TS = new Date("2026-08-02T09:00:00-04:00").getTime();


function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, EVENT_TS - (now ?? EVENT_TS));
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const started = diff === 0;

  // Screen-reader announcement: update at a human cadence, not every second.
  // Announce hourly when far out, every 15 minutes within a day, every minute
  // in the final hour, and once when the race starts. Never per-second.
  const announcement = started
    ? "The race has started. Have a beautiful run."
    : days > 0
      ? `${days} day${days === 1 ? "" : "s"} and ${hours} hour${hours === 1 ? "" : "s"} until the start line.`
      : hours > 0
        ? `${hours} hour${hours === 1 ? "" : "s"} and ${minutes} minute${minutes === 1 ? "" : "s"} until the start line.`
        : `${minutes} minute${minutes === 1 ? "" : "s"} until the start line.`;

  const announceKey = started
    ? "started"
    : days > 0
      ? `d-${days}-h-${hours}`
      : hours > 1
        ? `h-${hours}-q-${Math.floor(minutes / 15)}`
        : `m-${hours * 60 + minutes}`;

  const [liveMessage, setLiveMessage] = useState("");
  const lastKey = useRef<string>("");
  useEffect(() => {
    if (now === null) return;
    if (lastKey.current !== announceKey) {
      lastKey.current = announceKey;
      setLiveMessage(announcement);
    }
  }, [announceKey, announcement, now]);

  return (
    <div className="border border-hairline bg-[color:var(--color-paper-warm)] px-4 py-3">
      <p className="eyebrow text-terracotta text-center lg:text-left">
        {started ? "It's race day ♡" : "Countdown to the start line"}
      </p>
      <div
        className="mt-2 grid grid-cols-4 gap-2 text-center"
        aria-hidden="true"
      >
        {[
          { label: "Days", value: days },
          { label: "Hrs", value: hours },
          { label: "Min", value: minutes },
          { label: "Sec", value: seconds },
        ].map((u) => (
          <div key={u.label} className="flex flex-col">
            <span className="display-tight text-forest text-2xl sm:text-3xl tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="eyebrow text-ink-soft text-[0.6rem] mt-1">
              {u.label}
            </span>
          </div>
        ))}
      </div>
      {/* Visually hidden polite live region — focus never moves. */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveMessage}
      </div>
    </div>
  );
}
