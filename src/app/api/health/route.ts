import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    // Probe database connectivity
    await db.user.count();
  } catch (error) {
    dbStatus = "unreachable";
    console.error("Health check DB probe failed:", error);
  }

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? Math.round(process.uptime()) : undefined,
      environment: process.env.NODE_ENV || "development",
      services: {
        database: {
          status: dbStatus,
          latencyMs: responseTimeMs,
        },
        aiProviders: {
          geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
          openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
          groqConfigured: Boolean(process.env.GROQ_API_KEY),
          fallbackActive: !process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY,
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
