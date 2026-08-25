import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("AI Study Summarizer"),
  DEFAULT_AI_PROVIDER: z.enum(["gemini", "openai", "anthropic", "groq", "mock"]).default("gemini"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  DATABASE_URL: z.string().default("file:./dev.db"),
  ENABLE_TELEMETRY: z.string().transform((val) => val === "true").default("true"),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  DEFAULT_AI_PROVIDER: process.env.DEFAULT_AI_PROVIDER,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  ENABLE_TELEMETRY: process.env.ENABLE_TELEMETRY,
});
