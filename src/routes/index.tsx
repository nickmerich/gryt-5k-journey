import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GRYT Club 5Ks — Ops HQ · Run Takoma" },
      {
        property: "og:title",
        content: "GRYT Club 5Ks — Ops HQ · Run Takoma",
      },
      {
        name: "description",
        content:
          "Run Takoma, with love. A neighborhood 5K from GRYT Club — run of show, zone leads, and the big five risks for Sunday, August 2.",
      },
      {
        property: "og:description",
        content:
          "Run Takoma, with love. A neighborhood 5K from GRYT Club — run of show, zone leads, and the big five risks for Sunday, August 2.",
      },
    ],
  }),
  component: OpsHQ,
});

// ---------------------------------------------------------------------------
// Data — mirrors the visual design faithfully.
// ---------------------------------------------------------------------------

type Task = { id: string; time: string; text: string; zone: string; zoneTone?: "a" | "e" | "f" | "g" | "nick" | "crew" | "default" };
type Block = { title: string; range: string; tasks: Task[] };

const BLOCKS: Block[] = [
  {
    title: "Setup",
    range: "6:30 – 8:45 AM",
    tasks: [
      { id: "s1", time: "6:30 AM", text: "Field access — unload equipment, coolers into the shelter.", zone: "Zone B" },
      { id: "s2", time: "7:00 AM", text: "Two 10×10 tents, six tables, 20 chairs up on Ed Wilhelm Field.", zone: "Zone B" },
      { id: "s3", time: "7:00 AM", text: "Course signage out: 6 directional signs + 4 mile markers. Courtesy, not closure — trail stays open.", zone: "Zone A", zoneTone: "a" },
      { id: "s4", time: "7:30 AM", text: "Smartwater delivery inventoried (350 bottles). Barrels iced — 4× 10-lb bags minimum.", zone: "Zone E", zoneTone: "e" },
      { id: "s5", time: "8:00 AM", text: "Volunteer briefing with Nick. Contact cards handed out.", zone: "Nick", zoneTone: "nick" },
      { id: "s6", time: "8:30 AM", text: "Registration + merch + VIP tents open. EMT on-site.", zone: "Zone F", zoneTone: "f" },
      { id: "s7", time: "8:45 AM", text: "Turnaround volunteer posted at Mile 1.5 — cowbell, phone, Barrel 1 with cups.", zone: "Zone A", zoneTone: "a" },
    ],
  },
  {
    title: "Race & First Finishers",
    range: "9:00 – 10:30 AM",
    tasks: [
      { id: "r1", time: "9:00 AM", text: "Race start — casual whistle. Music OFF while runners are on the trail.", zone: "Zone A", zoneTone: "a" },
      { id: "r2", time: "9:15 AM", text: "Grill lit. Coals need 30 minutes — do not be late on this one.", zone: "Zone C" },
      { id: "r3", time: "10:00 AM", text: "First finishers — bottle handoff at the chute, food service begins, music back on low.", zone: "Zone C" },
      { id: "r4", time: "10:15 AM", text: "Course sweep — every sign and every stake comes out of the ground.", zone: "Zone A", zoneTone: "a" },
      { id: "r5", time: "10:30 AM", text: "Barrel 1 retrieved from the turnaround, back to the shelter.", zone: "Zone E", zoneTone: "e" },
    ],
  },
  {
    title: "Cookout & Field Day",
    range: "10:30 AM – 1:30 PM",
    tasks: [
      { id: "c1", time: "10:30 AM", text: "Field Day gear out on the grass — kickball, Spikeball, cornhole, footballs, soccer, wiffle. No brackets, no refs.", zone: "Zone G", zoneTone: "g" },
      { id: "c2", time: "11:00 AM", text: "Walk the field: point folks to food, games, and the local-partner tables. Make introductions.", zone: "All Crew", zoneTone: "crew" },
      { id: "c3", time: "1:00 PM", text: "Grill OFF. Douse coals — thoroughly wet, cold before disposal.", zone: "Zone C" },
      { id: "c4", time: "1:30 PM", text: "Wind-down announcement — warm, unhurried, thank-yous.", zone: "Nick", zoneTone: "nick" },
    ],
  },
  {
    title: "Breakdown & Walkthrough",
    range: "1:45 – 3:00 PM",
    tasks: [
      { id: "b1", time: "2:00 PM", text: "Full breakdown — tents, tables, chairs. All trash bagged and out of the park if bins are near capacity.", zone: "Zone B" },
      { id: "b2", time: "2:30 PM", text: "Smartwater barrels emptied and staged for pickup.", zone: "Zone E", zoneTone: "e" },
      { id: "b3", time: "2:45 PM", text: "Site walkthrough with the Recreation Dept rep — $150 deposit back, future permits protected.", zone: "Nick", zoneTone: "nick" },
      { id: "b4", time: "Monday", text: "Port-a-john pickup confirmed (delivered Saturday).", zone: "Zone B" },
    ],
  },
];

