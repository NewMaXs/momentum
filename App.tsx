import { ThemeContext } from "@/contexts/ThemeContext";
import AnalyticsScreen from "@/tabs/analytics";
import FocusScreen from "@/tabs/focus";
import Dashboard from "@/tabs/index";
import PatternsScreen from "@/tabs/patterns";
import SettingsScreen from "@/tabs/settings";
import { Ionicons } from "@expo/vector-icons";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "react-native";
import {
  BottomNavigation,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

const routeTitles: Record<string, string> = {
  index: "仪表盘",
  focus: "专注",
  patterns: "定式树",
  analytics: "分析",
  settings: "设置",
};

const DashboardRoute = () => <Dashboard />;
const FocusRoute = () => <FocusScreen />;
const PatternsRoute = () => <PatternsScreen />;
const AnalyticsRoute = () => <AnalyticsScreen />;
const SettingsRoute = () => <SettingsScreen />;

export default function App() {
  const { theme } = useMaterial3Theme();
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = React.useState<
    "system" | "light" | "dark"
  >("system");
  const [isReady, setIsReady] = React.useState(false);

  // ---------- 持久化 ----------
  React.useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("themeMode");
        if (stored === "system" || stored === "light" || stored === "dark") {
          setThemeModeState(stored);
        }
      } catch (e) {
        console.warn("Failed to load theme mode", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setThemeMode = async (mode: "system" | "light" | "dark") => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem("themeMode", mode);
    } catch (e) {
      console.warn("Failed to save theme mode", e);
    }
  };

  // ---------- 当前是否为深色 ----------
  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : systemScheme === "dark";

  const paperTheme = isDark
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "index", title: routeTitles.index },
    { key: "focus", title: routeTitles.focus },
    { key: "patterns", title: routeTitles.patterns },
    { key: "analytics", title: routeTitles.analytics },
    { key: "settings", title: routeTitles.settings },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    index: DashboardRoute,
    focus: FocusRoute,
    patterns: PatternsRoute,
    analytics: AnalyticsRoute,
    settings: SettingsRoute,
  });

  const renderIcon = ({
    route,
    focused,
    color,
  }: {
    route: { key: string; title: string };
    focused: boolean;
    color: string;
  }) => {
    const map: Record<string, string> = {
      index: focused ? "home" : "home-outline",
      focus: focused ? "timer" : "timer-outline",
      patterns: focused ? "git-network" : "git-network-outline",
      analytics: focused ? "analytics" : "analytics-outline",
      settings: focused ? "settings" : "settings-outline",
    };
    const name = map[route.key] ?? "ellipse";
    return <Ionicons name={name as any} size={22} color={color} />;
  };

  if (!isReady) return null; // 等待主题加载完毕后再渲染

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          shifting={true}
          sceneAnimationEnabled={true}
          labeled={true}
          renderIcon={renderIcon}
        />
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
