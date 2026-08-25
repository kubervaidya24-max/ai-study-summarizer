import { siteConfig } from "@/config/site";
import { Sparkles, BookOpen, Layers, BrainCircuit, CheckCircle2, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full z-10 space-y-10">
        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Level 1: Next.js 15 Foundation Online
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            AI Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Summarizer</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Convert lecture PDFs, dense study notes, and research documents into structured summaries, 3D active-recall flashcards, and adaptive MCQ quizzes.
          </p>
        </div>

        {/* Foundation Architecture Checklist Card */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Architecture & Foundation Matrix</h2>
                <p className="text-xs text-slate-400">Next.js 15 • React 19 • TypeScript Strict • TailwindCSS v4</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Checks Passing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-slate-200">App Router & RSC Architecture</span>
                <p className="text-xs text-slate-400 mt-0.5">Optimized Server and Client component boundaries.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-slate-200">Modular Folder Structure</span>
                <p className="text-xs text-slate-400 mt-0.5">Categorized in src/app, components, services, lib, types.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-slate-200">Type-Safe Domain Models</span>
                <p className="text-xs text-slate-400 mt-0.5">Strict Zod schemas and TypeScript interfaces.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-slate-200">Defensive Security Baseline</span>
                <p className="text-xs text-slate-400 mt-0.5">Untrusted file sanitization & server-isolated keys.</p>
              </div>
            </div>
          </div>

          {/* Supported Document Types */}
          <div className="pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Supported Ingestion Formats</h3>
            <div className="flex flex-wrap gap-2">
              {siteConfig.supportedFileTypes.map((type) => (
                <div key={type.extension} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                  <span className="font-mono text-blue-400 font-semibold">{type.extension.toUpperCase()}</span>
                  <span>{type.name} (Max {type.maxSizeMB}MB)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Smart Summarization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract high-yield overviews, critical concepts, and exam tips in seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">3D Active Flashcards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active recall cards with flip mechanics, difficulty grading, and shuffle modes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Adaptive Quizzes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time scored MCQs with instant feedback and pedagogical explanations.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-slate-800/80">
          <span>Engineered by {siteConfig.author.name} ({siteConfig.author.github})</span>
          <span className="font-mono text-slate-400">Level 1 of 19 Complete</span>
        </div>
      </div>
    </main>
  );
}
