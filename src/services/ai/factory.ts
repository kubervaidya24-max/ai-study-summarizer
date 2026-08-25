import { LLMProvider } from "./provider";
import { GeminiProvider } from "./gemini-provider";
import { OpenAIProvider } from "./openai-provider";
import { GroqProvider } from "./groq-provider";
import { MockProvider } from "./mock-provider";

export class AIFactory {
  /**
   * Resolves the appropriate LLM provider based on environment keys and preferences.
   */
  static getProvider(preferredProvider?: string): LLMProvider {
    const providerKey = preferredProvider || process.env.DEFAULT_AI_PROVIDER || "gemini";

    // 1. Check Gemini
    if (providerKey === "gemini" && process.env.GEMINI_API_KEY) {
      return new GeminiProvider(process.env.GEMINI_API_KEY);
    }

    // 2. Check OpenAI
    if (providerKey === "openai" && process.env.OPENAI_API_KEY) {
      return new OpenAIProvider(process.env.OPENAI_API_KEY);
    }

    // 3. Check Groq
    if (providerKey === "groq" && process.env.GROQ_API_KEY) {
      return new GroqProvider(process.env.GROQ_API_KEY);
    }

    // 4. Auto-fallback to any available key
    if (process.env.GEMINI_API_KEY) {
      return new GeminiProvider(process.env.GEMINI_API_KEY);
    }
    if (process.env.OPENAI_API_KEY) {
      return new OpenAIProvider(process.env.OPENAI_API_KEY);
    }
    if (process.env.GROQ_API_KEY) {
      return new GroqProvider(process.env.GROQ_API_KEY);
    }

    // 5. Zero-config Mock Provider fallback
    return new MockProvider();
  }
}
