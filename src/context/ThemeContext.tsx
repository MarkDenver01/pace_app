import { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark" | "redish" | "purplelish" | "brownish";

interface ThemeContextType {
  themeName: Theme;
  setThemeName: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeName: "light",
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
    document.documentElement.style.setProperty("--button-color", getThemeColor(themeName));
  }, [themeName]);

  const getThemeColor = (theme: Theme) => {
    switch (theme) {
      case "dark":
        return "#111827";
      case "redish":
        return "#DC2626";
      case "purplelish":
        return "#7C3AED";
      case "brownish":
        return "#92400E";
      default:
        return "#2563EB"; // light default (blue)
    }
  };

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
