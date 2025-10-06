import AnalyticsScreen from "@/tabs/analytics";
import FocusScreen from "@/tabs/focus";
import Dashboard from "@/tabs/index";
import PatternsScreen from "@/tabs/patterns";
import SettingsScreen from "@/tabs/settings";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";

const routeTitles = {
  index: "仪表盘",
  focus: "专注",
  patterns: "定式树",
  analytics: "分析",
  settings: "设置",
};

interface MainNavigatorProps {
  themeMode: "system" | "light" | "dark";
  onThemeChange: (mode: "system" | "light" | "dark") => void;
}

export default function MainNavigator({
  themeMode,
  onThemeChange,
}: MainNavigatorProps) {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "index", title: routeTitles.index },
    { key: "focus", title: routeTitles.focus },
    { key: "patterns", title: routeTitles.patterns },
    { key: "analytics", title: routeTitles.analytics },
    { key: "settings", title: routeTitles.settings },
  ];

  const renderScene = BottomNavigation.SceneMap({
    index: () => <Dashboard />,
    focus: () => <FocusScreen />,
    patterns: () => <PatternsScreen />,
    analytics: () => <AnalyticsScreen />,
    settings: () => (
      <SettingsScreen themeMode={themeMode} onThemeChange={onThemeChange} />
    ),
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
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      sceneAnimationEnabled={true}
      labeled={true}
      renderIcon={renderIcon}
    />
  );
}
