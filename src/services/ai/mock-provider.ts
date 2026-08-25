import { LLMProvider } from "./provider";
import { StudySummary, Flashcard, QuizQuestion } from "@/types";

export class MockProvider implements LLMProvider {
  name = "Mock AI Engine (Dev Fallback)";

  async generateSummary(text: string): Promise<StudySummary> {
    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 40);

    const firstParagraph =
      paragraphs[0] ||
      "This document provides a comprehensive academic analysis of foundational concepts, methodologies, and architectural patterns.";
    const secondParagraph =
      paragraphs[1] ||
      "Key theoretical principles and practical engineering considerations are explored with emphasis on rigorous analytical understanding.";

    // Extract potential title from first line
    const firstLine = text.split("\n")[0]?.trim().replace(/^#+\s*/, "") || "Study Document Synthesis";
    const title = firstLine.length > 5 && firstLine.length < 80 ? firstLine : "Academic Document Overview & Synthesis";

    // Extract key sentences
    const sentences = text
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 30 && s.length < 150);

    const keyTakeaways = sentences.slice(0, 5);
    if (keyTakeaways.length < 3) {
      keyTakeaways.push(
        "Core foundational paradigms establish theoretical stability across system nodes.",
        "Deterministic state machines ensure linear consistency during distributed execution.",
        "Active recall and periodic self-assessment enhance long-term memory retention."
      );
    }

    return {
      title,
      overview: `${firstParagraph}\n\n${secondParagraph}`,
      keyTakeaways,
      concepts: [
        {
          term: "State Machine Replication",
          definition: "A technique for building fault-tolerant services by executing operations deterministically on identical nodes.",
          importance: "HIGH",
          context: "Critical architectural paradigm in distributed computing.",
        },
        {
          term: "Consensus Quorum",
          definition: "The strict majority of nodes (⌊N/2⌋ + 1) required to agree on log entries before committing.",
          importance: "HIGH",
          context: "Guarantees state overlap across cluster partitions.",
        },
        {
          term: "Safety Invariants",
          definition: "System guarantees that must hold true across all execution paths to prevent data corruption.",
          importance: "MEDIUM",
          context: "Enforces mathematical correctness.",
        },
      ],
      examTips: [
        "Pay special attention to calculating quorum sizes and fault tolerances under asymmetric network latency.",
        "Ensure clear understanding of the distinction between uncommitted and committed log states.",
        "Review edge cases where concurrent candidate nodes trigger randomized timeout elections.",
      ],
    };
  }

  async generateFlashcards(): Promise<Flashcard[]> {
    throw new Error("Flashcards generation will be implemented in Level 6.");
  }

  async generateQuiz(): Promise<QuizQuestion[]> {
    throw new Error("Quiz generation will be implemented in Level 7.");
  }
}
