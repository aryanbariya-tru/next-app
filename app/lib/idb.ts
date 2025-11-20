import { openDB } from "idb";
import { DataItem, ChangeAction } from "@/app/types/dataStore";

const DB_NAME = "school-db";
const STORE_DATA = "data";
const STORE_CHANGES = "changes";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_DATA)) {
        db.createObjectStore(STORE_DATA, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(STORE_CHANGES)) {
        db.createObjectStore(STORE_CHANGES, { autoIncrement: true });
      }
    },
  });
}

export async function saveData(items: DataItem[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_DATA, "readwrite");

  await tx.objectStore(STORE_DATA).clear();

  for (const item of items) {
    await tx.objectStore(STORE_DATA).put(item);
  }

  await tx.done;
}

export async function getData(): Promise<DataItem[]> {
  const db = await getDB();
  return db.transaction(STORE_DATA).objectStore(STORE_DATA).getAll();
}

export async function getDataWithChanges(
  baseData?: DataItem[]
): Promise<DataItem[]> {
  const db = await getDB();

  const data: DataItem[] =
    baseData ||
    (await db.transaction(STORE_DATA).objectStore(STORE_DATA).getAll());

  const changes: ChangeAction[] = await db
    .transaction(STORE_CHANGES)
    .objectStore(STORE_CHANGES)
    .getAll();

  const merged = [...data];

  for (const change of changes) {
    if (change.type === "add") {
      merged.push(change.item);
    }

    if (change.type === "update") {
      const index = merged.findIndex((d) => d._id === change.id);
      if (index !== -1) merged[index] = { ...merged[index], ...change.item };
    }

    if (change.type === "delete") {
      const index = merged.findIndex((d) => d._id === change.id);
      if (index !== -1) merged.splice(index, 1);
    }
  }

  return merged;
}

export async function addChange(action: ChangeAction) {
  const db = await getDB();
  await db
    .transaction(STORE_CHANGES, "readwrite")
    .objectStore(STORE_CHANGES)
    .add(action);
}

export async function getChanges() {
  const db = await getDB();
  return db.transaction(STORE_CHANGES).objectStore(STORE_CHANGES).getAll();
}

export async function clearChanges() {
  const db = await getDB();
  await db
    .transaction(STORE_CHANGES, "readwrite")
    .objectStore(STORE_CHANGES)
    .clear();
}
