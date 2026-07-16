import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import flyerAsset from "@/assets/rtwl-flyer.png.asset.json";

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
          "Sunday, August 2, 2026 · 9:00 AM · Takoma Park, MD. Community. Movement. Takoma.",
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
  const [submitted, setSubmitted] = useState<null | { name: string; ticket: string }>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _drop, ...rest } = e;
      return rest;
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
      return;
    }
    setSubmitting(true);
    try {
      const key = "rtwl-registrations";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      existing.push({ ...parsed.data, ts: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));

      try {
        const res = await fetch("/api/public/rtwl-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("Registration email request failed", err);
        }
      } catch (err) {
        console.warn("Registration email request errored", err);
      }

      setSubmitted({ name: parsed.data.name, ticket: parsed.data.ticket });
      setForm(initialForm);
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
        <span className="eyebrow text-ink-soft">GRYT Club · 5K Series</span>
        <span className="eyebrow text-ink-soft hidden sm:inline">
          08 · 02 · 2026
        </span>
      </header>

      {/* HERO — official flyer as the branding source of truth */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <figure className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden
            className="absolute -inset-3 -z-10"
            style={{
              backgroundColor: "var(--color-forest)",
              transform: "rotate(-1.2deg)",
            }}
          />
          <img
            src={flyerAsset.url}
            alt="Run Takoma With Love 5K — official flyer. Presented by GRYT Club, in partnership with smartwater, HeNO, and Oddisee. Sunday August 2, 2026 at 9:00 AM in Takoma Park, Maryland."
            className="block w-full"
            width={1600}
            height={1600}
          />
        </figure>

        <div className="text-center lg:text-left">
          <RuledLabel align="lg-left">Presented by GRYT</RuledLabel>
          <h1 className="mt-5 display-tight text-[clamp(3rem,8vw,5.5rem)] leading-[0.9]">
            <span className="block text-forest">RUN TAKOMA</span>
            <span className="mt-2 block serif-italic text-forest text-[clamp(2rem,5vw,3rem)] leading-none">
              with love{" "}
              <span aria-hidden className="text-terracotta">♡</span>
            </span>
            <span className="mt-2 block text-terracotta">5K</span>
          </h1>

          <div className="mt-8 inline-block border-y-2 border-ink py-4 px-2">
            <p className="display-tight text-terracotta text-lg sm:text-xl">
              Sunday · August 2, 2026 · 9:00 AM
            </p>
            <p className="mt-1 display-tight text-forest">
              Takoma Park, Maryland
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <PartnerMark label="smartwater" />
            <Dot />
            <PartnerMark label="HeNO." bold />
            <Dot />
            <PartnerMark label="Oddisee" />
          </div>

          <a
            href="#register"
            className="mt-8 inline-flex items-center justify-center px-9 py-4 display-tight text-lg tracking-[0.08em]"
            style={{
              backgroundColor: "var(--color-forest)",
              color: "var(--color-forest-ink)",
              clipPath:
                "polygon(2% 15%, 8% 0%, 30% 8%, 55% 0%, 78% 10%, 96% 0%, 100% 40%, 98% 85%, 90% 100%, 65% 92%, 40% 100%, 15% 90%, 0% 100%, 3% 55%)",
            }}
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

      {/* Supporting */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <Feature
            kicker="The Route"
            title="3.1 miles through Takoma"
            body="A flat, tree-lined loop through the old neighborhoods and back down Carroll Avenue."
          />
          <Feature
            kicker="The Vibe"
            title="Neighborhood block-party energy"
            body="DJ Oddisee at the start, HeNO. crew at the finish, coffee, pastries, kids' zone on the field."
          />
          <Feature
            kicker="The Cause"
            title="Every entry moves the block"
            body="Proceeds support youth run clubs and community fridges across Takoma Park and Silver Spring."
          />
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section
        id="register"
        className="relative z-10 mx-auto max-w-2xl px-6 pb-24 scroll-mt-16"
      >
        <div className="border-2 border-ink bg-paper-warm p-8 sm:p-10">
          <RuledLabel>Registration</RuledLabel>
          <h2 className="mt-4 display-tight text-4xl sm:text-5xl text-forest">
            Grab your bib.
          </h2>
          <p className="mt-3 text-ink-soft">
            All finishers get a hand-numbered patch. Community pricing — pay
            what moves you at check-in.
          </p>

          {submitted ? (
            <div
              role="status"
              className="mt-8 border-2 border-forest bg-paper p-6"
            >
              <p className="eyebrow text-terracotta">You're in</p>
              <p className="mt-2 display-tight text-2xl text-forest">
                See you Sunday, {submitted.name.split(" ")[0]}.
              </p>
              <p className="mt-2 text-ink-soft">
                We saved your spot for the{" "}
                <span className="font-semibold text-ink">
                  {ticketLabel(submitted.ticket)}
                </span>{" "}
                entry. A confirmation will hit your inbox before race week.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(null)}
                className="mt-5 eyebrow underline underline-offset-4 hover:text-terracotta"
              >
                Register another runner
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
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
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
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
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxLength={255}
                  className={inputCls(!!errors.email)}
                  placeholder="you@grytrun.com"
                />
              </Field>

              <Field label="Ticket" htmlFor="ticket" error={errors.ticket}>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      { v: "5k", label: "5K Runner" },
                      { v: "walker", label: "Walker" },
                      { v: "supporter", label: "Supporter" },
                    ] as const
                  ).map((opt) => {
                    const active = form.ticket === opt.v;
                    return (
                      <label
                        key={opt.v}
                        className={`cursor-pointer border-2 px-4 py-3 text-center display-tight tracking-wider transition-colors ${
                          active
                            ? "border-forest bg-forest text-forest-ink"
                            : "border-ink hover:bg-ink hover:text-paper"
                        }`}
                      >
                        <input
                          type="radio"
                          name="ticket"
                          value={opt.v}
                          checked={active}
                          onChange={() => update("ticket", opt.v)}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </Field>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.waiver}
                    onChange={(e) => update("waiver", e.target.checked)}
                    className="mt-1 h-5 w-5 accent-[color:var(--color-forest)] border-2 border-ink"
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
                  <p className="mt-2 text-sm text-terracotta">{errors.waiver}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full display-tight text-lg tracking-[0.08em] py-4 bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors disabled:opacity-60"
              >
                {submitting ? "Signing you up…" : "Lock in my spot"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="eyebrow text-ink-soft">© GRYT Club · Takoma Park, MD</p>
          <p className="eyebrow text-ink-soft">grytrun.com · @grytclub</p>
        </div>
      </footer>
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
      {error && <p className="mt-1.5 text-sm text-terracotta">{error}</p>}
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
