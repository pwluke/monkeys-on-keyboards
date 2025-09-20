"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{ background: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "1px solid #ccc" }}
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}