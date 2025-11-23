import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import {
  Dialog,
  List,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

// ==================== 类型定义 ====================

/**
 * 选项配置接口
 */
export interface SelectionOption {
  /** 选项值 */
  value: string;
  /** 选项标签 */
  label: string;
  /** 选项描述（可选） */
  description?: string;
  /** 选项图标（可选） */
  icon?: string;
}

/**
 * SelectionDialog 组件属性
 */
export interface SelectionDialogProps {
  /** 对话框是否可见 */
  visible: boolean;
  /** 对话框关闭回调 */
  onDismiss: () => void;
  /** 对话框标题 */
  title: string;
  /** 选项列表 */
  options: readonly SelectionOption[];
  /** 当前选中的值 */
  selectedValue: string;
  /** 选择回调 */
  onSelect: (value: string) => void;
  /** 选择后是否自动关闭对话框（默认为 true） */
  autoClose?: boolean;
}

// ==================== 常量配置 ====================

/** 动画配置 */
const ANIMATION_CONFIG = {
  /** 弹出动画：弹性张力 */
  SPRING_TENSION: 80,
  /** 弹出动画：摩擦力 */
  SPRING_FRICTION: 10,
  /** 淡入持续时间（毫秒） */
  FADE_IN_DURATION: 200,
  /** 淡出持续时间（毫秒） */
  FADE_OUT_DURATION: 150,
  /** 初始缩放值 */
  INITIAL_SCALE: 0.9,
  /** 最终缩放值 */
  FINAL_SCALE: 1,
  /** 初始透明度 */
  INITIAL_OPACITY: 0,
  /** 最终透明度 */
  FINAL_OPACITY: 1,
} as const;

/** 屏幕宽度 */
const SCREEN_WIDTH = Dimensions.get("window").width;

/** 对话框配置 */
const DIALOG_CONFIG = {
  /** 对话框最大宽度 */
  MAX_WIDTH: 560,
  /** 对话框水平边距 */
  HORIZONTAL_MARGIN: 48,
  /** 对话框圆角 */
  BORDER_RADIUS: 28,
  /** 选项圆角 */
  ITEM_BORDER_RADIUS: 16,
} as const;

// ==================== 子组件 ====================

/**
 * 单个选项项属性
 */
interface RadioItemProps {
  option: SelectionOption;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPress: (value: string) => void;
}

/**
 * 单个选项项组件
 *
 * 使用 memo 优化，避免不必要的重渲染
 */
const RadioItem: React.FC<RadioItemProps> = React.memo(
  ({ option, isSelected, isFirst, isLast, onPress }) => {
    const theme = useTheme();

    const handlePress = useCallback(() => {
      onPress(option.value);
    }, [onPress, option.value]);

    const itemStyle = useMemo(
      () => [
        styles.radioItem,
        isSelected && {
          backgroundColor: theme.colors.secondaryContainer,
        },
        isFirst && styles.firstItem,
        isLast && styles.lastItem,
      ],
      [isSelected, isFirst, isLast, theme.colors.secondaryContainer],
    );

    const titleColor = isSelected
      ? theme.colors.onSecondaryContainer
      : theme.colors.onSurface;

    const descriptionColor = isSelected
      ? theme.colors.onSecondaryContainer
      : theme.colors.onSurfaceVariant;

    return (
      <TouchableRipple
        onPress={handlePress}
        rippleColor={theme.colors.surfaceVariant}
        style={itemStyle}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${option.label}${option.description ? `: ${option.description}` : ""}`}
      >
        <View style={styles.radioItemContent}>
          <View style={styles.radioItemLeft}>
            {option.icon && <List.Icon icon={option.icon} color={titleColor} />}
            <View
              style={[
                styles.radioTextContainer,
                !option.icon && styles.radioTextContainerNoIcon,
              ]}
            >
              <Text
                variant="bodyLarge"
                style={[
                  styles.radioTitle,
                  {
                    color: titleColor,
                    fontWeight: isSelected ? "600" : "400",
                  },
                ]}
              >
                {option.label}
              </Text>
              {option.description && (
                <Text variant="bodySmall" style={{ color: descriptionColor }}>
                  {option.description}
                </Text>
              )}
            </View>
          </View>
          <RadioButton
            value={option.value}
            color={theme.colors.primary}
            uncheckedColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </TouchableRipple>
    );
  },
);

if (__DEV__) {
  RadioItem.displayName = "RadioItem";
}

// ==================== 主组件 ====================

/**
 * 选择对话框组件
 *
 * 提供带动画的单选对话框，特性：
 * - Material Design 3 风格
 * - 平滑的弹出/关闭动画
 * - 支持图标和描述
 * - 完全的类型安全
 * - 性能优化的重渲染
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(false);
 * const [value, setValue] = useState('option1');
 *
 * const options = [
 *   { value: 'option1', label: '选项一', icon: 'check' },
 *   { value: 'option2', label: '选项二', icon: 'close' },
 * ];
 *
 * return (
 *   <SelectionDialog
 *     visible={visible}
 *     onDismiss={() => setVisible(false)}
 *     title="请选择"
 *     options={options}
 *     selectedValue={value}
 *     onSelect={setValue}
 *   />
 * );
 * ```
 */
const SelectionDialog: React.FC<SelectionDialogProps> = ({
  visible,
  onDismiss,
  title,
  options,
  selectedValue,
  onSelect,
  autoClose = true,
}) => {
  const theme = useTheme();

  // 动画值
  const scaleAnim = useRef(
    new Animated.Value(ANIMATION_CONFIG.INITIAL_SCALE),
  ).current;
  const opacityAnim = useRef(
    new Animated.Value(ANIMATION_CONFIG.INITIAL_OPACITY),
  ).current;

  // 处理显示/隐藏动画
  useEffect(() => {
    if (visible) {
      // 弹出动画
      const animation = Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: ANIMATION_CONFIG.FINAL_SCALE,
          tension: ANIMATION_CONFIG.SPRING_TENSION,
          friction: ANIMATION_CONFIG.SPRING_FRICTION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: ANIMATION_CONFIG.FINAL_OPACITY,
          duration: ANIMATION_CONFIG.FADE_IN_DURATION,
          useNativeDriver: true,
        }),
      ]);

      animation.start();

      return () => {
        animation.stop();
      };
    } else {
      // 消失动画
      const animation = Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: ANIMATION_CONFIG.INITIAL_SCALE,
          duration: ANIMATION_CONFIG.FADE_OUT_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: ANIMATION_CONFIG.INITIAL_OPACITY,
          duration: ANIMATION_CONFIG.FADE_OUT_DURATION,
          useNativeDriver: true,
        }),
      ]);

      animation.start();

      return () => {
        animation.stop();
      };
    }
  }, [visible, scaleAnim, opacityAnim]);

  /**
   * 处理选项选择
   */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      if (autoClose) {
        // 延迟关闭，让用户看到选择效果
        setTimeout(() => {
          onDismiss();
        }, 100);
      }
    },
    [onSelect, onDismiss, autoClose],
  );

  // 对话框样式
  const dialogStyle = useMemo(
    () => [
      styles.dialog,
      {
        backgroundColor: theme.colors.surface,
      },
    ],
    [theme.colors.surface],
  );

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={dialogStyle}
        dismissable
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <RadioButton.Group
              onValueChange={handleSelect}
              value={selectedValue}
            >
              {options.map((option, index) => (
                <RadioItem
                  key={option.value}
                  option={option}
                  isSelected={selectedValue === option.value}
                  isFirst={index === 0}
                  isLast={index === options.length - 1}
                  onPress={handleSelect}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Animated.View>
      </Dialog>
    </Portal>
  );
};

if (__DEV__) {
  SelectionDialog.displayName = "SelectionDialog";
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  dialog: {
    borderRadius: DIALOG_CONFIG.BORDER_RADIUS,
    width: SCREEN_WIDTH - DIALOG_CONFIG.HORIZONTAL_MARGIN,
    maxWidth: DIALOG_CONFIG.MAX_WIDTH,
    alignSelf: "center",
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  dialogContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  radioItem: {
    borderRadius: DIALOG_CONFIG.ITEM_BORDER_RADIUS,
    marginVertical: 4,
    overflow: "hidden",
  },
  firstItem: {
    marginTop: 0,
  },
  lastItem: {
    marginBottom: 0,
  },
  radioItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 72,
  },
  radioItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  radioTextContainerNoIcon: {
    marginLeft: 16,
  },
  radioTitle: {
    marginBottom: 2,
  },
});

export default React.memo(SelectionDialog);