const ALL_TASK_IDS = BLOCKS.flatMap((b) => b.tasks.map((t) => t.id));

type Zone = {
  letter: string;
  title: string;
  role: string;
  bullets: string[];
  rule: string;
  dot: "terra" | "black" | "forest";
};

const ZONES: Zone[] = [
  {
    letter: "A",
    title: "Course — Sligo Creek Trail",
    role: "Route Marshal",
    bullets: [
      "5K out-and-back from the park; no road crossings anywhere.",
      "One volunteer at the Mile 1.5 turnaround with a cowbell and a phone.",
      "6 directional signs + 4 mile markers — placed 7:00 AM, swept 10:15 AM.",
    ],
    rule: "The trail stays open to the public. Signage is courtesy, not closure — be friendly to everyone out there.",
    dot: "terra",
  },
  {
    letter: "B",
    title: "Field Ops (with Zone G)",
    role: "Field Lead",
    bullets: [
      "Two 10×10 pop-up tents, six folding tables, 20 chairs.",
      "Owns setup, trash staging, and the 2:00 PM breakdown.",
      "Runs the 2:45 PM walkthrough with Nick.",
    ],
    rule: "Everything we bring in leaves with us — a clean field is the deposit and next year’s permit.",
    dot: "black",
  },
  {
    letter: "C",
    title: "Picnic Shelter, Grill & Food",
    role: "Food Lead",
    bullets: [
      "Feeding 100: 60 burgers, 60 hot dogs, 15 veggie, fruit + snacks.",
      "Coals lit 9:15 AM sharp — ready for first finishers at 10:00.",
      "Burn-ban check 15 hours out. If banned: 25 pizza vouchers instead.",
    ],
    rule: "Coals doused and cold before disposal — non-negotiable M-NCPPC fire rule.",
    dot: "black",
  },
  {
    letter: "D",
    title: "Sound",
    role: "Field Lead (shared)",
    bullets: [
      "No DJ. One battery Bluetooth speaker, curated Oddisee / Heno. playlist.",
      "Conversational volume only; OFF while runners are on the course.",
      "Speaker points into the park interior, away from houses.",
    ],
    rule: "MoCo §31B-5: 65 dBA max at the property line. If a neighbor can complain, we’re too loud.",
    dot: "black",
  },
  {
    letter: "E",
    title: "Hydration — Smartwater",
    role: "Hydration Lead",
    bullets: [
      "350 bottles for 100 people — a 3.5×/person August buffer.",
      "Barrel 1: Mile 1.5 (cups) · Barrel 2: finish chute (bottles) · Barrel 3: shelter.",
      "Minimum 4× 10-lb bags of ice — nobody drinks warm water in August.",
    ],
    rule: "Barrels counted and staged for return pickup by 2:30 PM.",
    dot: "forest",
  },
  {
    letter: "F",
    title: "Registration, Merch & VIP",
    role: "Registration Lead",
    bullets: [
      "Capped at 100 registrants via RunSignup — walk-ups still welcomed warmly.",
      "150 merch units: registered runners pick first; walk-ups get stickers + what’s left.",
      "VIP tent for Oddisee, Heno., Outer Note reps, and brand partners.",
    ],
    rule: "No sales of any kind on parkland — everything is a giveaway.",
    dot: "terra",
  },
  {
    letter: "G",
    title: "Field Day Games",
    role: "Field Lead (shared)",
    bullets: [
      "Kickball, Spikeball, cornhole, footballs, soccer, wiffle ball.",
      "No brackets, no referees, no schedule — gear on the grass = permission to play.",
      "All gear counted back into the bin at 1:45 PM.",
    ],
    rule: "Keep it unstructured — the casual vibe is the permit-friendly vibe.",
    dot: "forest",
  },
];

