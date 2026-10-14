import { graphemes, isEmoji } from "./transform.ts";

/** Dual-joining Arabic letters. Tatweel is inserted only after these. */
const DUAL = new Set("بتثجحخسشصضطظعغفقكلمنهويئى".split(""));

const ALEF = new Set(["ا", "أ", "إ", "آ", "ٱ"]);

function baseChar(grapheme: string): string {
  return [...grapheme.normalize("NFD")][0] ?? "";
}

function isArabicLetter(grapheme: string): boolean {
  const base = baseChar(grapheme);
  return /[\u0621-\u064A\u0671]/.test(base);
}

/**
 * Insert U+0640 only after a dual-joining letter that is not at the end of the word.
 * Lam-alef stays a ligature. Digits, Latin, spaces, and emoji are left alone.
 */
export function tatweel(input: string): string {
  const parts = graphemes(input);
  let out = "";
  for (let index = 0; index < parts.length; index += 1) {
    const current = parts[index] ?? "";
    const next = parts[index + 1];
    out += current;
    if (!next || isEmoji(current)) continue;
    const base = baseChar(current);
    if (!DUAL.has(base)) continue;
    if (!isArabicLetter(next) || isEmoji(next)) continue;
    if (base === "ل" && ALEF.has(baseChar(next))) continue;
    out += "\u0640";
  }
  return out;
}

/** Remove Arabic harakat. Tatweel and base letters stay. */
export function stripTashkeel(input: string): string {
  return input.replace(/[\u064B-\u065F\u0670]/g, "");
}

const HARAKAT = ["\u064E", "\u064F", "\u0650"] as const;

/** Adds one vowel mark per Arabic letter. The badge on this style says the letters change. */
export function addHarakat(input: string): string {
  let index = 0;
  return graphemes(input)
    .map((grapheme) => {
      if (isEmoji(grapheme) || /^\s$/u.test(grapheme)) return grapheme;
      const base = baseChar(grapheme);
      if (!/[\u0621-\u064A]/.test(base)) return grapheme;
      const mark = HARAKAT[index % HARAKAT.length] ?? "\u064E";
      index += 1;
      return grapheme + mark;
    })
    .join("");
}
