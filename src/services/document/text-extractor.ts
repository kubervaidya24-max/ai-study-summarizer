/**
 * Plain Text & Markdown Extraction Service
 */

export function extractPlainText(buffer: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  let text = decoder.decode(buffer);

  // Remove UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  return text;
}
