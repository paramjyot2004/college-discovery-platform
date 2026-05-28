import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FeedbackProvider } from "./components/Feedback";
import { ExplorePage } from "./pages/ExplorePage";
import { DetailPage } from "./pages/DetailPage";
import { ComparePage } from "./pages/ComparePage";
import { SavedPage } from "./pages/SavedPage";
import { PredictorPage } from "./pages/PredictorPage";
import { DiscussionsPage } from "./pages/DiscussionsPage";
import { College } from "./types";
import { getAllColleges } from "./utils/localData";
import { AlertCircle, Scale, GraduationCap, X } from "lucide-react";

function RootApp() {
  const { user, toggleSaved, savedIds } = useAuth();
  
  // Active navigation tabs
  const [activeTab, setActiveTab] = useState<"home" | "compare" | "saved" | "predictor" | "discussions">("home");
  const [allColleges, setAllColleges] = useState<College[]>([]);

  React.useEffect(() => {
    let mounted = true;
    getAllColleges()
      .then((list) => {
        if (mounted) setAllColleges(list || []);
      })
      .catch((err) => console.error("Failed to load all colleges:", err));
    return () => {
      mounted = false;
    };
  }, []);
  
  // Selected detail slug
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Compare sandbox state (exactly 2 allowed)
  const [comparingColleges, setComparingColleges] = useState<College[]>([]);

  // Alert notifier state for compare cap
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Compare toggler logic
  const handleToggleCompare = (college: College) => {
    const isAlreadyPresent = comparingColleges.some((c) => c.id === college.id);
    
    if (isAlreadyPresent) {
      // Remove it
      setComparingColleges(comparingColleges.filter((c) => c.id !== college.id));
    } else {
      // Add it, capping to 3
      if (comparingColleges.length >= 3) {
        setAlertMsg("You can compare a maximum of 3 colleges side-by-side. Please remove one from the comparison list first.");
        // Auto-dismiss alert after 5s
        setTimeout(() => setAlertMsg(null), 5000);
      } else {
        setComparingColleges([...comparingColleges, college]);
      }
    }
  };

  const handleRemoveCompare = (id: string) => {
    setComparingColleges(comparingColleges.filter((c) => c.id !== id));
  };

  const handleAddCompare = (college: College) => {
    if (comparingColleges.length >= 3) {
      setAlertMsg("Comparison queue is full. Remove a college first.");
      return;
    }
    setComparingColleges([...comparingColleges, college]);
  };

  const handleClearCompare = () => {
    setComparingColleges([]);
  };

  // Saved bookmark toggler helper
  const handleToggleSaved = async (collegeId: string) => {
    // If successful, toggled Saved status
    await toggleSaved(collegeId);
  };

  const handleViewDetails = (slug: string) => {
    setSelectedSlug(slug);
    // Smooth scroll to top when detail opens
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans text-slate-700 antialiased">
      
      {/* 1. Sticky Navigation Header */}
      <Navbar
        activeTab={selectedSlug ? "detail" : activeTab}
        setActiveTab={(tab) => {
          setSelectedSlug(null); // Close active detail view when moving between tabs
          setActiveTab(tab);
        }}
        compareCount={comparingColleges.length}
      />

      {/* 2. Floating Cap alerts notifier - Refined in High Density */}
      {alertMsg && (
        <div className="fixed top-16 right-4 z-50 max-w-xs bg-white border border-slate-200 p-3 rounded-lg shadow-md flex items-start gap-2.5 animate-slide-in text-slate-800">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wide">Matrix Alert</h4>
            <p className="text-[11px] text-slate-550 mt-0.5 leading-relaxed">{alertMsg}</p>
          </div>
          <button
            onClick={() => setAlertMsg(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Content Rendering Body */}
      <main className="mx-auto flex w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <ErrorBoundary>
        {selectedSlug ? (
          /* Detail Page View has operational priority */
          <DetailPage
            slug={selectedSlug}
            onBack={() => setSelectedSlug(null)}
            onToggleSaved={handleToggleSaved}
            savedIds={savedIds}
          />
        ) : activeTab === "home" ? (
          /* Explore View page */
          <div className="w-full">
          <ExplorePage
            onToggleSaved={handleToggleSaved}
            savedIds={savedIds}
            comparingColleges={comparingColleges}
            onToggleCompare={handleToggleCompare}
            onViewDetails={handleViewDetails}
          />
          </div>
        ) : activeTab === "compare" ? (
          /* Compare Dashboard view page */
          <div className="w-full">
            <ComparePage
              comparingColleges={comparingColleges}
              onRemove={handleRemoveCompare}
              allColleges={allColleges}
              onAdd={handleAddCompare}
              onViewDetails={handleViewDetails}
              onClearAll={handleClearCompare}
            />
          </div>
        ) : activeTab === "predictor" ? (
          <div className="w-full">
            <PredictorPage colleges={allColleges} onViewDetails={handleViewDetails} />
          </div>
        ) : activeTab === "discussions" ? (
          <div className="w-full">
            <DiscussionsPage colleges={allColleges} onViewDetails={handleViewDetails} />
          </div>
        ) : (
          /* Shortlists bookmarks view page */
          <div className="w-full">
            <SavedPage
              onToggleSaved={handleToggleSaved}
              comparingColleges={comparingColleges}
              onToggleCompare={handleToggleCompare}
              onViewDetails={handleViewDetails}
              onNavigateHome={() => setActiveTab("home")}
            />
          </div>
        )}
        </ErrorBoundary>

      </main>

      {/* 4. Auth triggers overlays */}
      <AuthModal />

      {/* 5. Minimal branding Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FeedbackProvider>
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </FeedbackProvider>
  );
}
