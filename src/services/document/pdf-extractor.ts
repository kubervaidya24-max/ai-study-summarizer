import { extractText, getDocumentProxy } from "unpdf";

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  isScanned: boolean;
  warning?: string;
  info?: Record<string, unknown>;
}

/**
 * Server-Side In-Memory PDF Extraction using unpdf.
 */
export async function extractPdfText(buffer: Uint8Array): Promise<PdfExtractionResult> {
  try {
    const pdf = await getDocumentProxy(buffer);
    const pageCount = pdf.numPages || 1;
    const { text } = await extractText(pdf, { mergePages: true });

    const rawText = text || "";
    const characterCount = rawText.trim().length;
    const avgCharsPerPage = characterCount / pageCount;

    let isScanned = false;
    let warning: string | undefined;

    if (characterCount < 50) {
      isScanned = true;
      warning = "The uploaded PDF appears to be empty or contains scanned images without readable text layers.";
    } else if (avgCharsPerPage < 60) {
      isScanned = true;
      warning = "Very low text density detected. This PDF may contain primarily scanned graphics or diagrams.";
    }

    return {
      text: rawText,
      pageCount,
      isScanned,
      warning,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF document structure.";
    throw new Error(`PDF Extraction Error: ${message}`);
  }
}
