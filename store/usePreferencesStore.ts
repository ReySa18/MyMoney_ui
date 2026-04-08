import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode } from "@/lib/currency";

interface PreferencesState {
  currency: CurrencyCode;
  language: "id" | "en";
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (language: "id" | "en") => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: "IDR",
      language: "id",
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "mymoney-preferences",
    }
  )
);
