import { addHarakat, doubleTatweel, tatweel } from "./arabic.ts";
import {
  applyFrame,
  applyMap,
  applyMarks,
  blankMap,
  fillAlphabet,
  fillDigits,
  insertBetween,
  mirrorCase,
  reverseGraphemes,
  spaceOut,
  toLeet,
} from "./transform.ts";

export type Locale = "ar" | "en";

export type StyleDefinition = {
  id: string;
  nameAr: string;
  nameEn: string;
  categories: readonly string[];
  /** Harakat and glitch change the letters, so the name may no longer be searchable. */
  changesLetters: boolean;
  apply: (input: string) => string;
};

export const CATEGORIES: readonly { id: string; ar: string; en: string }[] = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "favoritos", ar: "مفضلة", en: "Favorites" },
  { id: "arabi", ar: "عربي", en: "Arabic" },
  { id: "english", ar: "إنجليزي", en: "English" },
  { id: "games", ar: "ألعاب", en: "Games" },
  { id: "social", ar: "تواصل", en: "Social" },
  { id: "symbols", ar: "رموز", en: "Symbols" },
  { id: "hearts", ar: "قلوب", en: "Hearts" },
  { id: "stars", ar: "نجوم", en: "Stars" },
  { id: "frames", ar: "إطارات", en: "Frames" },
  { id: "fancy", ar: "فخم", en: "Fancy" },
  { id: "cute", ar: "كيوت", en: "Cute" },
];

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";

function withDigits(map: Record<string, string>, start: number): Record<string, string> {
  fillDigits(start, map);
  return map;
}

function joinMaps(...maps: Record<string, string>[]): Record<string, string> {
  const map = blankMap();
  for (const part of maps) {
    for (const [key, value] of Object.entries(part)) map[key] = value;
  }
  return map;
}

const scriptUpperHoles: Record<string, string> = {
  B: "\u212C",
  E: "\u2130",
  F: "\u2131",
  H: "\u210B",
  I: "\u2110",
  L: "\u2112",
  M: "\u2133",
  R: "\u211B",
};

const scriptLowerHoles: Record<string, string> = {
  e: "\u212F",
  g: "\u210A",
  o: "\u2134",
};

const frakturUpperHoles: Record<string, string> = {
  C: "\u212D",
  H: "\u210C",
  I: "\u2111",
  R: "\u211C",
  Z: "\u2128",
};

const doubleUpperHoles: Record<string, string> = {
  C: "\u2102",
  H: "\u210D",
  N: "\u2115",
  P: "\u2119",
  Q: "\u211A",
  R: "\u211D",
  Z: "\u2124",
};

const circledDigits: Record<string, string> = {
  "0": "\u24EA",
  "1": "\u2460",
  "2": "\u2461",
  "3": "\u2462",
  "4": "\u2463",
  "5": "\u2464",
  "6": "\u2465",
  "7": "\u2466",
  "8": "\u2467",
  "9": "\u2468",
};

const smallCaps = blankMap();
const SMALL_PAIRS: readonly [string, string][] = [
  ["a", "ᴀ"], ["b", "ʙ"], ["c", "ᴄ"], ["d", "ᴅ"], ["e", "ᴇ"], ["f", "ꜰ"], ["g", "ɢ"],
  ["h", "ʜ"], ["i", "ɪ"], ["j", "ᴊ"], ["k", "ᴋ"], ["l", "ʟ"], ["m", "ᴍ"], ["n", "ɴ"],
  ["o", "ᴏ"], ["p", "ᴘ"], ["q", "ǫ"], ["r", "ʀ"], ["s", "ꜱ"], ["t", "ᴛ"], ["u", "ᴜ"],
  ["v", "ᴠ"], ["w", "ᴡ"], ["x", "x"], ["y", "ʏ"], ["z", "ᴢ"],
];
for (const [letter, glyph] of SMALL_PAIRS) {
  smallCaps[letter] = glyph;
  smallCaps[letter.toUpperCase()] = glyph;
}

const superscript: Record<string, string> = {
  a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ",
  k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", r: "ʳ", s: "ˢ", t: "ᵗ", u: "ᵘ",
  v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ", A: "ᴬ", B: "ᴮ", D: "ᴰ", E: "ᴱ", G: "ᴳ",
  H: "ᴴ", I: "ᴵ", J: "ᴶ", K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ", O: "ᴼ", P: "ᴾ", R: "ᴿ",
  T: "ᵀ", U: "ᵁ", V: "ⱽ", W: "ᵂ",
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

const subscript: Record<string, string> = {
  a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ",
  p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
};
for (const key of Object.keys(subscript)) {
  if (key >= "a" && key <= "z") subscript[key.toUpperCase()] = subscript[key] ?? "";
}

const flipLower: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
};
const flip = blankMap();
for (const [key, value] of Object.entries(flipLower)) {
  flip[key] = value;
  const upper = key.toLocaleUpperCase("en");
  if (upper !== key) flip[upper] = value;
}

