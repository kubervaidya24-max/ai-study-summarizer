import { describe, it, expect } from "vitest";
import { cleanText } from "@/services/document/document-cleaner";

describe("DocumentCleaner", () => {
  it("should normalize smart quotes and unicode dashes", () => {
    const dirty = `“Hello ‘World’” – test — dash \u200B zero-width`;
    const result = cleanText(dirty);
    expect(result.text).toContain('"Hello \'World\'"');
    expect(result.text).toContain("- test - dash");
    expect(result.text).not.toContain("\u200B");
  });

  it("should unbreak words split across line breaks with hyphens", () => {
    const raw = "dis-\ntributed sys-\ntems";
    const result = cleanText(raw);
    expect(result.text).toContain("distributed systems");
  });

  it("should accurately compute word and character count metrics", () => {
    const text = "Raft is a consensus algorithm.\nIt is designed to be easy to understand.";
    const result = cleanText(text);
    expect(result.wordCount).toBe(13);
    expect(result.characterCount).toBeGreaterThan(50);
  });
});
