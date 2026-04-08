"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks";
import { useAuthStore } from "@/store/useAuthStore";
import { getAccessToken } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, checkAuth } = useAuthStore();
  const token = getAccessToken();
  
  // Fetch user profile if token exists
  const { data: profile, isError } = useUserProfile();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (profile) {
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar_url || "/avatar.jpg",
        phone: profile.phone || "",
        joinDate: profile.join_date,
      });
    } else if (isError || !token) {
      setUser(null);
    }
  }, [profile, isError, token, setUser]);

  return <>{children}</>;
}