const MAPS = {
  bold: withDigits(joinMaps(fillAlphabet(0x1d400, UPPER), fillAlphabet(0x1d41a, LOWER)), 0x1d7ce),
  italic: joinMaps(fillAlphabet(0x1d434, UPPER), fillAlphabet(0x1d44e, LOWER, { h: "\u210E" })),
  boldItalic: joinMaps(fillAlphabet(0x1d468, UPPER), fillAlphabet(0x1d482, LOWER)),
  script: joinMaps(fillAlphabet(0x1d49c, UPPER, scriptUpperHoles), fillAlphabet(0x1d4b6, LOWER, scriptLowerHoles)),
  boldScript: joinMaps(fillAlphabet(0x1d4d0, UPPER), fillAlphabet(0x1d4ea, LOWER)),
  fraktur: joinMaps(fillAlphabet(0x1d504, UPPER, frakturUpperHoles), fillAlphabet(0x1d51e, LOWER)),
  boldFraktur: joinMaps(fillAlphabet(0x1d56c, UPPER), fillAlphabet(0x1d586, LOWER)),
  doubleStruck: withDigits(
    joinMaps(fillAlphabet(0x1d538, UPPER, doubleUpperHoles), fillAlphabet(0x1d552, LOWER)),
    0x1d7d8,
  ),
  mono: withDigits(joinMaps(fillAlphabet(0x1d670, UPPER), fillAlphabet(0x1d68a, LOWER)), 0x1d7f6),
  fullwidth: withDigits(joinMaps(fillAlphabet(0xff21, UPPER), fillAlphabet(0xff41, LOWER)), 0xff10),
  circled: joinMaps(fillAlphabet(0x24b6, UPPER), fillAlphabet(0x24d0, LOWER), circledDigits),
  squared: mirrorCase(fillAlphabet(0x1f170, UPPER)),
  smallCaps,
  superscript,
  subscript,
  flip,
};

type MapKey = keyof typeof MAPS;

function mapStyle(
  id: string,
  nameAr: string,
  nameEn: string,
  key: MapKey,
  categories: string[],
): StyleDefinition {
  const table = MAPS[key];
  return {
    id,
    nameAr,
    nameEn,
    categories,
    changesLetters: false,
    apply: (input) => applyMap(input, table),
  };
}

function style(
  id: string,
  nameAr: string,
  nameEn: string,
  categories: string[],
  apply: (input: string) => string,
  changesLetters = false,
): StyleDefinition {
  return { id, nameAr, nameEn, categories, changesLetters, apply };
}

function frame(
  id: string,
  nameAr: string,
  nameEn: string,
  prefix: string,
  suffix: string,
  categories: string[],
  body?: (input: string) => string,
): StyleDefinition {
  return style(id, nameAr, nameEn, categories, (input) => applyFrame(body ? body(input) : input, prefix, suffix));
}

function tatweelFrame(
  id: string,
  nameAr: string,
  nameEn: string,
  prefix: string,
  suffix: string,
  categories: string[],
): StyleDefinition {
  return frame(`${id}-tatweel`, `${nameAr} مطوّل`, `${nameEn} tatweel`, prefix, suffix, categories, tatweel);
}

function side(
  id: string,
  nameAr: string,
  nameEn: string,
  prefix: string,
  suffix: string,
  categories: string[],
  withTatweel = false,
): StyleDefinition[] {
  const plain = frame(id, nameAr, nameEn, prefix, suffix, categories);
  if (!withTatweel) return [plain];
  return [plain, tatweelFrame(id, nameAr, nameEn, prefix, suffix, categories)];
}

