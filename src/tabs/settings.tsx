import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  List,
  Menu,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsScreenProps {
  themeMode: "system" | "light" | "dark";
  onThemeChange: (mode: "system" | "light" | "dark") => void;
}

export default function SettingsScreen({
  themeMode,
  onThemeChange,
}: SettingsScreenProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuKey, setMenuKey] = useState(0); // 强制重置 Menu 状态
  const theme = useTheme();

  // 当菜单关闭时强制刷新 key，重置状态（防止动画卡死）
  useEffect(() => {
    if (!menuVisible) {
      const t = setTimeout(() => setMenuKey((k) => k + 1), 300);
      return () => clearTimeout(t);
    }
  }, [menuVisible]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <Card mode="contained" style={{ borderRadius: 16 }}>
        <Card.Title title="外观" titleVariant="titleMedium" />
        <Divider />
        <Card.Content>
          <List.Item
            title="主题模式"
            right={() => (
              <Menu
                key={menuKey} // 每次关闭后强制重新挂载
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="text"
                    onPress={() => setMenuVisible(true)}
                    icon="chevron-down"
                  >
                    {themeMode === "system"
                      ? "系统"
                      : themeMode === "light"
                      ? "浅色"
                      : "深色"}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    onThemeChange("system");
                    setMenuVisible(false);
                  }}
                  title="系统"
                />
                <Menu.Item
                  onPress={() => {
                    onThemeChange("light");
                    setMenuVisible(false);
                  }}
                  title="浅色"
                />
                <Menu.Item
                  onPress={() => {
                    onThemeChange("dark");
                    setMenuVisible(false);
                  }}
                  title="深色"
                />
              </Menu>
            )}
          />
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}
