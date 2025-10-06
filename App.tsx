import { ThemeContext } from "@/context/ThemeContext";
import MainNavigator from "@/navigation/MainNavigator";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function App() {
  const { theme } = useMaterial3Theme();
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = React.useState<
    "system" | "light" | "dark"
  >("system");
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("themeMode");
      if (stored === "system" || stored === "light" || stored === "dark") {
        setThemeModeState(stored);
      }
      setIsReady(true);
    })();
  }, []);

  const setThemeMode = async (mode: "system" | "light" | "dark") => {
    setThemeModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
      ? false
      : systemScheme === "dark";

  const paperTheme = isDark
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <MainNavigator themeMode={themeMode} onThemeChange={setThemeMode} />
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
