import { describe, it, expect } from "vitest";
import { chunkDocument, estimateTokens } from "@/services/document/chunker";

describe("DocumentChunker", () => {
  it("should estimate token count from characters (~4 chars per token)", () => {
    const text = "12345678";
    expect(estimateTokens(text)).toBe(2);
  });

  it("should return a single chunk if text is smaller than max chunk tokens", () => {
    const shortText = "Distributed consensus algorithm explanation.";
    const chunks = chunkDocument(shortText, { maxChunkTokens: 500, overlapTokens: 50 });
    expect(chunks.length).toBe(1);
    expect(chunks[0].text).toBe(shortText);
    expect(chunks[0].chunkIndex).toBe(0);
  });

  it("should split long text into multiple chunks with overlap", () => {
    const longText = Array(20)
      .fill("State machine replication ensures all nodes compute the same sequence of operations deterministically.")
      .join("\n\n");

    const chunks = chunkDocument(longText, { maxChunkTokens: 50, overlapTokens: 10 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].chunkIndex).toBe(0);
    expect(chunks[1].chunkIndex).toBe(1);
  });
});
