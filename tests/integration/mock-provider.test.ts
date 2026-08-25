import { describe, it, expect } from "vitest";
import { MockProvider } from "@/services/ai/mock-provider";

describe("MockAIProvider Integration", () => {
  const provider = new MockProvider();
  const sampleNotes = `
# Distributed Systems: State Machine Replication
State machine replication is a technique for building fault-tolerant services by executing operations deterministically.
Quorum consensus requires a majority of cluster nodes to agree before committing.
Heartbeats prevent spurious election timeouts.
Term numbers monotonically increase to establish total order.
`;

  it("should generate a structured summary from raw text", async () => {
    const summary = await provider.generateSummary(sampleNotes);
    expect(summary.title).toBeDefined();
    expect(summary.overview.length).toBeGreaterThan(20);
    expect(summary.keyTakeaways.length).toBeGreaterThanOrEqual(3);
    expect(summary.concepts.length).toBeGreaterThanOrEqual(2);
  });

  it("should generate flashcards with questions and answers", async () => {
    const flashcards = await provider.generateFlashcards(sampleNotes, 4);
    expect(flashcards.length).toBe(4);
    expect(flashcards[0].question.length).toBeGreaterThan(10);
    expect(flashcards[0].answer.length).toBeGreaterThan(10);
  });

  it("should generate 4-option practice quiz questions", async () => {
    const quiz = await provider.generateQuiz(sampleNotes, 3);
    expect(quiz.length).toBe(3);
    expect(quiz[0].options.length).toBe(4);
    expect(quiz[0].correctIndex).toBeGreaterThanOrEqual(0);
    expect(quiz[0].correctIndex).toBeLessThanOrEqual(3);
    expect(quiz[0].explanation.length).toBeGreaterThan(10);
  });
});