export const STYLES: readonly StyleDefinition[] = [
  mapStyle("bold", "عريض", "Bold", "bold", ["english", "games"]),
  mapStyle("italic", "مائل", "Italic", "italic", ["english", "social"]),
  mapStyle("bold-italic", "عريض مائل", "Bold italic", "boldItalic", ["english", "fancy"]),
  mapStyle("script", "خط اليد", "Script", "script", ["english", "social", "cute"]),
  mapStyle("bold-script", "خط يد عريض", "Bold script", "boldScript", ["english", "fancy", "social"]),
  mapStyle("fraktur", "قوطي", "Gothic", "fraktur", ["english", "games", "fancy"]),
  mapStyle("bold-fraktur", "قوطي عريض", "Bold gothic", "boldFraktur", ["english", "games", "fancy"]),
  mapStyle("double", "مزدوج", "Double-struck", "doubleStruck", ["english", "fancy"]),
  mapStyle("mono", "ثابت العرض", "Monospace", "mono", ["english"]),
  mapStyle("fullwidth", "عريض المسافة", "Fullwidth", "fullwidth", ["english"]),
  mapStyle("circled", "دوائر", "Circled", "circled", ["english", "cute"]),
  mapStyle("squared", "مربع", "Squared", "squared", ["english", "games"]),
  mapStyle("small-caps", "أحرف صغيرة", "Small caps", "smallCaps", ["english"]),
  mapStyle("superscript", "فوق السطر", "Superscript", "superscript", ["english"]),
  mapStyle("subscript", "تحت السطر", "Subscript", "subscript", ["english"]),
  style("upside-down", "مقلوب", "Upside down", ["english"], (input) => reverseGraphemes(applyMap(input, MAPS.flip))),
  style("leet", "أرقام بدل الحروف", "Leet", ["english", "games"], toLeet),
  style("reverse", "معكوس", "Reversed", ["english"], reverseGraphemes),
  style("spaced", "حروف متباعدة", "Spaced", ["english", "arabi"], spaceOut),
  style("underline", "تحته خط", "Underlined", ["english", "arabi"], (input) => applyMarks(input, ["\u0332"])),
  style("strike", "مشطوب", "Struck through", ["english", "arabi"], (input) => applyMarks(input, ["\u0336"])),
  style("glitch", "متقطع", "Glitch", ["english"], (input) => applyMarks(input, ["\u0335", "\u0332"]), true),

  style("tatweel", "تطويل", "Tatweel", ["arabi"], tatweel),
  style("harakat", "تشكيل", "Vowel marks", ["arabi"], addHarakat, true),
  style("hearts-between", "قلوب بين الحروف", "Hearts between", ["hearts", "cute", "arabi", "symbols"], (input) => insertBetween(input, "♡")),
  style("stars-between", "نجوم بين الحروف", "Stars between", ["stars", "games", "symbols"], (input) => insertBetween(input, "★")),
  style("dots-between", "نقاط بين الحروف", "Dots between", ["symbols", "cute"], (input) => insertBetween(input, "•")),
  style("flowers-between", "زهور بين الحروف", "Flowers between", ["cute", "symbols"], (input) => insertBetween(input, "✿")),

  frame("crown", "تاج", "Crown", "♛ ", " ♛", ["frames", "fancy", "games"]),
  frame("star-frame", "إطار نجوم", "Star frame", "★ ", " ★", ["frames", "stars", "games"]),
  frame("spark-frame", "إطار بريق", "Spark frame", "✦ ", " ✦", ["frames", "stars", "fancy"]),
  frame("heart-frame", "إطار قلوب", "Heart frame", "♡ ", " ♡", ["frames", "hearts", "cute"]),
  frame("flower-frame", "إطار زهور", "Flower frame", "✿ ", " ✿", ["frames", "cute"]),
  frame("bracket-frame", "أقواس", "Brackets", "『 ", " 』", ["frames", "social", "fancy"]),
  frame("lenticular", "جناحان", "Wings", "꧁", "꧂", ["frames", "games", "fancy"]),
  frame("swords", "سيوف", "Swords", "⚔ ", " ⚔", ["frames", "games"]),
  frame("diamond", "ماسة", "Diamond", "◆ ", " ◆", ["frames", "fancy"]),
  frame("moon", "قمر", "Moon", "☾ ", " ☽", ["frames", "cute", "social"]),
  frame("box", "إطار مربع", "Box frame", "┌ ", " ┐", ["frames"]),
  frame("double-box", "إطار مزدوج", "Double box", "【 ", " 】", ["frames", "fancy"]),
  frame("fire", "نار", "Fire", "🔥 ", " 🔥", ["frames", "games"]),
  frame("butterfly", "فراشة", "Butterfly", "🦋 ", " 🦋", ["frames", "cute"]),
  frame("music", "موسيقى", "Music", "♫ ", " ♫", ["frames", "social"]),
  frame("gold-emoji", "بريق ذهبي", "Gold sparkle", "✨ ", " ✨", ["frames", "fancy", "stars"]),
  frame("quiet", "إطار هادئ", "Quiet frame", "✧ ", " ✧", ["frames", "fancy"]),
  frame("royal-tatweel", "تطويل ملكي", "Royal tatweel", "♛ ", " ♛", ["frames", "arabi", "fancy"], tatweel),
  frame("game-tatweel", "تطويل للألعاب", "Game tatweel", "꧁", "꧂", ["frames", "arabi", "games"], tatweel),
  style("double-tatweel", "تطويل مزدوج", "Double tatweel", ["arabi", "fancy"], doubleTatweel),
  frame("royal-double", "تطويل ملكي مزدوج", "Royal double tatweel", "♛ ", " ♛", ["frames", "arabi", "fancy"], doubleTatweel),

  style("star-open-between", "نجمة مفرغة بين الحروف", "Open star between", ["stars", "symbols", "cute"], (input) => insertBetween(input, "☆")),
  style("spark-between", "بريق بين الحروف", "Spark between", ["stars", "symbols", "fancy"], (input) => insertBetween(input, "✦")),
  style("pin-between", "نجمة صغيرة", "Small star", ["stars", "symbols", "fancy"], (input) => insertBetween(input, "✧")),
  style("heart-solid-between", "قلب ممتلئ بين الحروف", "Solid heart between", ["hearts", "symbols", "cute"], (input) => insertBetween(input, "♥")),
  style("heart-tip-between", "قلب مدبب", "Heart tip", ["hearts", "symbols", "cute", "social"], (input) => insertBetween(input, "❥")),
  style("flower-alt-between", "زهرة بين الحروف", "Blossom between", ["cute", "symbols"], (input) => insertBetween(input, "❀")),
  style("ornament-between", "زخرفة بين الحروف", "Ornament between", ["symbols", "fancy", "arabi"], (input) => insertBetween(input, "༒")),
  style("petal-between", "بتلة بين الحروف", "Petal between", ["cute", "symbols"], (input) => insertBetween(input, "ꕥ")),
  style("bolt-between", "برق بين الحروف", "Bolt between", ["games", "symbols"], (input) => insertBetween(input, "⚡")),

  ...side("crown-emoji", "تاج ملون", "Color crown", "👑 ", " 👑", ["frames", "fancy", "arabi"], true),
  ...side("fleur", "شعار", "Fleur", "⚜️ ", " ⚜️", ["frames", "fancy", "arabi"], true),
  ...side("gem", "جوهرة", "Gem", "💎 ", " 💎", ["frames", "fancy"], true),
  ...side("skull", "جمجمة", "Skull", "💀 ", " 💀", ["frames", "games"], true),
  ...side("sword-emoji", "سيف ملون", "Color sword", "⚔️ ", " ⚔️", ["frames", "games", "arabi"], true),
  ...side("bolt", "برق", "Lightning", "⚡ ", " ⚡", ["frames", "games"], true),
  ...side("trophy", "كأس", "Trophy", "🏆 ", " 🏆", ["frames", "games"]),
  ...side("heart-solid", "إطار قلب ممتلئ", "Solid heart frame", "♥ ", " ♥", ["frames", "hearts", "cute"], true),
  ...side("heart-tip", "قلب مدبب", "Heart-tip frame", "❥ ", " ❥", ["frames", "hearts", "cute", "social"], true),
  ...side("heart-pink", "قلب وردي", "Pink heart", "💗 ", " 💗", ["frames", "hearts", "cute"], true),
  ...side("heart-blue", "قلب أزرق", "Blue heart", "💙 ", " 💙", ["frames", "hearts", "social"]),
  ...side("heart-purple", "قلب بنفسجي", "Purple heart", "💜 ", " 💜", ["frames", "hearts"]),
  ...side("heart-white", "قلب أبيض", "White heart", "🤍 ", " 🤍", ["frames", "hearts", "cute"]),
  ...side("heart-glow", "قلب لامع", "Glowing heart", "💖 ", " 💖", ["frames", "hearts", "cute"]),
  ...side("black-heart", "قلب أسود", "Black heart", "🖤 ", " 🖤", ["frames", "hearts", "fancy"]),
  ...side("star-open", "إطار نجمة مفرغة", "Open-star frame", "☆ ", " ☆", ["frames", "stars", "cute"], true),
  ...side("star-pin", "نجمة دقيقة", "Pin star", "✩ ", " ✩", ["frames", "stars"]),
  ...side("star-burst", "نجمة مزخرفة", "Burst star", "✪ ", " ✪", ["frames", "stars", "games"]),
  ...side("star-glow", "نجمة لامعة", "Glowing star", "🌟 ", " 🌟", ["frames", "stars"]),
  ...side("spark-emoji", "شرارة", "Spark emoji", "💫 ", " 💫", ["frames", "stars", "fancy"]),
  ...side("flower-alt", "زهرة خط", "Line flower", "❀ ", " ❀", ["frames", "cute"], true),
  ...side("blossom", "زهرة", "Blossom", "🌸 ", " 🌸", ["frames", "cute"], true),
  ...side("rose", "وردة", "Rose", "🌹 ", " 🌹", ["frames", "cute", "hearts"], true),
  ...side("moon-emoji", "هلال", "Crescent", "🌙 ", " 🌙", ["frames", "cute", "social"], true),
  ...side("wings-ornament", "أقواس مزخرفة", "Ornament wings", "༺", "༻", ["frames", "fancy", "games", "arabi"], true),
  ...side("angle", "أقواس زاوية", "Angle brackets", "❮", "❯", ["frames", "fancy"]),
  ...side("leaf", "أقواس ورق", "Leaf brackets", "⊱", "⊰", ["frames", "cute", "fancy"]),
  ...side("lion", "أسد", "Lion", "🦁 ", " 🦁", ["frames", "fancy", "games"], true),
  ...side("eagle", "نسر", "Eagle", "🦅 ", " 🦅", ["frames", "fancy", "games"]),
  ...side("diamond-blue", "ماسة زرقاء", "Blue diamond", "💠 ", " 💠", ["frames", "fancy"]),

  tatweelFrame("star-frame", "إطار نجوم", "Star frame", "★ ", " ★", ["frames", "stars", "games"]),
  tatweelFrame("spark-frame", "إطار بريق", "Spark frame", "✦ ", " ✦", ["frames", "stars", "fancy"]),
  tatweelFrame("heart-frame", "إطار قلوب", "Heart frame", "♡ ", " ♡", ["frames", "hearts", "cute"]),
  tatweelFrame("flower-frame", "إطار زهور", "Flower frame", "✿ ", " ✿", ["frames", "cute"]),
  tatweelFrame("bracket-frame", "أقواس", "Brackets", "『 ", " 』", ["frames", "social", "fancy"]),
  tatweelFrame("swords", "سيوف", "Swords", "⚔ ", " ⚔", ["frames", "games"]),
  tatweelFrame("diamond", "ماسة", "Diamond", "◆ ", " ◆", ["frames", "fancy"]),
  tatweelFrame("moon", "قمر", "Moon", "☾ ", " ☽", ["frames", "cute", "social"]),
  tatweelFrame("box", "إطار مربع", "Box frame", "┌ ", " ┐", ["frames", "arabi"]),
  tatweelFrame("double-box", "إطار مزدوج", "Double box", "【 ", " 】", ["frames", "fancy"]),
  tatweelFrame("fire", "نار", "Fire", "🔥 ", " 🔥", ["frames", "games"]),
  tatweelFrame("butterfly", "فراشة", "Butterfly", "🦋 ", " 🦋", ["frames", "cute"]),
  tatweelFrame("music", "موسيقى", "Music", "♫ ", " ♫", ["frames", "social"]),
  tatweelFrame("gold-emoji", "بريق ذهبي", "Gold sparkle", "✨ ", " ✨", ["frames", "fancy", "stars"]),
  tatweelFrame("quiet", "إطار هادئ", "Quiet frame", "✧ ", " ✧", ["frames", "fancy"]),
];

const byId = new Map(STYLES.map((item) => [item.id, item]));

export function getStyle(id: string): StyleDefinition | undefined {
  return byId.get(id);
}

export function styleName(item: StyleDefinition, locale: Locale): string {
  return locale === "ar" ? item.nameAr : item.nameEn;
}

export function categoryLabel(id: string, locale: Locale): string {
  const found = CATEGORIES.find((item) => item.id === id);
  if (!found) return id;
  return locale === "ar" ? found.ar : found.en;
}

export function stylesInCategory(category: string): readonly StyleDefinition[] {
  if (category === "all" || category === "favoritos") return STYLES;
  return STYLES.filter((item) => item.categories.includes(category));
}

/** A map that does not touch this input is hidden. Frames and marks still show. */
export function styleApplies(item: StyleDefinition, input: string): boolean {
  const body = input.trim();
  if (!body) return false;
  return item.apply(body) !== body;
}
