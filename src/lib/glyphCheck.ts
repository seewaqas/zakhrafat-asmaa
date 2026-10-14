import { graphemes } from "./transform.ts";

/**
 * A drawn glyph's advance and the number of inked pixels.
 * `a`/`d`/`l`/`r` are the canvas text bounding box.
 */
export type GlyphBox = {
  w: number;
  a: number;
  d: number;
  l: number;
  r: number;
  ink: number;
};

export type GlyphMeter = (text: string) => GlyphBox;

/**
 * Combining overlays used by the underline, strike, and glitch styles.
 * Arabic vowel marks live in the Arabic block and are not included:
 * those marks are in the same font as the letters, so they do not
 * trigger the Android fallback bug.
 */
const OVERLAY = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]/u;

export function sameGlyph(a: GlyphBox, b: GlyphBox): boolean {
  const tol = 0.6;
  return (
    Math.abs(a.w - b.w) <= tol &&
    Math.abs(a.a - b.a) <= tol &&
    Math.abs(a.d - b.d) <= tol &&
    Math.abs(a.l - b.l) <= tol &&
    Math.abs(a.r - b.r) <= tol &&
    Math.abs(a.ink - b.ink) <= Math.max(8, b.ink * 0.12)
  );
}

function overlayChars(cluster: string): string[] {
  return [...cluster].filter((char) => OVERLAY.test(char));
}

/**
 * True when this grapheme cluster paints as an empty box on this device.
 *
 * Android Chrome picks one font for a whole cluster. Noto Naskh Arabic has
 * the Arabic letter and not U+0332 / U+0335 / U+0336. The font that has the
 * line (Roboto / Noto Sans) has no Arabic. The line is drawn, and the letter
 * becomes the missing-glyph box. The measured result is the letter's advance
 * plus one missing-glyph advance per mark, with the missing glyph's ink.
 * A font that really has both keeps the mark's advance near zero and only
 * adds the line's ink, so those clusters stay supported.
 */
export function clusterUnsupported(cluster: string, meter: GlyphMeter, missing: GlyphBox): boolean {
  if (!cluster || /^\s$/u.test(cluster)) return false;
  if (!(missing.w > 1) || !(missing.ink > 8)) return false;

  const box = meter(cluster);
  if (sameGlyph(box, missing)) return true;

  const marks = overlayChars(cluster);
  if (marks.length === 0) return false;

  const base = [...cluster].filter((char) => !OVERLAY.test(char)).join("");
  if (!base) return true;
  const baseBox = meter(base);
  if (sameGlyph(baseBox, missing)) return true;

  const unit = missing.w;
  const extra = box.w - baseBox.w;
  const tolerance = Math.max(2, unit * 0.12);
  const copies = Math.round(extra / unit);
  if (copies < 1 || copies > marks.length) return false;
  if (Math.abs(extra - copies * unit) > tolerance) return false;

  const extraInk = box.ink - baseBox.ink;
  const ratio = extraInk / (copies * missing.ink);
  return ratio >= 0.65 && ratio <= 1.4;
}

/** True when any cluster in `text` would paint as an empty box. */
export function textUnsupported(text: string, meter: GlyphMeter, missing: GlyphBox): boolean {
  for (const cluster of graphemes(text)) {
    if (clusterUnsupported(cluster, meter, missing)) return true;
  }
  return false;
}
