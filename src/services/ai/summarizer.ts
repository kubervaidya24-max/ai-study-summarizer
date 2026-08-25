import { AIFactory } from "./factory";
import { StudySummary } from "@/types";
import { SummaryGenerationOptions } from "./provider";
import { estimateTokens } from "@/services/document/chunker";

export interface SummarizeResponse {
  summary: StudySummary;
  telemetry: {
    durationMs: number;
    tokensEstimated: number;
    provider: string;
  };
}

export class SummarizerService {
  /**
   * Generates a structured study summary from cleaned document text.
   */
  static async summarize(
    text: string,
    options?: SummaryGenerationOptions & { provider?: string }
  ): Promise<SummarizeResponse> {
    if (!text || text.trim().length < 20) {
      throw new Error("Text content is too short for summary generation (minimum 20 characters required).");
    }

    const startTime = Date.now();
    const provider = AIFactory.getProvider(options?.provider);

    // Limit input text to ~12,000 tokens (approx 48,000 chars) for standard LLM context window safety
    const safeText = text.length > 48000 ? text.slice(0, 48000) + "\n\n[Content truncated for context limits]" : text;
    const tokensEstimated = estimateTokens(safeText);

    const summary = await provider.generateSummary(safeText, options);
    const durationMs = Date.now() - startTime;

    return {
      summary,
      telemetry: {
        durationMs,
        tokensEstimated,
        provider: provider.name,
      },
    };
  }
}
