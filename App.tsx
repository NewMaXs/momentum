import SplashScreen from "@/components/SplashScreen";
import { ThemeContext, ThemeContextValue } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import BottomNavigator from "@/navigation/BottomNavigator";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Animated, Easing } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// ==================== 常量配置 ====================

/** 动画配置常量 */
const ANIMATION_CONFIG = {
  /** Logo 缩放动画持续时间（毫秒） */
  SCALE_DURATION: 500,
  /** Splash 停留时间（毫秒） */
  DELAY_DURATION: 800,
  /** 淡出动画持续时间（毫秒） */
  FADE_DURATION: 600,
  /** 初始缩放值 */
  INITIAL_SCALE: 0.9,
  /** 最终缩放值 */
  FINAL_SCALE: 1,
  /** 初始透明度 */
  INITIAL_OPACITY: 1,
  /** 最终透明度 */
  FINAL_OPACITY: 0,
} as const;

// ==================== 主组件 ====================

/**
 * 应用根组件
 *
 * 负责：
 * - 主题管理
 * - 启动动画
 * - 全局状态提供
 */
export default function App() {
  const { themeMode, setThemeMode, paperTheme, isDark, isReady } =
    useAppTheme();

  // 动画状态
  const fadeAnim = React.useRef(
    new Animated.Value(ANIMATION_CONFIG.INITIAL_OPACITY),
  ).current;
  const scaleAnim = React.useRef(
    new Animated.Value(ANIMATION_CONFIG.INITIAL_SCALE),
  ).current;

  const [showSplash, setShowSplash] = React.useState(true);

  // 控制 Splash 动画
  React.useEffect(() => {
    if (!isReady) return;

    // Logo 缩放 -> 停留 -> 淡出
    const animation = Animated.sequence([
      // 1. Logo 缩放动画
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_CONFIG.FINAL_SCALE,
        duration: ANIMATION_CONFIG.SCALE_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // 2. 停留一段时间
      Animated.delay(ANIMATION_CONFIG.DELAY_DURATION),
      // 3. 淡出动画
      Animated.timing(fadeAnim, {
        toValue: ANIMATION_CONFIG.FINAL_OPACITY,
        duration: ANIMATION_CONFIG.FADE_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      setShowSplash(false);
    });

    // 清理函数
    return () => {
      animation.stop();
    };
  }, [isReady, fadeAnim, scaleAnim]);

  // 优化 ThemeContext value，避免不必要的重渲染
  const themeContextValue = React.useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      setThemeMode,
    }),
    [themeMode, setThemeMode],
  );

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <ThemeContext.Provider value={themeContextValue}>
          <BottomNavigator />
        </ThemeContext.Provider>

        <SplashScreen
          visible={showSplash}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          theme={paperTheme}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
