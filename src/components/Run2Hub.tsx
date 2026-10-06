import { useEffect, useState } from "react";

type Track = "runner" | "brand";

const PACES = [
  { v: "first-5k", l: "First 5K" },
  { v: "casual", l: "Casual" },
  { v: "regular", l: "Regular" },
  { v: "fast", l: "Chasing time" },
];
const WEEKENDS = [
  { v: "dec-1", l: "1st weekend", d: "Dec 5–6" },
  { v: "dec-2", l: "2nd weekend", d: "Dec 12–13" },
  { v: "dec-3", l: "3rd weekend", d: "Dec 19–20" },
  { v: "any", l: "Any works", d: "I'm flexible" },
];
const CATEGORIES = [
  { v: "apparel", l: "Footwear & apparel" },
  { v: "hydration", l: "Hydration & nutrition" },
  { v: "recovery", l: "Recovery" },
  { v: "audio", l: "Audio & entertainment" },
  { v: "community", l: "Community grant" },
];

const input =
  "w-full border-2 border-ink bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta";

export function Run2Hub() {
  const [track, setTrack] = useState<Track>("runner");
  const [f, setF] = useState<Record<string, string>>({ pace: "casual", category: "apparel" });
  const weekendLabel = (v?: string) => { const w = WEEKENDS.find((x) => x.v === v); return w ? `${w.l} · ${w.d}` : ""; };
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: string) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  // Restore a previous successful signup so returning visitors see their confirmation, not the form.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("run2-signup");
      if (!raw) return;
      const prev = JSON.parse(raw) as { track: Track; f: Record<string, string> };
      if (prev?.f?.name) { setTrack(prev.track); setF(prev.f); setState("done"); }
    } catch {}
  }, []);

  // Hero "Join the Run #02 list" scrolls to the form; keeps the confirmation if already signed up.
  useEffect(() => {
    const open = (e: Event) => {
      const t = ((e as CustomEvent).detail as Track) ?? "runner";
      setErr("");
      document.getElementById("run2")?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (state === "done") return;
      setTrack(t);
      setTimeout(() => document.getElementById("run2-name")?.focus({ preventScroll: true }), 450);
    };
    window.addEventListener("run2:open", open);
    return () => window.removeEventListener("run2:open", open);
  }, [state]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const name = (f.name ?? "").trim();
    const email = (f.email ?? "").trim();
    if (name.length < 2) return setErr("Full name is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    if (track === "brand" && (f.brand ?? "").trim().length < 2) return setErr("Brand or organization is required.");
    if (track === "runner" && !f.weekend) return setErr("Pick the December weekend that works best.");
    setState("sending");
    try {
      const body =
        track === "runner"
          ? { kind: "runner", name, email, pace: f.pace, weekend: f.weekend }
          : { kind: "brand", name, email, brand: f.brand, role: f.role ?? "", category: f.category, message: f.message ?? "" };
      const res = await fetch("/api/public/run2-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong.");
      }
      setState("done");
      try { localStorage.setItem("run2-signup", JSON.stringify({ track, f })); } catch {}
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section id="run2" className="relative z-10 mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20 scroll-mt-4">
      <div className="text-center">
        <p className="eyebrow text-terracotta">Run #02 · Early December 2026</p>
        <h2 className="mt-3 display-tight text-4xl sm:text-6xl leading-[0.9]">
          <span className="text-forest">Want in on </span>
          <span className="brush-script text-terracotta">run #02?</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          248 signed up. 98 finished. Run #02 is targeting early December 2026. Tell us which weekend works and get first word on the date, route, and bibs.
        </p>
      </div>

      <div role="tablist" aria-label="Choose your lane" className="mx-auto mt-8 grid max-w-md grid-cols-2 border-2 border-ink">
        {(["runner", "brand"] as Track[]).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={track === t}
            onClick={() => { setTrack(t); if (state !== "done") setState("idle"); setErr(""); }}
            className={`display-tight py-3 tracking-[0.14em] transition-colors ${
              track === t ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper-warm text-forest hover:text-terracotta"
            }`}
          >
            {t === "runner" ? "I'M A RUNNER" : "I'M A BRAND"}
          </button>
        ))}
      </div>

      <div className="card-lift mx-auto mt-6 max-w-2xl border-2 border-ink bg-paper-warm p-5 sm:p-8">
        {state === "done" ? (
          <div className="text-center py-6" role="status" aria-live="polite">
            <p className="display-tight text-4xl text-terracotta">YOU'RE IN{f.name ? `, ${f.name.trim().split(" ")[0].toUpperCase()}` : ""}.</p>
            <p className="mt-3 text-ink-soft">
              {track === "runner"
                ? "You're on the Run #02 drop list. A confirmation with your weekend and pace is headed to your inbox."
                : "Thanks. The GRYT crew will reach out about partnering on Run #02."}
            </p>
            <dl className="mx-auto mt-6 max-w-sm border-2 border-dashed border-ink bg-paper p-4 text-left text-sm">
              <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">Name</dt><dd className="truncate text-ink">{f.name}</dd></div>
              <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">Email</dt><dd className="truncate text-ink">{f.email}</dd></div>
              {track === "runner" ? (
                <>
                  <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">Pace</dt><dd className="text-ink">{PACES.find((p) => p.v === f.pace)?.l}</dd></div>
                  <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">Weekend</dt><dd className="text-ink">{weekendLabel(f.weekend)}</dd></div>
                </>
              ) : (
                <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">Brand</dt><dd className="truncate text-ink">{f.brand}</dd></div>
              )}
              <div className="flex justify-between gap-4 py-1"><dt className="eyebrow text-ink-soft">List</dt><dd className="text-ink">Run #02 · {track === "runner" ? "Runners" : "Partners"}</dd></div>
            </dl>
            <button type="button" onClick={() => { try { localStorage.removeItem("run2-signup"); } catch {} setState("idle"); setF({ pace: "casual", category: "apparel" }); }} className="mt-4 eyebrow text-forest underline underline-offset-4 hover:text-terracotta">
              Sign up someone else
            </button>
            <p className="mt-6 display-tight tracking-[0.14em] text-forest">DO HARD THINGS TOGETHER</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <h3 className="display-tight text-2xl text-forest">
                {track === "runner" ? "Join the drop list" : "Partner on Run #02"}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {track === "runner"
                  ? "Free. Community-first. Priority access to the next 100 bibs."
                  : "Put your brand in front of a real crew on a real Sunday morning. Sampling, activations, and support for the run."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow text-forest">Full name</span>
                <input id="run2-name" className={`${input} mt-1`} value={f.name ?? ""} onChange={set("name")} placeholder="Nick Merich" autoComplete="name" maxLength={100} />
              </label>
              <label className="block">
                <span className="eyebrow text-forest">Email</span>
                <input type="email" className={`${input} mt-1`} value={f.email ?? ""} onChange={set("email")} placeholder="you@email.com" autoComplete="email" maxLength={255} />
              </label>
            </div>
            {track === "runner" && (
              <fieldset>
                <legend className="eyebrow text-forest">Which December weekend works best?</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {WEEKENDS.map((w) => (
                    <label key={w.v} className={`cursor-pointer border-2 border-ink px-3 py-3 text-center transition-colors ${f.weekend === w.v ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper text-forest"}`}>
                      <input type="radio" name="weekend" value={w.v} checked={f.weekend === w.v} onChange={set("weekend")} className="sr-only" />
                      <span className="block display-tight text-sm tracking-[0.1em]">{w.l}</span>
                      <span className="block text-xs opacity-80">{w.d}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {track === "runner" ? (
              <fieldset>
                <legend className="eyebrow text-forest">Your pace</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PACES.map((p) => (
                    <label key={p.v} className={`cursor-pointer border-2 border-ink px-3 py-3 text-center display-tight text-sm tracking-[0.1em] transition-colors ${f.pace === p.v ? "bg-terracotta text-[color:var(--color-terracotta-ink)]" : "bg-paper text-forest"}`}>
                      <input type="radio" name="pace" value={p.v} checked={f.pace === p.v} onChange={set("pace")} className="sr-only" />
                      {p.l}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="eyebrow text-forest">Brand / organization</span>
                    <input className={`${input} mt-1`} value={f.brand ?? ""} onChange={set("brand")} maxLength={120} />
                  </label>
                  <label className="block">
                    <span className="eyebrow text-forest">Your role</span>
                    <input className={`${input} mt-1`} value={f.role ?? ""} onChange={set("role")} maxLength={120} />
                  </label>
                </div>
                <label className="block">
                  <span className="eyebrow text-forest">Partnership type</span>
                  <select className={`${input} mt-1`} value={f.category} onChange={set("category")}>
                    {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow text-forest">What do you have in mind? (optional)</span>
                  <textarea className={`${input} mt-1 min-h-24`} value={f.message ?? ""} onChange={set("message")} maxLength={1000} />
                </label>
              </>
            )}
            {err && <p role="alert" className="text-sm text-terracotta">{err}</p>}
            <button
              type="submit"
              disabled={state === "sending"}
              className="brush-btn w-full display-tight text-lg tracking-[0.14em] py-4 bg-terracotta text-[color:var(--color-terracotta-ink)] hover:bg-forest hover:text-[color:var(--color-forest-ink)] transition-colors disabled:opacity-60"
            >
              {state === "sending" ? "SENDING…" : track === "runner" ? "PUT ME ON THE LIST" : "LET'S TALK"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
