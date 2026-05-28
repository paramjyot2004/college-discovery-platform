import { College } from "../types";
import { Star, MapPin, IndianRupee, Briefcase, Plus, Check, Eye, Heart, Calendar } from "lucide-react";
import { formatPackage, parsePackageValue } from "../utils/formatPackage";

interface CollegeCardProps {
  key?: any;
  college: College;
  isSaved: boolean;
  onToggleSaved: (id: string) => Promise<void>;
  isComparing: boolean;
  onToggleCompare: (college: College) => void;
  onViewDetails: (slug: string) => void;
}

export function CollegeCard({
  college,
  isSaved,
  isComparing,
  onToggleSaved,
  onToggleCompare,
  onViewDetails,
}: CollegeCardProps) {
  // Format fees to be super compact (e.g. ₹2.2 L)
  const formatFees = (amt: number) => {
    if (amt >= 100000) {
      return `₹${(amt / 100000).toFixed(2)} L`;
    }
    return `₹${amt.toLocaleString()}`;
  };

  return (
    <div 
      id={`college-card-${college.id}`}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:ring-2 hover:ring-blue-500/10 hover:border-blue-400 transition-all duration-200 group overflow-hidden flex flex-col h-full min-h-[29rem] sm:min-h-[31rem]"
    >
      {/* Banner & Badges Image container */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-100 shrink-0 sm:h-40">
        <img
          src={college.image}
          alt={`${college.name} Campus`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Top Floating Tags */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-800 shadow-xs">
            {college.type}
          </span>
          {college.campusSize && (
            <span className="rounded bg-slate-900/85 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-xs">
              {college.campusSize}
            </span>
          )}
        </div>

        {/* Saved Flag & Absolute Rating */}
        <div className="absolute right-2 top-2 flex items-center gap-1 sm:gap-1.5">
          {/* Rating tag inspired by design HTML */}
          <div className="bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-600 border border-blue-50 flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-current" />
            <span>{college.rating.toFixed(1)}</span>
          </div>

          <button
            id={`save-cap-${college.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved(college.id);
            }}
            className={`p-1.5 rounded-md transition-all ${
              isSaved
                ? "bg-red-500 text-white shadow-xs"
                : "bg-white/90 hover:bg-white text-slate-700 shadow-xs"
            }`}
            aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
          >
            <Heart className={`w-3 h-3 ${isSaved ? "fill-current text-white" : ""}`} />
          </button>
        </div>

        {/* Bottom Banner Floating Establishment year / details */}
        <div className="absolute bottom-2 left-2 text-white drop-shadow-xs">
          <h4 className="max-w-[13rem] text-xs font-bold leading-tight line-clamp-2 break-words hyphens-auto drop-shadow-md sm:max-w-[14rem] sm:text-sm">
            {college.name.split(",")[0]}
          </h4>
          <p className="mt-1 flex items-center gap-0.5 text-[10px] opacity-90">
            <MapPin className="w-2.5 h-2.5" />
            {college.location.split(",")[0]}
          </p>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/45 backdrop-blur-xs text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium">
          <Calendar className="w-2.5 h-2.5" />
          <span>Est. {college.established}</span>
        </div>
      </div>

      {/* College Info Body */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex-1 space-y-3">
          {/* Subheader Title */}
          <h3 className="min-h-[2.75rem] text-sm font-semibold leading-snug text-slate-800 transition-colors line-clamp-2 break-words hyphens-auto group-hover:text-blue-600 sm:min-h-[3rem] sm:text-[15px]">
            {college.name}
          </h3>

          {/* Description Snippet */}
          <p className="min-h-[3.25rem] text-[11px] leading-relaxed text-slate-500 line-clamp-3 sm:min-h-[3.5rem] sm:text-xs">
            {college.description}
          </p>

          {/* 3-Column ROI Statistics Box (Match High Density design template) */}
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200/60 bg-slate-50 p-2.5 sm:p-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg Pkg
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-[11px] font-bold text-slate-800">
                <Briefcase className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{formatPackage(parsePackageValue(college.placements) ?? 0)}</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Annual Fee
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-[11px] font-bold text-slate-800">
                <IndianRupee className="w-3 h-3 text-emerald-550 shrink-0" />
                <span>{formatFees(college.fees)}</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Highest Pkg
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-[11px] font-bold text-slate-800">
                <span className="text-amber-500 font-extrabold text-[10px] shrink-0">★</span>
                <span>
                  {parsePackageValue(college.highestPlacement) !== null
                    ? formatPackage(parsePackageValue(college.highestPlacement) as number)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons footer */}
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3.5 sm:pt-4">
          {/* Compare Button */}
          <button
            id={`compare-btn-${college.id}`}
            onClick={() => onToggleCompare(college)}
            className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-all ${
              isComparing
                ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                : "border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 bg-white cursor-pointer"
            }`}
          >
            {isComparing ? (
              <>
                <Check className="w-3 h-3" />
                <span>Comparing</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 text-slate-450" />
                <span>Compare</span>
              </>
            )}
          </button>

          {/* Details Button */}
          <button
            id={`view-details-${college.id}`}
            onClick={() => onViewDetails(college.slug)}
            className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md active:scale-99"
          >
            <Eye className="w-3 h-3" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
