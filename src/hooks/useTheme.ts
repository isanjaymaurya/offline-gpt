import { useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeStorage] = useLocalStorage<Theme>("theme", "system");

  const applyTheme = useCallback((t: Theme) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (t === "system") {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", t === "dark");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);

    if (typeof window === "undefined") return;
    const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // only react when using system theme
      if (theme === "system") applyTheme("system");
    };
    try {
      mq?.addEventListener?.("change", handler);
    } catch {
      // fallback for older browsers
      try {
        // @ts-ignore
        mq?.addListener?.(handler);
      } catch {}
    }
    return () => {
      try {
        mq?.removeEventListener?.("change", handler);
      } catch {
        try {
          // @ts-ignore
          mq?.removeListener?.(handler);
        } catch {}
      }
    };
  }, [theme, applyTheme]);

  const setTheme = useCallback((t: Theme) => setThemeStorage(t), [setThemeStorage]);

  const toggle = useCallback(() => {
    setThemeStorage((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setThemeStorage]);

  const isDark = useMemo(() => {
    if (typeof window === "undefined") return theme === "dark";
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [theme]);

  return {
    theme,
    setTheme,
    toggle,
    isDark,
  } as const;
}