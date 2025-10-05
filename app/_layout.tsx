import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  BottomNavigation,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import AnalyticsScreen from "./analytics";
import FocusScreen from "./focus";
import Dashboard from "./index";
import PatternsScreen from "./patterns";
import SettingsScreen from "./settings";

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

export default function RootLayout() {
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

  return (
    <PaperProvider
      theme={
        {
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: Colors.primary,
            onPrimary: Colors.textInverse,
            secondary: Colors.secondary,
            background: Colors.background,
            surface: Colors.background,
            surfaceVariant: Colors.backgroundSecondary,
            outline: Colors.gray200,
            inverseOnSurface: Colors.textInverse,
            onSurface: Colors.textPrimary,
            secondaryContainer: Colors.secondaryLight,
          },
          roundness: BorderRadius.md,
        } as typeof MD3LightTheme
      }
    >
      <StatusBar style="auto" />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        sceneAnimationEnabled={true}
        labeled={true}
        renderIcon={renderIcon}
        activeColor={Colors.primary}
        inactiveColor={Colors.gray500}
        barStyle={{
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.gray200,
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
        }}
        activeIndicatorStyle={{ backgroundColor: Colors.primaryLight }}
      />
    </PaperProvider>
  );
}
