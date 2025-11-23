/**
 * 仪表盘页面
 *
 * 显示应用的主要概览信息和快速访问功能
 */

import { SPACING } from "@/constants/app";
import { createLogger } from "@/utils/logger";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const logger = createLogger("Dashboard");

/**
 * 仪表盘组件
 */
const Dashboard: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    logger.debug("Dashboard mounted");
    return () => {
      logger.debug("Dashboard unmounted");
    };
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          仪表盘
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          欢迎使用 Momentum
        </Text>
      </View>

      {/* 快速概览卡片 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            今日概览
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.cardDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            暂无数据
          </Text>
        </Card.Content>
      </Card>

      {/* 统计卡片 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            使用统计
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.cardDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            开始使用应用以查看统计数据
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

if (__DEV__) {
  Dashboard.displayName = "Dashboard";
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
  cardTitle: {
    marginBottom: SPACING.SM,
    fontWeight: "600",
  },
  cardDescription: {
    lineHeight: 20,
  },
});

export default React.memo(Dashboard);
