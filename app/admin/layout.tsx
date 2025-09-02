"use client"

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Only redirect if loading is finished and user is definitely not logged in
      if (user === null) {
        router.replace("/login");
      } else if (!isAdmin && user) {
        router.replace("/");
      }
    }
  }, [user, isAdmin, loading, router]);

  // Show loading spinner while loading or if user is undefined (not yet hydrated)
  if (loading || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Checking admin access...</div>
      </div>
    );
  }

  // Defensive: if user is null or not admin, render nothing (should be redirected already)
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
