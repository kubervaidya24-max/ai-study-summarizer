import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, SummaryGenerationOptions } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";
import { cleanAndParseSummaryJson } from "./schemas/summary";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryUserPrompt } from "./prompts/summary";

export class GeminiProvider implements LLMProvider {
  name = "Google Gemini";
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = "gemini-1.5-flash") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generateSummary(
    text: string,
    options?: SummaryGenerationOptions
  ): Promise<StudySummary> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: SUMMARY_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const userPrompt = buildSummaryUserPrompt(text, options);
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    return cleanAndParseSummaryJson(responseText);
  }

  async generateFlashcards(): Promise<Flashcard[]> {
    throw new Error("Flashcards generation will be implemented in Level 6.");
  }

  async generateQuiz(): Promise<QuizQuestion[]> {
    throw new Error("Quiz generation will be implemented in Level 7.");
  }
}
