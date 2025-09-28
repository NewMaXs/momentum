import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

// 设计系统颜色
export const Colors = {
  primary: "#6366f1",
  primaryLight: "#a5b4fc",
  primaryDark: "#4338ca",
  secondary: "#10b981",
  secondaryLight: "#6ee7b7",
  danger: "#ef4444",
  dangerLight: "#fca5a5",
  warning: "#f59e0b",
  warningLight: "#fcd34d",
  success: "#10b981",
  successLight: "#6ee7b7",

  // 中性色
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  // 背景色
  background: "#ffffff",
  backgroundSecondary: "#f9fafb",
  backgroundTertiary: "#f3f4f6",

  // 文本色
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  textTertiary: "#9ca3af",
  textInverse: "#ffffff",
};

// 字体大小
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

// 间距
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

// 圆角
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

// 阴影
export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// 基础按钮组件
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    // 尺寸样式
    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        minHeight: 52,
      },
    };

    // 变体样式
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? Colors.gray300 : Colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? Colors.gray300 : Colors.secondary,
      },
      danger: {
        backgroundColor: disabled ? Colors.gray300 : Colors.danger,
      },
      success: {
        backgroundColor: disabled ? Colors.gray300 : Colors.success,
      },
      warning: {
        backgroundColor: disabled ? Colors.gray300 : Colors.warning,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: disabled ? Colors.gray300 : Colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
    };

    const sizeStyles = {
      sm: { fontSize: FontSizes.sm },
      md: { fontSize: FontSizes.base },
      lg: { fontSize: FontSizes.lg },
    };

    const variantStyles = {
      primary: { color: Colors.textInverse },
      secondary: { color: Colors.textInverse },
      danger: { color: Colors.textInverse },
      success: { color: Colors.textInverse },
      warning: { color: Colors.textInverse },
      outline: { color: disabled ? Colors.gray400 : Colors.primary },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <View style={getButtonStyle()}>
      <Text style={getTextStyle()}>{title}</Text>
    </View>
  );
};

// 卡片组件
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = "md",
}) => {
  return (
    <View style={[styles.card, { padding: Spacing[padding] }, style]}>
      {children}
    </View>
  );
};

// 徽章组件
interface BadgeProps {
  text: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "primary",
  size = "md",
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.full,
      alignItems: "center",
      justifyContent: "center",
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        minHeight: 20,
      },
      md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minHeight: 24,
      },
    };

    const variantStyles = {
      primary: { backgroundColor: Colors.primaryLight },
      secondary: { backgroundColor: Colors.gray200 },
      success: { backgroundColor: Colors.successLight },
      warning: { backgroundColor: Colors.warningLight },
      danger: { backgroundColor: Colors.dangerLight },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: FontSizes.xs },
      md: { fontSize: FontSizes.sm },
    };

    const variantStyles = {
      primary: { color: Colors.primaryDark },
      secondary: { color: Colors.gray700 },
      success: { color: Colors.secondary },
      warning: { color: Colors.warning },
      danger: { color: Colors.danger },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontWeight: "600",
    };
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
};

// 进度条组件
interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.gray200,
  height = 8,
  style,
}) => {
  return (
    <View
      style={[
        {
          height,
          backgroundColor,
          borderRadius: BorderRadius.full,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: color,
          borderRadius: BorderRadius.full,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
});
