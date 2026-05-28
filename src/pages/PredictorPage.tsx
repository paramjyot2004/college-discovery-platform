import React, { useState } from "react";
import { College } from "../types";
import { Sparkles, ArrowRight, GraduationCap, BadgeIndianRupee, Trophy } from "lucide-react";
import { formatPackage, parsePackageValue } from "../utils/formatPackage";

interface PredictorPageProps {
  colleges: College[];
  onViewDetails: (slug: string) => void;
}

const EXAMS = [
  "JEE Advanced",
  "JEE Main",
  "COMEDK",
  "VITEEE",
  "State Entrance",
] as const;

type ExamName = (typeof EXAMS)[number];

function formatFee(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${value.toLocaleString()}`;
}

function getExamBase(exam: ExamName) {
  switch (exam) {
    case "JEE Advanced":
      return 2200;
    case "JEE Main":
      return 6500;
    case "COMEDK":
      return 9000;
    case "VITEEE":
      return 11000;
    case "State Entrance":
      return 8000;
    default:
      return 6000;
  }
}

function getExamBonus(exam: ExamName, college: College) {
  if (exam === "JEE Advanced") {
    return college.type === "Public" ? 1800 : -350;
  }

  if (exam === "JEE Main") {
    return college.type === "Public" ? 900 : 500;
  }

  if (exam === "COMEDK") {
    return college.type === "Private" ? 1800 : -150;
  }

  if (exam === "VITEEE") {
    return college.type === "Private" ? 2200 : -300;
  }

  return college.location.includes("Delhi") || college.location.includes("Karnataka") || college.location.includes("Tamil Nadu")
    ? 700
    : 300;
}

function getWhyLabel(exam: ExamName, college: College) {
  if (exam === "JEE Advanced" && college.type === "Public") {
    return "Public flagship fit";
  }

  if ((exam === "COMEDK" || exam === "VITEEE") && college.type === "Private") {
    return "Private entrance fit";
  }

  if (college.rating >= 4.6) {
    return "High-confidence match";
  }

  return "Solid dataset match";
}

function getBand(rank: number, threshold: number) {
  if (rank <= threshold) {
    return "Strong Match";
  }

  if (rank <= threshold * 1.35) {
    return "Match";
  }

  return "Stretch";
}

export function PredictorPage({ colleges, onViewDetails }: PredictorPageProps) {
  const [exam, setExam] = useState<ExamName>("JEE Main");
  const [rank, setRank] = useState("6500");

  const numericRank = Math.max(1, Number.parseInt(rank || "0", 10) || 0);

  const rankedColleges = colleges
    .map((college) => {
      const placementValue = parsePackageValue(college.placements) ?? 0;
      const baseThreshold = getExamBase(exam);
      const threshold = Math.max(
        800,
        Math.round(
          baseThreshold + college.rating * 1150 + placementValue * 68 + getExamBonus(exam, college) - college.fees / 220
        )
      );
      const qualityScore = college.rating * 24 + placementValue * 1.8 + (1000000 - college.fees) / 160000;
      const fitScore = threshold - numericRank + qualityScore;
      return {
        college,
        threshold,
        fitScore,
        band: getBand(numericRank, threshold),
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 6);

  const strongMatches = rankedColleges.filter((item) => item.band === "Strong Match").length;
  const bestMatch = rankedColleges[0];

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.2),_transparent_35%)]" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
            <Sparkles className="h-3 w-3" />
            Dataset-driven recommendation engine
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            College Predictor
          </h1>
          <p className="max-w-xl text-xs md:text-sm leading-relaxed text-slate-300">
            Enter your exam and rank to get a ranked shortlist based on the dataset&apos;s rating, fees, placements, and admission-fit logic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 sticky top-24">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value as ExamName)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EXAMS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Rank
              </label>
              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Current signal</p>
              <p className="mt-1 text-sm font-black text-blue-950">
                {exam} with rank {numericRank.toLocaleString()}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-blue-700/80">
                {strongMatches} strong matches in the current dataset. Best fit: {bestMatch?.college.name || "No result"}.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommended Colleges</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{rankedColleges.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Strong Matches</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{strongMatches}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Best Fit</p>
              <p className="mt-2 text-sm font-black text-slate-900 leading-tight">{bestMatch?.college.name || "No result"}</p>
            </div>
          </div>

          <div className="space-y-3">
            {rankedColleges.map(({ college, band, threshold, fitScore }) => {
              const placementValue = parsePackageValue(college.placements) ?? 0;
              const reason = getWhyLabel(exam, college);
              return (
                <article key={college.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${band === "Strong Match" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : band === "Match" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                          {band}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {reason}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">{college.name}</h3>
                      <p className="text-xs text-slate-500">{college.location}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-right border border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated cutoff rank</p>
                      <p className="text-lg font-black text-slate-900">{threshold.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <BadgeIndianRupee className="h-3.5 w-3.5" />
                        Fees
                      </div>
                      <p className="mt-1 font-black text-slate-900">{formatFee(college.fees)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <Trophy className="h-3.5 w-3.5" />
                        Placements
                      </div>
                      <p className="mt-1 font-black text-slate-900">{formatPackage(placementValue)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Rating
                      </div>
                      <p className="mt-1 font-black text-slate-900">{college.rating.toFixed(1)} / 5</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-slate-500">
                      Stronger scores reflect admission fit, ROI, and overall dataset quality. Fit score: {fitScore.toFixed(1)}.
                    </p>
                    <button
                      onClick={() => onViewDetails(college.slug)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700"
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
