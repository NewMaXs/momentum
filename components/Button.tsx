import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { FontSizes } from "@/constants/fontSize";
import { Spacing } from "@/constants/spacing";
import { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton, Text as PaperText } from "react-native-paper";

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
    <PaperButton style={getButtonStyle()}>
      <PaperText style={getTextStyle()}>{title}</PaperText>
    </PaperButton>
  );
};
