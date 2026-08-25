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
import { StudySessionData } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  UploadCloud,
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<string>("upload");
  const [sessionData, setSessionData] = React.useState<StudySessionData | null>(null);
  const [isProcessingAI, setIsProcessingAI] = React.useState(false);

  const {
    status: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
    uploadFile,
    reset: resetUpload,
  } = useFileUpload();

  // Load sample demo session
  const handleLoadSample = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      setSessionData(mockStudySession);
      setIsProcessingAI(false);
      setActiveTab("summary");
    }, 600);
  };

  // Real upload handler
  const handleFileSelect = async (file: File) => {
    const uploaded = await uploadFile(file);
    if (uploaded) {
      setIsProcessingAI(true);
      // Simulate level 3-4 pipeline transition to mock summary for study viewer
      setTimeout(() => {
        setSessionData({
          ...mockStudySession,
          title: uploaded.fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          document: {
            ...mockStudySession.document,
            fileName: uploaded.fileName,
            fileSize: uploaded.fileSize,
            fileType: uploaded.fileType,
            extractedAt: uploaded.extractedAt,
          },
        });
        setIsProcessingAI(false);
        setActiveTab("summary");
      }, 700);
    }
  };

  const handleClearSession = () => {
    setSessionData(null);
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

        {/* Loading Overlay */}
        {isProcessingAI ? (
          <div className="glass-panel p-12 rounded-3xl">
            <LoadingState
              title="Processing Document & Study Assets..."
              subtitle="Validating document headers and preparing content for the study pipeline."
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
                <SummaryViewer summary={sessionData.summary} />
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
                <FlashcardViewer initialCards={sessionData.flashcards} />
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
                <QuizEngine questions={sessionData.quiz} />
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
