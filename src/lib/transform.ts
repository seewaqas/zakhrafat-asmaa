/** Pure text transforms. No DOM. Safe on the server and in the browser. */

export const MAX_INPUT_GRAPHEMES = 500;

const segmenter = new Intl.Segmenter("ar", { granularity: "grapheme" });

export function graphemes(input: string): string[] {
  return [...segmenter.segment(input)].map((part) => part.segment);
}

export function isEmoji(grapheme: string): boolean {
  return /\p{Extended_Pictographic}/u.test(grapheme);
}

function isMark(char: string): boolean {
  return /\p{M}/u.test(char);
}

export function visibleLength(input: string): number {
  return graphemes(input).length;
}

export function clampInput(input: string): string {
  const parts = graphemes(input);
  if (parts.length <= MAX_INPUT_GRAPHEMES) return input;
  return parts.slice(0, MAX_INPUT_GRAPHEMES).join("");
}

export function mapGraphemes(input: string, mapChar: (base: string) => string): string {
  return graphemes(input)
    .map((grapheme) => {
      if (isEmoji(grapheme) || /^\s$/u.test(grapheme)) return grapheme;
      const chars = [...grapheme.normalize("NFD")];
      const base = chars[0];
      if (!base || isMark(base)) return grapheme;
      return mapChar(base) + chars.slice(1).join("");
    })
    .join("");
}

export function applyMap(input: string, map: Readonly<Record<string, string>>): string {
  return mapGraphemes(input, (base) => (Object.hasOwn(map, base) ? map[base] : base));
}

/** At most two combining marks, and never on emoji or spaces. */
export function applyMarks(input: string, marks: readonly string[]): string {
  const safe = marks.slice(0, 2);
  if (safe.length === 0) return input;
  return graphemes(input)
    .map((grapheme) => {
      if (isEmoji(grapheme) || /^\s$/u.test(grapheme)) return grapheme;
      const existing = [...grapheme.normalize("NFD")].filter((char) => isMark(char)).length;
      if (existing >= 2) return grapheme;
      return grapheme + safe.slice(0, 2 - existing).join("");
    })
    .join("");
}

export function applyFrame(input: string, prefix: string, suffix: string): string {
  const body = input.trim();
  if (!body) return input;
  return `${prefix}${body}${suffix}`;
}

export function insertBetween(input: string, mark: string): string {
  const parts = graphemes(input);
  let started = false;
  let out = "";
  for (const grapheme of parts) {
    if (/^\s$/u.test(grapheme)) {
      out += grapheme;
      started = false;
      continue;
    }
    if (started) out += mark;
    out += grapheme;
    started = true;
  }
  return out;
}

export function reverseGraphemes(input: string): string {
  return graphemes(input).reverse().join("");
}

export function spaceOut(input: string): string {
  const parts = graphemes(input).filter((grapheme) => !/^\s$/u.test(grapheme));
  return parts.join(" ");
}

const LEET: Record<string, string> = Object.assign(Object.create(null) as Record<string, string>, {
  a: "4",
  A: "4",
  e: "3",
  E: "3",
  i: "1",
  I: "1",
  o: "0",
  O: "0",
  s: "5",
  S: "5",
  t: "7",
  T: "7",
});

export function toLeet(input: string): string {
  return mapGraphemes(input, (base) => LEET[base] ?? base).normalize("NFC");
}

export function blankMap(): Record<string, string> {
  return Object.create(null) as Record<string, string>;
}

export function isAssigned(codePoint: number): boolean {
  return !/\p{Cn}/u.test(String.fromCodePoint(codePoint));
}

export function fillAlphabet(
  start: number,
  letters: string,
  preset: Record<string, string> = {},
): Record<string, string> {
  const map = blankMap();
  for (const [key, value] of Object.entries(preset)) map[key] = value;
  for (let index = 0; index < letters.length; index += 1) {
    const letter = letters[index];
    if (!letter || Object.hasOwn(map, letter)) continue;
    const codePoint = start + index;
    if (!isAssigned(codePoint)) continue;
    map[letter] = String.fromCodePoint(codePoint);
  }
  return map;
}

export function fillDigits(start: number, into: Record<string, string>): void {
  for (let digit = 0; digit < 10; digit += 1) {
    const codePoint = start + digit;
    if (!isAssigned(codePoint)) continue;
    into[String(digit)] = String.fromCodePoint(codePoint);
  }
}

export function mirrorCase(upper: Record<string, string>): Record<string, string> {
  const map = blankMap();
  for (const [key, value] of Object.entries(upper)) {
    map[key] = value;
    const lower = key.toLocaleLowerCase("en");
    if (!Object.hasOwn(map, lower)) map[lower] = value;
  }
  return map;
}
