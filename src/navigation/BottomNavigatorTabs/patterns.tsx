/**
 * 定式树页面
 *
 * 展示和管理围棋定式模式
 */

import { SPACING } from "@/constants/app";
import { createLogger } from "@/utils/logger";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Icon, List, Text, useTheme } from "react-native-paper";

const logger = createLogger("PatternsScreen");

/**
 * 定式树组件
 */
const PatternsScreen: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    logger.debug("PatternsScreen mounted");
    return () => {
      logger.debug("PatternsScreen unmounted");
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
          定式树
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          查看和学习围棋定式模式
        </Text>
      </View>

      {/* 定式库概览 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.iconHeader}>
            <Icon source="graph" size={48} color={theme.colors.primary} />
          </View>
          <Text variant="titleLarge" style={styles.centerTitle}>
            定式库
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.centerDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            系统化学习围棋开局定式
          </Text>
        </Card.Content>
      </Card>

      {/* 定式分类 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            定式分类
          </Text>
          <List.Section style={styles.listSection}>
            <List.Item
              title="星位定式"
              description="最常见的开局定式"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="star"
                  color={theme.colors.primary}
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
            />
            <List.Item
              title="小目定式"
              description="灵活多变的开局选择"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="circle-outline"
                  color={theme.colors.primary}
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
            />
            <List.Item
              title="三三定式"
              description="实地取向的定式"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="square-outline"
                  color={theme.colors.primary}
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
            />
            <List.Item
              title="高目定式"
              description="势力导向的开局"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="triangle-outline"
                  color={theme.colors.primary}
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
            />
          </List.Section>
        </Card.Content>
      </Card>

      {/* 学习进度 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            学习进度
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Text
                variant="displaySmall"
                style={[styles.progressValue, { color: theme.colors.primary }]}
              >
                0
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.progressLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                已学习
              </Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text
                variant="displaySmall"
                style={[
                  styles.progressValue,
                  { color: theme.colors.secondary },
                ]}
              >
                0
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.progressLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                收藏
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 学习建议 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            学习建议
          </Text>
          <View style={styles.tipItem}>
            <Icon
              source="lightbulb-outline"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text
              variant="bodyMedium"
              style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}
            >
              从基础定式开始，逐步深入学习
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon
              source="lightbulb-outline"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text
              variant="bodyMedium"
              style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}
            >
              理解定式背后的思想比记忆更重要
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon
              source="lightbulb-outline"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text
              variant="bodyMedium"
              style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}
            >
              在实战中应用所学定式
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

if (__DEV__) {
  PatternsScreen.displayName = "PatternsScreen";
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
  iconHeader: {
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  centerTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: SPACING.SM,
  },
  centerDescription: {
    textAlign: "center",
  },
  cardTitle: {
    marginBottom: SPACING.MD,
    fontWeight: "600",
  },
  listSection: {
    marginTop: 0,
    marginBottom: 0,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: SPACING.SM,
    paddingVertical: SPACING.MD,
  },
  progressItem: {
    alignItems: "center",
    flex: 1,
  },
  progressDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  progressValue: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  progressLabel: {
    marginTop: SPACING.XS,
    textAlign: "center",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.MD,
  },
  tipText: {
    marginLeft: SPACING.SM,
    flex: 1,
    lineHeight: 20,
  },
});

export default React.memo(PatternsScreen);
