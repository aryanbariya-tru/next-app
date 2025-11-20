import { create } from "zustand";
import { RickStore } from "@/app/types/rickStore";

export const useRickstore = create<RickStore>((set) => ({
  results: [],
  pagination: null,

  fetchRick: async (page = 1) => {
    try {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      if (!res.ok) throw new Error(`Failed to fetch characters: ${res.status}`);

      const data = await res.json();
      set({
        results: data.results,
        pagination: {
          current: page,
          next: data.info.next ? page + 1 : null,
          last: data.info.pages,
          records: data.info.count,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Fetch Error:", message);
    }
  },

  fetchONE: async (id: number) => {
    try {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );
      if (!res.ok) throw new Error(`Failed to fetch character: ${res.status}`);

      const data = await res.json();
      set({ results: [data] });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Fetch Error:", message);
    }
  },
  fetchSearch: async (name: string) => {
    try {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${name}`
      );
      if (!res.ok) throw new Error(`Failed to fetch character: ${res.status}`);
      const data = await res.json();
      set({
        results: data.results ?? [],
        pagination: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Fetch Error:", message);
    }
  },
    fetchSpecies: async (name: string) => {
    try {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${name}`
      );
      if (!res.ok) throw new Error(`Failed to fetch character: ${res.status}`);
      const data = await res.json();
      set({
        results: data.results ?? [],
        pagination: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Fetch Error:", message);
    }
  },
}));
