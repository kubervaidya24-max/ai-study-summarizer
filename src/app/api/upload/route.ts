import { NextRequest, NextResponse } from "next/server";
import { UploadService } from "@/services/upload";
import { ApiResponse, DocumentMetadata } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<DocumentMetadata>>> {
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
            message: "No valid file was provided in the multipart request body. Expected field 'file'.",
          },
        },
        { status: 400 }
      );
    }

    // Process and validate file
    const result = await UploadService.processFile(file);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: result.error || "File validation failed.",
          },
        },
        { status: result.statusCode }
      );
    }

    const durationMs = Date.now() - startTime;

    const metadata: DocumentMetadata = {
      fileName: result.data.fileName,
      fileType: result.data.fileType,
      fileSize: result.data.fileSize,
      wordCount: 0, // Word count will be calculated in Level 4 (Extraction Pipeline)
      extractedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: metadata,
        telemetry: {
          durationMs,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during upload processing.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
