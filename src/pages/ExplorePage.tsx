import React, { useState, useEffect } from "react";
import { College } from "../types";
import { FilterSidebar } from "../components/FilterSidebar";
import { CollegeCard } from "../components/CollegeCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { AlertBanner } from "../components/Feedback";
import { Search, Loader2, ArrowUpDown, Server, Sparkles, BookOpen, Layers } from "lucide-react";
import { getErrorMessage } from "../utils/error";

interface ExplorePageProps {
  onToggleSaved: (id: string) => Promise<void>;
  savedIds: string[];
  comparingColleges: College[];
  onToggleCompare: (college: College) => void;
  onViewDetails: (slug: string) => void;
}

const ITEMS_PER_PAGE = 6;

export function ExplorePage({
  onToggleSaved,
  savedIds,
  comparingColleges,
  onToggleCompare,
  onViewDetails,
}: ExplorePageProps) {
  // State variables for search + filtering
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [feesRange, setFeesRange] = useState<[number, number]>([0, 1000000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  // Colleges list state
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Paginated states
  const [currentPage, setCurrentPage] = useState(1);

  // Quick reset helper
  const resetFilters = () => {
    setSearch("");
    setSelectedLocation("");
    setFeesRange([0, 1000000]);
    setMinRating(0);
    setSelectedType("");
    setSortBy("rating-desc");
    setCurrentPage(1);
  };

  // Fetch colleges when active parameters mutate
  useEffect(() => {
    async function fetchColleges() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const queryParams = new URLSearchParams();
        const searchParam = (search || "").trim();
        if (searchParam) queryParams.set("search", searchParam);
        if (selectedLocation) queryParams.set("location", selectedLocation);
        if (feesRange[0] > 0) queryParams.set("minFees", feesRange[0].toString());
        if (feesRange[1] < 1000000) queryParams.set("maxFees", feesRange[1].toString());
        if (minRating > 0) queryParams.set("rating", minRating.toString());
        if (selectedType) queryParams.set("type", selectedType);
        queryParams.set("sortBy", sortBy);

        const res = await fetch(`/api/colleges?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error("Could not load university profiles");
        }
        const data = await res.json();
        setColleges(data.colleges || []);
        setCurrentPage(1); // Reset page index on state filter modifications
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err, "Failed to load college listings. Please try again."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchColleges();
  }, [search, selectedLocation, feesRange, minRating, selectedType, sortBy]);

  // Handle local pagination calculus
  const totalPages = Math.ceil(colleges.length / ITEMS_PER_PAGE);
  const paginatedColleges = colleges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div id="explore-viewport" className="space-y-6 animate-fade-in text-slate-800">
      
      {/* 1. Hero search block header (High Density edition) */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-xl overflow-hidden px-6 py-8 md:py-10 md:px-10 shadow-md border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> India’s Leading Admissions Assistant
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
            Find Your Dream Engineering Campus
          </h1>
          <p className="text-xs text-slate-300 max-w-lg font-medium leading-relaxed">
            Browse through NIRF top-ranked institutes. Filter by annual tuition costs, ratings, or verified placement packages.
          </p>

          {/* Search bar inside Hero (High density design) */}
          <div className="pt-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by college name, courses (e.g. Aerospace, CS), state..."
                className="w-full pl-9 pr-4 py-2 bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-lg shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Floating Quick tag metrics decoration */}
        <div className="absolute right-8 bottom-8 hidden lg:flex gap-3 max-w-sm text-left">
          <div className="px-3 py-2 bg-white/5 backdrop-blur-md rounded border border-white/10">
            <span className="text-lg font-black block leading-none">16+</span>
            <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">Institutions</span>
          </div>
          <div className="px-3 py-2 bg-white/5 backdrop-blur-md rounded border border-white/10">
            <span className="text-lg font-black block leading-none">100%</span>
            <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">Verified Stats</span>
          </div>
        </div>
      </div>

      {/* 2. College Grid and Filter row layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Column */}
        <div className="lg:col-span-1">
          <FilterSidebar
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            feesRange={feesRange}
            setFeesRange={setFeesRange}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            resetFilters={resetFilters}
          />
        </div>

        {/* Right Directory Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* List Headers + Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white py-2.5 px-4 rounded-xl border border-slate-250/60 shadow-xs">
            <div>
              <p className="text-xs font-black text-slate-700">
                {isLoading ? (
                  "Filtering college records..."
                ) : (
                  <>Showing <span className="text-blue-600">{colleges.length}</span> verified colleges</>
                )}
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <label 
                htmlFor="sort-select"
                className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <span>Sort By</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="rating-desc">Reviews: High to Low</option>
                <option value="placements-desc">Package: High to Low</option>
                <option value="fees-asc">Fees: Low to High</option>
                <option value="fees-desc">Fees: High to Low</option>
                <option value="reviews-desc">Reviews Count</option>
              </select>
            </div>
          </div>

          {/* Database server error message wrapper */}
          {errorMsg && (
            <AlertBanner
              tone="error"
              title="We couldn't load college listings"
              message={errorMsg}
            />
          )}

          {/* Cards block logic */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : colleges.length === 0 ? (
            <EmptyState
              onClearFilters={resetFilters}
              title="No colleges match your filters"
              message="Try adjusting your search, location, fees range, rating, or college type to see more results."
              actionLabel="Reset filters"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {paginatedColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isSaved={savedIds.includes(college.id)}
                    onToggleSaved={onToggleSaved}
                    isComparing={comparingColleges.some((c) => c.id === college.id)}
                    onToggleCompare={onToggleCompare}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>

              {/* Pagination block */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // Scroll back to list view area elegantly
                  const target = document.getElementById("explore-viewport");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </>
          )}

        </div>
      </div>

    </div>
  );
}
