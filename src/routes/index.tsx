import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import flyerAsset from "@/assets/rtwl-flyer.png.asset.json";

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
      { title: "Run Takoma With Love 5K — GRYT Club" },
      {
        name: "description",
        content:
          "Run Takoma With Love 5K — Sunday, August 2, 2026 at 9:00 AM in Takoma Park, MD. Presented by GRYT in partnership with smartwater, HeNO, and Oddisee.",
      },
      { property: "og:title", content: "Run Takoma With Love 5K — GRYT Club" },
      {
        property: "og:description",
        content:
          "Run Takoma With Love 5K — Sunday, August 2, 2026 at 9:00 AM in Takoma Park, MD. Presented by GRYT in partnership with smartwater, HeNO, and Oddisee.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: flyerAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: flyerAsset.url },
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
    if (!strava || !rid) return;

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

      setSubmitted({
        name: parsed.data.name,
        email: parsed.data.email,
        ticket: parsed.data.ticket,
        waiverAccepted: parsed.data.waiver,
        tosAccepted: parsed.data.tos,
        confirmedAt: new Date().toISOString(),
        registrationId,
        strava: null,
        stravaStatus: "idle",
      });
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

      {/* Top eyebrow */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pt-6 sm:pt-8">
        <span className="eyebrow text-forest">GRYT Club · 5K Series</span>
        <div className="flex items-center gap-4">
          <ReduceMotionToggle />
          <span className="eyebrow text-terracotta hidden sm:inline">
            08 · 02 · 2026
          </span>
        </div>
      </header>


      {/* HERO — official flyer as the branding source of truth */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-5 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
        <figure className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden
            className="absolute -inset-2 -z-10 sm:-inset-3"
            style={{
              backgroundColor: "var(--color-forest)",
              transform: "rotate(-1.2deg)",
            }}
          />
          <img
            src={flyerAsset.url}
            alt="Run Takoma With Love 5K — official flyer. Presented by GRYT Club, in partnership with smartwater. Sunday August 2, 2026 at 9:00 AM in Takoma Park, Maryland."
            className="block w-full"
            width={1600}
            height={1600}
          />
        </figure>

        {/* Mobile: compact CTA under the flyer (flyer already carries the wordmark) */}
        <div className="lg:hidden text-center">
          <h1 className="sr-only">
            Run Takoma With Love 5K — Sunday August 2, 2026, Takoma Park, Maryland
          </h1>
          <a
            href="#register"
            className="brush-btn block w-full display-tight text-base tracking-[0.14em] py-5 bg-terracotta text-[color:var(--color-terracotta-ink)] active:scale-[0.99] transition-transform"
          >
            REGISTER — LOCK IN YOUR SPOT
          </a>
          <p className="mt-3 eyebrow text-forest">
            <span className="text-terracotta">♡</span> Sunday · Aug 2, 2026 · 9:00 AM <span className="text-terracotta">♡</span>
          </p>
          <div className="mt-5">
            <Countdown />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={downloadEventIcs}
              className="eyebrow text-forest underline decoration-terracotta decoration-2 underline-offset-4"
            >
              + Add to calendar (.ics)
            </button>
          </div>
        </div>

        {/* Desktop / large: full editorial block */}

        <div className="hidden lg:block text-center lg:text-left">
          <RuledLabel align="lg-left">Presented by GRYT</RuledLabel>
          <h1 className="mt-5 display-tight text-[clamp(3rem,8vw,6rem)] leading-[0.88]">
            <span className="block">
              <span className="text-forest">RUN </span>
              <span className="text-terracotta">TAKOMA</span>
            </span>
            <span className="mt-3 block brush-script text-forest text-[clamp(2.5rem,6vw,4rem)]">
              with love{" "}
              <span aria-hidden className="text-terracotta">♡</span>
            </span>
            <span className="mt-1 block text-forest">5K</span>
          </h1>

          <div className="mt-8 inline-block">
            <span className="paint-stroke inline-block bg-forest px-6 py-3 display-tight text-[color:var(--color-forest-ink)] text-lg sm:text-xl">
              Sunday · August 2, 2026 · 9:00 AM
            </span>
            <p className="mt-3 display-tight text-forest tracking-[0.12em]">
              Takoma Park, Maryland
            </p>
            <div className="mt-6 max-w-md">
              <Countdown />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow text-ink-soft">In partnership with</span>
            <PartnerMark label="smartwater" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#register"
              className="brush-btn inline-flex items-center justify-center px-10 py-5 display-tight text-lg tracking-[0.1em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors"
            >
              REGISTER | GRYTRUN.COM
            </a>
            <button
              type="button"
              onClick={downloadEventIcs}
              className="eyebrow text-forest underline decoration-terracotta decoration-2 underline-offset-4"
            >
              + Add to calendar (.ics)
            </button>
          </div>
        </div>
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
              <span>SUN · AUG 2 · 9AM</span>
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
          <li
            data-reveal
            style={{ transitionDelay: "0ms" }}
            className="reveal-on-scroll hover-lift card-lift border border-hairline bg-paper-warm p-6"
          >
            <p className="eyebrow text-terracotta">Chapter 01</p>
            <h3 className="mt-2 display-tight text-2xl text-forest leading-tight">
              An album dropped.
            </h3>
            <p className="mt-3 text-ink-soft">
              April 30, 2026 — Oddisee and Heno. release{" "}
              <em className="serif-italic">From Takoma With Love</em>.
              Twelve tracks written as a love letter to the block.
            </p>
          </li>
          <li
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="reveal-on-scroll hover-lift card-lift border border-hairline bg-paper-warm p-6"
          >
            <p className="eyebrow text-terracotta">Chapter 02</p>
            <h3 className="mt-2 display-tight text-2xl text-forest leading-tight">
              One listener laced up.
            </h3>
            <p className="mt-3 text-ink-soft">
              Four hundred miles away in Pittsburgh, a friend hit play, tied
              his shoes, and started sketching a 5K on the back of a napkin.
            </p>
          </li>
          <li
            data-reveal
            style={{ transitionDelay: "240ms" }}
            className="reveal-on-scroll hover-lift card-lift border border-hairline bg-paper-warm p-6"
          >
            <p className="eyebrow text-terracotta">Chapter 03</p>
            <h3 className="mt-2 display-tight text-2xl text-forest leading-tight">
              We're running it out loud.
            </h3>
            <p className="mt-3 text-ink-soft">
              August 2, 2026 — one loop through Takoma Park. Small on purpose.
              A neighborhood pace, a shared playlist, and a bib for every
              finisher.
            </p>
          </li>
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
      </section>

      {/* RUN OF SHOW — race day schedule */}

      <section
        id="run-of-show"
        className="relative z-10 mx-auto max-w-5xl px-5 pt-14 pb-6 sm:px-6 sm:pt-20"
      >
        <div className="flex flex-col items-center text-center">
          <RuledLabel>Race day</RuledLabel>
          <h2 className="mt-4 display-tight text-4xl sm:text-6xl leading-[0.9]">
            <span className="text-forest">Run of </span>
            <span className="brush-script text-terracotta text-5xl sm:text-7xl">show</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Sunday, August 2, 2026 — from first coffee to last cheer. Move at your pace.
          </p>
        </div>

        <ol className="relative mt-12 space-y-6 sm:space-y-0">
          {/* Vertical timeline spine on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-6 top-2 bottom-2 w-px bg-hairline sm:left-1/2"
          />
          {[
            { time: "7:30 AM", title: "Check-in & bib pickup", body: "Coffee's on. Grab your bib packet, pin up, warm up." },
            { time: "8:30 AM", title: "Community warm-up", body: "Group stretch on the lawn. Everyone in — walkers, runners, kids." },
            { time: "9:00 AM", title: "Start line ♡", body: "Horn goes off. Push if you want. Cruise if you want. Just move." },
            { time: "9:20 AM", title: "First finishers", body: "Cowbells, high-fives, and a very loud cheer squad." },
            { time: "10:00 AM", title: "Last finisher party", body: "The best applause is for whoever crosses last. We wait." },
            { time: "10:30 AM", title: "Block party", body: "Music, snacks, smartwater, and a group photo you'll actually want." },
          ].map((step, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={step.time}
                className={`rise-in relative sm:grid sm:grid-cols-2 sm:gap-10 ${
                  left ? "" : "sm:[&>*:first-child]:col-start-2"
                }`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div
                  className={`relative pl-14 sm:pl-0 ${
                    left ? "sm:pr-10 sm:text-right" : "sm:pl-10"
                  }`}
                >
                  {/* Dot */}
                  <span
                    aria-hidden
                    className={`absolute top-2 left-4 h-4 w-4 rounded-full border-2 border-ink bg-terracotta tick-bob sm:left-auto ${
                      left ? "sm:right-[-8px]" : "sm:left-[-8px]"
                    }`}
                  />
                  <p className="eyebrow text-terracotta">{step.time}</p>
                  <p className="mt-1 display-tight text-xl sm:text-2xl text-forest">
                    {step.title}
                  </p>
                  <p className="mt-2 text-ink-soft leading-relaxed">{step.body}</p>
                </div>
                {/* Spacer for the opposite column on desktop */}
                <div className="hidden sm:block" />
              </li>
            );
          })}
        </ol>

        {/* Stat strip — bring life */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { n: "5", u: "kilometers" },
            { n: "1", u: "loop" },
            { n: "∞", u: "high-fives" },
            { n: "0", u: "pressure" },
          ].map((s, i) => (
            <div
              key={s.u}
              className="hover-lift rise-in border-2 border-ink bg-paper-warm p-4 text-center"
              style={{ animationDelay: `${i * 80 + 400}ms` }}
            >

              <p className="display-tight text-5xl sm:text-6xl text-terracotta leading-none">
                {s.n}
              </p>
              <p className="eyebrow mt-2 text-forest">{s.u}</p>
            </div>
          ))}
        </div>
      </section>




      {/* REGISTRATION FORM */}
      <section
        id="register"
        className="relative z-10 mx-auto max-w-2xl px-5 pb-32 sm:px-6 sm:pb-24 scroll-mt-4 sm:scroll-mt-16"
      >
        <div className="card-lift relative border-2 border-ink bg-paper-warm p-5 sm:p-8 md:p-10">

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
                  placeholder="Angela Davis"
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

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 pb-28 text-center sm:flex-row sm:justify-between sm:pb-8 sm:text-left">
          <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-4">
              <a href="/story" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                The Story
              </a>
              <a href="/contact" className="eyebrow text-ink-soft hover:text-ink transition-colors">
                Contact
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
              <a
                href="https://x.com/grytrunclub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GRYT Run Club on X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-terracotta"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>


      {/* Sticky mobile CTA — hidden once the user has registered */}
      {!submitted && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/95 backdrop-blur-md px-4 pt-3 lg:hidden shadow-[0_-12px_30px_-12px_oklch(0.20_0.01_60/0.25)]"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <a
            href="#register"
            className="brush-btn flex w-full items-center justify-center gap-2 text-center display-tight text-base tracking-[0.14em] py-4 bg-terracotta text-[color:var(--color-terracotta-ink)] active:scale-[0.99] transition-transform"
          >
            REGISTER — AUG 2 ♡
          </a>
          <p className="mt-1.5 text-center text-[0.65rem] tracking-[0.14em] uppercase text-ink-soft">
            Free · Under 60 seconds · Confirmation email
          </p>
        </div>
      )}

    </main>

  );
}

/* --- helpers --- */

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

function ReduceMotionToggle() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (prefers: boolean) => {
      setReduced(prefers);
      document.documentElement.classList.toggle("motion-off", prefers);
    };
    const stored = localStorage.getItem("gryt-reduce-motion");
    apply(stored === null ? mql.matches : stored === "1");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("gryt-reduce-motion") === null) apply(e.matches);
    };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  function toggle() {
    const next = !reduced;
    setReduced(next);
    document.documentElement.classList.toggle("motion-off", next);
    localStorage.setItem("gryt-reduce-motion", next ? "1" : "0");
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      aria-label={reduced ? "Motion reduced. Activate to enable animations." : "Animations enabled. Activate to reduce motion."}
      title="Toggle motion for animations. Timer and timeline stay usable."
      className="eyebrow inline-flex items-center gap-2 border border-hairline px-2.5 py-1 text-ink-soft hover:text-terracotta hover:border-terracotta transition-colors"
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${reduced ? "bg-ink-soft" : "bg-terracotta"}`}
      />
      {reduced ? "Motion off" : "Reduce motion"}
    </button>
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
