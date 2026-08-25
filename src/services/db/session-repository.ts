import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  StudySessionData,
  Flashcard,
  QuizQuestion,
  StudySummary,
} from "@/types";

type FullSessionPayload = Prisma.StudySessionGetPayload<{
  include: {
    document: true;
    summary: true;
    flashcardSet: {
      include: { cards: true };
    };
    quiz: {
      include: { questions: true; attempts: true };
    };
  };
}>;

export class SessionRepository {
  /**
   * Saves or updates a full study session with all generated assets.
   */
  static async saveStudySession(
    data: StudySessionData,
    userId?: string
  ): Promise<StudySessionData> {
    const session = await db.studySession.create({
      data: {
        id: data.id,
        userId: userId || null,
        title: data.title,
        document: {
          create: {
            fileName: data.document.fileName,
            fileType: data.document.fileType,
            fileSize: data.document.fileSize,
            pageCount: data.document.pageCount || 1,
            wordCount: data.document.wordCount || 0,
            rawText: data.extractedText || null,
          },
        },
        summary: {
          create: {
            title: data.summary.title,
            overview: data.summary.overview,
            keyTakeaways: JSON.stringify(data.summary.keyTakeaways),
            concepts: JSON.stringify(data.summary.concepts),
            examTips: JSON.stringify(data.summary.examTips || []),
          },
        },
        flashcardSet: {
          create: {
            cardCount: data.flashcards.length,
            cards: {
              create: data.flashcards.map((card) => ({
                id: card.id,
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                topic: card.topic,
                sourceSnippet: card.sourceSnippet || null,
              })),
            },
          },
        },
        quiz: {
          create: {
            title: `${data.title} Practice Quiz`,
            questions: {
              create: data.quiz.map((q) => ({
                id: q.id,
                question: q.question,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                topic: q.topic,
                difficulty: q.difficulty,
              })),
            },
          },
        },
      },
      include: {
        document: true,
        summary: true,
        flashcardSet: {
          include: { cards: true },
        },
        quiz: {
          include: { questions: true, attempts: true },
        },
      },
    });

    return this.formatSessionResult(session);
  }

  /**
   * Retrieves a full study session by ID.
   */
  static async getSessionById(id: string): Promise<StudySessionData | null> {
    const session = await db.studySession.findUnique({
      where: { id },
      include: {
        document: true,
        summary: true,
        flashcardSet: {
          include: { cards: true },
        },
        quiz: {
          include: { questions: true, attempts: true },
        },
      },
    });

    if (!session || !session.document || !session.summary) {
      return null;
    }

    return this.formatSessionResult(session);
  }

  /**
   * Retrieves study history for a user or public recent sessions.
   */
  static async getUserSessions(userId?: string, search?: string) {
    return db.studySession.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(search
          ? {
              title: {
                contains: search,
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        document: true,
        flashcardSet: {
          select: { cardCount: true },
        },
        quiz: {
          select: {
            attempts: {
              orderBy: { completedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      take: 20,
    });
  }

  /**
   * Deletes a study session and cascades.
   */
  static async deleteSession(id: string, userId?: string): Promise<boolean> {
    const session = await db.studySession.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!session) return false;
    if (userId && session.userId && session.userId !== userId) {
      throw new Error("Unauthorized to delete this study session.");
    }

    await db.studySession.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Records a quiz attempt.
   */
  static async recordQuizAttempt(params: {
    quizId: string;
    userId?: string;
    score: number;
    totalQuestions: number;
    answers: Array<{ questionId: string; selectedOptionIndex: number; isCorrect: boolean }>;
  }) {
    const { quizId, userId, score, totalQuestions, answers } = params;
    const percentage = Math.round((score / totalQuestions) * 100);

    return db.quizAttempt.create({
      data: {
        quizId,
        userId: userId || null,
        score,
        totalQuestions,
        percentage,
        answers: JSON.stringify(answers),
      },
    });
  }

  /**
   * Helper to deserialize Prisma models into StudySessionData.
   */
  private static formatSessionResult(session: FullSessionPayload): StudySessionData {
    let summaryObj: StudySummary = {
      title: session.summary?.title || session.title,
      overview: session.summary?.overview || "",
      keyTakeaways: [],
      concepts: [],
      examTips: [],
    };

    if (session.summary) {
      try {
        summaryObj = {
          title: session.summary.title,
          overview: session.summary.overview,
          keyTakeaways: JSON.parse(session.summary.keyTakeaways),
          concepts: JSON.parse(session.summary.concepts),
          examTips: JSON.parse(session.summary.examTips || "[]"),
        };
      } catch {
        // Fallback for parsing errors
      }
    }

    const flashcards: Flashcard[] = (session.flashcardSet?.cards || []).map((c) => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
      difficulty: c.difficulty as "EASY" | "MEDIUM" | "HARD",
      topic: c.topic,
      sourceSnippet: c.sourceSnippet || undefined,
    }));

    const quiz: QuizQuestion[] = (session.quiz?.questions || []).map((q) => {
      let options: [string, string, string, string] = ["A", "B", "C", "D"];
      try {
        const parsed = JSON.parse(q.options);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          options = [String(parsed[0]), String(parsed[1]), String(parsed[2]), String(parsed[3])];
        }
      } catch {
        // Fallback
      }
      return {
        id: q.id,
        question: q.question,
        options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty as "EASY" | "MEDIUM" | "HARD",
      };
    });

    const doc = session.document;
    const documentMeta = doc
      ? {
          fileName: doc.fileName,
          fileType: doc.fileType as "pdf" | "txt" | "md",
          fileSize: doc.fileSize,
          pageCount: doc.pageCount,
          wordCount: doc.wordCount,
          extractedAt: session.createdAt.toISOString(),
        }
      : {
          fileName: "Untitled Document",
          fileType: "txt" as const,
          fileSize: 0,
          pageCount: 1,
          wordCount: 0,
          extractedAt: session.createdAt.toISOString(),
        };

    return {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      document: documentMeta,
      extractedText: doc?.rawText || undefined,
      summary: summaryObj,
      flashcards,
      quiz,
    };
  }
}
