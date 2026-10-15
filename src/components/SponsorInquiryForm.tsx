import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const PACKAGES = [
  { v: "supporter", l: "Supporter" },
  { v: "station", l: "Station" },
  { v: "presenting", l: "Presenting" },
  { v: "in-kind", l: "In-kind / product" },
  { v: "not-sure", l: "Not sure yet" },
];
const BUDGETS = [
  { v: "under-500", l: "Under $500" },
  { v: "500-1500", l: "$500 – $1,500" },
  { v: "1500-3500", l: "$1,500 – $3,500" },
  { v: "3500-plus", l: "$3,500+" },
  { v: "in-kind", l: "Product only" },
];

export const SPONSOR_LABELS = {
  package: Object.fromEntries(PACKAGES.map((p) => [p.v, p.l])) as Record<string, string>,
  budget: Object.fromEntries(BUDGETS.map((p) => [p.v, p.l])) as Record<string, string>,
};

const field = "field-focus mt-1 w-full border-2 border-ink bg-paper-warm px-3 py-3 text-base";

export function SponsorInquiryForm() {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState("station");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d) setPkg(d);
      document.getElementById("sponsor-form")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.getElementById("sp-name")?.focus({ preventScroll: true }), 400);
    };
    window.addEventListener("sponsor:pick", on);
    return () => window.removeEventListener("sponsor:pick", on);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries()) as Record<string, string>;
    body.package = pkg;
    if (!body.name || body.name.trim().length < 2) return setErr("Add your name.");
    if (!/^\S+@\S+\.\S+$/.test(body.email ?? "")) return setErr("Add a valid work email.");
    if (!body.company || body.company.trim().length < 2) return setErr("Add your brand or company.");
    setBusy(true);
    try {
      const r = await fetch("/api/public/sponsor-inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      sessionStorage.setItem("sponsor-inquiry", JSON.stringify({ id: j.id, name: body.name, company: body.company, package: pkg, budget: body.budget }));
      navigate({ to: "/partners/thanks" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <section id="sponsor-form" className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow text-terracotta">Sponsorship inquiry</p>
      <h2 className="display-tight mt-3 text-5xl">Get in the room</h2>
      <p className="mt-3 text-ink-soft">Tell us who you are and what you want out of Run #02. We reply personally.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5 border-2 border-ink bg-paper p-6 card-lift sm:grid-cols-2">
        <label className="eyebrow">Your name<input id="sp-name" name="name" required maxLength={100} autoComplete="name" className={field} /></label>
        <label className="eyebrow">Work email<input name="email" type="email" required maxLength={255} autoComplete="email" className={field} /></label>
        <label className="eyebrow">Brand / company<input name="company" required maxLength={120} autoComplete="organization" className={field} /></label>
        <label className="eyebrow">Your role<input name="role" maxLength={120} className={field} /></label>
        <label className="eyebrow sm:col-span-2">Website or Instagram<input name="website" maxLength={200} className={field} /></label>
        <fieldset className="sm:col-span-2">
          <legend className="eyebrow">Package you're eyeing</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PACKAGES.map((p) => (
              <button key={p.v} type="button" aria-pressed={pkg === p.v} onClick={() => setPkg(p.v)}
                className={`min-h-11 border-2 border-ink px-4 eyebrow ${pkg === p.v ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper-warm"}`}>
                {p.l}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="eyebrow sm:col-span-2">Budget range
          <select name="budget" defaultValue="500-1500" className={field}>
            {BUDGETS.map((b) => <option key={b.v} value={b.v}>{b.l}</option>)}
          </select>
        </label>
        <label className="eyebrow sm:col-span-2">What would make this a win for you?
          <textarea name="goals" rows={4} maxLength={1500} className={field} placeholder="Sampling, content, meeting local runners…" />
        </label>
        <input name="hp" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        {err && <p role="alert" className="sm:col-span-2 text-sm text-destructive">{err}</p>}
        <button type="submit" disabled={busy} className="sm:col-span-2 brush-btn inline-flex min-h-14 items-center justify-center gap-2 bg-terracotta px-8 py-4 display-tight text-lg tracking-[0.1em] text-[color:var(--color-terracotta-ink)] hover:bg-forest disabled:opacity-70">
          {busy && <span className="spinner" aria-hidden />} {busy ? "SENDING" : "SEND INQUIRY"}
        </button>
      </form>
    </section>
  );
}
