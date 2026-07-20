import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Run Takoma With Love 5K" },
      {
        name: "description",
        content:
          "Get in touch with GRYT Club about the Run Takoma With Love 5K — volunteering, sponsorship, press, or general questions.",
      },
      { property: "og:title", content: "Contact — Run Takoma With Love 5K" },
      {
        property: "og:description",
        content:
          "Reach the GRYT Club team about the Run Takoma With Love 5K.",
      },
    ],
  }),
  component: ContactPage,
});

const clientSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().min(2, "Add a short subject").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(4000, "Message must be under 4000 characters"),
});

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message" | "form", string>>;

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const errorRef = useRef<HTMLDivElement | null>(null);

  function setField<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const parsed = clientSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form") as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };
      if (!res.ok || !data.success) {
        setErrors({
          ...(data.fieldErrors ?? {}),
          form: data.fieldErrors ? undefined : data.error || "Could not send message.",
        });
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      setSent(true);
    } catch {
      setErrors({ form: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link to="/" className="eyebrow text-ink-soft hover:text-ink transition-colors">
          ← Back to Run Takoma
        </Link>

        <h1 className="display-tight mt-6 text-4xl sm:text-6xl leading-[0.95] uppercase">
          Get in touch
        </h1>
        <p className="mt-4 text-ink-soft">
          Questions about the run, volunteering, sponsorship, or press? Send
          us a note and the GRYT team will get back to you.
        </p>

        {sent ? (
          <div className="mt-10 border-2 border-dashed border-forest bg-white/60 p-8 text-center">
            <p className="eyebrow text-forest">MESSAGE SENT ♡</p>
            <h2 className="display-tight mt-3 text-3xl uppercase">Thanks — we've got it.</h2>
            <p className="mt-3 text-ink-soft">
              We'll reply to <strong>{values.email}</strong> as soon as we can.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setValues({ name: "", email: "", subject: "", message: "" });
                }}
                className="brush-btn bg-terracotta px-6 py-3 text-[color:var(--color-terracotta-ink)] display-tight tracking-[0.1em]"
              >
                SEND ANOTHER
              </button>
              <Link
                to="/"
                className="eyebrow self-center text-ink-soft hover:text-ink transition-colors"
              >
                ← Back home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
            {errors.form ? (
              <div
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="border border-terracotta bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
              >
                {errors.form}
              </div>
            ) : null}

            {/* honeypot */}
            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <Field
              id="c-name"
              label="Your name"
              error={errors.name}
              input={
                <input
                  id="c-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                  className="w-full border border-hairline bg-white px-4 py-3 text-ink focus:border-forest focus:outline-none"
                />
              }
            />
            <Field
              id="c-email"
              label="Email"
              error={errors.email}
              input={
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  required
                  className="w-full border border-hairline bg-white px-4 py-3 text-ink focus:border-forest focus:outline-none"
                />
              }
            />
            <Field
              id="c-subject"
              label="Subject"
              error={errors.subject}
              input={
                <input
                  id="c-subject"
                  type="text"
                  value={values.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  required
                  className="w-full border border-hairline bg-white px-4 py-3 text-ink focus:border-forest focus:outline-none"
                />
              }
            />
            <Field
              id="c-message"
              label="Message"
              error={errors.message}
              input={
                <textarea
                  id="c-message"
                  rows={6}
                  value={values.message}
                  onChange={(e) => setField("message", e.target.value)}
                  required
                  className="w-full border border-hairline bg-white px-4 py-3 text-ink focus:border-forest focus:outline-none"
                />
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="brush-btn w-full display-tight text-lg tracking-[0.1em] py-5 bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors disabled:opacity-60"
            >
              {submitting ? "Sending…" : "SEND MESSAGE ♡"}
            </button>

            <p className="text-xs text-ink-soft">
              You can also email us directly at{" "}
              <a
                href="mailto:hello@grytrun.com"
                className="underline decoration-terracotta underline-offset-4"
              >
                hello@grytrun.com
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  error,
  input,
}: {
  id: string;
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-ink-soft">
        {label}
      </label>
      {input}
      {error ? <p className="mt-1 text-xs text-terracotta">{error}</p> : null}
    </div>
  );
}
