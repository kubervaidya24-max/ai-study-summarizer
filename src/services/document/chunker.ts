import { ExtractedChunk } from "@/types";

export interface ChunkOptions {
  maxChunkTokens?: number; // Target max tokens per chunk (default: 1500 tokens ~ 6000 chars)
  overlapTokens?: number;  // Overlap tokens between consecutive chunks (default: 200 tokens)
}

/**
 * Estimates token count from text length (1 token ≈ 4 chars for English/academic text).
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Splits text into semantic token-aware chunks with sliding window overlap.
 */
export function chunkDocument(
  text: string,
  options: ChunkOptions = {}
): ExtractedChunk[] {
  const maxTokens = options.maxChunkTokens ?? 1500;
  const overlapTokens = options.overlapTokens ?? 200;

  const maxChars = maxTokens * 4;
  const overlapChars = overlapTokens * 4;

  if (!text || text.trim().length === 0) {
    return [];
  }

  // If text fits in a single chunk, return immediately
  if (text.length <= maxChars) {
    return [
      {
        id: "chunk_0",
        chunkIndex: 0,
        text: text.trim(),
        tokenEstimate: estimateTokens(text),
        wordCount: text.split(/\s+/).filter(Boolean).length,
      },
    ];
  }

  const chunks: ExtractedChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = startIndex + maxChars;

    if (endIndex >= text.length) {
      // Reached the end of the text
      const chunkText = text.slice(startIndex).trim();
      if (chunkText.length > 0) {
        chunks.push({
          id: `chunk_${chunkIndex}`,
          chunkIndex,
          text: chunkText,
          tokenEstimate: estimateTokens(chunkText),
          wordCount: chunkText.split(/\s+/).filter(Boolean).length,
        });
      }
      break;
    }

    // Try to find a natural paragraph boundary (\n\n) near the end
    let splitIndex = text.lastIndexOf("\n\n", endIndex);

    // If no paragraph boundary in the last 25% of the chunk window, try a sentence boundary (. / ! / ?)
    if (splitIndex < startIndex + maxChars * 0.75) {
      const searchWindow = text.slice(startIndex + Math.floor(maxChars * 0.75), endIndex);
      const sentenceMatch = searchWindow.search(/[.!?]\s+[A-Z]/);
      if (sentenceMatch !== -1) {
        splitIndex = startIndex + Math.floor(maxChars * 0.75) + sentenceMatch + 1;
      }
    }

    // If still no sentence boundary, fallback to last whitespace
    if (splitIndex < startIndex + maxChars * 0.75) {
      const spaceIndex = text.lastIndexOf(" ", endIndex);
      if (spaceIndex > startIndex) {
        splitIndex = spaceIndex;
      } else {
        splitIndex = endIndex;
      }
    }

    const chunkText = text.slice(startIndex, splitIndex).trim();
    if (chunkText.length > 0) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        chunkIndex,
        text: chunkText,
        tokenEstimate: estimateTokens(chunkText),
        wordCount: chunkText.split(/\s+/).filter(Boolean).length,
      });
      chunkIndex++;
    }

    // Advance startIndex with overlap
    startIndex = Math.max(splitIndex - overlapChars, startIndex + 1);
  }

  return chunks;
}
