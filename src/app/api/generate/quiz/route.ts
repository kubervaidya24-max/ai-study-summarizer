import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/services/ai/quiz-generator";
import { ApiResponse, QuizQuestion } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<QuizQuestion[]>>> {
  try {
    const body = await request.json();
    const { text, questionCount, provider } = body;

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

    const result = await QuizService.generate(text, { questionCount, provider });

    return NextResponse.json(
      {
        success: true,
        data: result.quiz,
        telemetry: {
          durationMs: result.telemetry.durationMs,
          tokensEstimated: result.telemetry.tokensEstimated,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI quiz generation failed.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "QUIZ_GENERATION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
