// src/types/breed.ts
export type Breed = {
  id: string;
  type: "breed";
  attributes: {
    name: string;
    description?: string;
    life:{
        max:number;
        min:number;
    }
  };
  relationships: {
    group: {
      data: { id: string; type: string };
    };
  };
};

export type Pagination = {
  current: number;
  next: number | null;
  last: number;
  records: number;
};

export type BreedsResponse = {
  data: Breed[];
  meta: {
    pagination: Pagination;
  };
};


// src/store/useBreedStore.ts
import { create } from "zustand";

type BreedStore = {
  breeds: Breed[];
  pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  fetchBreeds: (page?: number) => Promise<void>;
};

export const useBreedStore = create<BreedStore>((set) => ({
  breeds: [],
  pagination: null,
  status: "idle",
  error: null,

  fetchBreeds: async () => {
    set({ status: "loading", error: null });

    try {
      const res = await fetch(`https://dogapi.dog/api/v2/breeds?page%5Bnumber%5D=1&page%5Bsize%5D=20`);
      if (!res.ok) throw new Error(`Failed to fetch breeds: ${res.status}`);

      const data: BreedsResponse = await res.json();

      set({
        breeds: data.data,
        pagination: data.meta.pagination,
        status: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ status: "error", error: message });
    }
  },
}));
