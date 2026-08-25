import { BrainCircuit, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export function LoadingState({
  title = "Analyzing Document...",
  subtitle = "Our AI engine is reading, chunking, and synthesizing key concepts.",
}: LoadingStateProps) {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Orbiting Ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <div className="absolute w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>
      </div>

      {/* Shimmer skeleton bars */}
      <div className="w-full max-w-md space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <Skeleton className="h-4 w-4/6 mx-auto" />
      </div>
    </div>
  );
}
