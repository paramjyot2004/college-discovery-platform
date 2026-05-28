import React from "react";
import { useAuth } from "../context/AuthContext";
import { Compass, Heart, Scale, LogIn, UserPlus, Menu, X, LogOut, GraduationCap } from "lucide-react";

interface NavbarProps {
  activeTab: "home" | "compare" | "saved" | "predictor" | "discussions" | string;
  setActiveTab: (tab: "home" | "compare" | "saved" | "predictor" | "discussions") => void;
  compareCount: number;
}

export function Navbar({ activeTab, setActiveTab, compareCount }: NavbarProps) {
  const { user, savedIds, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
      isActive
        ? "border border-blue-100 bg-blue-50 text-blue-700"
        : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center justify-between py-3 md:min-h-16 md:py-3.5">
          <div className="flex items-center">
            <button
              onClick={() => {
                setActiveTab("home");
                setMobileMenuOpen(false);
              }}
              className="group flex cursor-pointer items-center gap-2 text-slate-900"
            >
              <div className="rounded-lg bg-blue-600 p-1.5 text-white shadow-sm transition-colors group-hover:bg-blue-700">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="bg-gradient-to-r from-blue-700 to-indigo-900 bg-clip-text text-base font-black tracking-tight text-transparent">
                  Unipedia
                </span>
                <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  Discovery Matrix
                </span>
              </div>
            </button>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <button id="nav-home-tab" onClick={() => setActiveTab("home")} className={navItemClass(activeTab === "home")}>
              <Compass className="h-3.5 w-3.5" />
              <span>Explore</span>
            </button>

            <button
              id="nav-compare-tab"
              onClick={() => setActiveTab("compare")}
              className={`${navItemClass(activeTab === "compare")} relative`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              id="nav-saved-tab"
              onClick={() => {
                if (!user) {
                  openAuthModal("login");
                } else {
                  setActiveTab("saved");
                }
              }}
              className={`${navItemClass(activeTab === "saved")} relative`}
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Shortlist</span>
              {savedIds.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {savedIds.length}
                </span>
              )}
            </button>

            <button id="nav-predictor-tab" onClick={() => setActiveTab("predictor")} className={navItemClass(activeTab === "predictor")}>
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Predictor</span>
            </button>

            <button id="nav-discussions-tab" onClick={() => setActiveTab("discussions")} className={navItemClass(activeTab === "discussions")}>
              <Compass className="h-3.5 w-3.5" />
              <span>Discussions</span>
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Candidate</span>
                  <span className="max-w-[140px] truncate text-xs font-semibold leading-none text-slate-700">
                    {user.email}
                  </span>
                </div>
                <button
                  id="logout-button"
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-login-button"
                  onClick={() => openAuthModal("login")}
                  className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </button>
                <button
                  id="nav-signup-button"
                  onClick={() => openAuthModal("signup")}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 shadow-inner md:hidden">
          <button
            onClick={() => {
              setActiveTab("home");
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "home" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore Colleges</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("compare");
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "compare" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="h-4 w-4" />
              <span>Compare side-by-side</span>
            </div>
            {compareCount > 0 && <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{compareCount}</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("predictor");
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "predictor" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>College Predictor</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("discussions");
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "discussions" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Discussions</span>
          </button>

          <button
            onClick={() => {
              if (!user) {
                openAuthModal("login");
              } else {
                setActiveTab("saved");
              }
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "saved" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="h-4 w-4" />
              <span>My Shortlist</span>
            </div>
            {savedIds.length > 0 && <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{savedIds.length}</span>}
          </button>

          <div className="my-2 border-t border-slate-200 pt-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Logged in as</p>
                  <p className="truncate text-xs font-semibold text-slate-800">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-1">
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal("signup");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}