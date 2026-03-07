/**
 * Split text into chunks at natural break points within maxLength characters.
 *
 * Priority order for split points:
 * 1. Paragraph break (\n\n)
 * 2. Sentence ending (。！？!?)
 * 3. Single newline
 * 4. Japanese/Chinese comma (、，) or ASCII comma
 * 5. Space
 * 6. Hard cut at maxLength
 */
export function splitText(text: string, maxLength: number): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  if (trimmed.length <= maxLength) return [trimmed];

  const chunks: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    const candidate = remaining.slice(0, maxLength);

    // 1. Paragraph break
    const paraBreak = candidate.lastIndexOf("\n\n");
    if (paraBreak > 0) {
      chunks.push(remaining.slice(0, paraBreak).trimEnd());
      remaining = remaining.slice(paraBreak + 2).trimStart();
      continue;
    }

    // 2. Sentence ending
    const sentenceEnd = lastIndexOfAny(candidate, ["。", "！", "？", "!", "?"]);
    if (sentenceEnd > 0) {
      chunks.push(remaining.slice(0, sentenceEnd + 1).trimEnd());
      remaining = remaining.slice(sentenceEnd + 1).trimStart();
      continue;
    }

    // 3. Single newline
    const newline = candidate.lastIndexOf("\n");
    if (newline > 0) {
      chunks.push(remaining.slice(0, newline).trimEnd());
      remaining = remaining.slice(newline + 1).trimStart();
      continue;
    }

    // 4. Comma
    const comma = lastIndexOfAny(candidate, ["、", "，", ","]);
    if (comma > 0) {
      chunks.push(remaining.slice(0, comma + 1).trimEnd());
      remaining = remaining.slice(comma + 1).trimStart();
      continue;
    }

    // 5. Space
    const space = candidate.lastIndexOf(" ");
    if (space > 0) {
      chunks.push(remaining.slice(0, space).trimEnd());
      remaining = remaining.slice(space + 1).trimStart();
      continue;
    }

    // 6. Hard cut
    chunks.push(remaining.slice(0, maxLength));
    remaining = remaining.slice(maxLength);
  }

  return chunks.filter((c) => c.length > 0);
}

function lastIndexOfAny(str: string, chars: string[]): number {
  return chars.reduce((max, ch) => Math.max(max, str.lastIndexOf(ch)), -1);
}
