import React from "react";

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  themeMode: "system",
  setThemeMode: () => {},
});

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within ThemeContext.Provider",
    );
  }
  return context;
};
