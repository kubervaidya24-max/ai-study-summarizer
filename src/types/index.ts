/**
 * AI Study Summarizer — Core TypeScript Definitions
 */

export type DocumentType = "pdf" | "txt" | "md";

export interface DocumentMetadata {
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  wordCount: number;
  pageCount?: number;
  extractedAt: string;
}

export interface ExtractedChunk {
  id: string;
  chunkIndex: number;
  text: string;
  tokenEstimate: number;
  wordCount: number;
}

export interface ExtractedDocumentResult {
  metadata: DocumentMetadata;
  fullText: string;
  cleanedText: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
  isScanned?: boolean;
  warning?: string;
  chunks: ExtractedChunk[];
}

export type ConceptImportance = "HIGH" | "MEDIUM" | "LOW";

export interface KeyConcept {
  term: string;
  definition: string;
  importance: ConceptImportance;
  context?: string;
}

export interface StudySummary {
  title: string;
  overview: string;
  keyTakeaways: string[];
  concepts: KeyConcept[];
  examTips: string[];
}

export type FlashcardDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: FlashcardDifficulty;
  topic: string;
  sourceSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: FlashcardDifficulty;
}

export interface QuizResultAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  completedAt: string;
}

export interface StudySessionData {
  id: string;
  title: string;
  createdAt: string;
  document: DocumentMetadata;
  extractedText?: string;
  summary: StudySummary;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  attempts?: QuizResultAttempt[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  telemetry?: {
    durationMs: number;
    tokensEstimated?: number;
    provider?: string;
  };
}
