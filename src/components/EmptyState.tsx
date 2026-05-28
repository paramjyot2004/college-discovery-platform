import { LucideIcon, Search, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  onClearFilters,
  title = "No colleges match your search",
  message = "Try widening your fees range, changing the location filter, or updating your keywords.",
  actionLabel = "Reset filters",
  icon: Icon = Search,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5 sm:h-20 sm:w-20">
        <Icon className="h-7 w-7 sm:h-9 sm:w-9" />
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-6 text-slate-500 sm:text-[15px]">
          {message}
        </p>
      </div>

      <button
        id="empty-reset-button"
        onClick={onClearFilters}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
      >
        <RotateCcw className="w-4 h-4" />
        {actionLabel}
      </button>
    </div>
  );
}
