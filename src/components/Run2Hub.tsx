import { useEffect, useState } from "react";

type Track = "runner" | "brand";

const PACES = [
  { v: "first-5k", l: "First 5K" },
  { v: "casual", l: "Easy and social" },
  { v: "regular", l: "Regular runner" },
  { v: "fast", l: "Chasing a time" },
];
const WEEKENDS = [
  { v: "dec-1", l: "Dec 5–6" },
  { v: "dec-2", l: "Dec 12–13" },
  { v: "dec-3", l: "Dec 19–20" },
  { v: "any", l: "Any weekend works" },
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
  const weekendLabel = (v?: string) => { const w = WEEKENDS.find((x) => x.v === v); return w ? w.l : ""; };
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: string) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  // Restore a previous successful signup so returning visitors see their confirmation, not the form.
  useEffect(() => {
    try {
      const r = new URLSearchParams(window.location.search).get("ref");
      if (r && /^[a-z0-9]{6,12}$/.test(r)) localStorage.setItem("run2-ref", r);
    } catch {}
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
    if (name.length < 2) return setErr(track === "runner" ? "We need your name for the bib." : "Full name is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("That email looks off. Mind checking it?");
    if (track === "brand" && (f.brand ?? "").trim().length < 2) return setErr("Brand or organization is required.");
    if (track === "runner" && !f.weekend) return setErr("Pick a weekend, or choose \"Any weekend works.\"");
    setState("sending");
    try {
      let ref: string | null = null;
      try { ref = new URLSearchParams(window.location.search).get("ref") || localStorage.getItem("run2-ref"); } catch {}
      const body =
        track === "runner"
          ? { kind: "runner", name, email, pace: f.pace, weekend: f.weekend, ref }
          : { kind: "brand", name, email, brand: f.brand, role: f.role ?? "", category: f.category, message: f.message ?? "", ref };
      const res = await fetch("/api/public/run2-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong.");
      }
      const j = await res.json().catch(() => ({}));
      const nf = { ...f, code: typeof j.referralCode === "string" ? j.referralCode : "" };
      setF(nf);
      setState("done");
      try { localStorage.setItem("run2-signup", JSON.stringify({ track, f: nf })); } catch {}
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
          <span className="text-forest">Run Takoma again </span>
          <span className="brush-script text-terracotta">in December</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          248 people signed up for the first one and 98 finished. Run #02 is free, and the 100 bibs go to this list first. Pick your weekend and we'll send the date and route as soon as they're locked.
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
            {t === "runner" ? "I'M RUNNING" : "I'M A BRAND"}
          </button>
        ))}
      </div>

      <div className="ink-card mx-auto mt-6 max-w-2xl p-5 sm:p-8">
        {state === "done" ? (
          <div className="text-center py-6" role="status" aria-live="polite">
            <p className="display-tight text-4xl text-terracotta">YOU'RE IN{f.name ? `, ${f.name.trim().split(" ")[0].toUpperCase()}` : ""}.</p>
            <p className="mt-3 text-ink-soft">
              {track === "runner"
                ? "You're on the list. We'll email you first when bibs open for Run #02. Know someone who'd be down? Send them grytrun.com."
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
            <ShareWithFriend code={f.code} />
            <button type="button" onClick={() => { try { localStorage.removeItem("run2-signup"); } catch {} setState("idle"); setF({ pace: "casual", category: "apparel" }); }} className="mt-4 block mx-auto eyebrow text-forest underline underline-offset-4 hover:text-terracotta">
              Sign up someone else
            </button>
            <p className="mt-6 display-tight tracking-[0.14em] text-forest">DO HARD THINGS TOGETHER</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <h3 className="display-tight text-2xl text-forest">
                {track === "runner" ? "Get first dibs on a bib" : "Partner on Run #02"}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {track === "runner"
                  ? <>Free. Every pace welcome, walkers too. Takes 30 seconds.<span className="mt-1 block">11am EST Start Time.</span></>
                  : <>Put your brand in front of a real crew on a real Sunday morning. <a href="/partners" className="underline underline-offset-4 text-terracotta">See numbers, photos & packages</a>.</>}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow text-forest">{track === "runner" ? "Your name" : "Full name"}</span>
                <input id="run2-name" className={`${input} mt-1`} value={f.name ?? ""} onChange={set("name")} placeholder={track === "runner" ? "First and last" : "Nick Merich"} autoComplete="name" maxLength={100} />
              </label>
              <label className="block">
                <span className="eyebrow text-forest">Email</span>
                <input type="email" className={`${input} mt-1`} value={f.email ?? ""} onChange={set("email")} placeholder={track === "runner" ? "Where we'll send your bib link" : "you@email.com"} autoComplete="email" maxLength={255} />
              </label>
            </div>
            {track === "runner" && (
              <fieldset>
                <legend className="eyebrow text-forest">Which weekend works for you?</legend>
                <p className="mt-1 text-xs text-ink-soft">We'll pick the date most people can make.</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {WEEKENDS.map((w) => (
                    <label key={w.v} className={`cursor-pointer border-2 border-ink px-3 py-3 text-center transition-colors ${f.weekend === w.v ? "bg-forest text-[color:var(--color-forest-ink)]" : "bg-paper text-forest"}`}>
                      <input type="radio" name="weekend" value={w.v} checked={f.weekend === w.v} onChange={set("weekend")} className="sr-only" />
                      <span className="block display-tight text-sm tracking-[0.1em]">{w.l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {track === "runner" ? (
              <fieldset>
                <legend className="eyebrow text-forest">How do you run?</legend>
                <p className="mt-1 text-xs text-ink-soft">Just helps us plan. Nobody gets left behind.</p>
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
              {state === "sending" ? "SENDING…" : track === "runner" ? "SAVE MY SPOT ON THE LIST" : "LET'S TALK"}
            </button>
            {track === "runner" && <p className="text-center text-xs text-ink-soft">No spam. Just the date, the route and your bib link.</p>}
          </form>
        )}
      </div>
    </section>
  );
}

const SHARE_TEXT = "I'm on the list for GRYT Run #02 in early December. Run it with me.";

function ShareWithFriend({ code }: { code?: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("/#run2");
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    setUrl(`${window.location.origin}/${code ? `?ref=${code}` : ""}#run2`);
    if (!code) return;
    fetch(`/api/public/run2-referrals?code=${code}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j && typeof j.count === "number") setCount(j.count); })
      .catch(() => {});
  }, [code]);
  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title: "GRYT Run #02", text: SHARE_TEXT, url }); return; } catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch {}
  }
  return (
    <div className="mx-auto mt-6 max-w-sm">
      <div className="border-2 border-ink bg-paper p-4 text-left">
        <p className="eyebrow text-ink-soft">Invite preview</p>
        <p className="mt-2 text-sm text-ink">{SHARE_TEXT}</p>
        <p className="mt-2 break-all text-sm text-terracotta underline underline-offset-2">{url}</p>
      </div>
      <button type="button" onClick={share} className="brush-btn mt-3 w-full block display-tight text-lg tracking-[0.14em] py-3 bg-forest text-[color:var(--color-forest-ink)] hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors">
        {copied ? "LINK COPIED" : "SHARE WITH A FRIEND"}
      </button>
      {code && (
        <p className="mt-3 text-center text-sm text-ink-soft" aria-live="polite">
          <span className="display-tight text-2xl text-terracotta">{count ?? "–"}</span>{" "}
          {count === 1 ? "friend has" : "friends have"} signed up with your link
        </p>
      )}
    </div>
  );
}
