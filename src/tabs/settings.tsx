import { ThemeContext } from "@/contexts/ThemeContext";
import React, { useContext } from "react";
import { View } from "react-native";
import { Divider, RadioButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 24,
      }}
    >
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        主题设置
      </Text>

      <RadioButton.Group
        onValueChange={(value) =>
          setThemeMode(value as "system" | "light" | "dark")
        }
        value={themeMode}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <RadioButton value="system" />
          <Text>跟随系统</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <RadioButton value="light" />
          <Text>浅色模式</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton value="dark" />
          <Text>深色模式</Text>
        </View>
      </RadioButton.Group>

      <Divider style={{ marginVertical: 20 }} />

      <Text variant="bodyMedium" style={{ color: "gray" }}>
        当前模式：
        {themeMode === "system"
          ? "跟随系统"
          : themeMode === "light"
          ? "浅色模式"
          : "深色模式"}
      </Text>
    </SafeAreaView>
  );
}
