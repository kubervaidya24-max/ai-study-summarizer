import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessor } from "@/services/document";
import { ApiResponse, ExtractedDocumentResult } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ExtractedDocumentResult>>> {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_FILE",
            message: "No valid file was provided in request body. Expected form-data field 'file'.",
          },
        },
        { status: 400 }
      );
    }

    const result = await DocumentProcessor.processFile(file);
    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        data: result,
        telemetry: {
          durationMs,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error extracting text from document.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXTRACTION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
