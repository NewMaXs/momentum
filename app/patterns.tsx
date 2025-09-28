import {
  BorderRadius,
  Button,
  Card,
  Colors,
  FontSizes,
  Spacing,
} from "@/components/DesignSystem";
import {
  Pattern,
  PatternTemplate,
  PatternTemplateLibrary,
  PatternTree,
  SteadyStateAnalysis,
} from "@/components/RSIPComponents";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PatternsScreen() {
  const [patterns, setPatterns] = useState<Pattern[]>([
    {
      id: "pattern-1",
      title: "回家立即洗澡",
      description: "进家门后15分钟内必须开始洗澡",
      triggerRule: "地理位置检测到回家",
      actionRule: "进入浴室开始洗澡流程",
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 2,
      isActive: true,
      createdAt: new Date("2024-01-10"),
      lastSuccessAt: new Date(),
      successCount: 15,
    },
    {
      id: "pattern-2",
      title: "不带手机进卧室",
      description: "晚上睡觉前将手机放在客厅充电",
      triggerRule: "晚上22:00后",
      actionRule: "将手机放置在客厅指定位置",
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 1,
      isActive: true,
      createdAt: new Date("2024-01-12"),
      lastSuccessAt: new Date(),
      successCount: 8,
    },
    {
      id: "pattern-3",
      title: "起床后30分钟不用手机",
      description: "起床后前30分钟只能做正事，不能刷手机",
      triggerRule: "早上起床后",
      actionRule: "将手机放在客厅，进行洗漱、整理、早餐等活动",
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 0,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      lastSuccessAt: new Date(),
      successCount: 5,
    },
  ]);

  const [templates] = useState<PatternTemplate[]>([
    {
      id: "template-1",
      title: "回家立即洗澡",
      description: "进家门后15分钟内必须开始洗澡",
      triggerRule: "地理位置检测到回家",
      actionRule: "进入浴室开始洗澡流程",
      category: "生活习惯",
    },
    {
      id: "template-2",
      title: "不带手机进卧室",
      description: "晚上睡觉前将手机放在客厅充电",
      triggerRule: "晚上22:00后",
      actionRule: "将手机放置在客厅指定位置",
      category: "数字戒断",
    },
    {
      id: "template-3",
      title: "起床后30分钟不用手机",
      description: "起床后前30分钟只能做正事，不能刷手机",
      triggerRule: "早上起床后",
      actionRule: "将手机放在客厅，进行洗漱、整理、早餐等活动",
      category: "数字戒断",
    },
    {
      id: "template-4",
      title: "饭后立即洗碗",
      description: "吃完饭后立即洗碗，不拖延",
      triggerRule: "用餐结束后",
      actionRule: "立即收拾餐具并清洗",
      category: "生活习惯",
    },
    {
      id: "template-5",
      title: "睡前阅读30分钟",
      description: "每天晚上睡前阅读30分钟纸质书籍",
      triggerRule: "晚上21:30后",
      actionRule: "拿起纸质书籍阅读30分钟",
      category: "学习成长",
    },
    {
      id: "template-6",
      title: "运动前准备",
      description: "运动前准备好运动装备和水",
      triggerRule: "计划运动前30分钟",
      actionRule: "准备运动装备、水杯等必需品",
      category: "健康管理",
    },
  ]);

  const [metrics] = useState({
    sleepScore: 75,
    energyScore: 80,
    phoneUsage: 45,
    taskProgress: 60,
    moodScore: 70,
  });

  const [showAddPattern, setShowAddPattern] = useState(false);
  const [newPattern, setNewPattern] = useState({
    title: "",
    description: "",
    triggerRule: "",
    actionRule: "",
  });

  const handleAddPattern = (parentId?: string) => {
    if (parentId) {
      // 添加子定式
      Alert.alert("添加子定式", "选择添加方式：", [
        {
          text: "从模板选择",
          onPress: () => setShowAddPattern(true),
        },
        {
          text: "自定义创建",
          onPress: () => setShowAddPattern(true),
        },
        { text: "取消", style: "cancel" },
      ]);
    } else {
      setShowAddPattern(true);
    }
  };

  const handleRemovePattern = (patternId: string) => {
    setPatterns((prev) => {
      const removePatternAndChildren = (
        patterns: Pattern[],
        id: string
      ): Pattern[] => {
        return patterns.filter((pattern) => {
          if (pattern.id === id || pattern.parentId === id) {
            return false;
          }
          return true;
        });
      };
      return removePatternAndChildren(prev, patternId);
    });
  };

  const handleReinforcePattern = (patternId: string) => {
    setPatterns((prev) =>
      prev.map((pattern) =>
        pattern.id === patternId
          ? { ...pattern, reinforcement: pattern.reinforcement + 1 }
          : pattern
      )
    );
  };

  const handleTogglePattern = (patternId: string) => {
    setPatterns((prev) =>
      prev.map((pattern) =>
        pattern.id === patternId
          ? { ...pattern, isActive: !pattern.isActive }
          : pattern
      )
    );
  };

  const handleSelectTemplate = (template: PatternTemplate) => {
    const newPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      title: template.title,
      description: template.description,
      triggerRule: template.triggerRule,
      actionRule: template.actionRule,
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 0,
      isActive: true,
      createdAt: new Date(),
      successCount: 0,
    };

    setPatterns((prev) => [...prev, newPattern]);
    setShowAddPattern(false);

    Alert.alert("定式已添加", `"${template.title}" 已添加到你的定式树中`);
  };

  const handleCreateCustomPattern = () => {
    if (
      !newPattern.title ||
      !newPattern.description ||
      !newPattern.triggerRule ||
      !newPattern.actionRule
    ) {
      Alert.alert("信息不完整", "请填写所有必要信息");
      return;
    }

    const customPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      title: newPattern.title,
      description: newPattern.description,
      triggerRule: newPattern.triggerRule,
      actionRule: newPattern.actionRule,
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 0,
      isActive: true,
      createdAt: new Date(),
      successCount: 0,
    };

    setPatterns((prev) => [...prev, customPattern]);
    setShowAddPattern(false);
    setNewPattern({
      title: "",
      description: "",
      triggerRule: "",
      actionRule: "",
    });

    Alert.alert("定式已创建", `"${customPattern.title}" 已添加到你的定式树中`);
  };

  const getActivePatternsCount = () => {
    return patterns.filter((p) => p.isActive).length;
  };

  const getReinforcedPatternsCount = () => {
    return patterns.filter((p) => p.reinforcement > 0).length;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 定式概览 */}
      <Card style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>定式树概览</Text>
        <View style={styles.overviewStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{patterns.length}</Text>
            <Text style={styles.statLabel}>总定式</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getActivePatternsCount()}</Text>
            <Text style={styles.statLabel}>活跃定式</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getReinforcedPatternsCount()}</Text>
            <Text style={styles.statLabel}>强化定式</Text>
          </View>
        </View>
      </Card>

      {/* 定式树 */}
      <PatternTree
        patterns={patterns}
        onAddPattern={handleAddPattern}
        onRemovePattern={handleRemovePattern}
        onReinforcePattern={handleReinforcePattern}
        onTogglePattern={handleTogglePattern}
      />

      {/* 模板库 */}
      <PatternTemplateLibrary
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* 稳态分析 */}
      <SteadyStateAnalysis patterns={patterns} metrics={metrics} />

      {/* 添加定式弹窗 */}
      {showAddPattern && (
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>添加新定式</Text>
              <TouchableOpacity onPress={() => setShowAddPattern(false)}>
                <Ionicons name="close" size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>定式名称</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPattern.title}
                  onChangeText={(text) =>
                    setNewPattern((prev) => ({ ...prev, title: text }))
                  }
                  placeholder="例如：回家立即洗澡"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>描述</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newPattern.description}
                  onChangeText={(text) =>
                    setNewPattern((prev) => ({ ...prev, description: text }))
                  }
                  placeholder="详细描述这个定式的目的和意义"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>触发条件</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newPattern.triggerRule}
                  onChangeText={(text) =>
                    setNewPattern((prev) => ({ ...prev, triggerRule: text }))
                  }
                  placeholder="描述什么情况下触发这个定式"
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>执行动作</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newPattern.actionRule}
                  onChangeText={(text) =>
                    setNewPattern((prev) => ({ ...prev, actionRule: text }))
                  }
                  placeholder="描述具体要执行的动作"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="取消"
                onPress={() => setShowAddPattern(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="创建定式"
                onPress={handleCreateCustomPattern}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  overviewCard: {
    margin: Spacing.lg,
  },
  overviewTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    width: "90%",
    maxHeight: "80%",
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  modalContent: {
    maxHeight: 400,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: Spacing["2xl"],
  },
});
