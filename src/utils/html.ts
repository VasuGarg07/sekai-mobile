const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== "#") return NAMED_ENTITIES[code.toLowerCase()] ?? entity;

    const codePoint =
      code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint);
  });
}

// AniList descriptions are HTML fragments (<br>, <i>, entities). React Native has no DOMParser,
// so tags are stripped and entities decoded by hand; nothing is rendered as HTML.
export function htmlToPlainText(html: string): string {
  const withLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  const withoutTags = withLineBreaks.replace(/<[^>]*>/g, "");
  return decodeEntities(withoutTags)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
