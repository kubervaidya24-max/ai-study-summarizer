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

    const firstLine = text.split("\n")[0]?.trim().replace(/^#+\s*/, "") || "Study Document Synthesis";
    const title = firstLine.length > 5 && firstLine.length < 80 ? firstLine : "Academic Document Overview & Synthesis";

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

  async generateFlashcards(text: string, count = 6): Promise<Flashcard[]> {
    const sentences = text
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25 && s.length < 160);

    const baseCards: Flashcard[] = [
      {
        id: "mock_card_1",
        question: "What is the primary architectural objective of the protocol described in this study material?",
        answer: sentences[0] || "To ensure state consistency, fault tolerance, and deterministic execution across multi-node environments.",
        difficulty: "EASY",
        topic: "Core Fundamentals",
        sourceSnippet: "Section 1: Architectural Foundations",
      },
      {
        id: "mock_card_2",
        question: "How does the system ensure safety invariants remain unbroken during state transitions?",
        answer: sentences[1] || "Through strict leader completeness, term numbering, and majority quorum validation before committing changes.",
        difficulty: "MEDIUM",
        topic: "Safety & Invariants",
        sourceSnippet: "Section 2: Invariant Guarantees",
      },
      {
        id: "mock_card_3",
        question: "What failure modes are tolerated by the system geometry under maximum fault boundaries?",
        answer: sentences[2] || "The system survives minority node failures up to F = ⌊(N - 1) / 2⌋ without stalling client progress.",
        difficulty: "HARD",
        topic: "Fault Boundaries",
        sourceSnippet: "Section 3: Fault Tolerant Limits",
      },
      {
        id: "mock_card_4",
        question: "Explain the role of heartbeat keepalive messages between leader and follower components.",
        answer: sentences[3] || "Periodic heartbeats reset election timeouts on follower nodes and prevent unnecessary re-election cycles.",
        difficulty: "EASY",
        topic: "Node Lifecycle",
        sourceSnippet: "Section 4: Keepalive Mechanism",
      },
      {
        id: "mock_card_5",
        question: "Why is monotonic term indexing critical for distributed logical clocks?",
        answer: sentences[4] || "It enables immediate detection of obsolete leaders and invalidates stale RPC requests across partitioned networks.",
        difficulty: "MEDIUM",
        topic: "Logical Clocks",
        sourceSnippet: "Section 5: Term Numbering",
      },
      {
        id: "mock_card_6",
        question: "Describe how log matching enforces linear consistency across node storage.",
        answer: sentences[5] || "Followers verify previous log index and term before appending, ensuring inductive consistency.",
        difficulty: "HARD",
        topic: "Log Replication",
        sourceSnippet: "Section 6: Consistency Verification",
      },
    ];

    return baseCards.slice(0, count);
  }

  async generateQuiz(): Promise<QuizQuestion[]> {
    throw new Error("Quiz generation will be implemented in Level 7.");
  }
}
