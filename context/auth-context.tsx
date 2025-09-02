"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { onAuthStateChanged as firebaseOnAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "../firebase.js"
import { setCookie, deleteCookie } from "cookies-next"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  logout: () => Promise<void>
  updateUserContext: (updatedUser: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use undefined as initial state to distinguish loading from "not logged in"
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  // Set your admin email(s) here:
  const ADMIN_EMAILS = ["samadali1580@gmail.com", "rakeshgupta1361411@gmail.com","aditaenterpriseindia@gmail.com"];

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (authUser: FirebaseUser | null) => {
      if (authUser) {
        // Check both admin email and Firebase custom claim
        const tokenResult = await authUser.getIdTokenResult();
        const isAdmin = ADMIN_EMAILS.includes(authUser.email || "") || tokenResult.claims.admin === true;
        setUser({
          uid: authUser.uid,
          email: authUser.email || "",
          displayName: authUser.displayName || "User",
          photoURL: authUser.photoURL || undefined,
          isAdmin,
        });
        setCookie("token", tokenResult.token, { path: "/", sameSite: "lax" });
      } else {
        setUser(null);
        deleteCookie("token", { path: "/" });
      }
      setLoading(false);
    });

    return () => unsubscribe()
  }, [])

  const updateUserContext = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      // Remove the token cookie
      deleteCookie("token", { path: "/" })
      // Force a page refresh after logout to clear any state
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAdmin: user?.isAdmin || false,
        loading,
        logout,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
