import { useThemeContext } from "@/context/ThemeContext";
import SelectionDialog, { SelectionOption } from "@/components/SelectionDialog";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List, TouchableRipple, useTheme } from "react-native-paper";

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useThemeContext();
  const [dialogVisible, setDialogVisible] = useState(false);
  const theme = useTheme();

  const getThemeModeIcon = () => {
    switch (themeMode) {
      case "system":
        return "theme-light-dark";
      case "light":
        return "white-balance-sunny";
      case "dark":
        return "moon-waxing-crescent";
    }
  };

  const getThemeModeLabel = () => {
    switch (themeMode) {
      case "system":
        return "系统";
      case "light":
        return "浅色";
      case "dark":
        return "深色";
    }
  };

  const themeOptions: SelectionOption[] = [
    {
      value: "system",
      label: "系统",
      description: "跟随系统明暗主题",
      icon: "theme-light-dark",
    },
    {
      value: "light",
      label: "浅色",
      description: "始终使用浅色主题",
      icon: "white-balance-sunny",
    },
    {
      value: "dark",
      label: "深色",
      description: "始终使用深色主题",
      icon: "moon-waxing-crescent",
    },
  ];

  const handleThemeModeChange = (value: string) => {
    setThemeMode(value as "system" | "light" | "dark");
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>
            外观设置
          </List.Subheader>

          {/* 颜色模式选择 */}
          <TouchableRipple
            onPress={() => setDialogVisible(true)}
            rippleColor={theme.colors.surfaceVariant}
          >
            <List.Item
              title="颜色模式"
              description={getThemeModeLabel()}
              left={(props) => (
                <List.Icon {...props} icon={getThemeModeIcon()} />
              )}
            />
          </TouchableRipple>
        </List.Section>

        {/* 关于部分 */}
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>
            关于
          </List.Subheader>
          <List.Item
            title="版本"
            description="1.0.0"
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
          />
        </List.Section>
      </ScrollView>

      {/* 主题选择对话框 */}
      <SelectionDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title="选择颜色模式"
        options={themeOptions}
        selectedValue={themeMode}
        onSelect={handleThemeModeChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
