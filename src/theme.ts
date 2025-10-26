import { createTheme, type Theme } from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D94022" },
    background: { default: "#f9fafb" },
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#D94022" },
  },
});

export const redishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D32F2F" }, // Redish
    background: { default: "#fff5f5" },
  },
});

export const purplelishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7E57C2" }, // Purple
    background: { default: "#f7f3fc" },
  },
});

export const greenishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00703c9f" }, // Brown
    background: { default: "#fefaf5" },
  },
});

export const blueishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#003DA59F" }, // Brown
    background: { default: "#fefaf5" },
  },
});

export const maroonishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D500329F" }, // Brown
    background: { default: "#fefaf5" },
  },
});

export const brownishTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#8D6E63" }, // Brown
    background: { default: "#fefaf5" },
  },
});

export function getThemeByName(name: string): Theme {
  switch (name) {
    case "dark":
      return darkTheme;
    case "redish":
      return redishTheme;
    case "purplelish":
      return purplelishTheme;
    case "brownish":
      return brownishTheme;
      case "greenish":
        return greenishTheme;
      case "blueish":
        return blueishTheme;
      case "maroonish":
        return maroonishTheme;
    case "light":
    default:
      return lightTheme;
  }
}
