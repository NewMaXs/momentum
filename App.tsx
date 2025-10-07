import { ThemeContext } from "@/context/ThemeContext";
import BottomNavigator from "@/navigation/BottomNavigator";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import {
  ActivityIndicator,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

type ThemeMode = "system" | "light" | "dark";

export default function App() {
  const { theme } = useMaterial3Theme();
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = React.useState<ThemeMode>("system");
  const [isReady, setIsReady] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current; // Splash 透明度
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current; // 图标缩放

  // 读取存储的主题模式
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("themeMode");
        if (
          mounted &&
          (stored === "system" || stored === "light" || stored === "dark")
        ) {
          setThemeModeState(stored);
        }
      } catch (e) {
        console.error("读取 themeMode 失败:", e);
      } finally {
        if (mounted) setIsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 存储主题模式
  const setThemeMode = React.useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem("themeMode", mode);
    } catch (e) {
      console.error("保存 themeMode 失败:", e);
    }
  }, []);

  // 判断是否暗色模式
  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : systemScheme === "dark";

  // 合并主题
  const paperTheme = React.useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    const overrideColors = isDark ? theme?.dark : theme?.light;
    return {
      ...base,
      colors: {
        ...base.colors,
        ...(overrideColors ?? {}),
      },
    };
  }, [isDark, theme]);

  // 控制 Splash 动画
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    if (isReady) {
      // 开始 logo 缩放动画
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(800), // 停留 0.8s 让用户看清
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setShowSplash(false));
    }
  }, [isReady]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
        <BottomNavigator themeMode={themeMode} onThemeChange={setThemeMode} />
      </ThemeContext.Provider>

      {showSplash && (
        <Animated.View
          style={[
            styles.splashContainer,
            {
              backgroundColor: paperTheme.colors.background,
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={{ alignItems: "center", transform: [{ scale: scaleAnim }] }}
          >
            <Image
              source={require("@/assets/icon/origin/momentum-256.png")}
              style={[styles.icon, { tintColor: paperTheme.colors.primary }]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.appName,
                { color: paperTheme.colors.onBackground },
              ]}
            >
              Momentum
            </Text>
          </Animated.View>
          <ActivityIndicator
            animating
            size="small"
            color={paperTheme.colors.primary}
            style={{ marginTop: 24 }}
          />
        </Animated.View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
