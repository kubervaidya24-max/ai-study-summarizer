import OpenAI from "openai";
import { LLMProvider, SummaryGenerationOptions } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";
import { cleanAndParseSummaryJson } from "./schemas/summary";
import { cleanAndParseFlashcardsJson } from "./schemas/flashcards";
import { cleanAndParseQuizJson } from "./schemas/quiz";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryUserPrompt } from "./prompts/summary";
import { FLASHCARDS_SYSTEM_PROMPT, buildFlashcardsUserPrompt } from "./prompts/flashcards";
import { QUIZ_SYSTEM_PROMPT, buildQuizUserPrompt } from "./prompts/quiz";

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

  async generateQuiz(text: string, questionCount = 5): Promise<QuizQuestion[]> {
    const userPrompt = buildQuizUserPrompt(text, questionCount);

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: "system", content: QUIZ_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || "";
    return cleanAndParseQuizJson(content);
  }
}
