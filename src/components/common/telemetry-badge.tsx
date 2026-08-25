"use client";

import * as React from "react";
import { PipelineTelemetry } from "@/services/telemetry";
import { Zap, ChevronDown, ChevronUp, Cpu, ShieldCheck, Gauge, Layers, HelpCircle, BookOpen, FileText } from "lucide-react";

interface TelemetryBadgeProps {
  telemetry: PipelineTelemetry | null;
}

export function TelemetryBadge({ telemetry }: TelemetryBadgeProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!telemetry || telemetry.totalDurationMs <= 0) {
    return null;
  }

  const seconds = (telemetry.totalDurationMs / 1000).toFixed(2);
  const throughput = telemetry.tokensPerSecond || 0;
  const tokens = telemetry.estimatedTokens || 0;

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3.5 backdrop-blur-xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main metric banner */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-white">Pipeline Execution:</span>
            <span className="font-mono text-amber-300 font-bold">{seconds}s</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">~{tokens.toLocaleString()} Tokens</span>
            {throughput > 0 && (
              <>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {throughput.toLocaleString()} tok/s
                </span>
              </>
            )}
          </div>
        </div>

        {/* Expand / Details Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Cpu className="w-3 h-3 text-blue-400" />
            <span>{telemetry.provider || "AI Engine"}</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-md"
            aria-label="Toggle pipeline timing breakdown"
          >
            <span>{isExpanded ? "Hide Timing" : "Stage Timing"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-800 space-y-3 animate-in fade-in-50 duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Extraction */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Extraction</span>
              </div>
              <p className="font-mono font-bold text-white text-sm">
                {telemetry.extractionMs ? `${telemetry.extractionMs}ms` : "—"}
              </p>
            </div>

            {/* Summary */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Summary AI</span>
              </div>
              <p className="font-mono font-bold text-white text-sm">
                {telemetry.aiSummaryMs ? `${telemetry.aiSummaryMs}ms` : "—"}
              </p>
            </div>

            {/* Flashcards */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Flashcards AI</span>
              </div>
              <p className="font-mono font-bold text-white text-sm">
                {telemetry.aiFlashcardsMs ? `${telemetry.aiFlashcardsMs}ms` : "—"}
              </p>
            </div>

            {/* Quiz */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quiz AI</span>
              </div>
              <p className="font-mono font-bold text-white text-sm">
                {telemetry.aiQuizMs ? `${telemetry.aiQuizMs}ms` : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              <span>Parallel Multi-Agent Generation</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400/90">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Non-PII Telemetry Only</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
