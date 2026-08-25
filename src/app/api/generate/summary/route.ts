import { NextRequest, NextResponse } from "next/server";
import { SummarizerService } from "@/services/ai/summarizer";
import { ApiResponse, StudySummary } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudySummary>>> {
  try {
    const body = await request.json();
    const { text, options } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Missing or invalid 'text' field in JSON request body.",
          },
        },
        { status: 400 }
      );
    }

    const result = await SummarizerService.summarize(text, options);

    return NextResponse.json(
      {
        success: true,
        data: result.summary,
        telemetry: {
          durationMs: result.telemetry.durationMs,
          tokensEstimated: result.telemetry.tokensEstimated,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI summary generation failed.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_GENERATION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
