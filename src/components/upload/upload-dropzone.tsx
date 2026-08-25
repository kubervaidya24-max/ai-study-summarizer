"use client";

import * as React from "react";
import {
  UploadCloud,
  CheckCircle,
  Sparkles,
  RefreshCw,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { UploadStatus } from "@/hooks/use-file-upload";

interface UploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  onLoadMockDemo?: () => void;
  onClearFile?: () => void;
  uploadStatus?: UploadStatus;
  uploadProgress?: number;
  uploadError?: string | null;
  selectedFileName?: string;
  selectedFileSize?: number;
}

export function UploadDropzone({
  onFileSelect,
  onLoadMockDemo,
  onClearFile,
  uploadStatus = "idle",
  uploadProgress = 0,
  uploadError = null,
  selectedFileName,
  selectedFileSize,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isUploading = uploadStatus === "uploading" || uploadStatus === "validating";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelect) onFileSelect(file);
    }
    // Reset file input so selecting the same file triggers change
    e.target.value = "";
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-3 text-red-300 text-xs md:text-sm animate-in fade-in-50 duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Upload Error</span>
              <p className="leading-relaxed">{uploadError}</p>
            </div>
          </div>
          {onClearFile && (
            <button
              onClick={onClearFile}
              className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
          isDragOver
            ? "border-blue-400 bg-blue-500/10 scale-[1.01] shadow-2xl shadow-blue-500/20"
            : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
        } ${isUploading ? "opacity-90 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mb-5">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 shadow-lg">
            {isUploading ? (
              <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
            ) : selectedFileName ? (
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 max-w-md z-10">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isUploading ? (
              "Uploading & Validating Document..."
            ) : selectedFileName ? (
              <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Ready: {selectedFileName}
              </span>
            ) : (
              "Upload Lecture PDF or Study Notes"
            )}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            {isUploading
              ? "Verifying file integrity, headers, and MIME encoding..."
              : "Drag & drop your study material here, or click to browse files."}
          </p>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="w-full max-w-sm mt-6 space-y-2 z-10">
            <Progress value={uploadProgress} className="h-2" />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Uploading to server...</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
        )}

        {/* Format Badges */}
        {!isUploading && !selectedFileName && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 z-10">
            {siteConfig.supportedFileTypes.map((type) => (
              <span
                key={type.extension}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[11px] font-mono text-slate-300 border border-slate-700/60"
              >
                {type.extension.toUpperCase()} (≤{type.maxSizeMB}MB)
              </span>
            ))}
          </div>
        )}

        {/* Loaded File Preview Badge */}
        {selectedFileName && !isUploading && (
          <div className="mt-5 flex items-center gap-3 p-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 z-10">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-slate-200">{selectedFileName}</span>
            {selectedFileSize && (
              <Badge variant="secondary" className="text-[10px]">
                {formatBytes(selectedFileSize)}
              </Badge>
            )}
            {onClearFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFile();
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Demo Loader Button */}
      {onLoadMockDemo && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Want to test immediately without uploading a file?</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMockDemo}
            disabled={isUploading}
            className="w-full sm:w-auto text-xs gap-1.5 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample: Raft Consensus Study Set
          </Button>
        </div>
      )}
    </div>
  );
}
