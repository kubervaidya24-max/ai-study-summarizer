import OpenAI from "openai";
import { LLMProvider, SummaryGenerationOptions } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";
import { cleanAndParseSummaryJson } from "./schemas/summary";
import { cleanAndParseFlashcardsJson } from "./schemas/flashcards";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryUserPrompt } from "./prompts/summary";
import { FLASHCARDS_SYSTEM_PROMPT, buildFlashcardsUserPrompt } from "./prompts/flashcards";

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

  async generateFlashcards(text: string, count = 6): Promise<Flashcard[]> {
    const userPrompt = buildFlashcardsUserPrompt(text, count);

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: "system", content: FLASHCARDS_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "";
    return cleanAndParseFlashcardsJson(content);
  }

  async generateQuiz(): Promise<QuizQuestion[]> {
    throw new Error("Quiz generation will be implemented in Level 7.");
  }
}
