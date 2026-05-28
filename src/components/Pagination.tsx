import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
      
      {/* Short count label */}
      <span className="text-xs font-bold text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      {/* Control buttons */}
      <div className="flex items-center gap-1.5">
        <button
          id="prev-page-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:pointer-events-none disabled:bg-gray-50 transition-all cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {(() => {
          const btns = [];
          for (let i = 1; i <= totalPages; i++) {
            const isCurrent = currentPage === i;
            btns.push(
              <button
                id={`page-btn-${i}`}
                key={i}
                onClick={() => onPageChange(i)}
                className={`flex items-center justify-center h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "border border-gray-100 bg-white hover:bg-gray-50 text-gray-600"
                }`}
              >
                {i}
              </button>
            );
          }
          return btns;
        })()}

        <button
          id="next-page-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:pointer-events-none disabled:bg-gray-50 transition-all cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
