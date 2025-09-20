"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{ background: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "1px solid #ccc" }}
    >
      <SunIcon className="w-4 h-4" />
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
}