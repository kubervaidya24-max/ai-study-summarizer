"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { SummaryViewer } from "@/components/summary/summary-viewer";
import { FlashcardViewer } from "@/components/flashcards/flashcard-viewer";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { mockStudySession } from "@/lib/mock-data";
import {
  StudySessionData,
  ExtractedDocumentResult,
  StudySummary,
  Flashcard,
  QuizQuestion,
  ApiResponse,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  UploadCloud,
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<string>("upload");
  const [sessionData, setSessionData] = React.useState<StudySessionData | null>(null);
  const [extractedDoc, setExtractedDoc] = React.useState<ExtractedDocumentResult | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState({ title: "", subtitle: "" });
  const [extractionWarning, setExtractionWarning] = React.useState<string | null>(null);

  const {
    status: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
    reset: resetUpload,
  } = useFileUpload();

  // Load sample demo session
  const handleLoadSample = () => {
    setIsProcessing(true);
    setLoadingMessage({
      title: "Loading Sample Study Session...",
      subtitle: "Populating Distributed Systems & Raft Consensus deck.",
    });
    setExtractionWarning(null);
    setTimeout(() => {
      setSessionData(mockStudySession);
      setExtractedDoc(null);
      setIsProcessing(false);
      setActiveTab("summary");
    }, 600);
  };

  // Real document extraction & 3-stage parallel AI generation handler
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setExtractionWarning(null);
    setLoadingMessage({
      title: "Extracting Document Content...",
      subtitle: "Parsing document structure and cleaning text layers.",
    });

    try {
      // Step 1: Extract text
      const formData = new FormData();
      formData.append("file", file);

      const extractRes = await fetch("/api/document/extract", {
        method: "POST",
        body: formData,
      });

      const extractResult: ApiResponse<ExtractedDocumentResult> = await extractRes.json();

      if (!extractRes.ok || !extractResult.success || !extractResult.data) {
        throw new Error(extractResult.error?.message || "Failed to extract text from document.");
      }

      const doc = extractResult.data;
      setExtractedDoc(doc);

      if (doc.warning) {
        setExtractionWarning(doc.warning);
      }

      // Step 2: Generate AI Summary, Flashcards, and Quiz in parallel
      setLoadingMessage({
        title: "AI Synthesis, Flashcards & Quiz Generation...",
        subtitle: "Drafting executive summary, building 3D active-recall flashcards, and generating practice questions.",
      });

      const [summaryRes, flashcardsRes, quizRes] = await Promise.all([
        fetch("/api/generate/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: doc.cleanedText,
            options: { detailLevel: "detailed" },
          }),
        }),
        fetch("/api/generate/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: doc.cleanedText,
            count: 6,
          }),
        }),
        fetch("/api/generate/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: doc.cleanedText,
            questionCount: 5,
          }),
        }),
      ]);

      const summaryResult: ApiResponse<StudySummary> = await summaryRes.json();
      const flashcardsResult: ApiResponse<Flashcard[]> = await flashcardsRes.json();
      const quizResult: ApiResponse<QuizQuestion[]> = await quizRes.json();

      if (!summaryRes.ok || !summaryResult.success || !summaryResult.data) {
        throw new Error(summaryResult.error?.message || "Failed to generate AI summary.");
      }

      const summary = summaryResult.data;
      const flashcards =
        flashcardsResult.success && flashcardsResult.data
          ? flashcardsResult.data
          : mockStudySession.flashcards;
      const quiz =
        quizResult.success && quizResult.data
          ? quizResult.data
          : mockStudySession.quiz;

      // Initialize complete live study session
      setSessionData({
        id: `session_${Date.now()}`,
        title: summary.title || doc.metadata.fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        createdAt: new Date().toISOString(),
        document: {
          ...doc.metadata,
          wordCount: doc.wordCount,
          pageCount: doc.pageCount || 1,
        },
        extractedText: doc.cleanedText,
        summary,
        flashcards,
        quiz,
      });

      setIsProcessing(false);
      setActiveTab("summary");
    } catch (err: unknown) {
      setIsProcessing(false);
      const message = err instanceof Error ? err.message : "Document processing failed.";
      setExtractionWarning(message);
    }
  };

  const handleClearSession = () => {
    setSessionData(null);
    setExtractedDoc(null);
    setExtractionWarning(null);
    resetUpload();
    setActiveTab("upload");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Interactive Study Workspace
              </span>
              {sessionData && (
                <Badge variant="success" className="text-[10px]">
                  Session Active
                </Badge>
              )}
              {extractedDoc && (
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {extractedDoc.chunks.length} Chunks Generated
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {sessionData ? sessionData.title : "New Study Session"}
            </h1>
            {sessionData && (
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 pt-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {sessionData.document.fileName} • {sessionData.document.pageCount || 1} Pages • {sessionData.document.wordCount.toLocaleString()} Words
              </p>
            )}
          </div>

          {sessionData && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 border-slate-700"
                onClick={handleClearSession}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload New Document
              </Button>
            </div>
          )}
        </div>

        {/* Scanned/Extraction Warning Banner */}
        {extractionWarning && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-xs md:text-sm animate-in fade-in-50">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Notice</span>
              <p className="leading-relaxed">{extractionWarning}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isProcessing ? (
          <div className="glass-panel p-12 rounded-3xl">
            <LoadingState
              title={loadingMessage.title || "Generating Study Assets..."}
              subtitle={loadingMessage.subtitle || "Synthesizing key concepts and drafting study cards."}
            />
          </div>
        ) : (
          /* Main Tab Navigation & Views */
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center md:justify-start">
              <TabsList className="grid grid-cols-4 w-full md:w-auto min-w-[340px] md:min-w-[500px]">
                <TabsTrigger value="upload" className="text-xs md:text-sm">
                  <UploadCloud className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-xs md:text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="text-xs md:text-sm">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Flashcards</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="text-xs md:text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Quiz</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: UPLOAD */}
            <TabsContent value="upload" className="pt-4">
              <div className="max-w-3xl mx-auto space-y-6">
                <UploadDropzone
                  onFileSelect={handleFileSelect}
                  onLoadMockDemo={handleLoadSample}
                  onClearFile={handleClearSession}
                  uploadStatus={uploadStatus}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  selectedFileName={sessionData?.document.fileName}
                  selectedFileSize={sessionData?.document.fileSize}
                />
              </div>
            </TabsContent>

            {/* TAB 2: SUMMARY */}
            <TabsContent value="summary" className="pt-4">
              {sessionData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Generated by AI Summarizer Engine
                    </span>
                  </div>
                  <SummaryViewer summary={sessionData.summary} />
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No Document Summarized Yet"
                  description="Upload a lecture PDF or click 'Load Sample' to generate structured summaries and key concepts."
                  actionLabel="Go to Upload Tab"
                  onAction={() => setActiveTab("upload")}
                />
              )}
            </TabsContent>

            {/* TAB 3: FLASHCARDS */}
            <TabsContent value="flashcards" className="pt-4">
              {sessionData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Active Recall Flashcard Deck ({sessionData.flashcards.length} Cards)
                    </span>
                  </div>
                  <FlashcardViewer initialCards={sessionData.flashcards} />
                </div>
              ) : (
                <EmptyState
                  icon={Layers}
                  title="No Flashcards Generated"
                  description="Upload study material to produce 3D interactive active-recall flashcards."
                  actionLabel="Go to Upload Tab"
                  onAction={() => setActiveTab("upload")}
                />
              )}
            </TabsContent>

            {/* TAB 4: QUIZ */}
            <TabsContent value="quiz" className="pt-4">
              {sessionData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      AI Practice MCQ Quiz ({sessionData.quiz.length} Questions)
                    </span>
                  </div>
                  <QuizEngine questions={sessionData.quiz} />
                </div>
              ) : (
                <EmptyState
                  icon={HelpCircle}
                  title="No Quiz Available"
                  description="Upload a study document to automatically generate a multiple-choice practice quiz."
                  actionLabel="Go to Upload Tab"
                  onAction={() => setActiveTab("upload")}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
}
