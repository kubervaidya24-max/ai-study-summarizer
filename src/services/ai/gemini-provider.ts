import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, SummaryGenerationOptions } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";
import { cleanAndParseSummaryJson } from "./schemas/summary";
import { cleanAndParseFlashcardsJson } from "./schemas/flashcards";
import { cleanAndParseQuizJson } from "./schemas/quiz";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryUserPrompt } from "./prompts/summary";
import { FLASHCARDS_SYSTEM_PROMPT, buildFlashcardsUserPrompt } from "./prompts/flashcards";
import { QUIZ_SYSTEM_PROMPT, buildQuizUserPrompt } from "./prompts/quiz";

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

  async generateFlashcards(text: string, count = 6): Promise<Flashcard[]> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: FLASHCARDS_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const userPrompt = buildFlashcardsUserPrompt(text, count);
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    return cleanAndParseFlashcardsJson(responseText);
  }

  async generateQuiz(text: string, questionCount = 5): Promise<QuizQuestion[]> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: QUIZ_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const userPrompt = buildQuizUserPrompt(text, questionCount);
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    return cleanAndParseQuizJson(responseText);
  }
}
