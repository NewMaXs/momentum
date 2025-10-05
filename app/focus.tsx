import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { FontSizes } from "@/constants/fontSize";
import { Spacing } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FocusScreen() {
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusTime, setFocusTime] = useState(0); // 秒
  const [targetTime, setTargetTime] = useState(60 * 60); // 60分钟
  const [violations, setViolations] = useState<string[]>([]);
  const [currentChainLength, setCurrentChainLength] = useState(12);

  const handleCompleteFocus = useCallback(() => {
    setIsFocusing(false);
    setCurrentChainLength((prev) => prev + 1);

    Alert.alert(
      "专注完成！",
      `恭喜你完成了 ${formatTime(focusTime)} 的专注时间！\n\n链长度已更新为 #${
        currentChainLength + 1
      }`,
      [
        {
          text: "继续专注",
          onPress: () => {
            setFocusTime(0);
            setIsFocusing(true);
          },
        },
        {
          text: "结束",
          style: "default",
        },
      ]
    );
  }, [focusTime, currentChainLength]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isFocusing) {
      interval = setInterval(() => {
        setFocusTime((prev) => {
          const newTime = prev + 1;
          // 如果达到目标时间，自动完成
          if (newTime >= targetTime) {
            handleCompleteFocus();
            return targetTime;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusing, targetTime, handleCompleteFocus]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    return Math.min((focusTime / targetTime) * 100, 100);
  };

  const handleStartFocus = () => {
    setIsFocusing(true);
    setFocusTime(0);
    setViolations([]);
  };

  const handlePauseFocus = () => {
    setIsFocusing(false);
  };

  const handleReportViolation = () => {
    Alert.alert("报告违规行为", "请选择你刚才的行为：", [
      {
        text: "上厕所",
        onPress: () => handleViolationDecision("上厕所"),
      },
      {
        text: "回复消息",
        onPress: () => handleViolationDecision("回复消息"),
      },
      {
        text: "刷手机",
        onPress: () => handleViolationDecision("刷手机"),
      },
      {
        text: "其他",
        onPress: () => handleViolationDecision("其他行为"),
      },
      {
        text: "取消",
        style: "cancel",
      },
    ]);
  };

  const handleViolationDecision = (behavior: string) => {
    Alert.alert(
      "下必为例",
      `检测到行为："${behavior}"\n\n根据"下必为例"原则，请选择：`,
      [
        {
          text: "清空主链",
          style: "destructive",
          onPress: () => {
            setViolations((prev) => [...prev, behavior]);
            setCurrentChainLength(0);
            setIsFocusing(false);
            Alert.alert("主链已清空", "所有节点记录已重置，下次从 #1 重新开始");
          },
        },
        {
          text: "永久允许",
          style: "default",
          onPress: () => {
            setViolations((prev) => [...prev, behavior]);
            Alert.alert(
              "行为已允许",
              `"${behavior}" 已被永久允许，后续不再视为违规`
            );
          },
        },
      ]
    );
  };

  const handleAbandonFocus = () => {
    const sunkCost = currentChainLength;

    Alert.alert(
      "放弃专注",
      `确定要放弃当前专注吗？\n\n这将损失：\n• ${sunkCost} 个节点的沉没成本\n• 未来约束力的预期价值\n• 整个任务链的连续性`,
      [
        {
          text: "继续专注",
          style: "cancel",
        },
        {
          text: "确认放弃",
          style: "destructive",
          onPress: () => {
            setCurrentChainLength(0);
            setIsFocusing(false);
            setFocusTime(0);
            setViolations([]);
          },
        },
      ]
    );
  };

  const getTimeColor = () => {
    if (!isFocusing) return Colors.gray500;
    if (focusTime < targetTime * 0.3) return Colors.warning;
    if (focusTime < targetTime * 0.7) return Colors.primary;
    return Colors.success;
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 专注状态卡片 */}
        <Card style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusTitle}>神圣座位</Text>
            <Badge
              text={isFocusing ? "专注中" : "待开始"}
              variant={isFocusing ? "success" : "secondary"}
            />
          </View>

          {/* 时间显示 */}
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: getTimeColor() }]}>
              {formatTime(focusTime)}
            </Text>
            <Text style={styles.timeLabel}>/ {formatTime(targetTime)}</Text>
          </View>

          {/* 进度条 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getProgress()}%`,
                    backgroundColor: getTimeColor(),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgress())}%
            </Text>
          </View>

          {/* 链信息 */}
          <View style={styles.chainInfo}>
            <View style={styles.chainStat}>
              <Text style={styles.chainValue}>#{currentChainLength}</Text>
              <Text style={styles.chainLabel}>当前链长</Text>
            </View>
            <View style={styles.chainStat}>
              <Text style={styles.chainValue}>{violations.length}</Text>
              <Text style={styles.chainLabel}>违规次数</Text>
            </View>
          </View>
        </Card>

        {/* 控制按钮 */}
        <Card style={styles.controlsCard}>
          <Text style={styles.sectionTitle}>专注控制</Text>

          {!isFocusing ? (
            <View style={styles.controlButtons}>
              <Button
                title="开始专注"
                onPress={handleStartFocus}
                variant="primary"
                size="lg"
                style={styles.startButton}
              />
              <Button
                title="设置时长"
                onPress={() => {
                  Alert.alert("设置专注时长", "选择专注时长：", [
                    { text: "30分钟", onPress: () => setTargetTime(30 * 60) },
                    { text: "60分钟", onPress: () => setTargetTime(60 * 60) },
                    { text: "90分钟", onPress: () => setTargetTime(90 * 60) },
                    { text: "取消", style: "cancel" },
                  ]);
                }}
                variant="outline"
                style={styles.settingsButton}
              />
            </View>
          ) : (
            <View style={styles.controlButtons}>
              <Button
                title="暂停"
                onPress={handlePauseFocus}
                variant="warning"
                style={styles.pauseButton}
              />
              <Button
                title="完成"
                onPress={handleCompleteFocus}
                variant="success"
                style={styles.completeButton}
              />
              <Button
                title="放弃"
                onPress={handleAbandonFocus}
                variant="danger"
                style={styles.abandonButton}
              />
            </View>
          )}
        </Card>

        {/* 违规管理 */}
        <Card style={styles.violationCard}>
          <View style={styles.violationHeader}>
            <Text style={styles.sectionTitle}>违规管理</Text>
            <Button
              title="报告违规"
              onPress={handleReportViolation}
              variant="outline"
              size="sm"
            />
          </View>

          {violations.length > 0 ? (
            <View style={styles.violationList}>
              {violations.map((violation, index) => (
                <View key={index} style={styles.violationItem}>
                  <Ionicons name="warning" size={16} color={Colors.warning} />
                  <Text style={styles.violationText}>{violation}</Text>
                  <Text style={styles.violationTime}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noViolations}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors.success}
              />
              <Text style={styles.noViolationsText}>暂无违规行为</Text>
            </View>
          )}
        </Card>

        {/* 神圣座位原理说明 */}
        <Card style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>神圣座位原理</Text>
          <View style={styles.explanationContent}>
            <View style={styles.explanationItem}>
              <Ionicons name="link" size={20} color={Colors.primary} />
              <Text style={styles.explanationText}>
                非线性价值压缩：整个任务链的沉没成本被压缩到当下
              </Text>
            </View>
            <View style={styles.explanationItem}>
              <Ionicons name="scale" size={20} color={Colors.secondary} />
              <Text style={styles.explanationText}>
                下必为例：一次违规要么清空主链，要么永久允许该行为
              </Text>
            </View>
            <View style={styles.explanationItem}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={Colors.success}
              />
              <Text style={styles.explanationText}>
                沉没成本保护：放弃将损失所有已积累的节点价值
              </Text>
            </View>
          </View>
        </Card>

        {/* 风险提示 */}
        {currentChainLength > 5 && (
          <Card style={styles.riskCard}>
            <View style={styles.riskHeader}>
              <Ionicons name="warning" size={20} color={Colors.warning} />
              <Text style={styles.riskTitle}>高风险提示</Text>
            </View>
            <Text style={styles.riskText}>
              当前链长度已达到 #{currentChainLength}，放弃将损失大量沉没成本。
              建议坚持完成当前专注，避免破窗效应。
            </Text>
          </Card>
        )}

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
  focusCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    alignItems: "center",
  },
  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.lg,
  },
  focusTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  timeContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  timeText: {
    fontSize: FontSizes["4xl"],
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  timeLabel: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  progressContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  progressText: {
    textAlign: "center",
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chainInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  chainStat: {
    alignItems: "center",
  },
  chainValue: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  chainLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  controlsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  controlButtons: {
    gap: Spacing.md,
  },
  startButton: {
    marginBottom: Spacing.sm,
  },
  settingsButton: {
    marginTop: Spacing.sm,
  },
  pauseButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1,
  },
  abandonButton: {
    flex: 1,
  },
  violationCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  violationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  violationList: {
    gap: Spacing.sm,
  },
  violationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  violationText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.warning,
  },
  violationTime: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  noViolations: {
    alignItems: "center",
    padding: Spacing.lg,
  },
  noViolationsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  explanationCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  explanationContent: {
    gap: Spacing.md,
  },
  explanationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  explanationText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  riskCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.warningLight,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  riskTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.warning,
  },
  riskText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: Spacing["2xl"],
  },
});
