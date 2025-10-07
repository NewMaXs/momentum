import React, { useEffect, useState } from "react";
import {
  Appbar,
  Button,
  List,
  Menu,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

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
    <>
      <Appbar.Header elevated={true}>
        <Appbar.Content title="设置" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <List.Section>
        <List.Subheader
          style={{ color: theme.colors.primary, paddingHorizontal: 32 }}
        >
          外观
        </List.Subheader>
        <TouchableRipple
          onPress={() => setMenuVisible(true)}
          rippleColor={theme.colors.onBackground + "22"}
        >
          <List.Item
            style={{ paddingHorizontal: 16 }}
            title="颜色模式"
            left={() => (
              <List.Icon
                icon={
                  themeMode === "system"
                    ? "theme-light-dark"
                    : themeMode === "light"
                    ? "white-balance-sunny"
                    : "moon-waxing-crescent"
                }
              />
            )}
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
                  rippleColor={
                    themeMode === "system"
                      ? theme.colors.primary + "22"
                      : theme.colors.onBackground + "22"
                  }
                />
                <Menu.Item
                  onPress={() => {
                    onThemeChange("light");
                    setMenuVisible(false);
                  }}
                  title="浅色"
                  rippleColor={
                    themeMode === "light"
                      ? theme.colors.primary + "22"
                      : theme.colors.onBackground + "22"
                  }
                />
                <Menu.Item
                  onPress={() => {
                    onThemeChange("dark");
                    setMenuVisible(false);
                  }}
                  title="深色"
                  rippleColor={
                    themeMode === "dark"
                      ? theme.colors.primary + "22"
                      : theme.colors.onBackground + "22"
                  }
                />
              </Menu>
            )}
          />
        </TouchableRipple>
      </List.Section>
    </>
  );
}
