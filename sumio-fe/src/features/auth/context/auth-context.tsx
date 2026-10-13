import type { UserProfileDto } from "@sumio/contract";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiClient } from "@/lib/api-client";
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

function useAuthSession() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (jwt: string) => {
    try {
      const res = await apiClient.auth.getMe({
        headers: { authorization: `Bearer ${jwt}` },
      });
      if (res.status === 200) {
        setProfile(res.body);
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

  return {
    firebaseUser,
    setFirebaseUser,
    profile,
    setProfile,
    token,
    setToken,
    isLoading,
    fetchProfile,
    refreshProfile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    firebaseUser,
    setFirebaseUser,
    profile,
    setProfile,
    token,
    setToken,
    isLoading,
    fetchProfile,
    refreshProfile,
  } = useAuthSession();

  const signInWithEmail = useCallback(
    async (email: string, pass: string) => {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const jwt = await cred.user.getIdToken();
      setToken(jwt);
      await fetchProfile(jwt);
    },
    [fetchProfile, setToken],
  );

  const signUpWithEmail = useCallback(
    async (email: string, pass: string, displayName?: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      const jwt = await cred.user.getIdToken(true);
      setToken(jwt);
      await fetchProfile(jwt);
    },
    [fetchProfile, setToken],
  );

  const signInWithGoogle = useCallback(async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const jwt = await cred.user.getIdToken();
    setToken(jwt);
    await fetchProfile(jwt);
  }, [fetchProfile, setToken]);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setToken(null);
    setProfile(null);
  }, [setFirebaseUser, setProfile, setToken]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
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
    }),
    [
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
    ],
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}

export function useAuth(): AuthContextType {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
