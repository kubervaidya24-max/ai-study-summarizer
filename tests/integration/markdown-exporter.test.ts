import { describe, it, expect } from "vitest";
import { generateMarkdown } from "@/services/export/markdown-exporter";
import { mockStudySession } from "@/lib/mock-data";

describe("MarkdownExporter Integration", () => {
  it("should generate a complete, valid markdown document", () => {
    const md = generateMarkdown(mockStudySession);

    expect(md).toContain(`# ${mockStudySession.title}`);
    expect(md).toContain("## 1. Executive Summary & Overview");
    expect(md).toContain("## 2. Core Takeaways");
    expect(md).toContain("## 3. Important Concepts & Vocabulary");
    expect(md).toContain("## 5. Active Recall Flashcards");
    expect(md).toContain("## 6. Practice Quiz & Assessment");
    expect(md).toContain("| Concept | Priority | Definition | Academic Context |");
  });
});
