import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Brain } from "lucide-react";
import { GithubIcon } from "@/components/common/github-icon";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
            <Brain className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-300">{siteConfig.name}</span>
          <span className="text-slate-400">•</span>
          <span>Next.js 15 & React 19 EdTech Platform</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            Built by <span className="text-slate-200 font-medium">{siteConfig.author.name}</span>
          </span>
          <span className="text-slate-400">•</span>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:underline"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
