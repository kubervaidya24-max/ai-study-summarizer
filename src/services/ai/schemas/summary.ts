import { z } from "zod";
import { StudySummary } from "@/types";

export const conceptSchema = z.object({
  term: z.string().min(1, "Concept term cannot be empty"),
  definition: z.string().min(5, "Definition must be descriptive"),
  importance: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  context: z.string().optional(),
});

export const summarySchema = z.object({
  title: z.string().min(3, "Title must be descriptive"),
  overview: z.string().min(20, "Overview must be at least 20 characters"),
  keyTakeaways: z.array(z.string().min(5)).min(2, "Must contain at least 2 key takeaways"),
  concepts: z.array(conceptSchema).min(1, "Must contain at least 1 key concept"),
  examTips: z.array(z.string().min(5)).default([]),
});

/**
 * Strips markdown code blocks and repairs common JSON formatting issues from LLM responses.
 */
export function cleanAndParseSummaryJson(rawText: string): StudySummary {
  let cleaned = rawText.trim();

  // Strip markdown code fence markers (e.g. ```json ... ```)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Remove potential non-JSON prefixes or suffixes
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    return summarySchema.parse(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid JSON structure";
    throw new Error(`AI Summary Schema Validation Failed: ${message}`);
  }
}
