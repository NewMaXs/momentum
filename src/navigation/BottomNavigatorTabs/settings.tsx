/**
 * 设置页面
 *
 * 提供应用的各项配置选项
 */

import SelectionDialog, { SelectionOption } from "@/components/SelectionDialog";
import SettingsItem from "@/components/SettingsItem";
import { APP_INFO, SPACING } from "@/constants/app";
import { useThemeContext } from "@/context/ThemeContext";
import { createLogger } from "@/utils/logger";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";

const logger = createLogger("SettingsScreen");

/**
 * 设置组件
 */
const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();

  // 对话框状态
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);

  // 功能开关状态
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // 获取主题模式图标
  const getThemeModeIcon = useCallback((): string => {
    switch (themeMode) {
      case "system":
        return "theme-light-dark";
      case "light":
        return "white-balance-sunny";
      case "dark":
        return "moon-waxing-crescent";
      default:
        return "theme-light-dark";
    }
  }, [themeMode]);

  // 获取主题模式标签
  const getThemeModeLabel = useCallback((): string => {
    switch (themeMode) {
      case "system":
        return "跟随系统";
      case "light":
        return "浅色模式";
      case "dark":
        return "深色模式";
      default:
        return "跟随系统";
    }
  }, [themeMode]);

  // 主题选项配置
  const themeOptions = useMemo<SelectionOption[]>(
    () => [
      {
        value: "system",
        label: "跟随系统",
        description: "自动适配系统明暗主题",
        icon: "theme-light-dark",
      },
      {
        value: "light",
        label: "浅色模式",
        description: "始终使用浅色主题",
        icon: "white-balance-sunny",
      },
      {
        value: "dark",
        label: "深色模式",
        description: "始终使用深色主题",
        icon: "moon-waxing-crescent",
      },
    ],
    [],
  );

  // 处理主题模式变化
  const handleThemeModeChange = useCallback(
    (value: string) => {
      logger.info(`Theme mode changed to: ${value}`);
      setThemeMode(value as "system" | "light" | "dark");
    },
    [setThemeMode],
  );

  // 处理通知开关
  const handleNotificationsToggle = useCallback(() => {
    const newValue = !notificationsEnabled;
    logger.debug(`Notifications ${newValue ? "enabled" : "disabled"}`);
    setNotificationsEnabled(newValue);
  }, [notificationsEnabled]);

  // 处理声音开关
  const handleSoundToggle = useCallback(() => {
    const newValue = !soundEnabled;
    logger.debug(`Sound ${newValue ? "enabled" : "disabled"}`);
    setSoundEnabled(newValue);
  }, [soundEnabled]);

  // 处理震动开关
  const handleVibrationToggle = useCallback(() => {
    const newValue = !vibrationEnabled;
    logger.debug(`Vibration ${newValue ? "enabled" : "disabled"}`);
    setVibrationEnabled(newValue);
  }, [vibrationEnabled]);

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 页面标题 */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            设置
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            个性化您的应用体验
          </Text>
        </View>

        {/* 外观设置 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <List.Icon icon="palette-outline" color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                外观设置
              </Text>
            </View>

            <SettingsItem
              title="颜色模式"
              description={getThemeModeLabel()}
              leftIcon={getThemeModeIcon()}
              onPress={() => setThemeDialogVisible(true)}
              showChevron
            />
          </Card.Content>
        </Card>

        {/* 通知设置 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <List.Icon icon="bell-outline" color={theme.colors.secondary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                通知设置
              </Text>
            </View>

            <SettingsItem
              title="推送通知"
              description="接收重要提醒和更新"
              leftIcon="bell-ring-outline"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                />
              }
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="提示音"
              description="启用操作提示音效"
              leftIcon="volume-high"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={handleSoundToggle}
                />
              }
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="震动反馈"
              description="启用触觉震动反馈"
              leftIcon="vibrate"
              rightElement={
                <Switch
                  value={vibrationEnabled}
                  onValueChange={handleVibrationToggle}
                />
              }
            />
          </Card.Content>
        </Card>

        {/* 数据管理 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <List.Icon
                icon="database-outline"
                color={theme.colors.tertiary}
              />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                数据管理
              </Text>
            </View>

            <SettingsItem
              title="导出数据"
              description="导出您的学习数据"
              leftIcon="export"
              onPress={() => logger.info("Export data pressed")}
              showChevron
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="清除缓存"
              description="释放存储空间"
              leftIcon="broom"
              onPress={() => logger.info("Clear cache pressed")}
              showChevron
            />
          </Card.Content>
        </Card>

        {/* 帮助与支持 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <List.Icon
                icon="help-circle-outline"
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                帮助与支持
              </Text>
            </View>

            <SettingsItem
              title="使用指南"
              leftIcon="book-open-outline"
              onPress={() => logger.info("User guide pressed")}
              showChevron
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="常见问题"
              leftIcon="frequently-asked-questions"
              onPress={() => logger.info("FAQ pressed")}
              showChevron
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="反馈建议"
              leftIcon="message-outline"
              onPress={() => logger.info("Feedback pressed")}
              showChevron
            />
          </Card.Content>
        </Card>

        {/* 关于应用 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <List.Icon
                icon="information-outline"
                color={theme.colors.secondary}
              />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                关于应用
              </Text>
            </View>

            <SettingsItem
              title="应用名称"
              description={APP_INFO.NAME}
              leftIcon="application"
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="版本号"
              description={APP_INFO.VERSION}
              leftIcon="tag-outline"
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="隐私政策"
              leftIcon="shield-lock-outline"
              onPress={() => logger.info("Privacy policy pressed")}
              showChevron
            />

            <Divider style={styles.divider} />

            <SettingsItem
              title="使用条款"
              leftIcon="file-document-outline"
              onPress={() => logger.info("Terms pressed")}
              showChevron
            />
          </Card.Content>
        </Card>

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 主题选择对话框 */}
      <SelectionDialog
        visible={themeDialogVisible}
        onDismiss={() => setThemeDialogVisible(false)}
        title="选择颜色模式"
        options={themeOptions}
        selectedValue={themeMode}
        onSelect={handleThemeModeChange}
      />
    </>
  );
};

if (__DEV__) {
  SettingsScreen.displayName = "SettingsScreen";
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.MD,
  },
  header: {
    marginBottom: SPACING.LG,
  },
  title: {
    marginBottom: SPACING.XS,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    marginBottom: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    marginLeft: SPACING.SM,
    fontWeight: "600",
  },
  divider: {
    marginVertical: SPACING.SM,
  },
  bottomSpacer: {
    height: SPACING.MD,
  },
});

export default React.memo(SettingsScreen);
