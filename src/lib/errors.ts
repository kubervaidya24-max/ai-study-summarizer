import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export class AppError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(message: string, code = "INTERNAL_SERVER_ERROR", statusCode = 500, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class ExtractionError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "EXTRACTION_FAILED", 422, details);
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "AI_SERVICE_ERROR", 502, details);
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized access", details?: unknown) {
    super(message, "UNAUTHORIZED", 401, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again in a moment.", details?: unknown) {
    super(message, "RATE_LIMIT_EXCEEDED", 429, details);
  }
}

/**
 * Handles errors in Next.js Route Handlers and maps them to standard ApiResponse format.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}
