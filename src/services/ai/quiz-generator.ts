import { AIFactory } from "./factory";
import { QuizQuestion } from "@/types";
import { estimateTokens } from "@/services/document/chunker";

export interface QuizGenerationResponse {
  quiz: QuizQuestion[];
  telemetry: {
    durationMs: number;
    tokensEstimated: number;
    provider: string;
    questionCount: number;
  };
}

export class QuizService {
  /**
   * Generates multiple choice quiz questions from cleaned document text.
   */
  static async generate(
    text: string,
    options?: { questionCount?: number; provider?: string }
  ): Promise<QuizGenerationResponse> {
    if (!text || text.trim().length < 20) {
      throw new Error("Text content is too short for quiz generation (minimum 20 characters required).");
    }

    const startTime = Date.now();
    const provider = AIFactory.getProvider(options?.provider);
    const questionCount = options?.questionCount ?? 5;

    // Safety context truncation
    const safeText = text.length > 36000 ? text.slice(0, 36000) + "\n\n[Truncated]" : text;
    const tokensEstimated = estimateTokens(safeText);

    const quiz = await provider.generateQuiz(safeText, questionCount);
    const durationMs = Date.now() - startTime;

    return {
      quiz,
      telemetry: {
        durationMs,
        tokensEstimated,
        provider: provider.name,
        questionCount: quiz.length,
      },
    };
  }
}
