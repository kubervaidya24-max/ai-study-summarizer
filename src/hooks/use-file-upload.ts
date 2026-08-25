"use client";

import { useState, useCallback } from "react";
import { validateFile } from "@/services/upload/validator";
import { ApiResponse, DocumentMetadata } from "@/types";

export type UploadStatus = "idle" | "validating" | "uploading" | "success" | "error";

export interface UseFileUploadReturn {
  status: UploadStatus;
  progress: number;
  error: string | null;
  uploadedMetadata: DocumentMetadata | null;
  uploadFile: (file: File) => Promise<DocumentMetadata | null>;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedMetadata, setUploadedMetadata] = useState<DocumentMetadata | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setUploadedMetadata(null);
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<DocumentMetadata | null> => {
    // 1. Client-Side Pre-Validation
    setStatus("validating");
    setError(null);
    setProgress(10);

    const clientValidation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!clientValidation.isValid) {
      setStatus("error");
      setError(clientValidation.error || "File validation failed.");
      return null;
    }

    // 2. Upload Execution
    setStatus("uploading");
    setProgress(35);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress progression for good UX
      const progressTimer = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);

      const result: ApiResponse<DocumentMetadata> = await response.json();

      if (!response.ok || !result.success || !result.data) {
        setStatus("error");
        setError(result.error?.message || `Upload failed with status code ${response.status}.`);
        return null;
      }

      setProgress(100);
      setStatus("success");
      setUploadedMetadata(result.data);
      return result.data;
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Network error during file upload.";
      setError(message);
      return null;
    }
  }, []);

  return {
    status,
    progress,
    error,
    uploadedMetadata,
    uploadFile,
    reset,
  };
}
