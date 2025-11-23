/**
 * 专注模式页面
 *
 * 提供专注计时器和专注统计功能
 */

import StatItem from "@/components/StatItem";
import { SPACING } from "@/constants/app";
import { createLogger } from "@/utils/logger";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Icon, Text, useTheme } from "react-native-paper";

const logger = createLogger("FocusScreen");

/**
 * 专注模式组件
 */
const FocusScreen: React.FC = () => {
  const theme = useTheme();
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    logger.debug("FocusScreen mounted");
    return () => {
      logger.debug("FocusScreen unmounted");
    };
  }, []);

  // 切换计时器状态
  const toggleTimer = () => {
    logger.info(`Timer ${isTimerRunning ? "stopped" : "started"}`);
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          专注模式
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          保持专注，提升效率
        </Text>
      </View>

      {/* 计时器卡片 */}
      <Card style={styles.timerCard} mode="elevated">
        <Card.Content style={styles.timerContent}>
          <View style={styles.timerDisplay}>
            <Text
              variant="displayLarge"
              style={[styles.timerText, { color: theme.colors.primary }]}
            >
              25:00
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.timerLabel, { color: theme.colors.onSurface }]}
            >
              专注中
            </Text>
          </View>

          <View style={styles.timerControls}>
            <Button
              mode="contained"
              onPress={toggleTimer}
              style={styles.controlButton}
              contentStyle={styles.controlButtonContent}
              icon={isTimerRunning ? "pause" : "play"}
            >
              {isTimerRunning ? "暂停" : "开始"}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* 统计信息 */}
      <Card style={styles.statsCard} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            今日统计
          </Text>
          <View style={styles.statsGrid}>
            <StatItem
              value="0"
              label="专注次数"
              icon="counter"
              iconColor={theme.colors.primary}
              valueColor={theme.colors.primary}
            />
            <StatItem
              value="0"
              label="总时长（分钟）"
              icon="clock-time-four-outline"
              iconColor={theme.colors.secondary}
              valueColor={theme.colors.secondary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* 说明卡片 */}
      <Card style={styles.infoCard} mode="elevated">
        <Card.Content>
          <View style={styles.infoHeader}>
            <Icon
              source="information-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.infoTitle}>
              如何使用
            </Text>
          </View>
          <Text
            variant="bodyMedium"
            style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
          >
            1. 选择一个任务
            {"\n"}2. 设置专注时间（默认 25 分钟）
            {"\n"}3. 点击开始，全心投入
            {"\n"}4. 结束后休息 5 分钟
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

if (__DEV__) {
  FocusScreen.displayName = "FocusScreen";
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
  timerCard: {
    marginBottom: SPACING.MD,
    minHeight: 200,
    justifyContent: "center",
  },
  timerContent: {
    alignItems: "center",
    paddingVertical: SPACING.XL,
  },
  timerDisplay: {
    alignItems: "center",
    marginBottom: SPACING.XL,
  },
  timerText: {
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  timerLabel: {
    marginTop: SPACING.XS,
    opacity: 0.6,
  },
  timerControls: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  controlButton: {
    minWidth: 120,
    borderRadius: 50,
  },
  controlButtonContent: {
    paddingVertical: SPACING.XS,
  },
  statsCard: {
    marginBottom: SPACING.MD,
  },
  cardTitle: {
    marginBottom: SPACING.MD,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.SM,
  },
  infoCard: {
    marginBottom: SPACING.MD,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  infoTitle: {
    marginLeft: SPACING.SM,
    fontWeight: "600",
  },
  infoText: {
    lineHeight: 24,
    paddingLeft: SPACING.SM,
  },
});

export default React.memo(FocusScreen);
