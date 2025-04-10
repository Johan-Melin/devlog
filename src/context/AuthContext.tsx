"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmail, 
  createUserWithEmail, 
  signOut 
} from "@/lib/firebase/auth";
import { User as FirebaseUser } from "firebase/auth";

// Enhanced auth context type
type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password);
      if (!result) {
        setError("Failed to sign in");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during sign in");
      } else {
        setError("An unknown error occurred during sign in");
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmail(email, password);
      if (!result) {
        setError("Failed to create account");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during sign in");
      } else {
        setError("An unknown error occurred during sign in");
      }
    }
  };

  const logOut = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during sign in");
      } else {
        setError("An unknown error occurred during sign in");
      }
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logOut,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}