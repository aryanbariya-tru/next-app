"use client";

import React, { useEffect, useState } from "react";
import { useDataStore } from "@/app/store/Datastore";
import { DataItem } from "@/app/types/dataStore";

export default function DataPage() {
  const { data, fetchData, addData, updateData, deleteData, loading } =
    useDataStore();
  const [form, setForm] = useState({ name: "", height: "", weight: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateData(editingId, form);
      setEditingId(null);
    } else {
      await addData(form);
    }
    setForm({ name: "", height: "", weight: "" });
  };

  const handleEdit = (item: DataItem) => {
    setForm({ name: item.name, height: item.height ?? "", weight: item.weight ?? ""});
    setEditingId(item._id );
  };

  return (
    <>
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Manage Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Height"
          value={form.height}
          onChange={(e) => setForm({ ...form, height: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Weight"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {editingId ? "Update Data" : "Add Data"}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li
              key={item._id}
              className="border p-3 rounded flex justify-between"
            >
              <div>
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>Height: {item.height}</p>
                <p>Weight: {item.weight}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {console.log(item._id);
                    deleteData(item._id)
                  }}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
