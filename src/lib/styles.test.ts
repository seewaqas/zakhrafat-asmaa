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

test("an arabic name has a full ornament grid in each popular chip", () => {
  const name = "محمد";
  const visible = (category: string) =>
    STYLES.filter((item) => (category === "all" || item.categories.includes(category)) && styleApplies(item, name)).length;
  assert.ok(visible("all") >= 90, `all ${visible("all")}`);
  assert.ok(visible("fancy") >= 18, `fancy ${visible("fancy")}`);
  assert.ok(visible("games") >= 18, `games ${visible("games")}`);
  assert.ok(visible("hearts") >= 12, `hearts ${visible("hearts")}`);
  assert.ok(visible("stars") >= 12, `stars ${visible("stars")}`);
  assert.ok(visible("symbols") >= 12, `symbols ${visible("symbols")}`);
});

test("only harakat and glitch are marked as changing letters", () => {
  const flagged = STYLES.filter((item) => item.changesLetters).map((item) => item.id).sort();
  assert.deepEqual(flagged, ["glitch", "harakat"]);
});
