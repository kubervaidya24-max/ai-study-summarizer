import { StudySummary, Flashcard, QuizQuestion } from "@/types";

export interface SummaryGenerationOptions {
  detailLevel?: "concise" | "detailed";
  targetAudience?: "student" | "researcher" | "exam_prep";
}

/**
 * Abstract LLM Provider Interface
 * All AI model implementations (Gemini, OpenAI, Anthropic, Groq, Mock) must conform to this interface.
 */
export interface LLMProvider {
  name: string;
  generateSummary(text: string, options?: SummaryGenerationOptions): Promise<StudySummary>;
  generateFlashcards(text: string, count?: number): Promise<Flashcard[]>;
  generateQuiz(text: string, questionCount?: number): Promise<QuizQuestion[]>;
}
