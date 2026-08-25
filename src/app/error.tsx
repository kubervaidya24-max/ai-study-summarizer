"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error securely
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The study processor encountered an unexpected issue. You can try reloading the workspace state.
          </p>
          {error.message && (
            <p className="text-[11px] font-mono text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-900/40 truncate">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="default" size="sm" onClick={() => reset()} className="text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </Button>

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
