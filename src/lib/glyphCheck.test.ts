import assert from "node:assert/strict";
import test from "node:test";
import { clusterUnsupported, textUnsupported, type GlyphBox, type GlyphMeter } from "./glyphCheck.ts";

/** Boxes measured in Chrome with only Noto Naskh Arabic and Noto Sans installed. */
const androidMissing: GlyphBox = { w: 21, a: 34, d: 9, l: -2, r: 19, ink: 286 };

const androidRows: Record<string, GlyphBox> = {
  "ن": { w: 19, a: 12, d: 8, l: -2, r: 18, ink: 102 },
  "و": { w: 15, a: 11, d: 7, l: -1, r: 14, ink: 113 },
  "ن\u0332": { w: 40, a: 34, d: 9, l: -2, r: 39, ink: 388 },
  "و\u0332": { w: 36, a: 34, d: 9, l: -2, r: 35, ink: 399 },
  "ن\u0336": { w: 40, a: 34, d: 9, l: -2, r: 39, ink: 388 },
  "ن\u0335\u0332": { w: 61, a: 34, d: 9, l: -2, r: 60, ink: 674 },
  "N": { w: 24, a: 24, d: 0, l: -3, r: 22, ink: 256 },
  "N\u0332": { w: 24, a: 24, d: 5, l: -3, r: 22, ink: 302 },
  "N\u0336": { w: 24, a: 24, d: 0, l: -3, r: 36, ink: 303 },
  "ن\u064E": { w: 19, a: 17, d: 8, l: -2, r: 18, ink: 117 },
  "★": androidMissing,
  "𝐀": androidMissing,
};

/** The same strings measured with the desktop fonts, where the marks attach. */
const desktopMissing: GlyphBox = { w: 19.2, a: 23, d: 0, l: -3, r: 17, ink: 128 };

const desktopRows: Record<string, GlyphBox> = {
  "ن": { w: 18.75, a: 13, d: 8, l: -2, r: 18, ink: 101 },
  "ن\u0332": { w: 23.5, a: 15, d: 8, l: 17, r: 22, ink: 165 },
  "ن\u0336": { w: 23.5, a: 15, d: 5, l: 21, r: 22, ink: 163 },
  "ن\u0335\u0332": { w: 23.5, a: 15, d: 8, l: 17, r: 22, ink: 185 },
  "N": { w: 24.32, a: 24, d: 0, l: -3, r: 22, ink: 251 },
  "N\u0332": { w: 24.32, a: 24, d: 5, l: -3, r: 22, ink: 295 },
  "ن\u064E": { w: 18.75, a: 17.17, d: 8, l: -2, r: 18, ink: 116 },
  "★": { w: 28.69, a: 24, d: 1, l: -2, r: 27, ink: 231 },
  "𝐀": { w: 20.8, a: 23, d: 0, l: 1, r: 22, ink: 197 },
};

function meterFrom(rows: Record<string, GlyphBox>): GlyphMeter {
  return (text) => {
    const found = rows[text];
    assert.ok(found, `fixture for ${[...text].map((char) => char.codePointAt(0)?.toString(16)).join("+")}`);
    return found;
  };
}

const android = meterFrom(androidRows);
const desktop = meterFrom(desktopRows);

test("android draws arabic combining lines as a missing-glyph box", () => {
  assert.equal(clusterUnsupported("ن\u0332", android, androidMissing), true);
  assert.equal(clusterUnsupported("و\u0332", android, androidMissing), true);
  assert.equal(clusterUnsupported("ن\u0336", android, androidMissing), true);
  assert.equal(clusterUnsupported("ن\u0335\u0332", android, androidMissing), true);
  assert.equal(textUnsupported("ن\u0332و\u0332 N\u0332", android, androidMissing), true);
});

test("android still draws latin combining lines and arabic vowel marks", () => {
  assert.equal(clusterUnsupported("N\u0332", android, androidMissing), false);
  assert.equal(clusterUnsupported("N\u0336", android, androidMissing), false);
  assert.equal(clusterUnsupported("ن", android, androidMissing), false);
  assert.equal(clusterUnsupported("ن\u064E", android, androidMissing), false);
  assert.equal(textUnsupported("N\u0332", android, androidMissing), false);
});

test("a symbol that uses the missing-glyph box is unsupported", () => {
  assert.equal(clusterUnsupported("★", android, androidMissing), true);
  assert.equal(clusterUnsupported("𝐀", android, androidMissing), true);
});

test("desktop fonts attach the same marks, so the styles stay", () => {
  assert.equal(clusterUnsupported("ن\u0332", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("ن\u0336", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("ن\u0335\u0332", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("N\u0332", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("ن\u064E", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("★", desktop, desktopMissing), false);
  assert.equal(clusterUnsupported("𝐀", desktop, desktopMissing), false);
  assert.equal(textUnsupported("ن\u0332", desktop, desktopMissing), false);
});

test("a cluster that is only the missing glyph is unsupported", () => {
  const missing = androidMissing;
  const base: GlyphBox = { w: 16, a: 12, d: 8, l: 0, r: 16, ink: 90 };
  const meter = meterFrom({ "ب": base, "ب\u0332": missing });
  assert.equal(clusterUnsupported("ب\u0332", meter, missing), true);
});
