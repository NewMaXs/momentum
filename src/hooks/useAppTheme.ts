import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

export type ThemeMode = "system" | "light" | "dark";

interface UseAppThemeReturn {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  paperTheme: MD3Theme;
  isDark: boolean;
  isReady: boolean;
}

const THEME_MODE_KEY = "themeMode";

export function useAppTheme(): UseAppThemeReturn {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = React.useState<ThemeMode>("system");
  const [isReady, setIsReady] = React.useState(false);

  // 初始化：从 AsyncStorage 读取设置
  React.useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const storedThemeMode = await AsyncStorage.getItem(THEME_MODE_KEY);

        if (!mounted) return;

        // 恢复主题模式
        if (
          storedThemeMode === "system" ||
          storedThemeMode === "light" ||
          storedThemeMode === "dark"
        ) {
          setThemeModeState(storedThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // 保存主题模式
  const setThemeMode = React.useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
    }
  }, []);

  // 计算当前是否为暗色模式
  const isDark = React.useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "light") return false;
    return systemScheme === "dark";
  }, [themeMode, systemScheme]);

  // 生成最终的 Paper Theme
  const paperTheme = React.useMemo(() => {
    return isDark ? MD3DarkTheme : MD3LightTheme;
  }, [isDark]);

  return {
    themeMode,
    setThemeMode,
    paperTheme,
    isDark,
    isReady,
  };
}
