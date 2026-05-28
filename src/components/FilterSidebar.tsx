import { Filter, RotateCcw, MapPin, IndianRupee, Star, Landmark } from "lucide-react";

interface FilterSidebarProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  feesRange: [number, number];
  setFeesRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  resetFilters: () => void;
}

const LOCATIONS = [
  { value: "", label: "All Districts" },
  { value: "Delhi", label: "Delhi / NCR" },
  { value: "Mumbai", label: "Mumbai, MH" },
  { value: "Bengaluru", label: "Bengaluru, KA" },
  { value: "Chennai", label: "Chennai, TN" },
  { value: "Vellore", label: "Vellore, TN" },
  { value: "Kharagpur", label: "Kharagpur, WB" },
  { value: "Trichy", label: "Trichy, TN" },
  { value: "Mangaluru", label: "Mangaluru, KA" },
  { value: "Nagpur", label: "Nagpur, MH" },
  { value: "Patiala", label: "Patiala, PB" }
];

const FEE_RANGES = [
  { label: "Any Fees", value: [0, 1000000] as [number, number] },
  { label: "Under ₹2 Lakhs", value: [0, 200001] as [number, number] },
  { label: "₹2 - ₹4 Lakhs", value: [200000, 400001] as [number, number] },
  { label: "₹4 - ₹6 Lakhs", value: [400000, 600000] as [number, number] },
  { label: "Above ₹6 Lakhs", value: [600000, 1000000] as [number, number] }
];

export function FilterSidebar({
  selectedLocation,
  setSelectedLocation,
  feesRange,
  setFeesRange,
  minRating,
  setMinRating,
  selectedType,
  setSelectedType,
  resetFilters,
}: FilterSidebarProps) {
  return (
    <div className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 sm:items-center">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Refine Results</span>
        </div>
        <button
          id="reset-filters-button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4 pt-4">
        <section className="space-y-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Landmark className="h-3 w-3" />
            <span>Institution Type</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["", "Public", "Private"].map((type) => (
              <button
                id={`filter-type-${type || "all"}`}
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-md border px-2.5 py-2 text-center text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                  selectedType === type
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/10"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {type === "" ? "All" : type}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <MapPin className="h-3 w-3" />
            <span>Campus Location</span>
          </label>
          <div className="relative">
            <select
              id="filter-location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 cursor-pointer hover:border-slate-300 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <IndianRupee className="h-3 w-3" />
            <span>Annual Course Fees</span>
          </label>
          <div className="space-y-2">
            {FEE_RANGES.map((range, idx) => {
              const isSelected =
                feesRange[0] === range.value[0] && feesRange[1] === range.value[1];

              return (
                <button
                  id={`filter-fees-range-${idx}`}
                  key={range.label}
                  onClick={() => setFeesRange(range.value)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600/10"
                      : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>{range.label}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Star className="h-3 w-3" />
            <span>Minimum Rating</span>
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[0, 4.0, 4.3, 4.5].map((stars) => (
              <button
                id={`filter-rating-${stars}`}
                key={stars}
                onClick={() => setMinRating(stars)}
                className={`rounded-md border px-2.5 py-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  minRating === stars
                    ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600/10"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {stars === 0 ? "Any Stars" : `${stars.toFixed(1)}+`}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-slate-100 pt-2">
          <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3 transition-colors duration-200 hover:bg-blue-50">
            <p className="mb-1.5 text-[11px] font-bold text-blue-800">Need help choosing?</p>
            <button
              onClick={() => alert("Connecting with an academic advisor. Our counseling desk is setting up your session!")}
              className="w-full rounded-md bg-blue-600 py-2 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              Talk to Counselor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
