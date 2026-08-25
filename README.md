# AI Study Summarizer — PDF/Notes to Flashcards & Quiz

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A modern, full-stack, AI-powered EdTech study companion that transforms lecture PDFs, study notes, and research documents into structured summaries, key concepts, interactive 3D flashcards, and adaptive multiple-choice quizzes.

---

## 🎯 Overview & Vision

**AI Study Summarizer** bridges the gap between passive reading and active recall. Students and lifelong learners frequently encounter dense academic papers, multi-page lecture slides, and voluminous study notes. AI Study Summarizer ingests these documents, securely extracts and normalizes the textual content, and orchestrates state-of-the-art LLMs to generate high-yield study materials:

1. **Executive Summaries & Core Takeaways**: High-level synthesis organized by topics.
2. **Key Concepts & Definitions**: Terminology, formulas, and critical theorems.
3. **Interactive Flashcards**: 3D flip cards with active recall rating (Easy / Medium / Hard) and shuffle mechanics.
4. **Adaptive MCQ Quizzes**: Instant answer validation, step-by-step rationales, and scored post-quiz evaluations.
5. **Study History & Persistence**: Revisit previous study sessions, review past quiz attempts, and track learning progress over time.
6. **Multi-Format Export**: Export clean Markdown or downloadable study PDFs.

---

## 🏗️ Architecture Summary

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 Frontend                           │
│  (React 19, TailwindCSS v4, ShadCN UI, Lucide Icons, Active Recall UX) │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / JSON / Streaming
┌────────────────────────────────────▼───────────────────────────────────┐
│                      Next.js Server & API Layer                        │
│   Auth.js (NextAuth v5) ── Middleware Guard ── Telemetry Interceptor   │
└──────────┬─────────────────────────┬─────────────────────────┬─────────┘
           │                         │                         │
┌──────────▼──────────┐   ┌──────────▼──────────┐   ┌──────────▼─────────┐
│ Document Pipeline   │   │ Provider-Agnostic   │   │  Persistence Layer │
│  - File Validator   │   │ AI Engine           │   │  - Prisma ORM      │
│  - PDF Text Extr.   │   │  - Schema Validate  │   │  - SQLite /        │
│  - Sanitizer        │   │  - OpenAI / Gemini  │   │    PostgreSQL      │
│  - Semantic Chunker │   │  - Anthropic / Groq │   │  - User Isolation  │
└─────────────────────┘   └─────────────────────┘   └────────────────────┘
```

---

## 🚀 Key Features

* **Universal Document Ingestion**: Drag-and-drop support for `.pdf`, `.txt`, and `.md` with strict MIME and client/server size validations.
* **Resilient Extraction Pipeline**: Robust text extraction handling Unicode, multi-column formats, page boundaries, and non-text detection.
* **Provider-Agnostic AI Layer**: Modular LLM adapters supporting Google Gemini, OpenAI GPT-4o, Anthropic Claude, and Groq with runtime schema enforcement via Zod.
* **Active Recall Flashcards**: Micro-animated flip flashcards with shuffle, progress tracking, and confidence scoring.
* **Interactive MCQ Engine**: Immediate feedback, detailed explanations, difficulty indicators, and final score summaries.
* **Zero Trust & Prompt Injection Defense**: Uploaded documents are treated as untrusted data envelopes with XML delimiters and strict system instruction boundaries.
* **Non-Invasive Telemetry**: Server-side latency tracking for document extraction, LLM generation, and error reporting without logging sensitive PII.
* **Exportable Content**: Generate standalone Markdown study guides and formatted PDFs.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components & Route Handlers) |
| **UI Library** | React 19, TypeScript |
| **Styling** | TailwindCSS v4, Vanilla CSS Custom Properties |
| **Component Kit** | ShadCN UI / Radix UI primitives |
| **Icons & Motion** | Lucide React |
| **Authentication** | Auth.js (NextAuth v5) with JWT session strategy |
| **Database & ORM** | Prisma ORM with SQLite (local dev) / PostgreSQL (production) |
| **Document Processing** | `pdfjs-dist` / text extractors & token-aware chunkers |
| **Validation** | Zod v3 schemas |
| **AI Integration** | Provider-independent adapter pattern (Gemini, OpenAI, Anthropic) |
| **Testing** | Vitest, React Testing Library, Playwright |

---

## 🗺️ Roadmap & Level Progress

The application is built following a strict 19-level engineering progression:

| Level | Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **00** | Project Planning | System architecture, data flow, roadmap, and Git setup | 🟢 Completed |
| **01** | Next.js 15 Foundation | Clean scaffold, TypeScript, Tailwind v4, ESLint, config | 🟢 Completed |
| **02** | UI Foundation | EdTech design system, Landing, Dashboard, Responsive layout | 🟢 Completed |
| **03** | File Upload System | Drag-and-drop, validation, client/server file intake | 🟢 Completed |
| **04** | PDF/Text Extraction | PDF parsing, sanitization, Unicode handling, chunking | 🟢 Completed |
| **05** | LLM Summary Engine | Provider-agnostic AI adapter, structured Zod output | 🟢 Completed |
| **06** | Flashcard Engine | 3D flip card viewer, rating, shuffle, active recall | 🟢 Completed |
| **07** | Quiz / MCQ Engine | Interactive multiple choice questions, scoring, feedback | 🟢 Completed |
| **08** | Authentication | Auth.js v5, protected sessions, user identity | 🟢 Completed |
| **09** | Database & Persistence | Prisma ORM, relational schema, study session models | 🟢 Completed |
| **10** | Study History | Saved sessions, dashboard history list, resume study | 🟢 Completed |
| **11** | Markdown & PDF Export | Clean study guide exports for offline review | 🟢 Completed |
| **12** | Latency Telemetry | Non-PII execution metrics, processing timer logging | 🟢 Completed |
| **13** | Error Handling Pass | Standardized API errors, fallback UI, boundary handling | 🟢 Completed |
| **14** | Security Hardening | Prompt injection defenses, rate limiting, sanitization | 🟢 Completed |
| **15** | Comprehensive Testing | Unit, integration, and E2E test suites | 🟢 Completed |
| **16** | Performance Optimization | Dynamic imports, streaming, bundle reduction | 🟢 Completed |
| **17** | UI/UX Polish | Micro-interactions, skeletons, toasts, accessible controls | 🟢 Completed |
| **18** | Production Readiness | Final audit, environment checklist, production build | 🟢 Completed |
| **19** | Portfolio / Interview Audit | Technical deep-dive, trade-off rationale, interview Q&A | ⏳ Pending |

---

## ⚙️ Quick Start (Local Setup)

### Prerequisites

* Node.js `20.x` or `22.x` (or newer)
* npm `10.x` or newer
* Git

### Installation

```bash
# Clone the repository
git clone https://github.com/kubervaidya24-max/ai-study-summarizer.git
cd ai-study-summarizer

# Install dependencies (Level 1+)
npm install

# Setup environment variables
cp .env.example .env.local

# Run database migrations (Level 9+)
npx prisma migrate dev

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## 🔒 Security & Privacy

* **Zero Knowledge Storage of Raw Keys**: LLM API keys remain strictly on the server-side environment.
* **Content Sandboxing**: Uploaded study documents are parsed in memory, sanitized, and encapsulated before AI ingestion to prevent prompt injection.
* **PII Redaction**: Telemetry logs record latency, token approximations, and error codes without storing user emails or private document bodies.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
