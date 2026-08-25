import { DocumentType } from "@/types";

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: DocumentType;
}

export const ALLOWED_EXTENSIONS: Record<string, { type: DocumentType; maxSizeBytes: number }> = {
  ".pdf": { type: "pdf", maxSizeBytes: 25 * 1024 * 1024 }, // 25 MB
  ".txt": { type: "txt", maxSizeBytes: 10 * 1024 * 1024 }, // 10 MB
  ".md": { type: "md", maxSizeBytes: 10 * 1024 * 1024 },  // 10 MB
};

export const ALLOWED_MIME_TYPES: Record<string, DocumentType> = {
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/x-markdown": "md",
  "application/octet-stream": "txt", // common fallback for text files
};

/**
 * Validates a file on the client or server based on name, size, and optional MIME type.
 */
export function validateFile(file: { name: string; size: number; type?: string }): FileValidationResult {
  // 1. Check for empty/corrupted file
  if (!file || file.size === 0) {
    return {
      isValid: false,
      error: "The uploaded file is empty (0 bytes). Please upload a valid document.",
    };
  }

  // 2. Validate file extension
  const extensionMatch = file.name.match(/\.[0-9a-z]+$/i);
  if (!extensionMatch) {
    return {
      isValid: false,
      error: "File has no extension. Please upload a .pdf, .txt, or .md file.",
    };
  }

  const extension = extensionMatch[0].toLowerCase();
  const config = ALLOWED_EXTENSIONS[extension];

  if (!config) {
    return {
      isValid: false,
      error: `Unsupported file format '${extension}'. Only .pdf, .txt, and .md files are supported.`,
    };
  }

  // 3. Validate file size
  if (file.size > config.maxSizeBytes) {
    const maxMB = config.maxSizeBytes / (1024 * 1024);
    return {
      isValid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${maxMB}MB for ${extension.toUpperCase()} files.`,
    };
  }

  return {
    isValid: true,
    fileType: config.type,
  };
}

/**
 * Validates magic bytes of a buffer on the server to prevent disguised file execution.
 */
export function validateBufferMagicBytes(buffer: Uint8Array, fileType: DocumentType): boolean {
  if (fileType === "pdf") {
    // PDF magic bytes start with %PDF- (0x25 0x50 0x44 0x46 0x2D)
    if (buffer.length < 5) return false;
    const header = String.fromCharCode(...buffer.slice(0, 5));
    return header.startsWith("%PDF-");
  }

  // For plain text / markdown, verify it does not contain binary NULL bytes (which indicate binary executables)
  const sample = buffer.slice(0, Math.min(buffer.length, 1024));
  for (let i = 0; i < sample.length; i++) {
    if (sample[i] === 0) {
      return false; // Found null byte in text file
    }
  }

  return true;
}
