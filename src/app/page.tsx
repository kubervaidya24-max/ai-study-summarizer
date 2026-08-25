import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Ambient Radial Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20 z-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation AI Study Companion • 2026 Edition
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn Dense Notes & PDFs into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Active Recall Assets
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop passively reading 50-page slides. Ingest any lecture PDF, text notes, or research papers and instantly generate executive summaries, 3D flashcards, and scored MCQ practice quizzes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="glow" className="w-full sm:w-auto gap-2.5 text-base shadow-xl">
                <Sparkles className="w-5 h-5" />
                Launch Study Workspace
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                View Source on GitHub
              </Button>
            </Link>
          </div>

          {/* Quick Format Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Supported Formats:</span>
            {siteConfig.supportedFileTypes.map((type) => (
              <span
                key={type.extension}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono"
              >
                {type.extension.toUpperCase()}
              </span>
            ))}
          </div>
        </section>

        {/* CORE FEATURE CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
            <CardHeader>
              <div className="p-3 w-fit rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-white">Smart Synthesis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 leading-relaxed">
              Extract high-yield overviews, critical takeaways, and glossary definitions with difficulty grading and exam tips directly from your materials.
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/5 group">
            <CardHeader>
              <div className="p-3 w-fit rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-white">3D Active Flashcards</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 leading-relaxed">
              Experience dynamic 3D card flips, keyboard navigation, shuffle algorithms, and confidence ratings (Easy / Medium / Hard) for spaced repetition.
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
            <CardHeader>
              <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-white">Adaptive MCQ Engine</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 leading-relaxed">
              Practice with AI-generated multiple-choice questions featuring instant rationale reveals, cumulative scoring, and final proficiency assessments.
            </CardContent>
          </Card>
        </section>

        {/* INTERACTIVE WORKSPACE CTA BANNER */}
        <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <Badge variant="default" className="text-xs">
              Interactive Live Demo
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Experience the Full Study Engine Right Now
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Jump into the workspace and test our preloaded Distributed Systems & Raft Consensus study deck complete with summaries, flashcards, and quizzes.
            </p>
          </div>

          <Link href="/dashboard" className="shrink-0">
            <Button size="lg" variant="glow" className="gap-2 text-base">
              Try Interactive Workspace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
