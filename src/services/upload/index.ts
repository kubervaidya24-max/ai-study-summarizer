import { validateFile, validateBufferMagicBytes } from "./validator";
import { DocumentType } from "@/types";

export interface ProcessedUploadResult {
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  buffer: Uint8Array;
}

/**
 * Upload Service handling in-memory processing, validation, and metadata generation.
 */
export class UploadService {
  /**
   * Processes an incoming File object server-side.
   */
  static async processFile(file: File): Promise<{
    success: boolean;
    data?: ProcessedUploadResult;
    error?: string;
    statusCode: number;
  }> {
    // 1. Structural validation
    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.isValid || !validation.fileType) {
      return {
        success: false,
        error: validation.error || "File validation failed.",
        statusCode: 400,
      };
    }

    try {
      // 2. Read array buffer in memory
      const arrayBuffer = await file.arrayBuffer();
      const uint8Buffer = new Uint8Array(arrayBuffer);

      // 3. Verify magic bytes
      const isBufferSafe = validateBufferMagicBytes(uint8Buffer, validation.fileType);
      if (!isBufferSafe) {
        return {
          success: false,
          error:
            validation.fileType === "pdf"
              ? "Invalid PDF file structure. The file header does not match the standard PDF format."
              : "Binary or executable content detected in plain text file. Upload rejected for security.",
          statusCode: 415,
        };
      }

      return {
        success: true,
        data: {
          fileName: file.name,
          fileType: validation.fileType,
          fileSize: file.size,
          buffer: uint8Buffer,
        },
        statusCode: 200,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to read uploaded file buffer.";
      return {
        success: false,
        error: message,
        statusCode: 500,
      };
    }
  }
}

export { validateFile, validateBufferMagicBytes };
