import { OpenAIProvider } from "./openai-provider";

export class GroqProvider extends OpenAIProvider {
  constructor(apiKey: string, modelName = "llama-3.3-70b-versatile") {
    super(apiKey, modelName, "https://api.groq.com/openai/v1");
    this.name = "Groq Cloud (Llama 3.3)";
  }
}
