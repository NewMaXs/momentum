import React from "react";

/**
 * 主题模式类型
 * - system: 跟随系统设置
 * - light: 浅色模式
 * - dark: 深色模式
 */
export type ThemeMode = "system" | "light" | "dark";

/**
 * 主题上下文值接口
 */
export interface ThemeContextValue {
  /** 当前主题模式 */
  themeMode: ThemeMode;
  /** 设置主题模式 */
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

/**
 * 主题上下文
 *
 * 用于在应用中共享主题模式状态
 */
export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

if (__DEV__) {
  ThemeContext.displayName = "ThemeContext";
}

/**
 * 使用主题上下文的 Hook
 *
 * @throws {Error} 如果在 ThemeContext.Provider 外部调用
 * @returns {ThemeContextValue} 主题上下文值
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { themeMode, setThemeMode } = useThemeContext();
 *
 *   return (
 *     <Button onPress={() => setThemeMode('dark')}>
 *       当前模式: {themeMode}
 *     </Button>
 *   );
 * }
 * ```
 */
export const useThemeContext = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeContext.Provider. " +
        "Wrap your app with <ThemeContext.Provider> or ensure the component " +
        "is rendered within the provider tree.",
    );
  }

  return context;
};
