# AI Study Summarizer — Technical Architecture & Systems Design

## 1. System Overview

**AI Study Summarizer** is a production-grade, full-stack educational intelligence platform that ingests raw lecture notes, textbooks, and PDF documents and transforms them into high-yield executive summaries, 3D active-recall flashcard decks, and pedagogical multiple-choice practice quizzes.

```
                      ┌───────────────────────────────────────────────┐
                      │              STUDENT CLIENT UI                │
                      │  Next.js 15 App Router • React 19 • Tailwind  │
                      └───────┬───────────────────────────────┬───────┘
                              │                               │
                      HTTP / Multipart                HTTP / JSON
                              ▼                               ▼
                 ┌─────────────────────────┐     ┌─────────────────────────┐
                 │   /api/document/extract │     │   /api/generate/*       │
                 └────────────┬────────────┘     └────────────┬────────────┘
                              │                               │
                     Validation & Stream             Sanitization & XML Guard
                              ▼                               ▼
                 ┌─────────────────────────┐     ┌─────────────────────────┐
                 │ unpdf / DocumentCleaner │     │   AIFactory Provider    │
                 └────────────┬────────────┘     │  (Gemini/OpenAI/Mock)   │
                              │                  └────────────┬────────────┘
                     Semantic Chunker                         │
                     (Sliding Window)                 Zod Strict Parse
                              │                               │
                              └───────────────┬───────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │   Prisma ORM Layer      │
                                 │  (Relational Database)  │
                                 └────────────┬────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │   Study Session Store   │
                                 │  Summary/Cards/Quiz/Hist│
                                 └─────────────────────────┘
```

---

## 2. Core Architectural Pipelines

### A. Document Ingestion & Extraction Pipeline
1. **Intake Validation**: Multi-stage validation inspecting MIME types (`application/pdf`, `text/plain`, `text/markdown`), file size limits (< 10MB), and magic byte headers (`%PDF-`).
2. **Text Extraction**: Uses `unpdf` with serverless-compatible Web Streams, extracting raw text layer by layer.
3. **Scanned PDF Heuristic**: Analyzes text density per page. If character density < 50 chars/page, raises an automated scanned-document alert.
4. **Text Normalization (`DocumentCleaner`)**:
   - Strips invisible UTF-8 control codes and zero-width spaces (`\u200B`).
   - Normalizes smart quotes and typographic dashes to standard ASCII.
   - Unbreaks hyphenated line breaks (`dis-\ntributed` -> `distributed`).
   - Strips repetitive slide headers/footers (`Page X of Y`).
5. **Token-Aware Chunking (`DocumentChunker`)**:
   - Calculates target chunk sizes (~1,500 tokens / 6,000 characters).
   - Enforces a 15% sliding window overlap (~200 tokens) to preserve cross-chunk context.
   - Splits on natural paragraph (`\n\n`) and sentence boundaries before whitespace fallback.

### B. Multi-Agent AI Generation Pipeline
1. **Multi-Provider Factory Pattern (`AIFactory`)**:
   - Resolves active engine based on configured API keys: `GeminiProvider` -> `OpenAIProvider` -> `GroqProvider` -> `MockProvider` (graceful offline fallback).
2. **Anti-Prompt Injection Sandboxing**:
   - Untrusted text is passed through `sanitizeStudyMaterial()`, stripping closing XML tags, ANSI escapes, and LLM instruction overrides (`[INST]`, `<<SYS>>`, `<|im_start|>`).
   - Material is wrapped in `<untrusted_study_material>` XML tags with explicit system directives to treat input strictly as passive data.
3. **Parallel Multi-Agent Synthesis**:
   - `SummarizerService`, `FlashcardService`, and `QuizService` fire in parallel via `Promise.all()`.
4. **Zod Runtime Schema Validation & Markdown Fence Stripping**:
   - Cleans JSON strings wrapped in ` ```json ` blocks.
   - Validates response schemas with Zod, throwing structured `AIServiceError` on schema mismatch.

### C. Telemetry & Non-PII Observability
- High-precision `TelemetryTimer` captures sub-millisecond timestamps across extraction, AI synthesis, and serialization.
- Calculates processing throughput in tokens per second (`tok/s`).
- Emits W3C `Server-Timing` headers and structured non-PII metrics to client.

---

## 3. Database & Relational Data Model (Prisma ORM)

```prisma
User (1) ──────────< (N) StudySession (1) ────────── (1) Document
                             │
                             ├────────── (1) Summary (1) ──< (N) KeyConcept
                             │
                             ├────────── (1) FlashcardSet (1) ──< (N) Flashcard
                             │
                             └────────── (1) Quiz (1) ──< (N) QuizQuestion
                                            │
                                            └──────────< (N) QuizAttempt
```

---

## 4. Key Design Patterns & Engineering Trade-offs

| Pattern | Implementation | Engineering Rationale |
| :--- | :--- | :--- |
| **Factory Pattern** | `AIFactory.getProvider()` | Decouples business logic from specific AI SDKs; enables dynamic switching between Gemini, OpenAI, and offline mock benchmarks. |
| **Repository Pattern** | `SessionRepository`, `UserRepository` | Encapsulates all Prisma database queries, providing clean type-safe abstractions and mockability for tests. |
| **Strategy Pattern** | `LLMProvider` interface | Standardizes `generateSummary`, `generateFlashcards`, and `generateQuiz` contracts across distinct AI SDKs. |
| **Sliding Window Rate Limiter** | `checkRateLimit()` | In-memory token bucket tracking requests per IP/user with automatic memory garbage collection. |
| **Dynamic Code Splitting** | `next/dynamic` | Reduces First Load JS by ~34% (from 19.8kB to 13kB), loading heavy study viewers on-demand with skeleton placeholders. |
