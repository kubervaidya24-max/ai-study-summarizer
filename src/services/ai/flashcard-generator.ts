import { AIFactory } from "./factory";
import { Flashcard } from "@/types";
import { estimateTokens } from "@/services/document/chunker";

export interface FlashcardGenerationResponse {
  flashcards: Flashcard[];
  telemetry: {
    durationMs: number;
    tokensEstimated: number;
    provider: string;
    cardCount: number;
  };
}

export class FlashcardService {
  /**
   * Generates active recall flashcards from cleaned document text.
   */
  static async generate(
    text: string,
    options?: { count?: number; provider?: string }
  ): Promise<FlashcardGenerationResponse> {
    if (!text || text.trim().length < 20) {
      throw new Error("Text content is too short for flashcard generation (minimum 20 characters required).");
    }

    const startTime = Date.now();
    const provider = AIFactory.getProvider(options?.provider);
    const count = options?.count ?? 6;

    // Safety context truncation
    const safeText = text.length > 36000 ? text.slice(0, 36000) + "\n\n[Truncated]" : text;
    const tokensEstimated = estimateTokens(safeText);

    const flashcards = await provider.generateFlashcards(safeText, count);
    const durationMs = Date.now() - startTime;

    return {
      flashcards,
      telemetry: {
        durationMs,
        tokensEstimated,
        provider: provider.name,
        cardCount: flashcards.length,
      },
    };
  }
}
