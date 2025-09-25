import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuxChain, ChainData, MainChain, PrecedentCase, PrecedentManager } from '../components/CTDPComponents';
import { Badge, Card, Colors, FontSizes, ProgressBar, Spacing } from '../components/DesignSystem';
import { Pattern, SteadyStateAnalysis } from '../components/RSIPComponents';

export default function Dashboard() {
  // 模拟数据
  const [mainChain, setMainChain] = useState<ChainData>({
    id: 'main-1',
    type: 'MAIN',
    currentLength: 12,
    bestLength: 25,
    status: 'IDLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [auxChain, setAuxChain] = useState<ChainData>({
    id: 'aux-1',
    type: 'AUX',
    currentLength: 8,
    bestLength: 15,
    status: 'IDLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [precedents, setPrecedents] = useState<PrecedentCase[]>([
    {
      id: 'p1',
      behaviorKey: '中途上厕所',
      allowed: true,
      decidedAt: new Date('2024-01-15'),
    },
    {
      id: 'p2',
      behaviorKey: '回复重要消息',
      allowed: true,
      decidedAt: new Date('2024-01-16'),
    },
    {
      id: 'p3',
      behaviorKey: '刷短视频',
      allowed: false,
      decidedAt: new Date('2024-01-17'),
    },
  ]);

  const [patterns, setPatterns] = useState<Pattern[]>([
    {
      id: 'pattern-1',
      title: '回家立即洗澡',
      description: '进家门后15分钟内必须开始洗澡',
      triggerRule: '地理位置检测到回家',
      actionRule: '进入浴室开始洗澡流程',
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 2,
      isActive: true,
      createdAt: new Date('2024-01-10'),
      lastSuccessAt: new Date(),
      successCount: 15,
    },
    {
      id: 'pattern-2',
      title: '不带手机进卧室',
      description: '晚上睡觉前将手机放在客厅充电',
      triggerRule: '晚上22:00后',
      actionRule: '将手机放置在客厅指定位置',
      level: 0,
      dependencies: [],
      conflicts: [],
      reinforcement: 1,
      isActive: true,
      createdAt: new Date('2024-01-12'),
      lastSuccessAt: new Date(),
      successCount: 8,
    },
  ]);

  const [metrics] = useState({
    sleepScore: 75,
    energyScore: 80,
    phoneUsage: 45,
    taskProgress: 60,
    moodScore: 70,
  });

  const handleMainChainTrigger = () => {
    setMainChain(prev => ({
      ...prev,
      status: 'FOCUSING',
      updatedAt: new Date(),
    }));
  };

  const handleMainChainViolation = (behavior: string) => {
    if (behavior === 'RESET') {
      setMainChain(prev => ({
        ...prev,
        currentLength: 0,
        status: 'IDLE',
        updatedAt: new Date(),
      }));
    }
  };

  const handleAuxSchedule = () => {
    setAuxChain(prev => ({
      ...prev,
      status: 'TRIGGERED',
      updatedAt: new Date(),
    }));
  };

  const handleAuxTrigger = () => {
    setAuxChain(prev => ({
      ...prev,
      status: 'IDLE',
      updatedAt: new Date(),
    }));
    // 同时触发主链
    handleMainChainTrigger();
  };

  const handleAuxMiss = () => {
    setAuxChain(prev => ({
      ...prev,
      currentLength: 0,
      status: 'IDLE',
      updatedAt: new Date(),
    }));
  };

  const getTodayProgress = () => {
    const completedPatterns = patterns.filter(p => p.isActive && p.lastSuccessAt && 
      p.lastSuccessAt.toDateString() === new Date().toDateString()).length;
    return Math.round((completedPatterns / patterns.filter(p => p.isActive).length) * 100);
  };

  const getChainHealth = () => {
    const mainHealth = (mainChain.currentLength / Math.max(mainChain.bestLength, 1)) * 100;
    const auxHealth = (auxChain.currentLength / Math.max(auxChain.bestLength, 1)) * 100;
    return Math.round((mainHealth + auxHealth) / 2);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 欢迎区域 */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>今日自控状态</Text>
        <Text style={styles.welcomeSubtitle}>
          {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
      </View>

      {/* 关键指标卡片 */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <View style={styles.metricContent}>
            <Ionicons name="trending-up" size={24} color={Colors.primary} />
            <Text style={styles.metricValue}>{getTodayProgress()}%</Text>
            <Text style={styles.metricLabel}>今日完成度</Text>
          </View>
        </Card>
        
        <Card style={styles.metricCard}>
          <View style={styles.metricContent}>
            <Ionicons name="link" size={24} color={Colors.secondary} />
            <Text style={styles.metricValue}>{getChainHealth()}%</Text>
            <Text style={styles.metricLabel}>链健康度</Text>
          </View>
        </Card>
      </View>

      {/* 快速操作 */}
      <Card style={styles.quickActionsCard}>
        <Text style={styles.sectionTitle}>快速操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="timer-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>预约专注</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.secondary} />
            <Text style={styles.quickActionText}>添加定式</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="analytics-outline" size={24} color={Colors.warning} />
            <Text style={styles.quickActionText}>查看分析</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="settings-outline" size={24} color={Colors.gray500} />
            <Text style={styles.quickActionText}>设置</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* CTDP 主链 */}
      <MainChain
        chain={mainChain}
        onTrigger={handleMainChainTrigger}
        onViolation={handleMainChainViolation}
      />

      {/* CTDP 辅助链 */}
      <AuxChain
        chain={auxChain}
        onSchedule={handleAuxSchedule}
        onTrigger={handleAuxTrigger}
        onMiss={handleAuxMiss}
      />

      {/* 判例管理 */}
      <PrecedentManager
        precedents={precedents}
        onAddPrecedent={(behavior, allowed) => {
          const newPrecedent: PrecedentCase = {
            id: `p${precedents.length + 1}`,
            behaviorKey: behavior,
            allowed,
            decidedAt: new Date(),
          };
          setPrecedents(prev => [...prev, newPrecedent]);
        }}
      />

      {/* 今日定式进度 */}
      <Card style={styles.patternsCard}>
        <Text style={styles.sectionTitle}>今日定式进度</Text>
        <View style={styles.patternsList}>
          {patterns.filter(p => p.isActive).map((pattern) => (
            <View key={pattern.id} style={styles.patternItem}>
              <View style={styles.patternInfo}>
                <Text style={styles.patternTitle}>{pattern.title}</Text>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
              </View>
              <View style={styles.patternStatus}>
                {pattern.lastSuccessAt && 
                 pattern.lastSuccessAt.toDateString() === new Date().toDateString() ? (
                  <Badge text="已完成" variant="success" size="sm" />
                ) : (
                  <Badge text="待完成" variant="secondary" size="sm" />
                )}
              </View>
            </View>
          ))}
        </View>
        <ProgressBar 
          progress={getTodayProgress()}
          style={styles.patternsProgress}
        />
      </Card>

      {/* 稳态分析 */}
      <SteadyStateAnalysis patterns={patterns} metrics={metrics} />

      {/* 风险提示 */}
      <Card style={styles.riskCard}>
        <View style={styles.riskHeader}>
          <Ionicons name="warning" size={20} color={Colors.warning} />
          <Text style={styles.riskTitle}>风险提示</Text>
        </View>
        <View style={styles.riskList}>
          <View style={styles.riskItem}>
            <Text style={styles.riskText}>• 主链已连续12次成功，注意避免破窗效应</Text>
          </View>
          <View style={styles.riskItem}>
            <Text style={styles.riskText}>• 手机使用时间较昨日增加15%</Text>
          </View>
          <View style={styles.riskItem}>
            <Text style={styles.riskText}>• 建议添加新的定式来强化稳态</Text>
          </View>
        </View>
      </Card>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  welcomeSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  welcomeTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.md,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  quickActionsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  patternsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  patternsList: {
    marginBottom: Spacing.md,
  },
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  patternInfo: {
    flex: 1,
  },
  patternTitle: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  patternDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  patternStatus: {
    marginLeft: Spacing.md,
  },
  patternsProgress: {
    marginTop: Spacing.sm,
  },
  riskCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.warningLight,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  riskTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.warning,
  },
  riskList: {
    gap: Spacing.sm,
  },
  riskItem: {
    paddingLeft: Spacing.sm,
  },
  riskText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
});