type Risk = { n: number; title: string; body: string; owner: string };
const BIG_FIVE: Risk[] = [
  { n: 1, title: "Warm Water", body: "August heat + a 5K = ice is safety equipment. Minimum 4× 10-lb bags for the Smartwater barrels, iced by 8:00 AM.", owner: "Hydration Lead (Zone E)" },
  { n: 2, title: "Late Grill", body: "Coals need 30 minutes. Lit at 9:15 AM or the first finishers stand around hungry at 10:00 — light it on time, every time.", owner: "Food Lead (Zone C)" },
  { n: 3, title: "Noise Complaint", body: "One speaker, conversational volume, pointed into the park. A single neighbor complaint puts every future permit at risk.", owner: "Field Lead (Zone D)" },
  { n: 4, title: "A Sign Left Behind", body: "Every sign and every stake out of the ground at the 10:15 AM sweep. Anything left costs the $150 deposit and prejudices next year’s application.", owner: "Route Marshal (Zone A)" },
  { n: 5, title: "Hot Coals", body: "Coals thoroughly wet and cold before disposal. This is the one M-NCPPC fire rule with zero tolerance.", owner: "Food Lead (Zone C)" },
];

// ---------------------------------------------------------------------------

type Tab = "run" | "zones" | "big5" | "crew";
const TABS: { id: Tab; label: string }[] = [
  { id: "run", label: "Run of Show" },
  { id: "zones", label: "Zones & Leads" },
  { id: "big5", label: "The Big 5" },
  { id: "crew", label: "Crew Notes" },
];

function useNowLabel() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    if (!now) return "—";
    return now
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      .toUpperCase();
  }, [now]);
}

