"use client";

import * as React from "react";
import { UploadCloud, CheckCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface UploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  onLoadMockDemo?: () => void;
  isProcessing?: boolean;
  selectedFileName?: string;
  selectedFileSize?: number;
}

export function UploadDropzone({
  onFileSelect,
  onLoadMockDemo,
  isProcessing = false,
  selectedFileName,
  selectedFileSize,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
          isDragOver
            ? "border-blue-400 bg-blue-500/10 scale-[1.01] shadow-2xl shadow-blue-500/20"
            : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
        } ${isProcessing ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          className="hidden"
          onChange={handleInputChange}
          disabled={isProcessing}
        />

        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mb-5">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 shadow-lg">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 max-w-md z-10">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {selectedFileName ? (
              <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Ready: {selectedFileName}
              </span>
            ) : (
              "Upload Lecture PDF or Notes"
            )}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Drag & drop your study material here, or browse files from your computer.
          </p>
        </div>

        {/* Format Badges */}
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

        {selectedFileName && (
          <div className="mt-4 text-xs text-slate-400 font-mono">
            Size: {selectedFileSize ? formatBytes(selectedFileSize) : "Loaded"}
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
