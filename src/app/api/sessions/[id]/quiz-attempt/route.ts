import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/services/db/session-repository";
import { auth } from "@/auth";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ recorded: boolean; attemptId: string }>>> {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const { score, totalQuestions, answers } = body;

    const sessionData = await SessionRepository.getSessionById(id);
    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SESSION_NOT_FOUND",
            message: "Study session not found.",
          },
        },
        { status: 404 }
      );
    }

    const attempt = await SessionRepository.recordQuizAttempt({
      quizId: id,
      userId: session?.user?.id,
      score,
      totalQuestions,
      answers,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          recorded: true,
          attemptId: attempt.id,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record quiz attempt.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECORD_ATTEMPT_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
