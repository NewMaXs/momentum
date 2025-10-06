import React from "react";

export type ThemeMode = "system" | "light" | "dark";

export const ThemeContext = React.createContext<{
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}>({
  themeMode: "system",
  setThemeMode: () => {},
});
