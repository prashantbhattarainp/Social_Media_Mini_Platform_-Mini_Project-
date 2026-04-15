import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "mini-social-theme";
const DEFAULT_THEME = "light";

const UIContext = createContext(null);

const hasWindow = typeof window !== "undefined";

const safeGetStorageValue = (key) => {
  if (!hasWindow) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorageValue = (key, value) => {
  if (!hasWindow) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write errors (private mode or storage restrictions).
  }
};

const getInitialTheme = () => {
  const stored = safeGetStorageValue(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  if (!hasWindow || typeof window.matchMedia !== "function") {
    return DEFAULT_THEME;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME;
};

const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (!hasWindow) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    safeSetStorageValue(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      isDarkMode: theme === "dark",
      toggleTheme,
    }),
    [theme]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

const useUI = () => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used inside UIProvider");
  }

  return context;
};

export { UIProvider, useUI };