function OpsHQ() {
  const [tab, setTab] = useState<Tab>("run");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = ALL_TASK_IDS.filter((id) => checked[id]).length;
  const total = ALL_TASK_IDS.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nowLabel = useNowLabel();

  const toggle = (id: string) =>
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  const reset = () => setChecked({});

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-24 sm:px-10">
        <Header nowLabel={nowLabel} done={done} total={total} pct={pct} onReset={reset} />
        <Tabs current={tab} onChange={setTab} />
        <main className="mt-8">
          {tab === "run" && <RunOfShow checked={checked} onToggle={toggle} />}
          {tab === "zones" && <ZonesAndLeads />}
          {tab === "big5" && <BigFive />}
          {tab === "crew" && <CrewNotes />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Header({
  nowLabel,
  done,
  total,
  pct,
  onReset,
}: {
  nowLabel: string;
  done: number;
  total: number;
  pct: number;
  onReset: () => void;
}) {
  return (
    <header className="grid gap-6 border-b border-hairline pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <p className="eyebrow text-ink-soft">
          GRYT Club Presents · Ops HQ
        </p>
        <h1 className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="display-tight text-[clamp(2.6rem,6vw,4.2rem)]">
            RUN TAKOMA
          </span>
          <span className="serif-italic text-terracotta text-[clamp(1.8rem,4.5vw,3rem)]">
            with love
          </span>
        </h1>
        <p className="eyebrow mt-3 text-ink-soft">
          Sunday, August 2, 2026 · 9:00 AM – 2:00 PM · Takoma-Piney Branch Local Park
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 sm:items-end">
        <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden />
          Live · {nowLabel}
        </span>
        <div className="flex w-full min-w-[240px] items-center gap-3 sm:w-64">
          <div
            className="relative h-1.5 flex-1 overflow-hidden bg-ink/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            aria-label="Tasks completed"
          >
            <div
              className="absolute inset-y-0 left-0 bg-terracotta transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="eyebrow tabular-nums text-ink">
            {done}/{total}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="eyebrow text-ink-soft transition hover:text-terracotta"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}

function Tabs({ current, onChange }: { current: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="mt-6 flex flex-wrap gap-2 border-b border-hairline pb-0"
      aria-label="Ops HQ sections"
    >
      {TABS.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              "eyebrow relative -mb-[1px] border border-hairline border-b-0 px-4 py-3 transition",
              active
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-ink/5",
            ].join(" ")}
            aria-pressed={active}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

// -------- Run of Show ------------------------------------------------------

function RunOfShow({
  checked,
  onToggle,
}: {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        Tap a task when it's done — checks save on this device. The clock chip
        up top follows the day; the{" "}
        <span className="serif-italic text-terracotta">now</span> band shows
        where we should be.
      </p>
      <div className="mt-8 space-y-6">
        {BLOCKS.map((block) => {
          const total = block.tasks.length;
          const done = block.tasks.filter((t) => checked[t.id]).length;
          return (
            <article
              key={block.title}
              className="border border-hairline bg-paper-warm/40"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="eyebrow text-forest text-sm">
                    {block.title}
                  </h2>
                  <span className="eyebrow text-ink-soft">{block.range}</span>
                </div>
                <span className="eyebrow tabular-nums text-ink-soft">
                  {done}/{total}
                </span>
              </header>
              <ul>
                {block.tasks.map((t, i) => (
                  <li
                    key={t.id}
                    className={
                      i < block.tasks.length - 1
                        ? "border-b border-hairline/40"
                        : ""
                    }
                  >
                    <TaskRow
                      task={t}
                      checked={!!checked[t.id]}
                      onToggle={() => onToggle(t.id)}
                    />
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TaskRow({
  task,
  checked,
  onToggle,
}: {
  task: Task;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="group grid w-full grid-cols-[auto_5.5rem_1fr_auto] items-center gap-4 px-5 py-4 text-left transition hover:bg-ink/[0.03]"
    >
      <span
        aria-hidden
        className={[
          "flex h-5 w-5 items-center justify-center border transition",
          checked
            ? "border-terracotta bg-terracotta text-paper"
            : "border-ink/60 bg-transparent",
        ].join(" ")}
      >
        {checked && (
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10.5l4 4L16 6" />
          </svg>
        )}
      </span>
      <span
        className={[
          "eyebrow tabular-nums text-terracotta",
          checked ? "opacity-40" : "",
        ].join(" ")}
      >
        {task.time}
      </span>
      <span
        className={[
          "text-sm leading-snug text-ink",
          checked ? "line-through opacity-50" : "",
        ].join(" ")}
      >
        {task.text}
      </span>
      <ZoneChip zone={task.zone} tone={task.zoneTone} muted={checked} />
    </button>
  );
}

function ZoneChip({
  zone,
  tone,
  muted,
}: {
  zone: string;
  tone?: Task["zoneTone"];
  muted?: boolean;
}) {
  const cls: Record<NonNullable<Task["zoneTone"]>, string> = {
    a: "border-terracotta text-terracotta",
    e: "border-forest text-forest",
    f: "border-terracotta text-terracotta",
    g: "border-forest text-forest",
    nick: "border-ink bg-ink text-paper",
    crew: "border-ink bg-ink text-paper",
    default: "border-ink text-ink",
  };
  const t = tone ?? "default";
  return (
    <span
      className={[
        "eyebrow inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem]",
        cls[t],
        muted ? "opacity-40" : "",
      ].join(" ")}
    >
      {zone}
    </span>
  );
}

// -------- Zones & Leads ----------------------------------------------------

function ZonesAndLeads() {
  return (
    <section>
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        Seven zones, one lead each. Know your zone, know your neighbor's zone,
        and when in doubt find Nick.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {ZONES.map((z) => (
          <ZoneCard key={z.letter} zone={z} />
        ))}
      </div>
    </section>
  );
}

function ZoneCard({ zone }: { zone: Zone }) {
  const dotCls =
    zone.dot === "terra"
      ? "bg-terracotta text-paper"
      : zone.dot === "forest"
        ? "bg-forest text-forest-ink"
        : "bg-ink text-paper";
  return (
    <article className="flex flex-col border border-hairline">
      <header className="flex items-start gap-4 border-b border-hairline px-5 py-4">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold",
            dotCls,
          ].join(" ")}
          aria-hidden
        >
          {zone.letter}
        </span>
        <div>
          <h3 className="eyebrow text-ink text-sm">{zone.title}</h3>
          <p className="eyebrow mt-1 text-ink-soft text-[0.65rem]">{zone.role}</p>
        </div>
      </header>
      <ul className="space-y-3 px-5 py-4 text-sm leading-snug text-ink">
        {zone.bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="text-terracotta">♥</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <footer className="mt-auto border-t border-hairline px-5 py-3 text-xs leading-relaxed text-ink-soft">
        <span className="eyebrow mr-1 text-ink">Permit Rule</span> ·{" "}
        {zone.rule}
      </footer>
    </article>
  );
}

// -------- Big Five ---------------------------------------------------------

function BigFive() {
  return (
    <section>
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        Five things that will break the event if we let them. Everything else
        is fixable on the fly — these are not.
      </p>
      <div className="mt-8 space-y-4">
        {BIG_FIVE.map((r) => (
          <article
            key={r.n}
            className="grid grid-cols-[6rem_1fr] items-stretch border border-hairline"
          >
            <div className="flex items-center justify-center bg-terracotta text-paper">
              <span className="font-display text-5xl font-bold leading-none">
                {r.n}
              </span>
            </div>
            <div className="px-5 py-4">
              <h3 className="eyebrow text-ink text-sm">{r.title}</h3>
              <p className="mt-2 text-sm leading-snug text-ink">{r.body}</p>
              <p className="eyebrow mt-3 text-ink-soft text-[0.65rem]">
                Owner: {r.owner}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// -------- Crew Notes -------------------------------------------------------

function CrewNotes() {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <article className="border-t-2 border-terracotta bg-forest p-6 text-forest-ink md:row-span-1">
        <h2 className="eyebrow text-forest-ink">Why We're Here</h2>
        <p className="mt-4 text-sm leading-relaxed">
          This is a neighborhood hang with a 5K in the middle of it — not a
          race with splits and podiums.{" "}
          <strong className="font-semibold">
            Every pace and every experience level is welcome
          </strong>
          , walkers included. We're here to love Takoma and each other; the run
          is just the excuse.
        </p>
        <p className="mt-4 text-sm leading-relaxed">
          After the run, point people toward the shelter and the field — food,
          games, music, and local partners to meet. The hang{" "}
          <span className="serif-italic">is</span> the event.
        </p>
      </article>

      <article className="border border-hairline p-6">
        <h2 className="eyebrow text-ink">Contacts</h2>
        <dl className="mt-4 divide-y divide-hairline/40">
          {[
            ["Nick Merich — Event Lead", "Overall run of show, vibe, escalations"],
            ["EMT (contracted)", "On-site 8:30 AM – 2:00 PM, staged near finish"],
            ["Park Police", "(301) 949-8010 — emergencies only"],
            ["Recreation Dept rep", "2:45 PM walkthrough"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-4 py-2 text-sm">
              <dt className="text-ink">{k}</dt>
              <dd className="text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Every volunteer carries a contact card. Park Police is for
          emergencies only — we have no proactive police coordination, by
          design.
        </p>
      </article>

      <article className="border border-hairline p-6">
        <h2 className="eyebrow text-ink">What We Ask Of Everyone</h2>
        <ul className="mt-4 space-y-3 text-sm leading-snug text-ink">
          {[
            "Listen to volunteers and zone leads — they’re the ones holding the plan.",
            "Respect the streets and the neighbors: quiet voices near property lines, no blocking sidewalks or driveways.",
            "Share the trail — it’s open to everyone. A wave and a thank-you go a long way.",
            "No alcohol anywhere on-site. Non-negotiable.",
            "See something off? Don’t fix it alone — flag your zone lead or Nick.",
          ].map((b, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="text-terracotta">♥</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="border border-hairline p-6">
        <h2 className="eyebrow text-ink">Sanitation & Waste</h2>
        <ul className="mt-4 space-y-3 text-sm leading-snug text-ink">
          {[
            "Two port-a-johns (1 standard, 1 ADA) — delivered Saturday, picked up Monday.",
            "All trash bagged; if park bins are near capacity, it leaves the park with us.",
            "2:45 PM walkthrough with the Recreation rep — clean site = $150 deposit back and a warm welcome next year.",
          ].map((b, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="text-terracotta">♥</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

// -------- Footer -----------------------------------------------------------

function Footer() {
  return (
    <footer className="border-t-2 border-terracotta bg-forest text-forest-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-10">
        <p className="serif-italic text-lg">
          Leave the park better than we found it — with love.
        </p>
        <p className="eyebrow text-forest-ink/80">
          Heno. × Oddisee × GRYT Club
        </p>
      </div>
    </footer>
  );
}
