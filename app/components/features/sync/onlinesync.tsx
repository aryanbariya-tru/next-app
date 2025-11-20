"use client";

import { useEffect } from "react";
import { useDataStore } from "@/app/store/Datastore";

export default function OnlineSync() {
  useEffect(() => {
    const sync = () => {
      useDataStore.getState().syncWithServer();
    };

    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, []);

  return null;
}
