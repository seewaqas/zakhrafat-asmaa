import { clusterUnsupported, sameGlyph, type GlyphBox, type GlyphMeter } from "../lib/glyphCheck.ts";
import { graphemes } from "../lib/transform.ts";

const CACHE_KEY = "za-glyph-support";
const CACHE_VERSION = 1;

type Store = {
  v: number;
  font: string;
  flags: Record<string, boolean>;
};

function loadFlags(font: string): Map<string, boolean> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Partial<Store>;
    if (parsed.v !== CACHE_VERSION || parsed.font !== font || !parsed.flags || typeof parsed.flags !== "object") {
      return new Map();
    }
    return new Map(Object.entries(parsed.flags));
  } catch {
    return new Map();
  }
}

function saveFlags(font: string, flags: Map<string, boolean>): void {
  try {
    const entries = [...flags.entries()].slice(-400);
    const store: Store = { v: CACHE_VERSION, font, flags: Object.fromEntries(entries) };
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    /* Private mode can block storage. Detection still runs for this visit. */
  }
}

function measure(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, fontFamily: string, text: string): GlyphBox {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `32px ${fontFamily}`;
  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, 8, 52);
  const metrics = ctx.measureText(text);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let ink = 0;
  for (let index = 3; index < pixels.length; index += 4) {
    if ((pixels[index] ?? 0) > 20) ink += 1;
  }
  return {
    w: metrics.width,
    a: metrics.actualBoundingBoxAscent || 0,
    d: metrics.actualBoundingBoxDescent || 0,
    l: metrics.actualBoundingBoxLeft || 0,
    r: metrics.actualBoundingBoxRight || 0,
    ink,
  };
}

/**
 * Returns whether `text` paints with a missing-glyph box in `fontFamily`.
 * The family is the computed system stack of the result cards, so the check
 * matches what the card itself draws. If measurement fails, nothing is hidden.
 */
export function unsupportedOutput(fontFamily: string): (text: string) => boolean {
  if (!fontFamily) return () => false;
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 80;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return () => false;

  const boxes = new Map<string, GlyphBox>();
  const meter: GlyphMeter = (text) => {
    const cached = boxes.get(text);
    if (cached) return cached;
    const box = measure(ctx, canvas, fontFamily, text);
    boxes.set(text, box);
    return box;
  };

  let missing: GlyphBox;
  try {
    missing = meter("\uFFFF");
    const other = meter("\u0378");
    if (!sameGlyph(missing, other)) return () => false;
    if (!(missing.w > 1) || !(missing.ink > 8)) return () => false;
    if (sameGlyph(meter("A"), missing) && sameGlyph(meter("0"), missing)) return () => false;
  } catch {
    return () => false;
  }

  const flags = loadFlags(fontFamily);
  let dirty = false;
  let saveTimer = 0;

  return (text) => {
    let unsupported = false;
    for (const cluster of segment(text)) {
      const known = flags.get(cluster);
      if (known !== undefined) {
        if (known) unsupported = true;
        continue;
      }
      let bad = false;
      try {
        bad = clusterUnsupported(cluster, meter, missing);
      } catch {
        bad = false;
      }
      flags.set(cluster, bad);
      dirty = true;
      if (bad) unsupported = true;
    }
    if (dirty && saveTimer === 0) {
      saveTimer = window.setTimeout(() => {
        saveTimer = 0;
        dirty = false;
        saveFlags(fontFamily, flags);
      }, 200);
    }
    return unsupported;
  };
}

function segment(text: string): string[] {
  return graphemes(text);
}
