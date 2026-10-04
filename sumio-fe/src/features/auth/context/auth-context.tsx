import type { UserProfileDto } from "@sumio/contract";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

import { auth, googleProvider } from "@/lib/firebase";

export interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  profile: UserProfileDto | null;
  token: string | null;
  isLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (jwt: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = (await res.json()) as UserProfileDto;
        setProfile(data);
      }
    } catch {
      // Backend might be offline or still starting in dev, gracefully ignore
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    const jwt = await firebaseUser.getIdToken(true);
    setToken(jwt);
    await fetchProfile(jwt);
  }, [firebaseUser, fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const jwt = await user.getIdToken();
          setToken(jwt);
          await fetchProfile(jwt);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const jwt = await cred.user.getIdToken();
    setToken(jwt);
    await fetchProfile(jwt);
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const jwt = await cred.user.getIdToken(true);
    setToken(jwt);
    await fetchProfile(jwt);
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const jwt = await cred.user.getIdToken();
    setToken(jwt);
    await fetchProfile(jwt);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        token,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
