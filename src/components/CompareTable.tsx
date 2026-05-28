import React from "react";
import { College } from "../types";
import { X, Scale, IndianRupee, Briefcase, Star, MapPin, Landmark, Calendar, Eye, Compass } from "lucide-react";
import { formatPackage, parsePackageValue } from "../utils/formatPackage";

interface CompareTableProps {
  comparingColleges: College[];
  onRemove: (id: string) => void;
  allColleges: College[];
  onAdd: (college: College) => void;
  onViewDetails: (slug: string) => void;
}

export function CompareTable({
  comparingColleges,
  onRemove,
  allColleges,
  onAdd,
  onViewDetails,
}: CompareTableProps) {
  // Format fees to be super compact
  const formatFees = (amt: number) => {
    if (amt >= 100000) {
      return `₹${(amt / 100000).toFixed(2)} L`;
    }
    return `₹${amt.toLocaleString()}`;
  };

  // Find colleges not currently being compared
  const availableToCompare = allColleges.filter(
    (c) => !comparingColleges.some((comp) => comp.id === c.id)
  );
  const compareSlots = Array.from({ length: 3 }, (_, index) => comparingColleges[index] ?? null);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm md:p-5">
      {/* Table Header Section */}
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3 sm:items-center">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-sm font-black text-slate-800">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Comparison Matrix</span>
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Review detailed criteria, return-on-investment parameters, and campus reviews side-by-side.
          </p>
        </div>
        <span className="shrink-0 rounded border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          {comparingColleges.length} / 3 Selected
        </span>
      </div>

      {comparingColleges.length === 0 ? (
        <div className="space-y-3 px-4 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/50 bg-slate-50 text-slate-600">
            <Scale className="w-5 h-5 text-slate-550" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs">Comparison list is empty</h3>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
              Select colleges to compare from the Search directory, or select a college below to begin side-by-side inspection.
            </p>
          </div>
          {availableToCompare.length > 0 && (
            <div className="mx-auto max-w-xs pt-1">
              <label className="block text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Select College
              </label>
              <select
                id="compare-quick-select-0"
                onChange={(e) => {
                  const selected = allColleges.find((c) => c.slug === e.target.value);
                  if (selected) onAdd(selected);
                  e.target.value = "";
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">-- Choose college --</option>
                {availableToCompare.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <>
        <div className="space-y-4 md:hidden">
          {compareSlots.map((col, index) => (
            <div
              key={col?.id ?? `placeholder-mobile-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
            >
              {col ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-flex rounded bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold uppercase text-blue-600 ring-1 ring-blue-100/50">
                        {col.type}
                      </span>
                      <h3 className="text-sm font-black leading-tight text-slate-900">{col.name}</h3>
                      <p className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <MapPin className="h-2.5 w-2.5 text-slate-400" />
                        <span>{col.location.split(",")[0]}</span>
                      </p>
                    </div>
                    <button
                      id={`remove-compare-mobile-${col.id}`}
                      onClick={() => onRemove(col.id)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg placement</p>
                      <p className="mt-1 font-semibold text-slate-800">{formatPackage(parsePackageValue(col.placements) ?? 0)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest package</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {parsePackageValue(col.highestPlacement) !== null
                          ? formatPackage(parsePackageValue(col.highestPlacement) as number)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual fee</p>
                      <p className="mt-1 font-semibold text-emerald-700">{formatFees(col.fees)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Review rating</p>
                      <p className="mt-1 font-semibold text-slate-800">{col.rating.toFixed(1)} / 5</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Founded</p>
                      <p className="mt-1 font-semibold text-slate-800">{col.established}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus size</p>
                      <p className="mt-1 font-semibold text-slate-800">{col.campusSize || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {col.courses.slice(0, 3).map((course: string) => (
                      <span key={course} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
                        {course}
                      </span>
                    ))}
                  </div>

                  <button
                    id={`compare-to-detail-mobile-${col.id}`}
                    onClick={() => onViewDetails(col.slug)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-[10px] font-bold text-slate-400">Add another college to compare</p>
                  <select
                    id={`compare-quick-select-mobile-${index}`}
                    onChange={(e) => {
                      const selected = allColleges.find((c) => c.slug === e.target.value);
                      if (selected) onAdd(selected);
                      e.target.value = "";
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                  >
                    <option value="">-- Select college --</option>
                    {availableToCompare.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[550px] w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-2.5 font-bold text-slate-500 text-[10px] tracking-wider uppercase w-1/4">
                  Key Metrics
                </th>
                {compareSlots.map((col, index) =>
                  col ? (
                    <th key={col.id} className="p-2.5 w-3/8 relative group bg-white border-l border-r border-slate-100">
                      <button
                        id={`remove-compare-${col.id}`}
                        onClick={() => onRemove(col.id)}
                        className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1 pt-1">
                        <span className="inline-block text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-1.5 py-0.5 rounded uppercase">
                          {col.type}
                        </span>
                        <h3 className="font-extrabold text-xs text-slate-800 leading-tight line-clamp-1">
                          {col.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          <span>{col.location.split(",")[0]}</span>
                        </p>
                      </div>
                    </th>
                  ) : (
                    <th key={`placeholder-${index}`} className="p-3 w-3/8 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center">
                      <div className="py-4 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400">
                          Add another college to compare
                        </p>
                        <select
                          id={`compare-quick-select-${index}`}
                          onChange={(e) => {
                            const selected = allColleges.find((c) => c.slug === e.target.value);
                            if (selected) onAdd(selected);
                            e.target.value = "";
                          }}
                          className="w-full max-w-[170px] bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-600 focus:outline-none cursor-pointer"
                        >
                          <option value="">-- Select college --</option>
                          {availableToCompare.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* ROI Average placements */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  <span>Avg Placement</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`placement-${index}`} className="p-2.5 font-bold text-blue-700 bg-blue-50/10">
                    {col ? formatPackage(parsePackageValue(col.placements) ?? 0) : "-"}
                  </td>
                ))}
              </tr>

              {/* Highest placement package */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Highest Package</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`highest-${index}`} className="p-2.5 font-bold text-slate-800">
                    {col
                      ? parsePackageValue(col.highestPlacement) !== null
                        ? formatPackage(parsePackageValue(col.highestPlacement) as number)
                        : "N/A"
                      : "-"}
                  </td>
                ))}
              </tr>

              {/* Tuition Fees */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-550" />
                  <span>Annual Fee</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`fees-${index}`} className="p-2.5 font-bold text-emerald-700">
                    {col ? formatFees(col.fees) : "-"}
                  </td>
                ))}
              </tr>

              {/* Reviews rating */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reviews rating</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`rating-${index}`} className="p-2.5 font-bold text-slate-800">
                    {col ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{col.rating.toFixed(1)} / 5</span>
                        <span className="text-slate-400 font-normal text-[10px]">({col.reviewsCount})</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>

              {/* Establishment Year */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Founded / Ownership</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`founded-${index}`} className="p-2.5 text-slate-650 font-medium">
                    {col ? `${col.established} (${col.type})` : "-"}
                  </td>
                ))}
              </tr>

              {/* Campus Size */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-500" />
                  <span>Campus Size</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`campus-${index}`} className="p-2.5 text-slate-650 font-medium">
                    {col ? col.campusSize || "N/A" : "-"}
                  </td>
                ))}
              </tr>

              {/* Courses list */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 font-bold text-slate-700">
                  <span>Popular Offerings</span>
                </td>
                {compareSlots.map((col, index) => (
                  <td key={`courses-${index}`} className="p-2.5">
                    {col ? (
                      <div className="flex flex-wrap gap-1">
                        {col.courses.slice(0, 4).map((course: string) => (
                          <span key={course} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] rounded font-medium border border-slate-200/40">
                            {course}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>

              {/* Navigation trigger action column */}
              <tr>
                <td className="p-2.5"></td>
                {compareSlots.map((col, index) => (
                  <td key={`action-${index}`} className="p-2.5">
                    {col ? (
                      <button
                        id={`compare-to-detail-${col.id}`}
                        onClick={() => onViewDetails(col.slug)}
                        className="w-full flex items-center justify-center gap-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all active:scale-99 shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Profile</span>
                      </button>
                    ) : null}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
