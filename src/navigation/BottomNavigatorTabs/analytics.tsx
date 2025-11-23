/**
 * 数据分析页面
 *
 * 展示用户的使用数据统计和分析
 */

import StatItem from "@/components/StatItem";
import { SPACING } from "@/constants/app";
import { createLogger } from "@/utils/logger";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Icon,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";

const logger = createLogger("AnalyticsScreen");

/**
 * 时间范围类型
 */
type TimeRange = "day" | "week" | "month" | "year";

/**
 * 数据分析组件
 */
const AnalyticsScreen: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  useEffect(() => {
    logger.debug("AnalyticsScreen mounted");
    return () => {
      logger.debug("AnalyticsScreen unmounted");
    };
  }, []);

  // 处理时间范围变化
  const handleTimeRangeChange = (value: string) => {
    logger.debug(`Time range changed to: ${value}`);
    setTimeRange(value as TimeRange);
  };

  // 获取时间范围标签
  const getTimeRangeLabel = (): string => {
    switch (timeRange) {
      case "day":
        return "今日";
      case "week":
        return "本周";
      case "month":
        return "本月";
      case "year":
        return "本年";
      default:
        return "本周";
    }
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
          数据分析
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          查看您的使用数据和统计
        </Text>
      </View>

      {/* 时间范围选择 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <SegmentedButtons
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            buttons={[
              {
                value: "day",
                label: "日",
                icon: "calendar-today",
              },
              {
                value: "week",
                label: "周",
                icon: "calendar-week",
              },
              {
                value: "month",
                label: "月",
                icon: "calendar-month",
              },
              {
                value: "year",
                label: "年",
                icon: "calendar",
              },
            ]}
          />
        </Card.Content>
      </Card>

      {/* 总览统计 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {getTimeRangeLabel()}统计
          </Text>
          <View style={styles.statsGrid}>
            <StatItem
              value="0"
              label="专注时长（小时）"
              icon="timer"
              iconColor={theme.colors.primary}
              valueColor={theme.colors.primary}
            />
            <StatItem
              value="0"
              label="完成次数"
              icon="check-circle"
              iconColor={theme.colors.secondary}
              valueColor={theme.colors.secondary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* 趋势图表 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            使用趋势
          </Text>
          <View style={styles.chartPlaceholder}>
            <Icon
              source="chart-line"
              size={64}
              color={theme.colors.surfaceVariant}
            />
            <Text
              variant="bodyMedium"
              style={[
                styles.placeholderText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              图表功能开发中
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* 详细数据 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            详细数据
          </Text>

          {/* 专注数据 */}
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <Icon
                source="timer-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleSmall" style={styles.detailTitle}>
                专注模式
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                总次数
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0 次
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                平均时长
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0 分钟
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                最长记录
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0 分钟
              </Text>
            </View>
          </View>

          {/* 学习数据 */}
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <Icon
                source="book-open-outline"
                size={24}
                color={theme.colors.secondary}
              />
              <Text variant="titleSmall" style={styles.detailTitle}>
                学习数据
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                已学定式
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0 个
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                复习次数
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0 次
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                掌握程度
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                0%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 成就徽章 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            成就徽章
          </Text>
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementItem}>
              <Icon
                source="trophy-outline"
                size={40}
                color={theme.colors.surfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                初次专注
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Icon
                source="fire"
                size={40}
                color={theme.colors.surfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                连续 7 天
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Icon
                source="star-outline"
                size={40}
                color={theme.colors.surfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                专注达人
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Icon
                source="medal-outline"
                size={40}
                color={theme.colors.surfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.achievementLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                学习之星
              </Text>
            </View>
          </View>
          <Text
            variant="bodySmall"
            style={[
              styles.achievementHint,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            开始使用应用来解锁成就徽章
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

if (__DEV__) {
  AnalyticsScreen.displayName = "AnalyticsScreen";
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
    marginBottom: SPACING.MD,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.SM,
  },
  chartPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XL,
    opacity: 0.5,
  },
  placeholderText: {
    marginTop: SPACING.MD,
  },
  detailSection: {
    marginBottom: SPACING.LG,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  detailTitle: {
    marginLeft: SPACING.SM,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.SM,
  },
  detailValue: {
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  achievementsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  achievementItem: {
    alignItems: "center",
    flex: 1,
  },
  achievementLabel: {
    marginTop: SPACING.SM,
    textAlign: "center",
    lineHeight: 14,
  },
  achievementHint: {
    textAlign: "center",
    opacity: 0.7,
    fontStyle: "italic",
  },
});

export default React.memo(AnalyticsScreen);
