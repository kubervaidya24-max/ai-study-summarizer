import { extractPdfText } from "./pdf-extractor";
import { extractPlainText } from "./text-extractor";
import { cleanText } from "./document-cleaner";
import { chunkDocument, estimateTokens } from "./chunker";
import { UploadService } from "@/services/upload";
import { ExtractedDocumentResult, DocumentType } from "@/types";

export interface ProcessDocumentOptions {
  maxChunkTokens?: number;
  overlapTokens?: number;
}

/**
 * Master Document Processor Subsystem
 */
export class DocumentProcessor {
  /**
   * Processes a File directly from multipart request.
   */
  static async processFile(
    file: File,
    options?: ProcessDocumentOptions
  ): Promise<ExtractedDocumentResult> {
    const uploadResult = await UploadService.processFile(file);

    if (!uploadResult.success || !uploadResult.data) {
      throw new Error(uploadResult.error || "File processing failed during upload stage.");
    }

    return this.processBuffer({
      buffer: uploadResult.data.buffer,
      fileName: uploadResult.data.fileName,
      fileType: uploadResult.data.fileType,
      fileSize: uploadResult.data.fileSize,
      options,
    });
  }

  /**
   * Processes an in-memory document buffer.
   */
  static async processBuffer(params: {
    buffer: Uint8Array;
    fileName: string;
    fileType: DocumentType;
    fileSize: number;
    options?: ProcessDocumentOptions;
  }): Promise<ExtractedDocumentResult> {
    const { buffer, fileName, fileType, fileSize, options } = params;

    let rawText = "";
    let pageCount: number | undefined;
    let isScanned = false;
    let warning: string | undefined;

    // 1. Route to specialized text extractor
    if (fileType === "pdf") {
      const pdfResult = await extractPdfText(buffer);
      rawText = pdfResult.text;
      pageCount = pdfResult.pageCount;
      isScanned = pdfResult.isScanned;
      warning = pdfResult.warning;
    } else {
      rawText = extractPlainText(buffer);
      // Rough page count estimation for plain text documents (~500 words per page)
      const estimatedWords = rawText.split(/\s+/).filter(Boolean).length;
      pageCount = Math.max(1, Math.ceil(estimatedWords / 500));
    }

    // 2. Clean & Normalize Text
    const cleaned = cleanText(rawText);

    // 3. Check for empty extraction
    if (!cleaned.text || cleaned.characterCount === 0) {
      isScanned = true;
      warning =
        warning ||
        "No readable text could be extracted from this document. Please ensure the document is not an image-only scan or encrypted.";
    }

    // 4. Generate Semantic Chunks
    const chunks = chunkDocument(cleaned.text, {
      maxChunkTokens: options?.maxChunkTokens,
      overlapTokens: options?.overlapTokens,
    });

    return {
      metadata: {
        fileName,
        fileType,
        fileSize,
        wordCount: cleaned.wordCount,
        pageCount,
        extractedAt: new Date().toISOString(),
      },
      fullText: rawText,
      cleanedText: cleaned.text,
      wordCount: cleaned.wordCount,
      characterCount: cleaned.characterCount,
      pageCount,
      isScanned,
      warning,
      chunks,
    };
  }
}

export { cleanText, chunkDocument, estimateTokens, extractPdfText, extractPlainText };
