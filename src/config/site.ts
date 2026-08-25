export const siteConfig = {
  name: "AI Study Summarizer",
  description: "Transform lecture PDFs, study notes, and research papers into interactive summaries, 3D flashcards, and scored MCQ quizzes.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://ai-study-summarizer.dev/og.jpg",
  links: {
    github: "https://github.com/kubervaidya24-max/ai-study-summarizer",
  },
  author: {
    name: "Kuber Vaidya",
    github: "kubervaidya24-max",
  },
  navItems: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "My Studies", href: "/history" },
    { title: "New Study Session", href: "/study/new" },
  ],
  supportedFileTypes: [
    { extension: ".pdf", mime: "application/pdf", name: "PDF Document", maxSizeMB: 25 },
    { extension: ".txt", mime: "text/plain", name: "Plain Text Document", maxSizeMB: 10 },
    { extension: ".md", mime: "text/markdown", name: "Markdown Notes", maxSizeMB: 10 },
  ],
};

export type SiteConfig = typeof siteConfig;
