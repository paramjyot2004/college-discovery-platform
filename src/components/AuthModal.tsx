import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, Loader2, Compass, LogIn, UserPlus } from "lucide-react";
import { AlertBanner } from "./Feedback";

export function AuthModal() {
  const { authModalMode, closeAuthModal, openAuthModal, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!authModalMode) return null;

  const isLogin = authModalMode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all layout fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = isLogin
        ? await login(email, password)
        : await signup(email, password);

      if (!response.success && response.error) {
        setErrorMsg(response.error);
      } else {
        // Success! Reset values
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="auth-modal"
        className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        {/* Decorative Top header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-6 text-white text-center relative">
          <button
            id="close-auth-button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-2">
            <Compass className="w-10 h-10 text-blue-200 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {isLogin ? "Welcome back!" : "Create your account"}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {isLogin 
              ? "Sign in to save and shortlist your dream colleges" 
              : "Register to unlock saved bookmarks and comparisons"
            }
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4">
              <AlertBanner tone="error" title="Authentication error" message={errorMsg} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-800"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md active:scale-98 transition-all disabled:opacity-75 disabled:pointer-events-none mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Switch toggle link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  id="switch-to-signup-button"
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    openAuthModal("signup");
                  }}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  id="switch-to-login-button"
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    openAuthModal("login");
                  }}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  Sign in instead
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
