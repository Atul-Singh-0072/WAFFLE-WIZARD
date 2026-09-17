"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getServerTheme, getTheme, setTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

/**
 * Dark/light switch. Shows the theme it will switch *to*, so the icon reads as
 * an action rather than a status.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const next = theme === "light" ? "dark" : "light";
  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "theme-toggle relative flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-text transition-colors hover:border-secondary/60 hover:text-secondary",
        className,
      )}
    >
      <Sun className="theme-toggle__icon theme-toggle__sun size-5" aria-hidden />
      <Moon className="theme-toggle__icon theme-toggle__moon size-5" aria-hidden />
    </button>
  );
}
