import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Badge, BorderRadius, Button, Card, Colors, FontSizes, ProgressBar, Spacing } from './DesignSystem';

// 链状态类型
export type ChainType = 'MAIN' | 'AUX';
export type ChainStatus = 'IDLE' | 'TRIGGERED' | 'FOCUSING' | 'SUCCESS' | 'FAILED';

// 链数据接口
export interface ChainData {
  id: string;
  type: ChainType;
  currentLength: number;
  bestLength: number;
  status: ChainStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 主链组件
interface MainChainProps {
  chain: ChainData;
  onTrigger: () => void;
  onViolation: (behavior: string) => void;
}

export const MainChain: React.FC<MainChainProps> = ({
  chain,
  onTrigger,
  onViolation,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleTrigger = () => {
    setIsActive(true);
    onTrigger();
  };

  const handleViolation = () => {
    Alert.alert(
      '违规判定',
      '检测到可能违反"最好状态"的行为，请选择处理方式：',
      [
        {
          text: '清空主链',
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            onViolation('RESET');
          },
        },
        {
          text: '永久允许',
          style: 'default',
          onPress: () => {
            onViolation('ALLOW');
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (chain.status) {
      case 'SUCCESS': return Colors.success;
      case 'FAILED': return Colors.danger;
      case 'FOCUSING': return Colors.primary;
      default: return Colors.gray400;
    }
  };

  const getStatusText = () => {
    switch (chain.status) {
      case 'SUCCESS': return '已完成';
      case 'FAILED': return '已失败';
      case 'FOCUSING': return '专注中';
      default: return '待触发';
    }
  };

  return (
    <Card style={styles.chainCard}>
      <View style={styles.chainHeader}>
        <View style={styles.chainInfo}>
          <Text style={styles.chainTitle}>主链 (专注链)</Text>
          <Text style={styles.chainSubtitle}>神圣座位原理</Text>
        </View>
        <Badge 
          text={getStatusText()} 
          variant={chain.status === 'SUCCESS' ? 'success' : chain.status === 'FAILED' ? 'danger' : 'primary'}
        />
      </View>

      <View style={styles.chainStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>#{chain.currentLength}</Text>
          <Text style={styles.statLabel}>当前长度</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>#{chain.bestLength}</Text>
          <Text style={styles.statLabel}>最佳记录</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((chain.currentLength / Math.max(chain.bestLength, 1)) * 100)}%
          </Text>
          <Text style={styles.statLabel}>完成度</Text>
        </View>
      </View>

      <ProgressBar 
        progress={(chain.currentLength / Math.max(chain.bestLength, 1)) * 100}
        color={getStatusColor()}
        style={styles.progressBar}
      />

      <View style={styles.chainActions}>
        {chain.status === 'IDLE' && (
          <Button
            title="触发神圣座位"
            onPress={handleTrigger}
            variant="primary"
            style={styles.triggerButton}
          />
        )}
        
        {chain.status === 'FOCUSING' && (
          <View style={styles.focusingActions}>
            <Button
              title="报告违规"
              onPress={handleViolation}
              variant="outline"
              style={styles.violationButton}
            />
            <Button
              title="完成专注"
              onPress={() => {
                setIsActive(false);
                onTrigger(); // 这里应该调用完成专注的逻辑
              }}
              variant="secondary"
              style={styles.completeButton}
            />
          </View>
        )}
      </View>

      {chain.currentLength > 0 && (
        <View style={styles.sunkCostWarning}>
          <Ionicons name="warning" size={16} color={Colors.warning} />
          <Text style={styles.warningText}>
            放弃将损失 {chain.currentLength} 个节点的沉没成本
          </Text>
        </View>
      )}
    </Card>
  );
};

// 辅助链组件
interface AuxChainProps {
  chain: ChainData;
  onSchedule: () => void;
  onTrigger: () => void;
  onMiss: () => void;
}

export const AuxChain: React.FC<AuxChainProps> = ({
  chain,
  onSchedule,
  onTrigger,
  onMiss,
}) => {
  const [countdown, setCountdown] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = () => {
    setIsScheduled(true);
    setCountdown(15 * 60); // 15分钟倒计时
    onSchedule();
    
    // 开始倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsScheduled(false);
          onMiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card style={styles.chainCard}>
      <View style={styles.chainHeader}>
        <View style={styles.chainInfo}>
          <Text style={styles.chainTitle}>辅助链 (预约链)</Text>
          <Text style={styles.chainSubtitle}>线性时延原理</Text>
        </View>
        <Badge 
          text={isScheduled ? '预约中' : '待预约'} 
          variant={isScheduled ? 'warning' : 'secondary'}
        />
      </View>

      {isScheduled && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {formatTime(countdown)}
          </Text>
          <Text style={styles.countdownLabel}>剩余时间</Text>
        </View>
      )}

      <View style={styles.chainActions}>
        {!isScheduled && (
          <Button
            title="预约 15 分钟后开始"
            onPress={handleSchedule}
            variant="primary"
            style={styles.scheduleButton}
          />
        )}
        
        {isScheduled && (
          <View style={styles.scheduledActions}>
            <Button
              title="立即触发主链"
              onPress={() => {
                setIsScheduled(false);
                setCountdown(0);
                onTrigger();
              }}
              variant="secondary"
              style={styles.triggerButton}
            />
            <Button
              title="取消预约"
              onPress={() => {
                setIsScheduled(false);
                setCountdown(0);
                onMiss();
              }}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        )}
      </View>

      <View style={styles.auxExplanation}>
        <Ionicons name="information-circle" size={16} color={Colors.primary} />
        <Text style={styles.explanationText}>
          预约机制降低立即开始的阻力，15分钟后自动触发主链
        </Text>
      </View>
    </Card>
  );
};

// 判例管理组件
export interface PrecedentCase {
  id: string;
  behaviorKey: string;
  allowed: boolean;
  decidedAt: Date;
}

interface PrecedentManagerProps {
  precedents: PrecedentCase[];
  onAddPrecedent: (behavior: string, allowed: boolean) => void;
}

export const PrecedentManager: React.FC<PrecedentManagerProps> = ({
  precedents,
  onAddPrecedent,
}) => {
  return (
    <Card style={styles.precedentCard}>
      <Text style={styles.precedentTitle}>判例库 (下必为例)</Text>
      <Text style={styles.precedentSubtitle}>
        已建立 {precedents.length} 个判例规则
      </Text>
      
      <View style={styles.precedentList}>
        {precedents.map((precedent) => (
          <View key={precedent.id} style={styles.precedentItem}>
            <View style={styles.precedentInfo}>
              <Text style={styles.precedentBehavior}>
                {precedent.behaviorKey}
              </Text>
              <Text style={styles.precedentDate}>
                {precedent.decidedAt.toLocaleDateString()}
              </Text>
            </View>
            <Badge
              text={precedent.allowed ? '允许' : '禁止'}
              variant={precedent.allowed ? 'success' : 'danger'}
              size="sm"
            />
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  chainCard: {
    marginBottom: Spacing.lg,
  },
  chainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chainInfo: {
    flex: 1,
  },
  chainTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  chainSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressBar: {
    marginBottom: Spacing.md,
  },
  chainActions: {
    marginBottom: Spacing.md,
  },
  triggerButton: {
    marginBottom: Spacing.sm,
  },
  focusingActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  violationButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1,
  },
  sunkCostWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  warningText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    flex: 1,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
  },
  countdownText: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  countdownLabel: {
    fontSize: FontSizes.sm,
    color: Colors.primaryDark,
  },
  scheduleButton: {
    marginBottom: Spacing.sm,
  },
  scheduledActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  auxExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  explanationText: {
    fontSize: FontSizes.sm,
    color: Colors.primaryDark,
    flex: 1,
  },
  precedentCard: {
    marginBottom: Spacing.lg,
  },
  precedentTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  precedentSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  precedentList: {
    gap: Spacing.sm,
  },
  precedentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  precedentInfo: {
    flex: 1,
  },
  precedentBehavior: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  precedentDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
