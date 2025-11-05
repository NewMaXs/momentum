import { ThemeContext } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import BottomNavigator from "@/navigation/BottomNavigator";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Animated, Easing, Image, StyleSheet, Text } from "react-native";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const { themeMode, setThemeMode, paperTheme, isDark, isReady } =
    useAppTheme();

  const fadeAnim = React.useRef(new Animated.Value(1)).current; // Splash 透明度
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current; // 图标缩放
  const [showSplash, setShowSplash] = React.useState(true);

  // 控制 Splash 动画
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
  }, [fadeAnim, isReady, scaleAnim]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <ThemeContext.Provider
          value={{
            themeMode,
            setThemeMode,
          }}
        >
          <BottomNavigator />
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
              style={{
                alignItems: "center",
                transform: [{ scale: scaleAnim }],
              }}
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
    </SafeAreaProvider>
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
