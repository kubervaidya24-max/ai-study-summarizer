"use client";

import * as React from "react";
import { useToast, dismissToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((t) => {
        const isSuccess = t.variant === "success";
        const isDestructive = t.variant === "destructive";
        const isWarning = t.variant === "warning";

        const borderColor = isDestructive
          ? "border-red-500/40 bg-red-950/90 text-red-100"
          : isSuccess
          ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-100"
          : isWarning
          ? "border-amber-500/40 bg-amber-950/90 text-amber-100"
          : "border-slate-800 bg-slate-900/95 text-slate-100";

        const Icon = isDestructive
          ? AlertCircle
          : isSuccess
          ? CheckCircle2
          : isWarning
          ? AlertTriangle
          : Info;

        const iconColor = isDestructive
          ? "text-red-400"
          : isSuccess
          ? "text-emerald-400"
          : isWarning
          ? "text-amber-400"
          : "text-blue-400";

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${borderColor}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />

            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold leading-tight">{t.title}</h4>
              {t.description && (
                <p className="text-[11px] opacity-90 leading-relaxed">{t.description}</p>
              )}
            </div>

            <button
              onClick={() => dismissToast(t.id)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
