import AnalyticsScreen from "@/navigation/BottomNavigatorTabs/analytics";
import FocusScreen from "@/navigation/BottomNavigatorTabs/focus";
import Dashboard from "@/navigation/BottomNavigatorTabs/index";
import PatternsScreen from "@/navigation/BottomNavigatorTabs/patterns";
import SettingsScreen from "@/navigation/BottomNavigatorTabs/settings";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const routeTitles = {
  index: "仪表盘",
  focus: "专注",
  patterns: "定式树",
  analytics: "分析",
  settings: "设置",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ANIMATION_DURATION = 300; // 固定总动画时间（毫秒）

export default function BottomNavigator() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const theme = useTheme();

  // 为每个页面创建位置动画值，初始时除了第一个页面，其他都在屏幕外
  const slideAnims = useRef(
    Array.from({ length: 5 }, (_, i) => new Animated.Value(i === 0 ? 0 : 1)),
  ).current;

  const routes = useMemo(
    () => [
      { key: "index", title: routeTitles.index },
      { key: "focus", title: routeTitles.focus },
      { key: "patterns", title: routeTitles.patterns },
      { key: "analytics", title: routeTitles.analytics },
      { key: "settings", title: routeTitles.settings },
    ],
    [],
  );

  useEffect(() => {
    const distance = Math.abs(index - prevIndex);
    if (distance === 0) return;

    const direction = index > prevIndex ? 1 : -1;
    const start = Math.min(prevIndex, index);
    const end = Math.max(prevIndex, index);

    // 为涉及的页面创建动画
    const animations = [];

    for (let i = start; i <= end; i++) {
      const relativePosition = Math.abs(i - prevIndex);
      const timePerPage = ANIMATION_DURATION / distance;
      const delay =
        relativePosition > 0 ? timePerPage * (relativePosition - 1) : 0;

      let fromValue, toValue;

      if (i === prevIndex) {
        // 起始页面：从中心滑出
        fromValue = 0;
        toValue = -direction;
      } else if (i === index) {
        // 目标页面：从对面滑入中心
        fromValue = direction;
        toValue = 0;
      } else {
        // 中间页面：从对面快速划过
        fromValue = direction;
        toValue = -direction;
      }

      // 设置初始位置
      slideAnims[i].setValue(fromValue);

      // 创建动画
      animations.push(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(slideAnims[i], {
            toValue,
            duration: timePerPage,
            useNativeDriver: true,
          }),
        ]),
      );
    }

    Animated.parallel(animations).start();
    setPrevIndex(index);
  }, [index, prevIndex, slideAnims]);

  const getSceneComponent = (key: string) => {
    switch (key) {
      case "index":
        return Dashboard;
      case "focus":
        return FocusScreen;
      case "patterns":
        return PatternsScreen;
      case "analytics":
        return AnalyticsScreen;
      case "settings":
        return SettingsScreen;
      default:
        return null;
    }
  };

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        {routes.map((route, routeIndex) => {
          const SceneComponent = getSceneComponent(route.key);
          if (!SceneComponent) return null;

          const isActive = routeIndex === index;

          const translateX = slideAnims[routeIndex].interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          });

          return (
            <Animated.View
              key={route.key}
              style={[
                styles.sceneWrapper,
                {
                  transform: [{ translateX }],
                  zIndex: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                },
              ]}
              pointerEvents={isActive ? "auto" : "none"}
            >
              <SceneComponent />
            </Animated.View>
          );
        })}
      </View>
      <BottomNavigation.Bar
        navigationState={{ index, routes }}
        onTabPress={({ route }) => {
          const newIndex = routes.findIndex((r) => r.key === route.key);
          setIndex(newIndex);
        }}
        shifting={true}
        labeled={true}
        renderIcon={renderIcon}
        style={{ backgroundColor: theme.colors.elevation.level2 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  sceneWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
});
