import { NextRequest, NextResponse } from "next/server";
import { FlashcardService } from "@/services/ai/flashcard-generator";
import { ApiResponse, Flashcard } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Flashcard[]>>> {
  try {
    const body = await request.json();
    const { text, count, provider } = body;

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

    const result = await FlashcardService.generate(text, { count, provider });

    return NextResponse.json(
      {
        success: true,
        data: result.flashcards,
        telemetry: {
          durationMs: result.telemetry.durationMs,
          tokensEstimated: result.telemetry.tokensEstimated,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI flashcards generation failed.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FLASHCARD_GENERATION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
