import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Badge,
  BorderRadius,
  Button,
  Card,
  Colors,
  FontSizes,
  Shadows,
  Spacing,
} from "./DesignSystem";

// 定式类型定义
export interface Pattern {
  id: string;
  title: string;
  description: string;
  triggerRule: string;
  actionRule: string;
  level: number;
  parentId?: string;
  dependencies: string[];
  conflicts: string[];
  reinforcement: number; // 强化等级 +0, +1, +2...
  isActive: boolean;
  createdAt: Date;
  lastSuccessAt?: Date;
  successCount: number;
}

// 定式树节点组件
interface PatternTreeNodeProps {
  pattern: Pattern;
  children: Pattern[];
  onAddChild: (parentId: string) => void;
  onRemove: (patternId: string) => void;
  onReinforce: (patternId: string) => void;
  onToggle: (patternId: string) => void;
  level: number;
}

export const PatternTreeNode: React.FC<PatternTreeNodeProps> = ({
  pattern,
  children,
  onAddChild,
  onRemove,
  onReinforce,
  onToggle,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // 默认展开前两级

  const handleRemove = () => {
    Alert.alert(
      "删除定式",
      `确定要删除定式"${pattern.title}"及其所有子定式吗？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => onRemove(pattern.id),
        },
      ]
    );
  };

  const getReinforcementColor = () => {
    if (pattern.reinforcement === 0) return Colors.gray400;
    if (pattern.reinforcement <= 2) return Colors.success;
    if (pattern.reinforcement <= 5) return Colors.primary;
    return Colors.warning;
  };

  return (
    <View style={[styles.treeNode, { marginLeft: level * Spacing.lg }]}>
      <View style={styles.nodeContent}>
        <TouchableOpacity
          style={styles.nodeHeader}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.nodeInfo}>
            <View style={styles.nodeTitleRow}>
              <Text style={styles.nodeTitle}>{pattern.title}</Text>
              {pattern.reinforcement > 0 && (
                <Badge
                  text={`+${pattern.reinforcement}`}
                  variant="success"
                  size="sm"
                />
              )}
            </View>
            <Text style={styles.nodeDescription}>{pattern.description}</Text>
            <View style={styles.nodeStats}>
              <Text style={styles.nodeStat}>
                成功 {pattern.successCount} 次
              </Text>
              {pattern.lastSuccessAt && (
                <Text style={styles.nodeStat}>
                  最近: {pattern.lastSuccessAt.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.nodeActions}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.gray500}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.nodeDetails}>
            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>触发条件</Text>
              <Text style={styles.ruleText}>{pattern.triggerRule}</Text>
            </View>

            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>执行动作</Text>
              <Text style={styles.ruleText}>{pattern.actionRule}</Text>
            </View>

            <View style={styles.nodeControls}>
              <Button
                title="添加子定式"
                onPress={() => onAddChild(pattern.id)}
                variant="outline"
                size="sm"
                style={styles.controlButton}
              />

              <Button
                title="强化 +1"
                onPress={() => onReinforce(pattern.id)}
                variant="secondary"
                size="sm"
                style={styles.controlButton}
              />

              <Button
                title={pattern.isActive ? "停用" : "启用"}
                onPress={() => onToggle(pattern.id)}
                variant={pattern.isActive ? "danger" : "primary"}
                size="sm"
                style={styles.controlButton}
              />

              <Button
                title="删除"
                onPress={handleRemove}
                variant="danger"
                size="sm"
                style={styles.controlButton}
              />
            </View>
          </View>
        )}
      </View>

      {isExpanded && children.length > 0 && (
        <View style={styles.childrenContainer}>
          {children.map((child) => (
            <PatternTreeNode
              key={child.id}
              pattern={child}
              children={[]} // 这里应该递归获取子节点
              onAddChild={onAddChild}
              onRemove={onRemove}
              onReinforce={onReinforce}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// 定式树组件
interface PatternTreeProps {
  patterns: Pattern[];
  onAddPattern: (parentId?: string) => void;
  onRemovePattern: (patternId: string) => void;
  onReinforcePattern: (patternId: string) => void;
  onTogglePattern: (patternId: string) => void;
}

export const PatternTree: React.FC<PatternTreeProps> = ({
  patterns,
  onAddPattern,
  onRemovePattern,
  onReinforcePattern,
  onTogglePattern,
}) => {
  // 构建树形结构
  const buildTree = (
    patterns: Pattern[]
  ): { root: Pattern[]; children: Record<string, Pattern[]> } => {
    const root: Pattern[] = [];
    const children: Record<string, Pattern[]> = {};

    patterns.forEach((pattern) => {
      if (!pattern.parentId) {
        root.push(pattern);
      } else {
        if (!children[pattern.parentId]) {
          children[pattern.parentId] = [];
        }
        children[pattern.parentId].push(pattern);
      }
    });

    return { root, children };
  };

  const { root, children } = buildTree(patterns);

  return (
    <Card style={styles.treeCard}>
      <View style={styles.treeHeader}>
        <Text style={styles.treeTitle}>定式树 (RSIP)</Text>
        <Text style={styles.treeSubtitle}>
          递归稳态迭代协议 - 共 {patterns.length} 个定式
        </Text>
      </View>

      <ScrollView
        style={styles.treeContainer}
        showsVerticalScrollIndicator={false}
      >
        {root.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="git-network-outline"
              size={48}
              color={Colors.gray400}
            />
            <Text style={styles.emptyTitle}>还没有定式</Text>
            <Text style={styles.emptyDescription}>
              添加你的第一个定式，开始构建你的自控系统
            </Text>
            <Button
              title="添加根定式"
              onPress={() => onAddPattern()}
              variant="primary"
              style={styles.addRootButton}
            />
          </View>
        ) : (
          <View style={styles.treeContent}>
            {root.map((pattern) => (
              <PatternTreeNode
                key={pattern.id}
                pattern={pattern}
                children={children[pattern.id] || []}
                onAddChild={onAddPattern}
                onRemove={onRemovePattern}
                onReinforce={onReinforcePattern}
                onToggle={onTogglePattern}
                level={0}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {root.length > 0 && (
        <View style={styles.treeFooter}>
          <Button
            title="添加新定式"
            onPress={() => onAddPattern()}
            variant="outline"
            style={styles.addButton}
          />
        </View>
      )}
    </Card>
  );
};

// 定式模板组件
export interface PatternTemplate {
  id: string;
  title: string;
  description: string;
  triggerRule: string;
  actionRule: string;
  category: string;
}

interface PatternTemplateLibraryProps {
  templates: PatternTemplate[];
  onSelectTemplate: (template: PatternTemplate) => void;
}

export const PatternTemplateLibrary: React.FC<PatternTemplateLibraryProps> = ({
  templates,
  onSelectTemplate,
}) => {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <Card style={styles.templateCard}>
      <Text style={styles.templateTitle}>定式模板库</Text>
      <Text style={styles.templateSubtitle}>选择预设模板快速创建定式</Text>

      <ScrollView
        style={styles.templateContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {templates
              .filter((t) => t.category === category)
              .map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateItem}
                  onPress={() => onSelectTemplate(template)}
                >
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateItemTitle}>
                      {template.title}
                    </Text>
                    <Text style={styles.templateItemDescription}>
                      {template.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.gray400}
                  />
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </Card>
  );
};

// 稳态分析组件
interface SteadyStateAnalysisProps {
  patterns: Pattern[];
  metrics: {
    sleepScore: number;
    energyScore: number;
    phoneUsage: number;
    taskProgress: number;
    moodScore: number;
  };
}

export const SteadyStateAnalysis: React.FC<SteadyStateAnalysisProps> = ({
  patterns,
  metrics,
}) => {
  const activePatterns = patterns.filter((p) => p.isActive);
  const reinforcedPatterns = patterns.filter((p) => p.reinforcement > 0);

  return (
    <Card style={styles.analysisCard}>
      <Text style={styles.analysisTitle}>稳态分析</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{activePatterns.length}</Text>
          <Text style={styles.metricLabel}>活跃定式</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{reinforcedPatterns.length}</Text>
          <Text style={styles.metricLabel}>强化定式</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {Math.round(
              (activePatterns.length / Math.max(patterns.length, 1)) * 100
            )}
            %
          </Text>
          <Text style={styles.metricLabel}>激活率</Text>
        </View>
      </View>

      <View style={styles.stateRadar}>
        <Text style={styles.radarTitle}>稳态雷达</Text>
        <View style={styles.radarMetrics}>
          <View style={styles.radarItem}>
            <Text style={styles.radarLabel}>睡眠</Text>
            <View style={styles.radarBar}>
              <View
                style={[styles.radarFill, { width: `${metrics.sleepScore}%` }]}
              />
            </View>
          </View>
          <View style={styles.radarItem}>
            <Text style={styles.radarLabel}>精力</Text>
            <View style={styles.radarBar}>
              <View
                style={[styles.radarFill, { width: `${metrics.energyScore}%` }]}
              />
            </View>
          </View>
          <View style={styles.radarItem}>
            <Text style={styles.radarLabel}>手机使用</Text>
            <View style={styles.radarBar}>
              <View
                style={[
                  styles.radarFill,
                  { width: `${100 - metrics.phoneUsage}%` },
                ]}
              />
            </View>
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
          </View>
          <View style={styles.radarItem}>
            <Text style={styles.radarLabel}>情绪</Text>
            <View style={styles.radarBar}>
              <View
                style={[styles.radarFill, { width: `${metrics.moodScore}%` }]}
              />
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  treeCard: {
    flex: 1,
  },
  treeHeader: {
    marginBottom: Spacing.lg,
  },
  treeTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  treeSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  treeContainer: {
    flex: 1,
  },
  treeContent: {
    paddingBottom: Spacing.lg,
  },
  treeNode: {
    marginBottom: Spacing.sm,
  },
  nodeContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  nodeHeader: {
    flexDirection: "row",
    padding: Spacing.md,
    alignItems: "flex-start",
  },
  nodeInfo: {
    flex: 1,
  },
  nodeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  nodeTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  nodeDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  nodeStats: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  nodeStat: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  nodeActions: {
    paddingLeft: Spacing.sm,
  },
  nodeDetails: {
    padding: Spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  ruleSection: {
    marginBottom: Spacing.md,
  },
  ruleTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  ruleText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  nodeControls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  controlButton: {
    flex: 1,
    minWidth: 80,
  },
  childrenContainer: {
    marginTop: Spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  addRootButton: {
    marginTop: Spacing.md,
  },
  treeFooter: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
  templateCard: {
    marginBottom: Spacing.lg,
  },
  templateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  templateSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  templateContainer: {
    maxHeight: 300,
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  templateItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  templateInfo: {
    flex: 1,
  },
  templateItemTitle: {
    fontSize: FontSizes.base,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  templateItemDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  analysisCard: {
    marginBottom: Spacing.lg,
  },
  analysisTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  stateRadar: {
    marginTop: Spacing.md,
  },
  radarTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  radarMetrics: {
    gap: Spacing.sm,
  },
  radarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  radarLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    width: 60,
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
});
