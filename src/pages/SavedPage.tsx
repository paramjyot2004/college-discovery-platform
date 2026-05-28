import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { College } from "../types";
import { CollegeCard } from "../components/CollegeCard";
import { AlertBanner } from "../components/Feedback";
import { Heart, Lock, LogIn, Compass, RefreshCw, Server } from "lucide-react";
import { getErrorMessage } from "../utils/error";

interface SavedPageProps {
  onToggleSaved: (id: string) => Promise<void>;
  comparingColleges: College[];
  onToggleCompare: (college: College) => void;
  onViewDetails: (slug: string) => void;
  onNavigateHome: () => void;
}

export function SavedPage({
  onToggleSaved,
  comparingColleges,
  onToggleCompare,
  onViewDetails,
  onNavigateHome,
}: SavedPageProps) {
  const { user, openAuthModal, savedIds } = useAuth();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch fully hydrated saved college objects from backend
  useEffect(() => {
    async function loadSavedColleges() {
      const token = localStorage.getItem("auth_token");
      if (!user || !token) return;

      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch("/api/saved-colleges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Could not fetch shortlisted details from server.");
        }

        const data = await res.json();
        setSavedColleges(data.savedColleges || []);
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err, "Failed to load your shortlist right now."));
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedColleges();
  }, [user, savedIds]); // Refresh when user changes or saved IDs list toggles

  // If unauthenticated: render a beautiful lock gate screen
  if (!user) {
    return (
      <div className="max-w-sm mx-auto text-center py-16 px-4 space-y-4 text-slate-800">
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-black text-slate-800 leading-tight">My Shortlist is Locked</h2>
          <p className="text-xs text-slate-550 leading-relaxed">
            Create an account or sign in to bookmark and shortlist your dream universities, view placement averages, and compile comparisons.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            id="saved-lock-login-button"
            onClick={() => openAuthModal("login")}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-99"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In with Email</span>
          </button>
          <button
            id="saved-lock-signup-button"
            onClick={() => openAuthModal("signup")}
            className="w-full text-[11px] font-bold text-slate-450 hover:text-blue-600 py-1 cursor-pointer"
          >
            Don't have an account? Sign up here
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      
      {/* Visual Header banner - High Density edition */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 md:p-6 text-white relative overflow-hidden border border-slate-700 shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold border border-white/15 tracking-widest uppercase text-red-300">
            <Heart className="w-3 h-3 fill-current" /> My Portfolio
          </span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Shortlisted Campuses
          </h1>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Manage your favorited universities, view admission details, or initiate comparative calculations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Hydrating bookmarks...</span>
        </div>
      ) : errorMsg ? (
        <AlertBanner
          tone="error"
          title="Could not load shortlist"
          message={errorMsg}
        />
      ) : savedColleges.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl max-w-md mx-auto shadow-xs p-4 space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-xs">
            <Heart className="w-5 h-5" />
          </div>
          <div className="space-y-1 px-2">
            <h3 className="font-bold text-slate-800 text-xs">Your Shortlist is currently empty</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore the college directories and press the bookmark icon on any college card to save it here for fast access.
            </p>
          </div>
          <button
            id="saved-discover-button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Directions</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isSaved={true}
              onToggleSaved={onToggleSaved}
              isComparing={comparingColleges.some((c) => c.id === college.id)}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
}
