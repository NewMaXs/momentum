import AnalyticsScreen from "@/navigation/BottomNavigatorTabs/analytics";
import FocusScreen from "@/navigation/BottomNavigatorTabs/focus";
import Dashboard from "@/navigation/BottomNavigatorTabs/index";
import PatternsScreen from "@/navigation/BottomNavigatorTabs/patterns";
import SettingsScreen from "@/navigation/BottomNavigatorTabs/settings";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// ==================== 类型定义 ====================

/** 从 Ionicons 组件属性中提取图标名称的类型 */
type IconName = React.ComponentProps<typeof Ionicons>["name"];

/**
 * 路由键类型
 */
type RouteKey = "index" | "focus" | "patterns" | "analytics" | "settings";

/**
 * 路由配置接口
 */
interface RouteConfig {
  key: RouteKey;
  title: string;
  component: React.ComponentType;
  focusedIcon: IconName;
  unfocusedIcon: IconName;
}

// ==================== 常量配置 ====================

/**
 * 路由配置列表
 */
const ROUTE_CONFIGS: readonly RouteConfig[] = [
  {
    key: "index",
    title: "仪表盘",
    component: Dashboard,
    focusedIcon: "home",
    unfocusedIcon: "home-outline",
  },
  {
    key: "focus",
    title: "专注",
    component: FocusScreen,
    focusedIcon: "timer",
    unfocusedIcon: "timer-outline",
  },
  {
    key: "patterns",
    title: "定式树",
    component: PatternsScreen,
    focusedIcon: "git-branch",
    unfocusedIcon: "git-branch-outline",
  },
  {
    key: "analytics",
    title: "分析",
    component: AnalyticsScreen,
    focusedIcon: "analytics",
    unfocusedIcon: "analytics-outline",
  },
  {
    key: "settings",
    title: "设置",
    component: SettingsScreen,
    focusedIcon: "settings",
    unfocusedIcon: "settings-outline",
  },
] as const;

// ==================== 主组件 ====================

/**
 * 底部导航器组件
 */
export default function BottomNavigator() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);

  // 生成路由配置
  const routes = useMemo(
    () =>
      ROUTE_CONFIGS.map(({ key, title }) => ({
        key,
        title,
      })),
    [],
  );

  /**
   * 渲染场景
   */
  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    const config = ROUTE_CONFIGS.find((r) => r.key === route.key);
    if (!config) return null;

    const SceneComponent = config.component;
    return <SceneComponent />;
  }, []);

  /**
   * 渲染导航图标
   */
  const renderIcon = useCallback(
    ({
      route,
      focused,
      color,
    }: {
      route: { key: string; title: string };
      focused: boolean;
      color: string;
    }) => {
      const config = ROUTE_CONFIGS.find((r) => r.key === route.key);
      if (!config) return null;

      const iconName = focused ? config.focusedIcon : config.unfocusedIcon;
      return <Ionicons name={iconName} size={22} color={color} />;
    },
    [],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={renderIcon}
        shifting={true}
        labeled={true}
        barStyle={{
          backgroundColor: theme.colors.elevation.level2,
        }}
      />
    </SafeAreaView>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
