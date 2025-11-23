import { STORAGE_KEYS } from "@/constants/app";
import { createLogger } from "@/utils/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

const logger = createLogger("useAppTheme");

export type ThemeMode = "system" | "light" | "dark";

interface UseAppThemeReturn {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  paperTheme: MD3Theme;
  isDark: boolean;
  isReady: boolean;
}

const VALID_THEME_MODES: readonly ThemeMode[] = ["system", "light", "dark"];

/**
 * 类型守卫：检查给定的值是否为有效的 ThemeMode
 */
function isValidThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === "string" && VALID_THEME_MODES.includes(value as ThemeMode)
  );
}

/**
 * 自定义 Hook：管理应用主题
 *
 * @returns {UseAppThemeReturn} 主题相关的状态和方法
 */
export function useAppTheme(): UseAppThemeReturn {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = React.useState<ThemeMode>("system");
  const [isReady, setIsReady] = React.useState(false);

  // 初始化：从 AsyncStorage 读取设置
  React.useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        logger.debug("Loading theme settings from storage");
        const storedThemeMode = await AsyncStorage.getItem(
          STORAGE_KEYS.THEME_MODE,
        );

        if (!mounted) return;

        // 恢复主题模式
        if (isValidThemeMode(storedThemeMode)) {
          logger.info(`Loaded theme mode: ${storedThemeMode}`);
          setThemeModeState(storedThemeMode);
        } else {
          logger.debug("No valid theme mode found, using default");
        }
      } catch (error) {
        logger.error("Failed to load theme settings", error);
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
      logger.debug(`Setting theme mode to: ${mode}`);
      setThemeModeState(mode);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      logger.info(`Theme mode saved: ${mode}`);
    } catch (error) {
      logger.error("Failed to save theme mode", error);
      // 如果保存失败，回滚状态
      try {
        const currentMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (isValidThemeMode(currentMode)) {
          logger.warn(`Rolling back to previous theme mode: ${currentMode}`);
          setThemeModeState(currentMode);
        }
      } catch (rollbackError) {
        logger.error("Failed to rollback theme mode", rollbackError);
      }
    }
  }, []);

  // 计算当前是否为暗色模式
  const isDark = React.useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "light") return false;
    return systemScheme === "dark";
  }, [themeMode, systemScheme]);

  // 生成最终的 Paper Theme
  const paperTheme = React.useMemo<MD3Theme>(
    () => (isDark ? MD3DarkTheme : MD3LightTheme),
    [isDark],
  );

  return {
    themeMode,
    setThemeMode,
    paperTheme,
    isDark,
    isReady,
  };
}
