import { StudySessionData } from "@/types";

/**
 * Opens a dedicated print dialog with high-contrast document layout.
 */
export function openPrintableStudyGuide(session: StudySessionData): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const { title, document: doc, summary, flashcards, quiz } = session;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} — Study Guide</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      background: #ffffff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; color: #1e3a8a; margin-top: 0; }
    h2 { font-size: 18px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 28px; }
    h3 { font-size: 14px; color: #374151; margin-top: 16px; margin-bottom: 4px; }
    .meta { font-size: 12px; color: #6b7280; margin-bottom: 24px; }
    .overview { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; font-size: 13px; }
    ul, ol { padding-left: 20px; font-size: 13px; }
    li { margin-bottom: 6px; }
    .concept-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    .concept-table th, .concept-table td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    .concept-table th { background: #f1f5f9; color: #1e293b; }
    .card-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #fafafa; page-break-inside: avoid; }
    .quiz-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; background: #ffffff; page-break-inside: avoid; }
    .option { font-size: 12px; padding: 4px 8px; margin: 2px 0; }
    .correct { font-weight: bold; color: #059669; background: #ecfdf5; border-radius: 4px; }
    .explanation { font-size: 11px; color: #4b5563; background: #f3f4f6; padding: 6px 10px; border-radius: 4px; margin-top: 6px; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: bold; border-radius: 4px; background: #e0e7ff; color: #3730a3; }
    @media print {
      body { padding: 0; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    Source File: <strong>${doc.fileName}</strong> | Pages: ${doc.pageCount || 1} | Words: ${doc.wordCount.toLocaleString()} | Date: ${new Date().toLocaleDateString()}
  </div>

  <h2>1. Executive Overview</h2>
  <div class="overview">${summary.overview.replace(/\n/g, "<br>")}</div>

  <h2>2. Core Takeaways</h2>
  <ol>
    ${summary.keyTakeaways.map((item) => `<li>${item}</li>`).join("")}
  </ol>

  <h2>3. Key Concepts & Definitions</h2>
  <table class="concept-table">
    <thead>
      <tr>
        <th>Concept</th>
        <th>Priority</th>
        <th>Definition</th>
      </tr>
    </thead>
    <tbody>
      ${summary.concepts
        .map(
          (c) => `
        <tr>
          <td><strong>${c.term}</strong></td>
          <td><span class="badge">${c.importance}</span></td>
          <td>${c.definition}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  ${
    summary.examTips && summary.examTips.length > 0
      ? `
    <h2>4. Exam Tips</h2>
    <ul>
      ${summary.examTips.map((tip) => `<li>💡 ${tip}</li>`).join("")}
    </ul>
  `
      : ""
  }

  <div class="page-break"></div>

  <h2>5. Flashcards (${flashcards.length} Cards)</h2>
  ${flashcards
    .map(
      (c, i) => `
    <div class="card-box">
      <strong>Card ${i + 1}: ${c.question}</strong>
      <div style="margin-top: 6px; font-size: 13px;"><strong>Answer:</strong> ${c.answer}</div>
      <div style="margin-top: 4px; font-size: 11px; color: #6b7280;">Topic: ${c.topic} | Difficulty: ${c.difficulty}</div>
    </div>
  `
    )
    .join("")}

  <div class="page-break"></div>

  <h2>6. Practice Quiz (${quiz.length} Questions)</h2>
  ${quiz
    .map(
      (q, i) => `
    <div class="quiz-box">
      <strong>Q${i + 1}: ${q.question}</strong>
      <div style="margin-top: 8px;">
        ${q.options
          .map(
            (opt, optIdx) => `
          <div class="option ${optIdx === q.correctIndex ? "correct" : ""}">
            [${["A", "B", "C", "D"][optIdx]}] ${opt} ${optIdx === q.correctIndex ? "✔ (Correct Answer)" : ""}
          </div>
        `
          )
          .join("")}
      </div>
      <div class="explanation"><strong>Rationale:</strong> ${q.explanation}</div>
    </div>
  `
    )
    .join("")}

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
