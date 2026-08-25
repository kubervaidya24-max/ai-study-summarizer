import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/services/db/session-repository";
import { auth } from "@/auth";
import { ApiResponse, StudySessionData } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/sessions/[id] - Retrieve single session with all assets
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<StudySessionData>>> {
  try {
    const { id } = await params;
    const sessionData = await SessionRepository.getSessionById(id);

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SESSION_NOT_FOUND",
            message: `Study session with ID '${id}' was not found.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: sessionData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve session.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "GET_SESSION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Delete session
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ deleted: boolean }>>> {
  try {
    const session = await auth();
    const { id } = await params;

    const deleted = await SessionRepository.deleteSession(id, session?.user?.id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SESSION_NOT_FOUND",
            message: `Study session '${id}' does not exist or has already been removed.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { deleted: true },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete session.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_SESSION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
