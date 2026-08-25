"use client";

import * as React from "react";
import { StudySessionData } from "@/types";
import { downloadMarkdownFile } from "@/services/export/markdown-exporter";
import { openPrintableStudyGuide } from "@/services/export/print-exporter";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Printer,
  Copy,
  Check,
  X,
  FileText,
  Table,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: StudySessionData;
}

export function ExportModal({ isOpen, onClose, sessionData }: ExportModalProps) {
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySummary = async () => {
    const text = `${sessionData.title}\n\n${sessionData.summary.overview}\n\nKey Takeaways:\n${sessionData.summary.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopiedType("summary");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyFlashcardsCsv = async () => {
    let csv = "Question,Answer,Difficulty,Topic\n";
    sessionData.flashcards.forEach((c) => {
      csv += `"${c.question.replace(/"/g, '""')}","${c.answer.replace(/"/g, '""')}","${c.difficulty}","${c.topic}"\n`;
    });
    await navigator.clipboard.writeText(csv);
    setCopiedType("flashcards");
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Study Assets</h3>
              <p className="text-xs text-slate-400">Save your summary, deck, and quiz for offline review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {/* Markdown Download */}
          <button
            onClick={() => {
              downloadMarkdownFile(sessionData);
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Markdown Document (.md)</p>
                <p className="text-[11px] text-slate-400">Formatted with tables, active-recall Q&A, and quiz key</p>
              </div>
            </div>
            <FileDown className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </button>

          {/* Print to PDF */}
          <button
            onClick={() => {
              openPrintableStudyGuide(sessionData);
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Printable Study Sheet / PDF</p>
                <p className="text-[11px] text-slate-400">High-contrast clean layout for printing or saving to PDF</p>
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </button>

          {/* Copy Summary Text */}
          <button
            onClick={handleCopySummary}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                {copiedType === "summary" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Copy Summary & Takeaways</p>
                <p className="text-[11px] text-slate-400">Quickly paste overview directly into Notion or Obsidian</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {copiedType === "summary" ? "Copied!" : "Clipboard"}
            </span>
          </button>

          {/* Copy Flashcards CSV */}
          <button
            onClick={handleCopyFlashcardsCsv}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                {copiedType === "flashcards" ? <Check className="w-4 h-4 text-amber-400" /> : <Table className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Copy Flashcards (Anki CSV)</p>
                <p className="text-[11px] text-slate-400">Import directly into Anki or Quizlet</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {copiedType === "flashcards" ? "Copied!" : "CSV"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
