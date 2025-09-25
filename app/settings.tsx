import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Card, Colors, FontSizes, Spacing } from '../components/DesignSystem';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    autoBackup: false,
    darkMode: false,
    locationTracking: true,
    nfcEnabled: false,
    bluetoothEnabled: false,
  });

  const [focusSettings, setFocusSettings] = useState({
    defaultDuration: 60, // 分钟
    breakDuration: 15, // 分钟
    autoStart: false,
    strictMode: true,
  });

  const [patternSettings, setPatternSettings] = useState({
    maxDailyPatterns: 1,
    autoReinforcement: false,
    reminderEnabled: true,
    conflictDetection: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFocusSettingChange = (key: string, value: number | boolean) => {
    setFocusSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePatternSettingChange = (key: string, value: number | boolean) => {
    setPatternSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    Alert.alert(
      '导出数据',
      '确定要导出所有数据吗？这将包括你的链记录、定式树和判例库。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '导出',
          onPress: () => {
            // 这里应该实现数据导出逻辑
            Alert.alert('导出成功', '数据已导出到下载文件夹');
          },
        },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      '导入数据',
      '确定要导入数据吗？这将覆盖当前的所有数据。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '导入',
          style: 'destructive',
          onPress: () => {
            // 这里应该实现数据导入逻辑
            Alert.alert('导入成功', '数据已成功导入');
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      '重置数据',
      '确定要重置所有数据吗？这将删除所有链记录、定式树和判例库，此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '重置',
          style: 'destructive',
          onPress: () => {
            Alert.alert('数据已重置', '所有数据已清空');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean | number;
    onValueChange: (value: boolean | number) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={Colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingControl}>
        {type === 'switch' ? (
          <Switch
            value={value as boolean}
            onValueChange={onValueChange}
            trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
            thumbColor={value ? Colors.primary : Colors.gray400}
          />
        ) : (
          <TouchableOpacity onPress={() => onValueChange(!value)}>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 应用设置 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>应用设置</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="推送通知"
          subtitle="接收专注提醒和定式完成通知"
          value={settings.notifications}
          onValueChange={(value) => handleSettingChange('notifications', value as boolean)}
        />
        
        <SettingItem
          icon="volume-high-outline"
          title="声音提醒"
          subtitle="专注开始和结束时播放提示音"
          value={settings.soundEnabled}
          onValueChange={(value) => handleSettingChange('soundEnabled', value as boolean)}
        />
        
        <SettingItem
          icon="phone-portrait-outline"
          title="震动反馈"
          subtitle="操作时提供触觉反馈"
          value={settings.vibrationEnabled}
          onValueChange={(value) => handleSettingChange('vibrationEnabled', value as boolean)}
        />
        
        <SettingItem
          icon="moon-outline"
          title="深色模式"
          subtitle="使用深色主题"
          value={settings.darkMode}
          onValueChange={(value) => handleSettingChange('darkMode', value as boolean)}
        />
      </Card>

      {/* 专注设置 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>专注设置</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIcon}>
              <Ionicons name="timer-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>默认专注时长</Text>
              <Text style={styles.settingSubtitle}>主链专注的默认时长</Text>
            </View>
          </View>
          <View style={styles.settingControl}>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => {
                Alert.alert(
                  '选择专注时长',
                  '选择默认专注时长：',
                  [
                    { text: '30分钟', onPress: () => handleFocusSettingChange('defaultDuration', 30) },
                    { text: '60分钟', onPress: () => handleFocusSettingChange('defaultDuration', 60) },
                    { text: '90分钟', onPress: () => handleFocusSettingChange('defaultDuration', 90) },
                    { text: '取消', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.durationText}>{focusSettings.defaultDuration}分钟</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIcon}>
              <Ionicons name="pause-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>休息时长</Text>
              <Text style={styles.settingSubtitle}>专注间隔的休息时间</Text>
            </View>
          </View>
          <View style={styles.settingControl}>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => {
                Alert.alert(
                  '选择休息时长',
                  '选择休息时长：',
                  [
                    { text: '5分钟', onPress: () => handleFocusSettingChange('breakDuration', 5) },
                    { text: '15分钟', onPress: () => handleFocusSettingChange('breakDuration', 15) },
                    { text: '30分钟', onPress: () => handleFocusSettingChange('breakDuration', 30) },
                    { text: '取消', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.durationText}>{focusSettings.breakDuration}分钟</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
        </View>
        
        <SettingItem
          icon="play-outline"
          title="自动开始"
          subtitle="预约时间到达后自动开始专注"
          value={focusSettings.autoStart}
          onValueChange={(value) => handleFocusSettingChange('autoStart', value as boolean)}
        />
        
        <SettingItem
          icon="shield-checkmark-outline"
          title="严格模式"
          subtitle="启用更严格的违规检测"
          value={focusSettings.strictMode}
          onValueChange={(value) => handleFocusSettingChange('strictMode', value as boolean)}
        />
      </Card>

      {/* 定式设置 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>定式设置</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIcon}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>每日最大定式数</Text>
              <Text style={styles.settingSubtitle}>每天最多可添加的定式数量</Text>
            </View>
          </View>
          <View style={styles.settingControl}>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => {
                Alert.alert(
                  '选择每日最大定式数',
                  '选择每天最多可添加的定式数量：',
                  [
                    { text: '1个', onPress: () => handlePatternSettingChange('maxDailyPatterns', 1) },
                    { text: '2个', onPress: () => handlePatternSettingChange('maxDailyPatterns', 2) },
                    { text: '3个', onPress: () => handlePatternSettingChange('maxDailyPatterns', 3) },
                    { text: '取消', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.durationText}>{patternSettings.maxDailyPatterns}个</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
        </View>
        
        <SettingItem
          icon="trending-up-outline"
          title="自动强化"
          subtitle="定式成功后自动提升强化等级"
          value={patternSettings.autoReinforcement}
          onValueChange={(value) => handlePatternSettingChange('autoReinforcement', value as boolean)}
        />
        
        <SettingItem
          icon="alarm-outline"
          title="定式提醒"
          subtitle="提醒执行定式任务"
          value={patternSettings.reminderEnabled}
          onValueChange={(value) => handlePatternSettingChange('reminderEnabled', value as boolean)}
        />
        
        <SettingItem
          icon="warning-outline"
          title="冲突检测"
          subtitle="检测定式之间的冲突"
          value={patternSettings.conflictDetection}
          onValueChange={(value) => handlePatternSettingChange('conflictDetection', value as boolean)}
        />
      </Card>

      {/* 自动化设置 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>自动化设置</Text>
        
        <SettingItem
          icon="location-outline"
          title="位置追踪"
          subtitle="基于地理位置触发定式"
          value={settings.locationTracking}
          onValueChange={(value) => handleSettingChange('locationTracking', value as boolean)}
        />
        
        <SettingItem
          icon="radio-outline"
          title="NFC 支持"
          subtitle="使用 NFC 标签触发专注"
          value={settings.nfcEnabled}
          onValueChange={(value) => handleSettingChange('nfcEnabled', value as boolean)}
        />
        
        <SettingItem
          icon="bluetooth-outline"
          title="蓝牙支持"
          subtitle="使用蓝牙设备触发定式"
          value={settings.bluetoothEnabled}
          onValueChange={(value) => handleSettingChange('bluetoothEnabled', value as boolean)}
        />
        
        <SettingItem
          icon="cloud-upload-outline"
          title="自动备份"
          subtitle="自动备份数据到云端"
          value={settings.autoBackup}
          onValueChange={(value) => handleSettingChange('autoBackup', value as boolean)}
        />
      </Card>

      {/* 数据管理 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>数据管理</Text>
        
        <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
          <View style={styles.actionInfo}>
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>导出数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={handleImportData}>
          <View style={styles.actionInfo}>
            <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>导入数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={handleResetData}>
          <View style={styles.actionInfo}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            <Text style={[styles.actionTitle, { color: Colors.danger }]}>重置数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
      </Card>

      {/* 关于 */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>关于</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>版本</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>构建</Text>
          <Text style={styles.aboutValue}>2024.01.20</Text>
        </View>
        
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionInfo}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>帮助与支持</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionInfo}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>隐私政策</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionInfo}>
            <Ionicons name="star-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>评价应用</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
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
  settingsCard: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  settingControl: {
    marginLeft: Spacing.md,
  },
  durationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  durationText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  aboutLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  aboutValue: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
});
