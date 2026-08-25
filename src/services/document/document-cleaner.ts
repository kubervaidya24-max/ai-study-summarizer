/**
 * Document Text Cleaning & Normalization Service
 */

export interface CleanedTextResult {
  text: string;
  wordCount: number;
  characterCount: number;
}

export function cleanText(rawText: string): CleanedTextResult {
  if (!rawText) {
    return { text: "", wordCount: 0, characterCount: 0 };
  }

  let cleaned = rawText;

  // 1. Remove zero-width characters and invisible control chars
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

  // 2. Normalize smart quotes and typographic dashes to standard ASCII
  cleaned = cleaned
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...");

  // 3. Remove common repetitive slide noise (e.g., "Page 1 of 20", "Slide 12", etc.)
  cleaned = cleaned.replace(/^(Page|Slide)\s+\d+(\s+of\s+\d+)?$/gim, "");

  // 4. Fix hyphenated line breaks (e.g., "distrib-\nuted" -> "distributed")
  cleaned = cleaned.replace(/(\w+)-\n(\w+)/g, "$1$2");

  // 5. Replace multiple consecutive whitespace characters with a single space
  cleaned = cleaned.replace(/[^\S\r\n]+/g, " ");

  // 6. Normalize multiple consecutive line breaks (keep at most 2 for paragraph separation)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 7. Trim start and end
  cleaned = cleaned.trim();

  // Calculate metrics
  const words = cleaned.length > 0 ? cleaned.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characterCount = cleaned.length;

  return {
    text: cleaned,
    wordCount,
    characterCount,
  };
}
