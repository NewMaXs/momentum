import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { FontSizes } from "@/constants/fontSize";
import { Spacing } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  // 模拟数据
  const [chainData] = useState({
    mainChain: {
      currentLength: 12,
      bestLength: 25,
      totalSessions: 45,
      successRate: 78,
      averageDuration: 52, // 分钟
    },
    auxChain: {
      currentLength: 8,
      bestLength: 15,
      totalSessions: 32,
      successRate: 65,
      averageDuration: 15, // 分钟
    },
  });

  const [patternData] = useState({
    totalPatterns: 6,
    activePatterns: 4,
    reinforcedPatterns: 3,
    successRate: 72,
    averageReinforcement: 1.5,
  });

  const [weeklyData] = useState([
    { day: "周一", mainChain: 2, auxChain: 1, patterns: 3, mood: 7 },
    { day: "周二", mainChain: 1, auxChain: 2, patterns: 4, mood: 8 },
    { day: "周三", mainChain: 3, auxChain: 1, patterns: 2, mood: 6 },
    { day: "周四", mainChain: 2, auxChain: 3, patterns: 5, mood: 8 },
    { day: "周五", mainChain: 1, auxChain: 2, patterns: 3, mood: 7 },
    { day: "周六", mainChain: 0, auxChain: 1, patterns: 2, mood: 6 },
    { day: "周日", mainChain: 2, auxChain: 2, patterns: 4, mood: 8 },
  ]);

  const [metrics] = useState({
    sleepScore: 75,
    energyScore: 80,
    phoneUsage: 45,
    taskProgress: 60,
    moodScore: 70,
  });

  const getPeriodText = () => {
    switch (selectedPeriod) {
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

  const getTotalSessions = () => {
    return chainData.mainChain.totalSessions + chainData.auxChain.totalSessions;
  };

  const getOverallSuccessRate = () => {
    const mainSuccess =
      chainData.mainChain.totalSessions *
      (chainData.mainChain.successRate / 100);
    const auxSuccess =
      chainData.auxChain.totalSessions * (chainData.auxChain.successRate / 100);
    const totalSuccess = mainSuccess + auxSuccess;
    return Math.round((totalSuccess / getTotalSessions()) * 100);
  };

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map((item) => item[key]));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 时间选择器 */}
        <Card style={styles.periodSelector}>
          <View style={styles.periodButtons}>
            {(["week", "month", "year"] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period === "week"
                    ? "本周"
                    : period === "month"
                    ? "本月"
                    : "本年"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 总体统计 */}
        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>{getPeriodText()}总体表现</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="trending-up" size={24} color={Colors.primary} />
              <Text style={styles.overviewValue}>{getTotalSessions()}</Text>
              <Text style={styles.overviewLabel}>总专注次数</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors.success}
              />
              <Text style={styles.overviewValue}>
                {getOverallSuccessRate()}%
              </Text>
              <Text style={styles.overviewLabel}>成功率</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="time" size={24} color={Colors.secondary} />
              <Text style={styles.overviewValue}>
                {Math.round(
                  (chainData.mainChain.averageDuration +
                    chainData.auxChain.averageDuration) /
                    2
                )}
              </Text>
              <Text style={styles.overviewLabel}>平均时长(分)</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="git-network" size={24} color={Colors.warning} />
              <Text style={styles.overviewValue}>
                {patternData.activePatterns}
              </Text>
              <Text style={styles.overviewLabel}>活跃定式</Text>
            </View>
          </View>
        </Card>

        {/* 链状态分析 */}
        <Card style={styles.chainAnalysisCard}>
          <Text style={styles.sectionTitle}>链状态分析</Text>

          <View style={styles.chainSection}>
            <View style={styles.chainHeader}>
              <Text style={styles.chainTitle}>主链 (专注链)</Text>
              <Badge
                text={`#${chainData.mainChain.currentLength}`}
                variant="primary"
              />
            </View>
            <View style={styles.chainStats}>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.mainChain.totalSessions}
                </Text>
                <Text style={styles.chainStatLabel}>总次数</Text>
              </View>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.mainChain.successRate}%
                </Text>
                <Text style={styles.chainStatLabel}>成功率</Text>
              </View>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.mainChain.averageDuration}
                </Text>
                <Text style={styles.chainStatLabel}>平均时长</Text>
              </View>
            </View>
            <ProgressBar
              progress={
                (chainData.mainChain.currentLength /
                  chainData.mainChain.bestLength) *
                100
              }
              color={Colors.primary}
              style={styles.chainProgress}
            />
          </View>

          <View style={styles.chainSection}>
            <View style={styles.chainHeader}>
              <Text style={styles.chainTitle}>辅助链 (预约链)</Text>
              <Badge
                text={`#${chainData.auxChain.currentLength}`}
                variant="secondary"
              />
            </View>
            <View style={styles.chainStats}>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.auxChain.totalSessions}
                </Text>
                <Text style={styles.chainStatLabel}>总次数</Text>
              </View>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.auxChain.successRate}%
                </Text>
                <Text style={styles.chainStatLabel}>成功率</Text>
              </View>
              <View style={styles.chainStat}>
                <Text style={styles.chainStatValue}>
                  {chainData.auxChain.averageDuration}
                </Text>
                <Text style={styles.chainStatLabel}>平均时长</Text>
              </View>
            </View>
            <ProgressBar
              progress={
                (chainData.auxChain.currentLength /
                  chainData.auxChain.bestLength) *
                100
              }
              color={Colors.secondary}
              style={styles.chainProgress}
            />
          </View>
        </Card>

        {/* 定式分析 */}
        <Card style={styles.patternAnalysisCard}>
          <Text style={styles.sectionTitle}>定式分析</Text>

          <View style={styles.patternStats}>
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>
                {patternData.totalPatterns}
              </Text>
              <Text style={styles.patternStatLabel}>总定式数</Text>
            </View>
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>
                {patternData.activePatterns}
              </Text>
              <Text style={styles.patternStatLabel}>活跃定式</Text>
            </View>
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>
                {patternData.reinforcedPatterns}
              </Text>
              <Text style={styles.patternStatLabel}>强化定式</Text>
            </View>
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>
                {patternData.successRate}%
              </Text>
              <Text style={styles.patternStatLabel}>成功率</Text>
            </View>
          </View>

          <View style={styles.reinforcementAnalysis}>
            <Text style={styles.analysisTitle}>强化等级分布</Text>
            <View style={styles.reinforcementBars}>
              <View style={styles.reinforcementBar}>
                <Text style={styles.reinforcementLabel}>+0</Text>
                <View style={styles.reinforcementBarContainer}>
                  <View
                    style={[
                      styles.reinforcementBarFill,
                      { width: "30%", backgroundColor: Colors.gray400 },
                    ]}
                  />
                </View>
                <Text style={styles.reinforcementValue}>3</Text>
              </View>
              <View style={styles.reinforcementBar}>
                <Text style={styles.reinforcementLabel}>+1</Text>
                <View style={styles.reinforcementBarContainer}>
                  <View
                    style={[
                      styles.reinforcementBarFill,
                      { width: "50%", backgroundColor: Colors.success },
                    ]}
                  />
                </View>
                <Text style={styles.reinforcementValue}>2</Text>
              </View>
              <View style={styles.reinforcementBar}>
                <Text style={styles.reinforcementLabel}>+2</Text>
                <View style={styles.reinforcementBarContainer}>
                  <View
                    style={[
                      styles.reinforcementBarFill,
                      { width: "20%", backgroundColor: Colors.primary },
                    ]}
                  />
                </View>
                <Text style={styles.reinforcementValue}>1</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 周度趋势 */}
        <Card style={styles.trendCard}>
          <Text style={styles.sectionTitle}>周度趋势</Text>

          <View style={styles.trendChart}>
            {weeklyData.map((day, index) => {
              const maxMainChain = getMaxValue(weeklyData, "mainChain");
              const maxPatterns = getMaxValue(weeklyData, "patterns");

              return (
                <View key={day.day} style={styles.trendDay}>
                  <View style={styles.trendBars}>
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height: (day.mainChain / maxMainChain) * 60,
                          backgroundColor: Colors.primary,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height: (day.patterns / maxPatterns) * 60,
                          backgroundColor: Colors.secondary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.trendDayLabel}>{day.day}</Text>
                  <View style={styles.trendMood}>
                    <Ionicons
                      name={
                        day.mood >= 7
                          ? "happy"
                          : day.mood >= 5
                          ? "sad"
                          : "sad-outline"
                      }
                      size={12}
                      color={
                        day.mood >= 7
                          ? Colors.success
                          : day.mood >= 5
                          ? Colors.warning
                          : Colors.danger
                      }
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.trendLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={styles.legendText}>主链次数</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: Colors.secondary },
                ]}
              />
              <Text style={styles.legendText}>定式完成</Text>
            </View>
          </View>
        </Card>

        {/* 稳态雷达 */}
        <Card style={styles.radarCard}>
          <Text style={styles.sectionTitle}>稳态雷达</Text>

          <View style={styles.radarMetrics}>
            <View style={styles.radarItem}>
              <Text style={styles.radarLabel}>睡眠质量</Text>
              <View style={styles.radarBar}>
                <View
                  style={[
                    styles.radarFill,
                    { width: `${metrics.sleepScore}%` },
                  ]}
                />
              </View>
              <Text style={styles.radarValue}>{metrics.sleepScore}%</Text>
            </View>
            <View style={styles.radarItem}>
              <Text style={styles.radarLabel}>精力状态</Text>
              <View style={styles.radarBar}>
                <View
                  style={[
                    styles.radarFill,
                    { width: `${metrics.energyScore}%` },
                  ]}
                />
              </View>
              <Text style={styles.radarValue}>{metrics.energyScore}%</Text>
            </View>
            <View style={styles.radarItem}>
              <Text style={styles.radarLabel}>手机控制</Text>
              <View style={styles.radarBar}>
                <View
                  style={[
                    styles.radarFill,
                    { width: `${100 - metrics.phoneUsage}%` },
                  ]}
                />
              </View>
              <Text style={styles.radarValue}>{100 - metrics.phoneUsage}%</Text>
            </View>
            <View style={styles.radarItem}>
              <Text style={styles.radarLabel}>任务进度</Text>
              <View style={styles.radarBar}>
                <View
                  style={[
                    styles.radarFill,
                    { width: `${metrics.taskProgress}%` },
                  ]}
                />
              </View>
              <Text style={styles.radarValue}>{metrics.taskProgress}%</Text>
            </View>
            <View style={styles.radarItem}>
              <Text style={styles.radarLabel}>情绪状态</Text>
              <View style={styles.radarBar}>
                <View
                  style={[styles.radarFill, { width: `${metrics.moodScore}%` }]}
                />
              </View>
              <Text style={styles.radarValue}>{metrics.moodScore}%</Text>
            </View>
          </View>
        </Card>

        {/* 洞察建议 */}
        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>洞察与建议</Text>

          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Ionicons name="trending-up" size={20} color={Colors.success} />
              <Text style={styles.insightText}>
                主链成功率78%，表现良好，建议继续保持
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="warning" size={20} color={Colors.warning} />
              <Text style={styles.insightText}>
                辅助链成功率65%，建议优化预约机制
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="bulb" size={20} color={Colors.primary} />
              <Text style={styles.insightText}>
                定式成功率72%，可考虑添加更多强化定式
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="phone-portrait" size={20} color={Colors.danger} />
              <Text style={styles.insightText}>
                手机使用时间偏高，建议加强数字戒断定式
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  periodSelector: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  periodButtons: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.sm,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: Colors.textInverse,
  },
  overviewCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  overviewItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  overviewValue: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  overviewLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chainAnalysisCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chainSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  chainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  chainTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  chainStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
  },
  chainStat: {
    alignItems: "center",
  },
  chainStatValue: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  chainStatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  chainProgress: {
    marginTop: Spacing.sm,
  },
  patternAnalysisCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  patternStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  patternStat: {
    alignItems: "center",
  },
  patternStatValue: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  patternStatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  reinforcementAnalysis: {
    marginTop: Spacing.md,
  },
  analysisTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  reinforcementBars: {
    gap: Spacing.sm,
  },
  reinforcementBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  reinforcementLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    width: 30,
  },
  reinforcementBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  reinforcementBarFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  reinforcementValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    width: 20,
    textAlign: "right",
  },
  trendCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  trendChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
    marginBottom: Spacing.md,
  },
  trendDay: {
    alignItems: "center",
    flex: 1,
  },
  trendBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 80,
    marginBottom: Spacing.sm,
  },
  trendBar: {
    width: 8,
    borderRadius: BorderRadius.sm,
  },
  trendDayLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  trendMood: {
    alignItems: "center",
  },
  trendLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.sm,
  },
  legendText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  radarCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  radarMetrics: {
    gap: Spacing.md,
  },
  radarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  radarLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    width: 80,
  },
  radarBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  radarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  radarValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    width: 40,
    textAlign: "right",
  },
  insightsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  insightsList: {
    gap: Spacing.md,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: Spacing["2xl"],
  },
});
