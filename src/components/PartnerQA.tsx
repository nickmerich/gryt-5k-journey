import { useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What activations are available?",
  "How many runners show up?",
  "Can we sample product?",
  "When is Run #02?",
];

export function PartnerQA() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function ask(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setErr("");
    setQ("");
    const history: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/public/run2-partner-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "The assistant could not answer right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error("No answer came back. Try asking another way.");
    } catch (x) {
      if ((x as Error).name !== "AbortError") {
        setErr(x instanceof Error ? x.message : "Something went wrong.");
        setMsgs(history);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="ink-card mt-6 p-5 text-left sm:mt-8 sm:p-7">
      <p className="eyebrow text-terracotta">Partner Q&amp;A</p>
      <h3 className="mt-1 display-tight text-2xl leading-none text-forest">ASK ABOUT PARTNERING</h3>
      <p className="mt-2 text-sm text-ink-soft">Questions about sponsoring Run #02? Get a straight answer.</p>

      {msgs.length > 0 && (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto" aria-live="polite">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="ml-auto w-fit max-w-[85%] bg-forest px-3 py-2 text-sm text-[color:var(--color-forest-ink)]">{m.content}</p>
            ) : (
              <p key={i} className="max-w-[95%] whitespace-pre-wrap text-sm text-ink">
                {m.content || <span className="text-ink-soft">Thinking…</span>}
              </p>
            ),
          )}
        </div>
      )}

      {msgs.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button key={s} type="button" onClick={() => ask(s)} className="border-2 border-ink bg-paper-warm px-3 py-2 text-xs text-forest hover:bg-terracotta hover:text-[color:var(--color-terracotta-ink)] transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {err && <p role="alert" className="mt-3 text-sm text-terracotta">{err}</p>}

      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="mt-4 flex gap-2">
        <label htmlFor="partner-q" className="sr-only">Your question</label>
        <input
          id="partner-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={1500}
          placeholder="Ask a sponsorship question"
          className="min-w-0 flex-1 border-2 border-ink bg-paper px-3 py-3 text-base text-ink placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        />
        {busy ? (
          <button type="button" onClick={() => abortRef.current?.abort()} className="border-2 border-ink bg-paper-warm px-4 display-tight tracking-[0.1em] text-forest">STOP</button>
        ) : (
          <button type="submit" disabled={!q.trim()} className="bg-forest px-4 display-tight tracking-[0.1em] text-[color:var(--color-forest-ink)] hover:bg-terracotta disabled:opacity-50">ASK</button>
        )}
      </form>
      <p className="mt-2 text-xs text-ink-soft">Answers are AI-generated from our partnership details. The team confirms everything by email.</p>
    </div>
  );
}
