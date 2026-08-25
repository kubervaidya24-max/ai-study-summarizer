import { z } from "zod";
import { Flashcard } from "@/types";

export const flashcardSchema = z.object({
  id: z.string().default(() => `card_${Math.random().toString(36).substring(2, 9)}`),
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  topic: z.string().min(2, "Topic must be at least 2 characters").default("Core Subject"),
  sourceSnippet: z.string().optional(),
});

export const flashcardArraySchema = z.array(flashcardSchema);

export const flashcardWrapperSchema = z.object({
  flashcards: flashcardArraySchema,
});

/**
 * Parses and validates raw LLM output into typed Flashcards.
 */
export function cleanAndParseFlashcardsJson(rawText: string): Flashcard[] {
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
        return flashcardArraySchema.parse(parsed);
      }
    }

    // If output is wrapped in an object: { "flashcards": [...] }
    if (firstBrace !== -1) {
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          return flashcardArraySchema.parse(parsed);
        }
        const wrapped = flashcardWrapperSchema.parse(parsed);
        return wrapped.flashcards;
      }
    }

    throw new Error("No valid JSON array or object detected in response.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid flashcard structure";
    throw new Error(`AI Flashcards Schema Validation Failed: ${message}`);
  }
}
