import assert from "node:assert/strict";
import test from "node:test";
import { addHarakat, stripTashkeel, tatweel } from "./arabic.ts";
import { graphemes } from "./transform.ts";

test("tatweel joins dual letters and stops before a final dal", () => {
  assert.equal(tatweel("محمد"), "م\u0640ح\u0640م\u0640د");
});

test("tatweel skips right-joining zay and still joins yeh", () => {
  assert.equal(tatweel("زيد"), "زي\u0640د");
});

test("lam-alef stays a ligature", () => {
  assert.equal(tatweel("لا"), "لا");
});

test("digits and latin never receive tatweel", () => {
  assert.equal(tatweel("123"), "123");
  assert.equal(tatweel("Ahmed"), "Ahmed");
  assert.equal(tatweel("Ahmed 123"), "Ahmed 123");
});

test("emoji clusters stay whole", () => {
  const family = "👨‍👩‍👧";
  assert.equal(graphemes(family).length, 1);
  assert.equal(tatweel(family), family);
  assert.equal(tatweel("😎🎉"), "😎🎉");
});

test("harakat changes arabic letters and strip removes them", () => {
  const marked = addHarakat("محمد");
  assert.notEqual(marked, "محمد");
  assert.equal(stripTashkeel(marked), "محمد");
  assert.equal(stripTashkeel("م\u0640ح\u0640مد"), "م\u0640ح\u0640مد");
});
