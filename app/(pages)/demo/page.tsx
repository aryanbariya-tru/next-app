"use client";

import { useThemeStore } from "@/app/store/ThemeStore";

export default function Page() {
  const theme = useThemeStore((s) => s.theme);
  const token = useThemeStore((s) => s.token);

  const toggle = useThemeStore((s) => s.toggle);
  const setToken = useThemeStore((s) => s.setToken);

  return (
    <div className="p-6 space-y-4">
      <p>Theme: {theme}</p>
      <button onClick={toggle}>Toggle</button>

      <p>Token: {token}</p>
      <button onClick={() => setToken("xyz-123")}>
        Save Token
      </button>
    </div>
  );
}
