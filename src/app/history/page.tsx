"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils";
import {
  BookOpen,
  Search,
  FileText,
  Layers,
  HelpCircle,
  Trash2,
  ExternalLink,
  Sparkles,
  PlusCircle,
} from "lucide-react";

interface SessionListItem {
  id: string;
  title: string;
  createdAt: string;
  document: {
    fileName: string;
    fileType: string;
    fileSize: number;
    pageCount: number;
    wordCount: number;
  } | null;
  flashcardSet: {
    cardCount: number;
  } | null;
  quiz: {
    attempts: Array<{
      score: number;
      totalQuestions: number;
      percentage: number;
      completedAt: string;
    }>;
  } | null;
}

export default function HistoryPage() {
  const [sessions, setSessions] = React.useState<SessionListItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  // Fetch session history
  const fetchSessions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setSessions(result.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        setDeleteTargetId(null);
      }
    } catch {
      // Handle error
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.document?.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "pdf" && session.document?.fileType === "pdf") ||
      (typeFilter === "txt" && (session.document?.fileType === "txt" || session.document?.fileType === "notes")) ||
      (typeFilter === "md" && session.document?.fileType === "md");

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Saved Study Sessions
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              My Study Library
            </h1>
            <p className="text-xs text-slate-400">
              Access your previously generated summaries, flashcard decks, and quiz scores
            </p>
          </div>

          <Link href="/dashboard">
            <Button variant="glow" size="sm" className="text-xs gap-1.5">
              <PlusCircle className="w-4 h-4" />
              New Study Session
            </Button>
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic or filename..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Formats" },
              { id: "pdf", label: "PDFs" },
              { id: "txt", label: "Notes" },
              { id: "md", label: "Markdown" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-56 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse"
              />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((item) => {
              const latestAttempt = item.quiz?.attempts?.[0];
              const cardCount = item.flashcardSet?.cardCount || 0;

              return (
                <Card
                  key={item.id}
                  className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between group rounded-3xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono border-slate-700">
                        {item.document?.fileType || "doc"}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 pt-1">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                      <FileText className="w-3 h-3 shrink-0" />
                      {item.document?.fileName || "Study Material"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>{cardCount} Cards</span>
                      </div>
                      {latestAttempt ? (
                        <div className="flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">
                            Quiz: {latestAttempt.percentage}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Quiz Ready</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Study Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link href={`/dashboard?sessionId=${item.id}`}>
                      <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-700 hover:border-blue-500">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        Resume Study
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={searchQuery ? "No matching study sessions" : "No Study History Yet"}
            description={
              searchQuery
                ? "Try searching with different terms or reset your filters."
                : "Upload lecture documents in the workspace to automatically build your library."
            }
            actionLabel="Start New Study Session"
            onAction={() => window.location.assign("/dashboard")}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Delete Study Session?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This action will permanently delete this document summary, generated flashcards, and associated quiz history.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTargetId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(deleteTargetId)}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
