import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
}

interface FeedbackContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, ...toast }].slice(-4));

    window.setTimeout(() => removeToast(id), 3800);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onDismiss={removeToast} />
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}

function toneClasses(tone: ToastTone) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "error":
      return "border-red-200 bg-red-50 text-red-900";
    default:
      return "border-slate-200 bg-white text-slate-900";
  }
}

function toneIcon(tone: ToastTone) {
  switch (tone) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
}

export function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6 sm:w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-xl border p-3 shadow-lg shadow-slate-900/5 ${toneClasses(toast.tone)}`}
        >
          <div className="mt-0.5 shrink-0">{toneIcon(toast.tone)}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">{toast.title}</p>
            {toast.message && <p className="mt-1 text-xs leading-relaxed text-slate-600">{toast.message}</p>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-700"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function AlertBanner({
  title,
  message,
  tone = "error",
  action,
}: {
  title: string;
  message?: string;
  tone?: ToastTone;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClasses(tone)}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{toneIcon(tone)}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{title}</p>
          {message && <p className="mt-1 text-sm leading-relaxed text-slate-600">{message}</p>}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
