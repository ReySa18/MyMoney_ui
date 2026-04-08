import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";
import { getAccessToken } from "@/lib/api";
import { clearTokens } from "@/lib/api";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  checkAuth: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      checkAuth: () => {
        const token = getAccessToken();
        if (!token) {
          set({ user: null, isAuthenticated: false });
        }
      },
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "mymoney-auth",
    }
  )
);
