import { createContext, useContext, useState, useEffect } from "react";

// Define theme types
export type Theme = "light" | "dark" | "redish" | "purplelish" | "brownish";

// Context shape
interface ThemeContextProps {
  themeName: Theme;
  setThemeName: (theme: Theme) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextProps>({
  themeName: "light",
  setThemeName: () => {},
});

// Provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeNameState] = useState<Theme>("light");

  // Sync theme state with HTML attribute and localStorage
  const setThemeName = (newTheme: Theme) => {
    setThemeNameState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("themeName", newTheme);
  };

  // On mount: load from localStorage and apply
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeName") as Theme | null;
    if (savedTheme) {
      setThemeName(savedTheme);
    } else {
      // fallback to light
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useThemeContext = () => useContext(ThemeContext);
