"use client";
import React, { useEffect } from "react";
import { useBreedStore } from "@/app/store/dogImage";

export default function BreedList() {
  const { breeds, pagination, status, error, fetchBreeds } = useBreedStore();

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  if (status === "loading") return <p>Loading breeds...</p>;
  if (status === "error") return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🐕 Dog Breeds</h2>

      <ul className="space-y-2">
        {breeds.map((breed) => (
          <li
            key={breed.id}
            className="p-3 border rounded-lg bg-gray-50 flex flex-col"
          >
            <span>Name-{breed.attributes.name}</span>
            <span>Description{breed.attributes.description}</span>
            <span>Max-Life{breed.attributes.life.max}</span>
            <span>Min-Life{breed.attributes.life.min}</span>
            <span className="text-gray-500">
              Group ID: {breed.relationships.group.data.id}
            </span>
          </li>
        ))}
      </ul>

      {pagination && (
        <div className="flex justify-between mt-4">
          <button
            disabled={pagination.current <= 1}
            onClick={() => fetchBreeds(pagination.current - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.current} of {pagination.last}
          </span>
          <button
            disabled={!pagination.next}
            onClick={() => fetchBreeds(pagination.next!)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
