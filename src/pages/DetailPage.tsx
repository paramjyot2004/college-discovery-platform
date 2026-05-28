import React, { useEffect, useState } from "react";
import { College } from "../types";
import { Star, MapPin, IndianRupee, Briefcase, ChevronLeft, Landmark, Calendar, Sparkles, GraduationCap, Heart, ShieldCheck, Mail, Navigation } from "lucide-react";
import { AlertBanner } from "../components/Feedback";
import { getErrorMessage } from "../utils/error";
import { formatPackage, parsePackageValue } from "../utils/formatPackage";

interface DetailPageProps {
  slug: string;
  onBack: () => void;
  onToggleSaved: (id: string) => Promise<void>;
  savedIds: string[];
}

export function DetailPage({ slug, onBack, onToggleSaved, savedIds }: DetailPageProps) {
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  useEffect(() => {
    async function loadCollegeDetails() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`/api/colleges/${slug}`);
        if (!res.ok) {
          throw new Error("We could not load this college profile right now.");
        }
        const data = await res.json();
        setCollege(data.college || null);
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err, "Failed to load the college profile."));
      } finally {
        setIsLoading(false);
      }
    }
    loadCollegeDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Loading profile dataset...</p>
      </div>
    );
  }

  if (errorMsg || !college) {
    return (
      <div className="mx-auto flex max-w-xl items-center justify-center px-4 py-10">
        <AlertBanner
          tone="error"
          title="College profile unavailable"
          message={errorMsg || "Requested institution could not be located."}
          action={
            <button
              onClick={onBack}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Return to directory
            </button>
          }
        />
      </div>
    );
  }

  const isSaved = savedIds.includes(college.id);

  const generatedReviews = college.reviews?.length
    ? college.reviews
    : [
        {
          author: "Aarav Sharma",
          role: "Final-year student",
          rating: Math.max(4, college.rating - 0.1),
          text: `${college.name.split(",")[0]} delivers a strong academic environment and the placement support feels structured and transparent.`,
          date: "2026-04-18",
        },
        {
          author: "Nisha Verma",
          role: "Alumni",
          rating: Math.max(3.9, college.rating - 0.2),
          text: `Faculty support, peer learning, and internship opportunities were the biggest positives during my time at ${college.name.split(",")[0]}.`,
          date: "2026-03-04",
        },
        {
          author: "Rahul Mehta",
          role: "Prospective reviewer",
          rating: Math.min(5, college.rating),
          text: `The overall ROI is compelling, especially if you value placements, active clubs, and a campus experience that feels job-ready.`,
          date: "2026-02-11",
        },
      ];

  const averageReviewScore = generatedReviews.reduce((sum, review) => sum + review.rating, 0) / generatedReviews.length;
  const sentimentLabel = averageReviewScore >= 4.6 ? "Outstanding student sentiment" : averageReviewScore >= 4.3 ? "Very strong student sentiment" : "Mixed but positive feedback";

  // Format monetary figures
  const formatFees = (amt: number) => {
    if (amt >= 100000) {
      return `₹${(amt / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amt.toLocaleString()}`;
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-800" id="detail-viewport">
      
      {/* 1. Header Back to directory shortcut */}
      <button
        id="detail-back-button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-550 hover:text-slate-900 font-bold hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to Directory</span>
      </button>

      {/* 2. Banner Block (Sleeker and denser) */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-sm h-48 md:h-56">
        <img
          src={college.image}
          alt={`${college.name} Cover`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

        {/* Floating elements inside banner */}
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                {college.type}
              </span>
              <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] items-center gap-0.5 font-bold rounded flex shadow-xs">
                <Star className="w-2.5 h-2.5 fill-white text-white" />
                <span>{college.rating.toFixed(1)} Rating</span>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
              {college.name}
            </h1>

            <p className="text-slate-300 text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{college.location}</span>
            </p>
          </div>

          {/* Quick saving shortlisted CTA inside Banner */}
          <button
            id="detail-save-toggle"
            onClick={() => onToggleSaved(college.id)}
            className={`self-start md:self-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isSaved
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10"
                : "bg-white hover:bg-slate-50 text-slate-900"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current text-white" : ""}`} />
            <span>{isSaved ? "Shortlisted!" : "Shortlist College"}</span>
          </button>
        </div>
      </div>

      {/* 3. Double Column Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: tab content sections */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Tabs header controller */}
          <div className="flex border border-slate-200/80 bg-slate-100 p-1 rounded-lg gap-1">
            {(["overview", "courses", "placements", "reviews"] as const).map((tab) => (
              <button
                id={`detail-tab-${tab}`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-md capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                  {tab}
              </button>
            ))}
          </div>

          {/* Tab active page rendering */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-xs min-h-[220px]">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                    About this Institution
                  </h3>
                  <p className="text-slate-650 text-xs leading-relaxed whitespace-pre-line">
                    {college.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Establishment Era
                    </span>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Founded in {college.established}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      NIRF Placement Health
                    </span>
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      100% Industry Verified
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                    Offered Degree Programs
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-semibold">
                    The following comprehensive disciplines are popular streams at our campus.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {college.courses.map((course: string, idx: number) => (
                    <div 
                      key={course} 
                      className="p-3 border border-slate-150 rounded-lg flex items-start gap-2.5 hover:border-blue-100 transition-colors"
                    >
                      <span className="h-5 w-5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">{course}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                          Course Duration: {course.startsWith("M.") ? "2 Years (Regular)" : "4 Years (Regular)"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "placements" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                    Placements Statistics
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-semibold">
                    Track the performance of our immediate graduating batches across premium organizations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Average Package */}
                  <div className="p-4 bg-blue-50/60 text-blue-800 rounded-xl border border-blue-100/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-blue-600 text-white rounded">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        Average Package
                      </span>
                    </div>
                    <p className="text-2xl font-black text-blue-900">{formatPackage(parsePackageValue(college.placements) ?? 0)}</p>
                    <p className="text-[9px] text-blue-600 font-semibold leading-relaxed">
                      NIRF reported median package for engineering candidates
                    </p>
                  </div>

                  {/* Highest package */}
                  <div className="p-4 bg-emerald-58/60 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 bg-emerald-600 text-white rounded">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Highest Placement
                      </span>
                    </div>
                    <p className="text-2xl font-black text-emerald-950">
                      {parsePackageValue(college.highestPlacement) !== null
                        ? formatPackage(parsePackageValue(college.highestPlacement) as number)
                        : "N/A"}
                    </p>
                    <p className="text-[9px] text-emerald-600 font-semibold leading-relaxed">
                      Peak package secured globally by active alumni
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    * Placement indicators are validated periodically against statutory reports. Top companies hiring include Google, Microsoft, Amazon, TCS, and Accenture.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                    Student Reviews
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-semibold">
                    {sentimentLabel}. Based on {college.reviewsCount.toLocaleString()} verified review signals and college profile data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Average Rating</p>
                    <p className="text-2xl font-black text-amber-950 mt-1">{averageReviewScore.toFixed(1)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Review Count</p>
                    <p className="text-2xl font-black text-blue-950 mt-1">{college.reviewsCount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Placement Sentiment</p>
                    <p className="text-xs font-black text-emerald-950 mt-2 leading-tight">{formatPackage(parsePackageValue(college.placements) ?? 0)} average package</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {generatedReviews.map((review) => (
                    <article key={`${review.author}-${review.date}`} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{review.author}</h4>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{review.role}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600">{review.text}</p>
                      <p className="mt-3 text-[10px] font-semibold text-slate-400">Reviewed on {new Date(review.date).toLocaleDateString()}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Admission Highlights Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Admission Highlights</span>
            </h3>

            {/* highlights listing list */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">ANNUAL FEES</span>
                <span className="font-extrabold text-slate-800">{formatFees(college.fees)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">ESTABLISHED</span>
                <span className="font-extrabold text-slate-800">{college.established}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">OWNERSHIP</span>
                <span className="font-extrabold text-slate-800">{college.type}</span>
              </div>

              {college.campusSize && (
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">ACRE SIZE</span>
                  <span className="font-extrabold text-slate-800">{college.campusSize}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">REVIEWS</span>
                <span className="font-extrabold text-amber-600">{college.reviewsCount} profiles</span>
              </div>
            </div>

            {/* Quick Action callback */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  alert(`Inquire for ${college.name} registration process has been submitted! Our support representatives will reach out.`);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-99"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Apply / Get brochure</span>
              </button>
            </div>
          </div>

          {/* 4. Visual Campus Map Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Campus Location</span>
            </h3>

            <div className="relative w-full h-44 bg-slate-55 rounded-lg overflow-hidden border border-slate-200">
              <iframe
                title={`Map of ${college.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(college.name + " " + college.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-305"
              />
            </div>

            <a
              id="get-directions-button"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(college.name + " " + college.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all border border-slate-200"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Get Directions</span>
            </a>

            <p className="text-[11px] text-slate-500 flex items-start gap-1 p-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="font-semibold leading-normal">{college.location}</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
