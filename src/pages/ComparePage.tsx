import React from "react";
import { College } from "../types";
import { CompareTable } from "../components/CompareTable";
import { Scale, Sparkles, AlertCircle } from "lucide-react";

interface ComparePageProps {
  comparingColleges: College[];
  onRemove: (id: string) => void;
  allColleges: College[];
  onAdd: (college: College) => void;
  onViewDetails: (slug: string) => void;
  onClearAll: () => void;
}

export function ComparePage({
  comparingColleges,
  onRemove,
  allColleges,
  onAdd,
  onViewDetails,
  onClearAll,
}: ComparePageProps) {
  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      
      {/* Hero Header block - High Density style */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 md:p-6 text-white relative overflow-hidden border border-slate-700 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="max-w-xl relative shrink-0 space-y-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold border border-white/15 uppercase tracking-widest text-orange-200">
            <Sparkles className="w-3 h-3 fill-current" /> Advanced Analytics
          </span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Compare Top Universities
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed bg-black/10 p-2.5 rounded-lg border border-white/5">
            Select up to <strong className="font-bold underline text-white">3 universities</strong> to perform thorough structural comparisons across tuition fees, placement outcomes, reviews scoring, and campus location.
          </p>
        </div>

        {comparingColleges.length > 0 && (
          <button
            id="clear-comparison-button"
            onClick={onClearAll}
            className="absolute bottom-5 right-5 md:bottom-6 md:right-6 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer transition-all active:scale-98"
          >
            Clear Comparison
          </button>
        )}
      </div>

      {/* Comparisons Alert Banner if < 2 selected */}
      {comparingColleges.length < 3 && comparingColleges.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold leading-relaxed shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            You have selected <strong className="underline text-amber-950 font-bold">{comparingColleges.length} college</strong>. Choose another one using the table column dropdowns or Search to perform a complete side-by-side comparison!
          </span>
        </div>
      )}

      {/* Reusable comparison tables matrix */}
      <CompareTable
        comparingColleges={comparingColleges}
        onRemove={onRemove}
        allColleges={allColleges}
        onAdd={onAdd}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}
