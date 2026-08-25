import { describe, it, expect } from "vitest";
import { cleanAndParseSummaryJson } from "@/services/ai/schemas/summary";
import { cleanAndParseFlashcardsJson } from "@/services/ai/schemas/flashcards";
import { cleanAndParseQuizJson } from "@/services/ai/schemas/quiz";

describe("AI Zod Schemas & Parsers", () => {
  it("should parse valid JSON summary wrapped in markdown code fences", () => {
    const raw = "```json\n" + JSON.stringify({
      title: "Raft Consensus Algorithm",
      overview: "Comprehensive overview of consensus mechanisms.",
      keyTakeaways: ["Takeaway 1", "Takeaway 2"],
      concepts: [{ term: "Quorum", definition: "Majority of nodes", importance: "HIGH" }],
      examTips: ["Review leader election timeouts"],
    }) + "\n```";

    const parsed = cleanAndParseSummaryJson(raw);
    expect(parsed.title).toBe("Raft Consensus Algorithm");
    expect(parsed.concepts.length).toBe(1);
    expect(parsed.concepts[0].importance).toBe("HIGH");
  });

  it("should parse flashcards array with automatic ID generation", () => {
    const raw = JSON.stringify([
      {
        question: "What is an election timeout?",
        answer: "The period a follower waits before initiating election.",
        difficulty: "MEDIUM",
        topic: "Consensus",
      },
    ]);

    const cards = cleanAndParseFlashcardsJson(raw);
    expect(cards.length).toBe(1);
    expect(cards[0].id).toBeDefined();
    expect(cards[0].question).toContain("election timeout");
  });

  it("should parse multiple choice quiz questions with 4-tuple options", () => {
    const raw = JSON.stringify({
      questions: [
        {
          question: "What is the quorum for a 5-node cluster?",
          options: ["1 node", "2 nodes", "3 nodes", "4 nodes"],
          correctIndex: 2,
          explanation: "Quorum is strict majority floor(5/2) + 1 = 3.",
          topic: "Cluster Sizing",
          difficulty: "EASY",
        },
      ],
    });

    const quiz = cleanAndParseQuizJson(raw);
    expect(quiz.length).toBe(1);
    expect(quiz[0].correctIndex).toBe(2);
    expect(quiz[0].options.length).toBe(4);
  });
});
