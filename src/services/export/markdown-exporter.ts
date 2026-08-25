import { StudySessionData } from "@/types";

/**
 * Transforms a complete study session into a formatted GitHub-flavored Markdown document.
 */
export function generateMarkdown(session: StudySessionData): string {
  const { title, createdAt, document, summary, flashcards, quiz } = session;

  let md = `# ${title}\n\n`;

  // Metadata Header
  md += `> **Generated with AI Study Summarizer**\n`;
  md += `> **Source Document**: ${document.fileName} (${document.pageCount || 1} pages, ${document.wordCount.toLocaleString()} words)\n`;
  md += `> **Date**: ${new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n\n`;
  md += `---\n\n`;

  // Executive Overview
  md += `## 1. Executive Summary & Overview\n\n`;
  md += `${summary.overview}\n\n`;

  // Key Takeaways
  md += `## 2. Core Takeaways\n\n`;
  summary.keyTakeaways.forEach((item, index) => {
    md += `${index + 1}. ${item}\n`;
  });
  md += `\n`;

  // Key Concepts Table
  md += `## 3. Important Concepts & Vocabulary\n\n`;
  md += `| Concept | Priority | Definition | Academic Context |\n`;
  md += `| :--- | :---: | :--- | :--- |\n`;
  summary.concepts.forEach((concept) => {
    md += `| **${concept.term}** | \`${concept.importance}\` | ${concept.definition} | ${concept.context || "—"} |\n`;
  });
  md += `\n`;

  // Exam Tips
  if (summary.examTips && summary.examTips.length > 0) {
    md += `## 4. High-Yield Exam Strategies\n\n`;
    summary.examTips.forEach((tip) => {
      md += `- 💡 ${tip}\n`;
    });
    md += `\n`;
  }

  // Flashcards Deck
  md += `## 5. Active Recall Flashcards (${flashcards.length} Cards)\n\n`;
  flashcards.forEach((card, index) => {
    md += `### Card ${index + 1}: ${card.question}\n\n`;
    md += `**Answer**:\n> ${card.answer}\n\n`;
    md += `*Difficulty*: \`${card.difficulty}\` | *Topic*: ${card.topic}\n\n`;
    if (card.sourceSnippet) {
      md += `*Reference*: _"${card.sourceSnippet}"_\n\n`;
    }
    md += `---\n\n`;
  });

  // Practice Quiz
  md += `## 6. Practice Quiz & Assessment\n\n`;
  quiz.forEach((q, index) => {
    md += `### Question ${index + 1}: ${q.question}\n\n`;
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, optIndex) => {
      const isCorrect = optIndex === q.correctIndex;
      md += `- **[${letters[optIndex]}]** ${opt} ${isCorrect ? "*(Correct)*" : ""}\n`;
    });
    md += `\n**Pedagogical Rationale**:\n> ${q.explanation}\n\n`;
    md += `*Topic*: ${q.topic} | *Difficulty*: \`${q.difficulty}\`\n\n`;
  });

  return md;
}

/**
 * Triggers a client-side file download of the markdown text.
 */
export function downloadMarkdownFile(session: StudySessionData): void {
  const content = generateMarkdown(session);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const safeFilename = `${session.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-study-guide.md`;

  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
