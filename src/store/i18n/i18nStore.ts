import { create } from "zustand";
import { persist } from "zustand/middleware";

interface I18nState {
  language: "fr" | "en";
  setLanguage: (lang: "fr" | "en") => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "fr",
      setLanguage: (lang: "fr" | "en") => set({ language: lang }),
    }),
    {
      name: "i18n-storage",
    }
  )
);
