import { LucideIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} variant="outline" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
