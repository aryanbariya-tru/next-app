import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { DataItem, DataStore, DataActions } from "@/app/types/dataStore";
import { v4 as uuidv4 } from 'uuid';
import {
  saveData,
  addChange,
  getChanges,
  clearChanges,
  getDataWithChanges,
} from "@/app/lib/idb";

export const useDataStore = create<DataStore & DataActions>()(
  devtools(
    combine<DataStore, DataActions>(
      { data: [], cached: [], loading: false, changes: [] },
      (set, get) => ({
        fetchData: async () => {
          set({ loading: true });

          try {
            const res = await fetch("/api/school");
            const serverData: DataItem[] = await res.json();
            const merged = await getDataWithChanges(serverData);

            await saveData(merged);

            set({ data: merged, cached: merged, loading: false });
          } catch (err) {
            console.error("Offline: loading from IndexedDB", err);

            const cached = await getDataWithChanges();

            set({ data: cached, cached, loading: false });
          }
        },

        addData: async (item: Omit<DataItem, "_id">) => {
          const tempId = uuidv4();
          const newItem: DataItem = { _id: tempId, ...item };

          set((state) => ({
            data: [...state.data, newItem],
            cached: [...state.cached, newItem],
            changes: [...state.changes, { type: "add", item: newItem }],
          }));

          await addChange({ type: "add", item: newItem });

          const merged = await getDataWithChanges();
          await saveData(merged);

          if (navigator.onLine)
            (get() as DataActions & DataStore).syncWithServer();
        },

        updateData: async (id, item) => {
          set((state) => ({
            data: state.data.map((d) => (d._id === id ? { ...d, ...item } : d)),
            cached: state.cached.map((d) =>
              d._id === id ? { ...d, ...item } : d
            ),
            changes: [...state.changes, { type: "update", id, item }],
          }));

          await addChange({ type: "update", id, item });

          const merged = await getDataWithChanges();
          await saveData(merged);

          if (navigator.onLine)
            (get() as DataActions & DataStore).syncWithServer();
        },

        deleteData: async (id) => {
          set((state) => ({
            data: state.data.filter((d) => d._id !== id),
            cached: state.cached.filter((d) => d._id !== id),
            changes: [...state.changes, { type: "delete", id }],
          }));

          await addChange({ type: "delete", id });

          const merged = await getDataWithChanges();
          await saveData(merged);

          if (navigator.onLine)
            (get() as DataActions & DataStore).syncWithServer();
        },

        syncWithServer: async () => {
          const changes = await getChanges();

          for (const change of changes) {
            try {
              if (change.type === "add") {
                const { _id, ...payload } = change.item;

                const res = await fetch("/api/school", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                const json = await res.json();

                if (res.ok && json._id) {
                  set((state) => ({
                    data: state.data.map((d) =>
                      d._id === _id ? { ...d, _id: json._id } : d
                    ),
                    cached: state.cached.map((d) =>
                      d._id === _id ? { ...d, _id: json._id } : d
                    ),
                  }));
                }
              }

              if (change.type === "update") {
                await fetch(`/api/school/${change.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(change.item),
                });
              }

              if (change.type === "delete") {
                await fetch(`/api/school/${change.id}`, {
                  method: "DELETE",
                });
              }
            } catch (err) {
              console.error("Sync failed:", change, err);
            }
          }

          await clearChanges();
          set({ changes: [] });

          const res = await fetch("/api/school");
          const latest = await res.json();

          await saveData(latest);

          set({ data: latest, cached: latest });
        },
      })
    ),
    { name: "school-store", enabled: true }
  )
);
