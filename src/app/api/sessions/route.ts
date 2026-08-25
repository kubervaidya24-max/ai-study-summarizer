import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/services/db/session-repository";
import { auth } from "@/auth";
import { ApiResponse, StudySessionData } from "@/types";

export const dynamic = "force-dynamic";

export interface SessionSummaryItem {
  id: string;
  title: string;
  createdAt: Date;
  document: {
    fileName: string;
    fileType: string;
    fileSize: number;
    pageCount: number;
    wordCount: number;
  } | null;
  flashcardSet: {
    cardCount: number;
  } | null;
  quiz: {
    attempts: Array<{
      score: number;
      totalQuestions: number;
      percentage: number;
      completedAt: Date;
    }>;
  } | null;
}

// GET /api/sessions - List study sessions
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SessionSummaryItem[]>>> {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || undefined;

    const sessions = await SessionRepository.getUserSessions(session?.user?.id, search);

    return NextResponse.json(
      {
        success: true,
        data: sessions,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch study sessions.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_SESSIONS_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Save active study session
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudySessionData>>> {
  try {
    const session = await auth();
    const body = await request.json();
    const sessionData: StudySessionData = body;

    if (!sessionData || !sessionData.title || !sessionData.document || !sessionData.summary) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SESSION_PAYLOAD",
            message: "Missing required study session fields.",
          },
        },
        { status: 400 }
      );
    }

    const saved = await SessionRepository.saveStudySession(sessionData, session?.user?.id);

    return NextResponse.json(
      {
        success: true,
        data: saved,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save study session.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SAVE_SESSION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
