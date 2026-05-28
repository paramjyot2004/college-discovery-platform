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
    // Lightweight client-side session using localStorage
    function loadSession() {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setLoading(false);
        return;
      }
      try {
        const u = JSON.parse(raw) as User;
        setUser(u);
        const rawSaved = localStorage.getItem(`saved_${u.id}`);
        setSavedIds(rawSaved ? JSON.parse(rawSaved) : []);
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function loadSaved(token: string) {
    // kept for compatibility but not used in client-only mode
    return Promise.resolve();
  }

  async function refreshSaved() {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await loadSaved(token);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const rawUsers = localStorage.getItem("users") || "[]";
      const users = JSON.parse(rawUsers) as User[];
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) return { success: false, error: "Invalid credentials" };
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
      const rawSaved = localStorage.getItem(`saved_${found.id}`);
      setSavedIds(rawSaved ? JSON.parse(rawSaved) : []);
      setAuthModalMode(null);
      showToast({ tone: "success", title: "Signed in", message: "Welcome back." });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Failed to sign in");
      showToast({ tone: "error", title: "Login failed", message });
      return { success: false, error: message };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const rawUsers = localStorage.getItem("users") || "[]";
      const users = JSON.parse(rawUsers) as User[];
      if (users.find((u) => u.email === email)) return { success: false, error: "Email already in use" };
      const id = `u${Date.now()}`;
      const newUser: User = { id, email, password, createdAt: new Date().toISOString() } as any;
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setSavedIds([]);
      setAuthModalMode(null);
      showToast({ tone: "success", title: "Account created", message: "You can now save colleges." });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Failed to create account");
      showToast({ tone: "error", title: "Signup failed", message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setSavedIds([]);
    showToast({
      tone: "info",
      title: "Signed out",
      message: "Your account has been disconnected on this device.",
    });
  };

  const toggleSaved = async (collegeId: string) => {
    if (!user) {
      setAuthModalMode("login");
      return false;
    }
    try {
      const key = `saved_${user.id}`;
      const raw = localStorage.getItem(key) || "[]";
      const arr = new Set(JSON.parse(raw) as string[]);
      let saved = false;
      if (arr.has(collegeId)) {
        arr.delete(collegeId);
        saved = false;
      } else {
        arr.add(collegeId);
        saved = true;
      }
      const result = Array.from(arr);
      localStorage.setItem(key, JSON.stringify(result));
      setSavedIds(result);
      showToast({
        tone: saved ? "success" : "info",
        title: saved ? "Added to shortlist" : "Removed from shortlist",
        message: saved ? "The college is now saved for quick access." : "The college was removed from your shortlist.",
      });
      return saved;
    } catch (err) {
      console.error("Error toggling saved college:", err);
      showToast({ tone: "error", title: "Could not update shortlist", message: "Local storage error." });
      return false;
    }
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
