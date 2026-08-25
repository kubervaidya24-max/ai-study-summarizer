import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { AppSessionProvider } from "@/components/providers/session-provider";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — PDF/Notes to Flashcards & Quiz`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI Study Tool",
    "PDF Summarizer",
    "Flashcards Generator",
    "AI Quiz Engine",
    "Active Recall",
    "Spaced Repetition",
    "Next.js 15",
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <AppSessionProvider>
          {children}
          <ToastContainer />
        </AppSessionProvider>
      </body>
    </html>
  );
}
