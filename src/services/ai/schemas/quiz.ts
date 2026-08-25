import { z } from "zod";
import { QuizQuestion } from "@/types";

export const quizQuestionSchema = z.object({
  id: z.string().default(() => `quiz_${Math.random().toString(36).substring(2, 9)}`),
  question: z.string().min(8, "Question must be at least 8 characters"),
  options: z.tuple([
    z.string().min(1, "Option A cannot be empty"),
    z.string().min(1, "Option B cannot be empty"),
    z.string().min(1, "Option C cannot be empty"),
    z.string().min(1, "Option D cannot be empty"),
  ]),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(10, "Explanation must be descriptive"),
  topic: z.string().min(2).default("Core Concept"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
});

export const quizArraySchema = z.array(quizQuestionSchema);

export const quizWrapperSchema = z.object({
  quiz: quizArraySchema.optional(),
  questions: quizArraySchema.optional(),
});

/**
 * Parses and validates raw LLM output into typed Quiz Questions.
 */
export function cleanAndParseQuizJson(rawText: string): QuizQuestion[] {
  let cleaned = rawText.trim();

  // Strip markdown code fence blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find boundaries
  const firstBracket = cleaned.indexOf("[");
  const firstBrace = cleaned.indexOf("{");

  try {
    // If output is a raw array: [...]
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      const lastBracket = cleaned.lastIndexOf("]");
      if (lastBracket !== -1) {
        cleaned = cleaned.substring(firstBracket, lastBracket + 1);
        const parsed = JSON.parse(cleaned);
        return quizArraySchema.parse(parsed);
      }
    }

    // If output is wrapped in an object: { "quiz": [...] } or { "questions": [...] }
    if (firstBrace !== -1) {
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          return quizArraySchema.parse(parsed);
        }
        const wrapped = quizWrapperSchema.parse(parsed);
        const questions = wrapped.quiz || wrapped.questions;
        if (questions) return questions;
      }
    }

    throw new Error("No valid JSON array or object detected in quiz response.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid quiz structure";
    throw new Error(`AI Quiz Schema Validation Failed: ${message}`);
  }
}
