import { onAuthStateChanged, reload, type User } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fireAuth } from "@/lib/firebase";
import { registerProfile } from "@/services/profile";
import type { SekaiUser } from "@/types/user";

interface AuthContextValue {
  user: SekaiUser | null;
  /** False until Firebase has restored the saved session or found none. */
  initialized: boolean;
  /** Firebase emits no auth change after `updateProfile` or a verification done elsewhere. */
  refreshUser: () => Promise<SekaiUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toSekaiUser(user: User): SekaiUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    providers: user.providerData.map((provider) => provider.providerId),
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SekaiUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(fireAuth, (firebaseUser) => {
        setUser(firebaseUser ? toSekaiUser(firebaseUser) : null);
        setInitialized(true);
        if (firebaseUser) {
          registerProfile(firebaseUser).catch((error) =>
            console.warn("Couldn't register profile:", error),
          );
        }
      }),
    [],
  );

  const refreshUser = useCallback(async () => {
    const current = fireAuth.currentUser;
    if (!current) return null;

    await reload(current);
    const refreshed = toSekaiUser(current);
    setUser(refreshed);
    return refreshed;
  }, []);

  const value = useMemo(
    () => ({ user, initialized, refreshUser }),
    [user, initialized, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
