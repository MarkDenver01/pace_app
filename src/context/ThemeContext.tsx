// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme =
  | "light"
  | "dark"
  | "red-velvet"
  | "violet-dream"
  | "wood-brown"
  |  "olive-green"
  | "ocean-pulse"
  | "burgundy"
  | "super_admin"
  | "custom_admin";

interface ThemeContextProps {
  themeName: Theme;
  setThemeName: (theme: Theme) => void;
}

const defaultTheme: Theme = "light";

const ALL_THEMES: Theme[] = [
  "light",
  "dark",
  "red-velvet",
  "violet-dream",
  "wood-brown",
  "olive-green",
  "ocean-pulse",
  "burgundy",
  "super_admin",
  "custom_admin",
];

function isTheme(value: string): value is Theme {
  return ALL_THEMES.includes(value as Theme);
}

const ThemeContext = createContext<ThemeContextProps>({
  themeName: defaultTheme,
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeNameState] = useState<Theme>(defaultTheme);

  const setThemeName = useCallback((newTheme: Theme) => {
    console.log("[ThemeContext] Setting theme:", newTheme);
    setThemeNameState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("themeName", newTheme);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeName");
    if (savedTheme && isTheme(savedTheme)) {
      setThemeName(savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
  }, [setThemeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
