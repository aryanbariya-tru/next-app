"use client";


import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

type ThemeState = {
  theme: "light" | "dark";
  token: string;
}

type ThemeActions = {
    toggle: () => void;
  setToken: (token: string) => void;
}

export const useThemeStore = create(
  persist(
    combine<ThemeState, ThemeActions>(
      {
        theme: "light" as "light" | "dark",
        token: "",
      },
      (set) => ({
        toggle: () =>
          set((s) => ({
            theme: s.theme === "light" ? "dark" : "light",
          })),

        setToken: (token: string) =>
          set(() => ({
            token,
          })),
      })
    ),
    {
      name: "theme-store", // localStorage key
      partialize:(state) => ({ token: state.token })
    }
  ) 
);
