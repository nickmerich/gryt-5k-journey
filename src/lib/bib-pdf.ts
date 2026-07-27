/**
 * Print-optimized race bib PDF (US Letter, portrait).
 * Pure black on white, no textures — maximum contrast for home/office printers.
 * Hand-rolled minimal PDF writer: no dependencies, vector text (crisp at any size).
 */

// Helvetica-Bold AFM widths (per 1000 units) for the glyphs we use.
const W_BOLD: Record<string, number> = {
  " ": 278, "!": 333, '"': 474, "#": 556, "$": 556, "%": 889, "&": 722, "'": 238,
  "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333, ".": 278, "/": 278,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556,
  "8": 556, "9": 556, ":": 333, ";": 333, "<": 584, "=": 584, ">": 584, "?": 611,
  "@": 975, A: 722, B: 722, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278,
  J: 556, K: 722, L: 611, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667,
  T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, "[": 333, "\\": 278,
  "]": 333, "^": 584, _: 556, "`": 333, a: 556, b: 611, c: 556, d: 611, e: 556,
  f: 333, g: 611, h: 611, i: 278, j: 278, k: 556, l: 278, m: 889, n: 611, o: 611,
  p: 611, q: 611, r: 389, s: 556, t: 333, u: 611, v: 556, w: 778, x: 556, y: 556,
  z: 500, "|": 280, "·": 278,
};

function widthOf(text: string, size: number, tracking = 0): number {
  let w = 0;
  for (const ch of text) w += (W_BOLD[ch] ?? 556) / 1000;
  return w * size + tracking * Math.max(0, text.length - 1);
}

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** ASCII-safe fallback so WinAnsi never renders garbage. */
function ascii(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[·•]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

type Op = string;

function centeredText(
  ops: Op[],
  text: string,
  cx: number,
  y: number,
  size: number,
  tracking = 0,
) {
  const t = ascii(text);
  const x = cx - widthOf(t, size, tracking) / 2;
  ops.push(
    "BT",
    `/F1 ${size} Tf`,
    `${tracking.toFixed(2)} Tc`,
    `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
    `(${esc(t)}) Tj`,
    "0 Tc",
    "ET",
  );
}

export function buildBibPdf(opts: {
  name: string;
  bib: string;
  ticket: string;
  eventLine?: string;
  dateLine?: string;
}): Blob {
  const {
    name,
    bib,
    ticket,
    eventLine = "RUN TAKOMA WITH LOVE 5K",
    dateLine = "AUG 2, 2026 - TAKOMA PARK, MD",
  } = opts;

  const PW = 612;
  const PH = 792;
  // Bib panel: 7in x 5in centered.
  const bw = 504;
  const bh = 360;
  const bx = (PW - bw) / 2;
  const by = (PH - bh) / 2 + 40;
  const cx = PW / 2;

  const ops: Op[] = [];

  // White page (explicit, so printers don't rely on paper alone)
  ops.push("1 1 1 rg", `0 0 ${PW} ${PH} re f`, "0 0 0 RG", "0 0 0 rg");

  // Dashed cut line just outside the panel
  ops.push(
    "q",
    "0.5 w",
    "[4 4] 0 d",
    `${(bx - 14).toFixed(2)} ${(by - 14).toFixed(2)} ${(bw + 28).toFixed(2)} ${(bh + 28).toFixed(2)} re S`,
    "Q",
  );

  // Panel frame — heavy outer + thin inner
  ops.push("q", "4 w", `${bx} ${by} ${bw} ${bh} re S`, "Q");
  ops.push("q", "0.8 w", `${bx + 10} ${by + 10} ${bw - 20} ${bh - 20} re S`, "Q");

  // Header
  centeredText(ops, eventLine, cx, by + bh - 46, 19, 1.6);
  centeredText(ops, dateLine, cx, by + bh - 70, 10, 2.2);
  ops.push(
    "q",
    "1 w",
    `${(cx - 150).toFixed(2)} ${(by + bh - 84).toFixed(2)} m ${(cx + 150).toFixed(2)} ${(by + bh - 84).toFixed(2)} l S`,
    "Q",
  );

  // Big bib number
  centeredText(ops, bib, cx, by + 132, 170, 4);

  // Name
  centeredText(ops, name.length > 24 ? name.slice(0, 23) + "..." : name, cx, by + 92, 22, 0.8);

  // Ticket line
  centeredText(ops, ticket.toUpperCase(), cx, by + 68, 9, 2.4);

  // Footer rule + mission
  ops.push(
    "q",
    "1 w",
    `${(cx - 150).toFixed(2)} ${(by + 52).toFixed(2)} m ${(cx + 150).toFixed(2)} ${(by + 52).toFixed(2)} l S`,
    "Q",
  );
  centeredText(ops, "DO HARD THINGS TOGETHER", cx, by + 30, 14, 3);

  // Safety-pin holes: four corners inside the panel
  const pin = 7;
  const inset = 30;
  const holes: Array<[number, number]> = [
    [bx + inset, by + bh - inset],
    [bx + bw - inset, by + bh - inset],
    [bx + inset, by + inset],
    [bx + bw - inset, by + inset],
  ];
  const k = 0.5523;
  for (const [hx, hy] of holes) {
    ops.push(
      "q",
      "0.8 w",
      `${(hx + pin).toFixed(2)} ${hy.toFixed(2)} m`,
      `${(hx + pin).toFixed(2)} ${(hy + pin * k).toFixed(2)} ${(hx + pin * k).toFixed(2)} ${(hy + pin).toFixed(2)} ${hx.toFixed(2)} ${(hy + pin).toFixed(2)} c`,
      `${(hx - pin * k).toFixed(2)} ${(hy + pin).toFixed(2)} ${(hx - pin).toFixed(2)} ${(hy + pin * k).toFixed(2)} ${(hx - pin).toFixed(2)} ${hy.toFixed(2)} c`,
      `${(hx - pin).toFixed(2)} ${(hy - pin * k).toFixed(2)} ${(hx - pin * k).toFixed(2)} ${(hy - pin).toFixed(2)} ${hx.toFixed(2)} ${(hy - pin).toFixed(2)} c`,
      `${(hx + pin * k).toFixed(2)} ${(hy - pin).toFixed(2)} ${(hx + pin).toFixed(2)} ${(hy - pin * k).toFixed(2)} ${(hx + pin).toFixed(2)} ${hy.toFixed(2)} c`,
      "S",
      "Q",
    );
  }

  // Print instructions above the panel
  centeredText(ops, "PRINT AT 100% SCALE - NO FIT TO PAGE", cx, by + bh + 44, 9, 2);
  // Handle below the cut line
  centeredText(ops, "GRYT RUN CLUB   @GRYTRUNCLUB   GRYTRUN.COM", cx, by - 44, 8, 2);

  const content = ops.join("\n");

  const objs: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}
