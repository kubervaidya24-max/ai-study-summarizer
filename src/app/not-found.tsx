import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <Brain className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            404 • Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Lost in Study Notes?</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page or study session you requested could not be located. It may have been moved, renamed, or deleted.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button variant="glow" size="sm" className="text-xs gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              Open Workspace
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-800">
              <Home className="w-3.5 h-3.5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
