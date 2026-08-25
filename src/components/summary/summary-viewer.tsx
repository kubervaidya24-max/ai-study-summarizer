"use client";

import { StudySummary } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Lightbulb, GraduationCap, ArrowRight } from "lucide-react";

interface SummaryViewerProps {
  summary: StudySummary;
}

export function SummaryViewer({ summary }: SummaryViewerProps) {
  const getImportanceBadge = (importance: "HIGH" | "MEDIUM" | "LOW") => {
    switch (importance) {
      case "HIGH":
        return <Badge variant="destructive">Critical Focus</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">Important</Badge>;
      case "LOW":
        return <Badge variant="secondary">Supporting</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Overview Card */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Executive Synthesis
          </div>
          <CardTitle className="text-xl md:text-2xl text-white mt-1">
            {summary.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {summary.overview}
          </p>
        </CardContent>
      </Card>

      {/* Key Takeaways Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          High-Yield Key Takeaways
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {summary.keyTakeaways.map((takeaway, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex items-start gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-mono font-bold text-blue-400 border border-blue-500/20">
                {index + 1}
              </span>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {takeaway}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Definitions Glossary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Core Concepts & Definitions
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.concepts.map((concept, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-white text-sm md:text-base">
                  {concept.term}
                </h4>
                {getImportanceBadge(concept.importance)}
              </div>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {concept.definition}
              </p>
              {concept.context && (
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>{concept.context}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exam Prep & High-Yield Tips */}
      {summary.examTips && summary.examTips.length > 0 && (
        <Card className="border-purple-500/20 bg-purple-950/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Exam Preparation & High-Yield Tips
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {summary.examTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                <span className="text-purple-400 font-bold">•</span>
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
