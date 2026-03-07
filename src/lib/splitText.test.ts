import { test } from "node:test";
import assert from "node:assert/strict";
import { splitText } from "./splitText.ts";

// --- empty / whitespace ---

test("returns empty array for empty string", () => {
  assert.deepEqual(splitText("", 140), []);
});

test("returns empty array for whitespace-only string", () => {
  assert.deepEqual(splitText("   \n\t  ", 140), []);
});

// --- no split needed ---

test("returns single chunk when text fits within maxLength", () => {
  assert.deepEqual(splitText("Hello world", 140), ["Hello world"]);
});

test("returns single chunk when text is exactly maxLength", () => {
  const text = "a".repeat(140);
  assert.deepEqual(splitText(text, 140), [text]);
});

// --- paragraph break ---

test("splits at paragraph break (priority 1)", () => {
  const part1 = "First paragraph.";
  const part2 = "Second paragraph.";
  const text = `${part1}\n\n${part2}`;
  const result = splitText(text, 30);
  assert.equal(result[0], part1);
  assert.equal(result[1], part2);
});

// --- sentence ending ---

test("splits at Japanese sentence ending 。 (priority 2)", () => {
  // maxLength must be >= part2.length so each part is a single chunk
  const part1 = "これは最初の文です。";
  const part2 = "これは二番目の文です。";
  // Set maxLength to part2.length so both parts fit as individual chunks
  const maxLength = part2.length; // 11
  const text = part1 + part2;
  const result = splitText(text, maxLength);
  assert.equal(result[0], part1);
  assert.equal(result[1], part2);
});

test("splits at ! sentence ending (priority 2)", () => {
  // Single-word second part ensures maxLength = part1.length works cleanly
  const part1 = "Hello!";
  const part2 = "World";
  const text = part1 + part2;
  const result = splitText(text, part1.length);
  assert.equal(result[0], part1);
  assert.equal(result[1], part2);
});

// --- newline ---

test("splits at single newline (priority 3)", () => {
  const part1 = "Line one";
  const part2 = "Line two";
  const text = `${part1}\n${part2}`;
  const result = splitText(text, part1.length + 1);
  assert.equal(result[0], part1);
  assert.equal(result[1], part2);
});

// --- comma ---

test("splits at Japanese comma 、 (priority 4)", () => {
  // No sentence endings present
  const text = "aaaaa、bbbbb";
  const result = splitText(text, 6); // "aaaaa、" = 6 chars
  assert.equal(result[0], "aaaaa、");
  assert.equal(result[1], "bbbbb");
});

// --- space ---

test("splits at space (priority 5)", () => {
  // No sentence ending or comma; just spaces
  const text = "hello world";
  const result = splitText(text, 6); // "hello " is 6 but space is at index 5
  assert.equal(result[0], "hello");
  assert.equal(result[1], "world");
});

// --- hard cut ---

test("hard cuts when no natural break point exists", () => {
  const text = "aaaaaaaaaa";
  const result = splitText(text, 4);
  assert.deepEqual(result, ["aaaa", "aaaa", "aa"]);
});

// --- all chunks within limit ---

test("all output chunks are within maxLength", () => {
  const text =
    "本日は晴天なり。空は青く澄み渡り、風もなく穏やかな一日です。公園では子供たちが元気よく遊んでいます。桜の花びらが舞い散り、春の訪れを感じさせます。このような良い天気の日には、外に出て散歩するのが一番です。";
  const maxLength = 50;
  const result = splitText(text, maxLength);
  assert.ok(result.length > 1);
  for (const chunk of result) {
    assert.ok(
      chunk.length <= maxLength,
      `Chunk length ${chunk.length} exceeds maxLength ${maxLength}: "${chunk}"`
    );
  }
});

// --- round-trip: no characters lost (ignoring inter-chunk whitespace trimming) ---

test("joining chunks reproduces the original text (no lost non-whitespace characters)", () => {
  const text =
    "Hello world! This is a test. Does it split correctly? Yes it does. Let us verify!";
  const maxLength = 30;
  const result = splitText(text, maxLength);
  // The function trims whitespace at chunk boundaries, so we compare stripped versions
  const joined = result.join(" ");
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  assert.equal(normalize(joined), normalize(text));
});
