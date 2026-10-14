import assert from "node:assert/strict";
import test from "node:test";
import { getStyle, styleApplies, STYLES } from "./styles.ts";

test("style ids are unique", () => {
  const ids = STYLES.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("bold maps a latin letter and leaves arabic untouched", () => {
  const bold = getStyle("bold");
  assert.ok(bold);
  assert.equal(bold.apply("A"), "𝐀");
  assert.equal(styleApplies(bold, "محمد"), false);
  assert.equal(styleApplies(bold, "Ahmed"), true);
});

test("glitch is marked as changing letters and uses at most two marks", () => {
  const glitch = getStyle("glitch");
  assert.ok(glitch);
  assert.equal(glitch.changesLetters, true);
  const out = glitch.apply("A");
  const marks = [...out.normalize("NFD")].filter((char) => /\p{M}/u.test(char));
  assert.ok(marks.length <= 2);
  assert.equal(glitch.apply("😎"), "😎");
});

test("harakat style is flagged and frames are not", () => {
  assert.equal(getStyle("harakat")?.changesLetters, true);
  assert.equal(getStyle("tatweel")?.changesLetters, false);
  assert.equal(getStyle("crown")?.changesLetters, false);
});

test("a frame changes arabic and latin", () => {
  const crown = getStyle("crown");
  assert.ok(crown);
  assert.equal(styleApplies(crown, "نور"), true);
  assert.equal(styleApplies(crown, "Nora"), true);
});

test("royal tatweel keeps the joining rule inside the frame", () => {
  const royal = getStyle("royal-tatweel");
  assert.ok(royal);
  assert.equal(royal.apply("محمد"), "♛ م\u0640ح\u0640م\u0640د ♛");
  assert.equal(royal.apply("لا"), "♛ لا ♛");
});
