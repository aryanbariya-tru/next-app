"use client";
import React, { useEffect, useState } from "react";
import { useRickstore } from "@/app/store/rickmorty";
import { useDebounce } from "@/app/hooks/useDebounce";
import Image from "next/image";


const { fetchRick, fetchONE, fetchSearch } = useRickstore.getState();

export default function RickList() {
  const { results, pagination } = useRickstore();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchRick();
  }, []);

  useEffect(() => {
    if (debounceSearch.trim().length > 0) {
      fetchSearch(debounceSearch);
    } else {
      fetchRick();
    }
  }, [debounceSearch]);

  const openCharacter = (id: number) => {
    fetchONE(id);
  };

  return (
    <div className="p-16">
      <h2 className="text-2xl font-bold mb-4">Rick and Morty API</h2>

      {/* Search Box */}
      <div className="mb-6">
        <div>
          <label className="text-2xl ">Search by name :-</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none border px-2 py-1 mx-4 rounded"
          />
        </div>
        {/* <div>
          <select name="" id="">
            <option value=""></option>
          </select>
        </div> */}
      </div>

      {/* Pagination - hide during search */}
      {pagination && (
        <div className="flex justify-between m-6 items-center">
          <button
            disabled={pagination.current <= 1}
            onClick={() => fetchRick(pagination.current - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.current} of {pagination.last}
          </span>
          <button
            disabled={!pagination.next}
            onClick={() => fetchRick(pagination.next!)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* RESULTS */}
      <div className="grid grid-cols-2 gap-4 overflow-hidden">
        {results.map((rk) => (
          <div
            key={rk.id}
            className="border rounded-lg bg-gray-50 flex flex-row"
          >
            <Image
              src={rk.image}
              alt={rk.name}
              width={300}
              height={300}
              priority
            />
            <div className="flex flex-col text-3xl p-2">
              <span
                onClick={() => openCharacter(rk.id)}
                className="hover:text-orange-500 cursor-pointer"
              >
                Name: {rk.name}
              </span>
              <span>Status: {rk.status}</span>
              <span>Species: {rk.species}</span>
              <span>Type: {rk.type || "Unknown"}</span>
              <span className="text-gray-500">Gender: {rk.gender}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
