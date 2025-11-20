"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReguserStore } from "@/app/types/auth/register";

export const useRegisterStore = create<ReguserStore>()(
  persist(
    (set) => ({
      results: [],
      user: null,   
      token: null,     

      fetchRegusers: async () => {
        try {
          const res = await fetch("/api/auth/register");
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);

          const data = await res.json();
          set({ results: data.data });
        } catch (err) {
          console.error("❌ Fetch Error:", err);
        }
      },

      createReguser: async (payload: FormData) => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            body: payload,
          });

          const data = await res.json();
          if (!data.success) throw new Error(data.error);

          set((state) => ({
            results: [data.data, ...state.results],
          }));

          return { success: true, data: data.data };
        } catch (err) {
          console.error("❌ Create Error:", err);
          return { success: false };
        }
      },

      loginUsers: async (payload: FormData) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            body: payload,
          });

          const data = await res.json();
          console.log("LOGIN RESPONSE →", data);

          if (!data.success) {
            return { success: false };
          }

          set({
            user: data.data,
            token: data.token,
          });

          return { success: true, data: data.data };
        } catch {
          return { success: false };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),

    {
      name: "school", 
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
