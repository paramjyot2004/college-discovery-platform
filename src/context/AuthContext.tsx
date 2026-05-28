import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { useFeedback } from "../components/Feedback";
import { getErrorMessage } from "../utils/error";

interface AuthContextType {
  user: User | null;
  savedIds: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleSaved: (collegeId: string) => Promise<boolean>;
  refreshSaved: () => Promise<void>;
  openAuthModal: (mode: "login" | "signup") => void;
  closeAuthModal: () => void;
  authModalMode: "login" | "signup" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useFeedback();
  const [user, setUser] = useState<User | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | null>(null);

  // Read credentials on boot
  useEffect(() => {
    async function loadSession() {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // Load saved colleges immediately
          await loadSaved(token);
        } else {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
        showToast({
          tone: "error",
          title: "Session unavailable",
          message: "We couldn't restore your sign-in session. You can log in again.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function loadSaved(token: string) {
    try {
      const res = await fetch("/api/saved-colleges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedIds(data.savedIds || []);
      }
    } catch (err) {
      console.error("Failed to load saved colleges:", err);
    }
  }

  async function refreshSaved() {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await loadSaved(token);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      await loadSaved(data.token);
      setAuthModalMode(null);
      showToast({
        tone: "success",
        title: "Signed in",
        message: "Your shortlist and comparisons are ready.",
      });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Network or server connection issue");
      showToast({
        tone: "error",
        title: "Login failed",
        message,
      });
      return { success: false, error: message };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Signup failed" };
      }

      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      setSavedIds([]);
      setAuthModalMode(null);
      showToast({
        tone: "success",
        title: "Account created",
        message: "You can now save colleges and participate in discussions.",
      });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Network or server connection error");
      showToast({
        tone: "error",
        title: "Signup failed",
        message,
      });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setSavedIds([]);
    showToast({
      tone: "info",
      title: "Signed out",
      message: "Your account has been disconnected on this device.",
    });
  };

  const toggleSaved = async (collegeId: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuthModalMode("login");
      return false;
    }

    try {
      const res = await fetch("/api/saved-colleges/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedIds(data.savedIds);
        showToast({
          tone: data.saved ? "success" : "info",
          title: data.saved ? "Added to shortlist" : "Removed from shortlist",
          message: data.saved ? "The college is now saved for quick access." : "The college was removed from your shortlist.",
        });
        return data.saved;
      }
    } catch (err) {
      console.error("Error toggling saved college:", err);
      showToast({
        tone: "error",
        title: "Could not update shortlist",
        message: "Check your connection and try again.",
      });
    }
    return false;
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
  };

  const closeAuthModal = () => {
    setAuthModalMode(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedIds,
        loading,
        login,
        signup,
        logout,
        toggleSaved,
        refreshSaved,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
