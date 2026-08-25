import OpenAI from "openai";
import { LLMProvider, SummaryGenerationOptions } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";
import { cleanAndParseSummaryJson } from "./schemas/summary";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryUserPrompt } from "./prompts/summary";

export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey: string, modelName = "gpt-4o-mini", baseURL?: string) {
    this.client = new OpenAI({ apiKey, baseURL });
    this.modelName = modelName;
  }

  async generateSummary(
    text: string,
    options?: SummaryGenerationOptions
  ): Promise<StudySummary> {
    const userPrompt = buildSummaryUserPrompt(text, options);

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || "";
    return cleanAndParseSummaryJson(content);
  }

  async generateFlashcards(): Promise<Flashcard[]> {
    throw new Error("Flashcards generation will be implemented in Level 6.");
  }

  async generateQuiz(): Promise<QuizQuestion[]> {
    throw new Error("Quiz generation will be implemented in Level 7.");
  }
}
