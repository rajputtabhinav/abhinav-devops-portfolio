"use client";

import { useCallback, useSyncExternalStore } from "react";

export const PORTFOLIO_THEME_KEY = "portfolio-theme";

export type ThemeMode = "light" | "dark";

function readThemeAttr(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribeThemeAttr(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const el = document.documentElement;
  const observer = new MutationObserver(() => onChange());
  observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

  const onStorage = (e: StorageEvent) => {
    if (e.key === PORTFOLIO_THEME_KEY || e.key === null) {
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribeThemeAttr, readThemeAttr, getServerThemeSnapshot);

  const applyTheme = useCallback((next: ThemeMode) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(PORTFOLIO_THEME_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    applyTheme(mode === "dark" ? "light" : "dark");
  };

  const isDark = mode === "dark";

  return (
    <div className="theme-toggle-slot">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        className="theme-simple-toggle"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
      >
        <span className="theme-simple-toggle__thumb" aria-hidden="true">
          <i className={`bi ${isDark ? "bi-moon-fill" : "bi-sun-fill"} theme-simple-toggle__icon`} aria-hidden />
        </span>
      </button>
    </div>
  );
}
