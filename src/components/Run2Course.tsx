import { CLIMB_PER_LAP_FT, FINISH_EXTRA_M, LAP_M, LAPS, LOOP, LOOP_CUM_M, LOOP_ELEV_FT, PARK_OUTLINE } from "@/lib/run2-course";

const TURNS: [string, string][] = [
  ["Start", "Northwest corner of the park. Head northeast along the upper edge."],
  ["Bear right", "Swing southeast and start the long descent."],
  ["Straight", "Keep downhill along the east side."],
  ["Slight right", "Ease right, still dropping."],
  ["Turn right", "Head southwest along the bottom, still dropping."],
  ["Slight right", "Low point of the lap. Begin climbing west."],
  ["Straight", "Short push up the south edge."],
  ["Turn right", "Head northwest, climbing."],
  ["Turn right", "North up the west side, the longest climb."],
  ["Bear right", "Crest the climb and swing northeast."],
  ["Bear left", "Run back to the start to finish the lap."],
];

const W = 520, PAD = 28;
const xs = PARK_OUTLINE.map((p) => p[0]), ys = PARK_OUTLINE.map((p) => p[1]);
const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const k = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
const scale = (W - PAD * 2) / ((maxX - minX) * k);
const H = Math.round((maxY - minY) * scale + PAD * 2);
const offX = (W - PAD * 2 - (maxX - minX) * k * scale) / 2;
const proj = ([x, y]: [number, number]) => [PAD + offX + (x - minX) * k * scale, H - PAD - (y - minY) * scale] as const;
const toPath = (pts: [number, number][], close = false) => pts.map((p, i) => `${i ? "L" : "M"}${proj(p).map((n) => n.toFixed(1)).join(" ")}`).join(" ") + (close ? " Z" : "");

const EW = 520, EH = 150;
const eMin = Math.min(...LOOP_ELEV_FT) - 8, eMax = Math.max(...LOOP_ELEV_FT) + 8;
const ePts = LOOP_ELEV_FT.map((e, i) => [32 + (LOOP_CUM_M[i] / LAP_M) * (EW - 44), 12 + (1 - (e - eMin) / (eMax - eMin)) * (EH - 40)]);
const eLine = ePts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

export function Run2Course() {
  const [sx, sy] = proj(LOOP[0]);
  return (
    <section id="course" className="mx-auto max-w-6xl px-5 py-16 sm:px-6" aria-labelledby="course-title">
      <p className="eyebrow text-terracotta">Run #02 · Draft course</p>
      <h2 id="course-title" className="mt-4 display-tight text-4xl text-forest sm:text-6xl">SIX LAPS. ONE PARK.<span className="mt-1 block brush-script text-terracotta">where we first met.</span></h2>
      <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">
        Every step stays inside Takoma-Piney Branch Local Park. No streets, no road crossings. One {LAP_M} m lap, run {LAPS} times, plus a {FINISH_EXTRA_M} m stretch to the finish line for a full 5K.
      </p>
      <p className="mt-2 text-sm font-medium text-forest">Draft course. Final route depends on approval from Montgomery Parks.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <figure className="ink-card p-4 sm:p-6 lg:row-span-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Map of the draft Run #02 lap inside Takoma-Piney Branch Local Park, running clockwise from the northwest corner">
            <path d={toPath(PARK_OUTLINE, true)} className="fill-forest/10 stroke-forest" strokeWidth="2" strokeDasharray="6 5" />
            <path d={toPath(LOOP)} fill="none" className="stroke-terracotta" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
            {LOOP.slice(1, -1).map((p, i) => {
              const [x, y] = proj(p);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="10" className="fill-paper stroke-ink" strokeWidth="1.5" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="11" className="fill-ink" fontWeight="700">{i + 1}</text>
                </g>
              );
            })}
            <g transform={`translate(${W - 30},34)`}><path d="M0 -16 L7 6 L0 1 L-7 6 Z" className="fill-forest" /><text y="22" textAnchor="middle" fontSize="13" className="fill-forest" fontWeight="700">N</text></g>
            <circle cx={sx} cy={sy} r="13" className="fill-terracotta stroke-ink" strokeWidth="2" />
            <text x={sx + 16} y={sy - 16} fontSize="15" className="fill-ink" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">START · FINISH</text>
          </svg>
          <figcaption className="mt-3 text-xs text-ink-soft">Clockwise. Dashed line is the park boundary. Numbers match the directions.</figcaption>
        </figure>

        <div>
          <dl className="grid grid-cols-3 gap-3">
            {[["5K", "total"], [String(LAPS), "laps"], [`${CLIMB_PER_LAP_FT * LAPS} ft`, "total climb"]].map(([n, l]) => (
              <div key={l} className="ink-card p-4"><dt className="eyebrow text-forest">{l}</dt><dd className="display-tight mt-1 text-3xl text-terracotta">{n}</dd></div>
            ))}
          </dl>
          <figure className="ink-card mt-4 p-4">
            <p className="eyebrow text-forest">Elevation · one lap</p>
            <svg viewBox={`0 0 ${EW} ${EH}`} className="mt-2 h-auto w-full" role="img" aria-label={`Elevation for one lap: from ${Math.max(...LOOP_ELEV_FT)} feet at the start down to ${Math.min(...LOOP_ELEV_FT)} feet, then about ${CLIMB_PER_LAP_FT} feet of climbing back to the start`}>
              <path d={`${eLine} L${ePts.at(-1)![0]} ${EH - 28} L${ePts[0][0]} ${EH - 28} Z`} className="fill-terracotta/15" />
              <path d={eLine} fill="none" className="stroke-terracotta" strokeWidth="3" />
              <text x="0" y="18" fontSize="11" className="fill-ink-soft">{Math.round(eMax - 8)} ft</text>
              <text x="0" y={EH - 32} fontSize="11" className="fill-ink-soft">{Math.round(eMin + 8)} ft</text>
              <text x="32" y={EH - 10} fontSize="11" className="fill-ink-soft">0 m</text>
              <text x={EW - 12} y={EH - 10} fontSize="11" textAnchor="end" className="fill-ink-soft">{LAP_M} m</text>
            </svg>
            <p className="mt-2 text-xs text-ink-soft">Downhill first, then climb back to the start. About {CLIMB_PER_LAP_FT} ft up per lap.</p>
          </figure>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="display-tight text-2xl text-forest">TURN BY TURN · EACH LAP</h3>
        <ol className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {TURNS.map(([turn, note], i) => (
            <li key={i} className="flex gap-4 border-b border-hairline py-3">
              <span className="display-tight w-8 shrink-0 text-xl text-terracotta">{i === 0 ? "S" : i}</span>
              <div>
                <p className="font-semibold text-ink">{turn} <span className="font-normal text-ink-soft">· {LOOP_CUM_M[i]} m</span></p>
                <p className="text-sm text-ink-soft">{note}</p>
              </div>
            </li>
          ))}
          <li className="flex gap-4 border-b border-hairline py-3">
            <span className="display-tight w-8 shrink-0 text-xl text-terracotta">F</span>
            <div><p className="font-semibold text-ink">Finish</p><p className="text-sm text-ink-soft">After lap {LAPS}, run {FINISH_EXTRA_M} m past the start to the finish line.</p></div>
          </li>
        </ol>
      </div>
    </section>
  );
}
