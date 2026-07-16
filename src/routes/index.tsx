import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import flyerAsset from "@/assets/rtwl-flyer.png.asset.json";

const STRAVA_CLUB_URL = "https://www.strava.com/clubs/1708552";
const STRAVA_EVENT_URL =
  "https://www.strava.com/clubs/1708552/group_events/3512937555494892876/occurrences/FQIWmNW3loWGu8BhHBTUHxQQFAQUEhQAFAAAHBaAwvqo-GcAAA==";

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
});

type FormState = {
  name: string;
  email: string;
  ticket: "5k" | "walker" | "supporter" | "";
  waiver: boolean;
};

const initialForm: FormState = {
  name: "",
  email: "",
  ticket: "",
  waiver: false,
};

function RunTakomaOnePager() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState<
    | null
    | {
        name: string;
        ticket: string;
        registrationId: string | null;
        strava: StravaAthlete | null;
        stravaStatus: "idle" | "denied" | "error";
      }
  >(null);
  const [resendState, setResendState] = useState<
    { status: "idle" | "sending" | "sent" | "rate_limited" | "error"; message?: string }
  >({ status: "idle" });
  const [submitting, setSubmitting] = useState(false);

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
      const shouldValidate = touched[key as string] || key === "ticket" || key === "waiver";
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
      setTouched({ name: true, email: true, ticket: true, waiver: true });
      setShowSummary(true);
      // Focus first invalid field for keyboard/screen-reader users.
      const order = ["name", "email", "ticket", "waiver"];
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
          setTouched({ name: true, email: true, ticket: true, waiver: true });
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
        ticket: parsed.data.ticket,
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
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 sm:pt-8">
        <span className="eyebrow text-forest">GRYT Club · 5K Series</span>
        <span className="eyebrow text-terracotta hidden sm:inline">
          08 · 02 · 2026
        </span>
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
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow text-ink-soft">In partnership with</span>
            <PartnerMark label="smartwater" />
          </div>

          <a
            href="#register"
            className="brush-btn mt-8 inline-flex items-center justify-center px-10 py-5 display-tight text-lg tracking-[0.1em] bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors"
          >
            REGISTER | GRYTRUN.COM
          </a>
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


      {/* REGISTRATION FORM */}
      <section
        id="register"
        className="relative z-10 mx-auto max-w-2xl px-5 pb-32 sm:px-6 sm:pb-24 scroll-mt-4 sm:scroll-mt-16"
      >
        <div className="border-2 border-ink bg-paper-warm p-5 sm:p-8 md:p-10">

          <RuledLabel>Registration</RuledLabel>
          <h2 className="mt-4 display-tight text-4xl sm:text-5xl">
            <span className="text-forest">Grab your </span>
            <span className="brush-script text-terracotta text-5xl sm:text-6xl">bib</span>
            <span className="text-forest">.</span>
          </h2>
          <p className="mt-3 text-ink-soft">
            All finishers get a BIB packet. <span className="text-terracotta" aria-hidden>♡</span>
          </p>

          {submitted ? (
            <div
              role="status"
              className="mt-8 border-2 border-forest bg-paper p-6"
            >
              <p className="eyebrow text-terracotta">You're in <span aria-hidden>♡</span></p>
              <p className="mt-2 display-tight text-2xl">
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
                    {["name", "email", "ticket", "waiver"].map((k) =>
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


              <button
                type="submit"
                disabled={submitting}
                className="brush-btn w-full display-tight text-lg tracking-[0.1em] py-5 bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors disabled:opacity-60"
              >
                {submitting ? "Signing you up…" : "LOCK IN MY SPOT ♡"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 pb-28 text-center sm:flex-row sm:justify-between sm:pb-8 sm:text-left">
          <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
          <p className="eyebrow text-ink-soft">grytrun.com · @grytclub</p>
        </div>
      </footer>

      {/* Sticky mobile CTA — hidden once the user has registered */}
      {!submitted && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/95 backdrop-blur px-4 pt-3 lg:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <a
            href="#register"
            className="brush-btn block w-full text-center display-tight text-base tracking-[0.14em] py-4 bg-terracotta text-[color:var(--color-terracotta-ink)] active:scale-[0.99] transition-transform"
          >
            REGISTER — AUG 2 ♡
          </a>
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

function inputCls(hasError: boolean) {
  return [
    "w-full border-2 bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/60",
    "focus:outline-none focus:ring-0 focus:border-forest",
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
